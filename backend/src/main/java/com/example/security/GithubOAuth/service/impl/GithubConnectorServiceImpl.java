package com.example.security.GithubOAuth.service.impl;


import com.example.security.Enumeration.ConnextionProvider;
import com.example.security.GithubOAuth.controller.dto.*;
import com.example.security.entity.TrackedRepo;
import com.example.security.repo.TrackedRepositoryRepo;
import com.example.security.GithubOAuth.service.facade.GithubConnectorService;
import com.example.security.GithubOAuth.service.facade.GithubOAuthService;
import com.example.security.entity.Client;
import com.example.security.entity.ExternalConnection;
import com.example.security.repo.ClientRepo;
import com.example.security.repo.ExternalConnectionRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class GithubConnectorServiceImpl implements GithubConnectorService {

    private final GithubOAuthService githubOAuthService;
    private final OAuthStateCache stateCache;
    private final ClientRepo clientRepo;
    private final ExternalConnectionRepo externalConnectionRepo;
    private final TrackedRepositoryRepo trackedRepositoryRepo;

    public GithubConnectorServiceImpl(GithubOAuthService githubOAuthService, OAuthStateCache stateCache, ClientRepo clientRepo, ExternalConnectionRepo externalConnectionRepo, TrackedRepositoryRepo trackedRepositoryRepo) {
        this.githubOAuthService = githubOAuthService;
        this.stateCache = stateCache;
        this.clientRepo = clientRepo;
        this.externalConnectionRepo = externalConnectionRepo;
        this.trackedRepositoryRepo = trackedRepositoryRepo;
    }

    @Override
    public String initiateConnection(Long clientId) {
        String state = githubOAuthService.generateState();
        stateCache.store(state, clientId);
        return githubOAuthService.buildAuthorizationUrl(state);
    }

    @Override
    @Transactional
    public void handleCallback(String code, String state) {
        Long clientId = stateCache.consume(state);
        if (clientId == null) {
            throw new RuntimeException("Invalid or expired OAuth state");
        }

        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        String accessToken = githubOAuthService.exchangeCodeForAccessToken(code);
        GithubUserResponse githubUser = githubOAuthService.fetchGithubUser(accessToken);

        ExternalConnection connection = externalConnectionRepo
                .findByClientIdAndProvider(clientId, ConnextionProvider.GITHUB)
                .orElse(ExternalConnection.builder()
                        .client(client)
                        .provider(ConnextionProvider.GITHUB)
                        .connectedAt(LocalDateTime.now())
                        .build());

        connection.setAccessToken(accessToken);
        connection.setExternalUsername(githubUser.getLogin());
        connection.setExternalUrl(githubUser.getHtml_url());
        connection.setLastSyncAt(LocalDateTime.now());

        externalConnectionRepo.save(connection);
    }

    @Override
    public List<RepoSummary> getUserRepos(Long clientId) {
        ExternalConnection connection = externalConnectionRepo
                .findByClientIdAndProvider(clientId, ConnextionProvider.GITHUB)
                .orElseThrow(() -> new RuntimeException("GitHub not connected for this client"));

        GithubRepoResponse[] repos = githubOAuthService.fetchUserRepos(connection.getAccessToken());

        return Arrays.stream(repos)
                .map(repo -> RepoSummary.builder()
                        .externalId(repo.getId())
                        .name(repo.getName())
                        .fullName(repo.getFull_name())
                        .description(repo.getDescription())
                        .url(repo.getHtml_url())
                        .language(repo.getLanguage())
                        .stars(repo.getStargazers_count())
                        .isFork(repo.isFork())
                        .isArchived(repo.isArchived())
                        .updatedAt(repo.getUpdated_at())
                        .build())
                .toList();
    }

    @Override
    @Transactional
    public List<TrackedRepoResponse> trackRepo(Long clientId, TrackRepoRequest request) {
        boolean alreadyTracked = trackedRepositoryRepo
                .existsByClientIdAndExternalRepoId(clientId, request.getExternalRepoId());

        if (!alreadyTracked) {
            Client client = clientRepo.findById(clientId)
                    .orElseThrow(() -> new RuntimeException("Client not found"));

            TrackedRepo tracked = TrackedRepo.builder()
                    .client(client)
                    .provider(ConnextionProvider.GITHUB)
                    .externalRepoId(request.getExternalRepoId())
                    .name(request.getName())
                    .fullName(request.getFullName())
                    .url(request.getUrl())
                    .trackedAt(LocalDateTime.now())
                    .build();

            trackedRepositoryRepo.save(tracked);
        }
        try {
            ExternalConnection connection = externalConnectionRepo
                    .findByClientIdAndProvider(clientId, ConnextionProvider.GITHUB)
                    .orElseThrow(() -> new RuntimeException("GitHub not connected"));

            String owner = request.getFullName().split("/")[0];

            githubOAuthService.createWebhooks(
                    connection.getAccessToken(), owner, request.getName()
            );
        } catch (Exception e) {
            System.out.println("Échec de la création du webhook pour " + request.getFullName() + " : " + e.getMessage());
        }

        return getTrackedRepos(clientId);
    }

    @Override
    public List<TrackedRepoResponse> getTrackedRepos(Long clientId) {
        String token = externalConnectionRepo
                .findByClientIdAndProvider(clientId, ConnextionProvider.GITHUB)
                .map(ExternalConnection::getAccessToken)
                .orElse(null);

        return trackedRepositoryRepo.findAllByClientId(clientId)
                .stream()
                .map(repo -> {
                    TrackedRepoResponse.TrackedRepoResponseBuilder builder = TrackedRepoResponse.builder()
                            .id(repo.getId())
                            .externalRepoId(repo.getExternalRepoId())
                            .name(repo.getName())
                            .fullName(repo.getFullName())
                            .url(repo.getUrl())
                            .sonarProjectKey(repo.getSonarProjectKey())
                            .trackedAt(repo.getTrackedAt());

                    if (token != null && repo.getFullName() != null && repo.getFullName().contains("/")) {
                        String[] parts = repo.getFullName().split("/");
                        String owner = parts[0];
                        String repoName = parts[1];

                        // Détails du repo (language, default_branch, pushed_at) — factorisé
                        applyRepoDetails(builder, token, owner, repoName);

                        // Dernier commit — factorisé, réutilise fetchLastCommit (1 appel léger au lieu de 30 commits)
                        applyLastCommit(builder, token, owner, repoName);
                    }

                    return builder.build();
                })
                .toList();
    }

    @Override
    public List<CommitSummary> getRepoCommits(Long clientId, String owner, String repo) {
        ExternalConnection connection = externalConnectionRepo
                .findByClientIdAndProvider(clientId, ConnextionProvider.GITHUB)
                .orElseThrow(() -> new RuntimeException("GitHub not connected for this client"));

        GithubCommitResponse[] commits = githubOAuthService.fetchRepoCommits(
                connection.getAccessToken(), owner, repo
        );

        return Arrays.stream(commits)
                .map(this::toCommitSummary)
                .toList();
    }

    @Override
    public GithubStatusResponse getConnectionStatus(Long clientId) {
        return externalConnectionRepo
                .findByClientIdAndProvider(clientId, ConnextionProvider.GITHUB)
                .map(connection -> GithubStatusResponse.builder()
                        .connected(true)
                        .username(connection.getExternalUsername())
                        .build())
                .orElse(GithubStatusResponse.builder()
                        .connected(false)
                        .build());
    }

    // ---------------------------------------------------------------
    // Méthodes privées factorisées
    // ---------------------------------------------------------------

    /** Convertit un GithubCommitResponse (brut GitHub) en CommitSummary (DTO exposé à l'API). */
    private CommitSummary toCommitSummary(GithubCommitResponse c) {
        boolean hasCommitAuthor = c.getCommit() != null && c.getCommit().getAuthor() != null;

        return CommitSummary.builder()
                .sha(c.getSha())
                .message(c.getCommit() != null ? c.getCommit().getMessage() : null)
                .authorName(hasCommitAuthor ? c.getCommit().getAuthor().getName() : null)
                .authorLogin(c.getAuthor() != null ? c.getAuthor().getLogin() : null)
                .authorAvatarUrl(c.getAuthor() != null ? c.getAuthor().getAvatar_url() : null)
                .date(hasCommitAuthor ? c.getCommit().getAuthor().getDate() : null)
                .url(c.getHtml_url())
                .build();
    }

    /** Remplit language/default_branch/pushed_at sur le builder, en avalant les erreurs GitHub. */
    private void applyRepoDetails(TrackedRepoResponse.TrackedRepoResponseBuilder builder, String token, String owner, String repoName) {
        try {
            GithubRepoResponse details = githubOAuthService.fetchRepoDetails(token, owner, repoName);
            if (details != null) {
                builder.language(details.getLanguage());
                builder.default_branch(details.getDefault_branch());
                builder.pushed_at(
                        details.getPushed_at() != null
                                ? OffsetDateTime.parse(details.getPushed_at()).toLocalDateTime()
                                : null
                );
            }
        } catch (Exception e) {
            System.err.println("Erreur détails repo pour " + repoName + ": " + e.getMessage());
        }
    }

    /** Remplit les champs lastCommit* sur le builder, en avalant les erreurs GitHub. */
    private void applyLastCommit(TrackedRepoResponse.TrackedRepoResponseBuilder builder, String token, String owner, String repoName) {
        try {
            githubOAuthService.fetchLastCommit(token, owner, repoName)
                    .ifPresent(lastCommit -> {
                        CommitSummary summary = toCommitSummary(lastCommit);

                        builder.lastCommitSha(summary.getSha());
                        builder.lastCommitMessage(summary.getMessage());
                        builder.lastCommitAuthorName(summary.getAuthorName());
                        builder.lastCommitAuthorLogin(summary.getAuthorLogin());
                        builder.lastCommitAuthorAvatarUrl(summary.getAuthorAvatarUrl());
                        builder.lastCommitDate(
                                summary.getDate() != null
                                        ? OffsetDateTime.parse(summary.getDate()).toLocalDateTime()
                                        : null
                        );
                    });
        } catch (Exception e) {
            System.err.println("Erreur commit pour " + repoName + ": " + e.getMessage());
        }
    }
    @Override
    public CommitDetailResponse getCommitDetail(Long clientId, String owner, String repo, String sha) {
        ExternalConnection connection = externalConnectionRepo
                .findByClientIdAndProvider(clientId, ConnextionProvider.GITHUB)
                .orElseThrow(() -> new RuntimeException("GitHub not connected for this client"));

        GithubCommitResponse commit = githubOAuthService.fetchCommitDetail(
                connection.getAccessToken(), owner, repo, sha
        );

        return toCommitDetailResponse(commit);
    }
    /** Convertit un GithubCommitResponse (brut GitHub, endpoint unitaire) en CommitDetailResponse. */
    private CommitDetailResponse toCommitDetailResponse(GithubCommitResponse c) {
        boolean hasCommitAuthor = c.getCommit() != null && c.getCommit().getAuthor() != null;

        List<CommitDetailResponse.CommitFile> files = c.getFiles() == null
                ? List.of()
                : c.getFiles().stream()
                .map(f -> CommitDetailResponse.CommitFile.builder()
                        .filename(f.getFilename())
                        .status(f.getStatus())
                        .additions(f.getAdditions())
                        .deletions(f.getDeletions())
                        .changes(f.getChanges())
                        .build())
                .toList();

        return CommitDetailResponse.builder()
                .sha(c.getSha())
                .message(c.getCommit() != null ? c.getCommit().getMessage() : null)
                .authorName(hasCommitAuthor ? c.getCommit().getAuthor().getName() : null)
                .authorLogin(c.getAuthor() != null ? c.getAuthor().getLogin() : null)
                .authorAvatarUrl(c.getAuthor() != null ? c.getAuthor().getAvatar_url() : null)
                .date(hasCommitAuthor ? c.getCommit().getAuthor().getDate() : null)
                .url(c.getHtml_url())
                .totalAdditions(c.getStats() != null ? c.getStats().getAdditions() : null)
                .totalDeletions(c.getStats() != null ? c.getStats().getDeletions() : null)
                .totalChanges(c.getStats() != null ? c.getStats().getTotal() : null)
                .files(files)
                .build();
    }
}