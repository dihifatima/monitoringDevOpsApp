package com.example.security.GithubOAuth.service.impl;

import com.example.security.Enumeration.ConnextionProvider;
import com.example.security.GithubOAuth.controller.dto.*;
import com.example.security.GithubOAuth.entity.TrackedRepo;
import com.example.security.GithubOAuth.repo.TrackedRepositoryRepo;
import com.example.security.GithubOAuth.service.facade.GithubConnectorService;
import com.example.security.GithubOAuth.service.facade.GithubOAuthService;
import com.example.security.entity.Client;
import com.example.security.entity.ExternalConnection;
import com.example.security.repo.ClientRepo;
import com.example.security.repo.ExternalConnectionRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class GithubConnectorServiceImpl implements GithubConnectorService {

    private final GithubOAuthService githubOAuthService;
    private final OAuthStateCache stateCache;
    private final ClientRepo clientRepo;
    private final ExternalConnectionRepo externalConnectionRepo;
    private final TrackedRepositoryRepo trackedRepositoryRepo;

    public GithubConnectorServiceImpl(GithubOAuthService githubOAuthService,
                                      OAuthStateCache stateCache,
                                      ClientRepo clientRepo,
                                      ExternalConnectionRepo externalConnectionRepo, TrackedRepositoryRepo trackedRepositoryRepo) {
        this.githubOAuthService = githubOAuthService;
        this.stateCache = stateCache;
        this.clientRepo = clientRepo;
        this.externalConnectionRepo = externalConnectionRepo;
        this.trackedRepositoryRepo = trackedRepositoryRepo;
    }

    /**
     * Étape 1 du flow : appelée par l'app mobile (authentifiée).
     * Génère un state, le lie au client courant, renvoie l'URL GitHub à ouvrir.
     */
    @Override
    public String initiateConnection(Long clientId) {
        String state = githubOAuthService.generateState();
        stateCache.store(state, clientId);
        return githubOAuthService.buildAuthorizationUrl(state);
    }

    /**
     * Étape 2 du flow : appelée par GitHub (redirection navigateur, pas authentifiée).
     * Retrouve le client via le state, échange le code, sauvegarde la connexion.
     */
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

        return getTrackedRepos(clientId);
    }

    @Override
    public List<TrackedRepoResponse> getTrackedRepos(Long clientId) {
        return trackedRepositoryRepo.findAllByClientId(clientId)
                .stream()
                .map(repo -> TrackedRepoResponse.builder()
                        .id(repo.getId())
                        .externalRepoId(repo.getExternalRepoId())
                        .name(repo.getName())
                        .fullName(repo.getFullName())
                        .url(repo.getUrl())
                        .trackedAt(repo.getTrackedAt())
                        .build())
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
                .map(c -> CommitSummary.builder()
                        .sha(c.getSha())
                        .message(c.getCommit().getMessage())
                        .authorName(c.getCommit().getAuthor() != null ? c.getCommit().getAuthor().getName() : null)
                        .authorLogin(c.getAuthor() != null ? c.getAuthor().getLogin() : null)
                        .authorAvatarUrl(c.getAuthor() != null ? c.getAuthor().getAvatar_url() : null)
                        .date(c.getCommit().getAuthor() != null ? c.getCommit().getAuthor().getDate() : null)
                        .url(c.getHtml_url())
                        .build())
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


}