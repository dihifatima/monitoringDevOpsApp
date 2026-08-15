package com.example.security.JenkinsOAuth.service.impl;

import com.example.security.Enumeration.ConnextionProvider;
import com.example.security.JenkinsOAuth.controller.dto.JenkinsBuildResponse;
import com.example.security.JenkinsOAuth.controller.dto.JenkinsJobBuildsResponse;
import com.example.security.JenkinsOAuth.service.facade.JenkinsConnectorService;
import com.example.security.JenkinsOAuth.service.facade.JenkinsService;
import com.example.security.entity.Client;
import com.example.security.entity.ExternalConnection;
import com.example.security.entity.TrackedRepo;
import com.example.security.repo.ClientRepo;
import com.example.security.repo.ExternalConnectionRepo;
import com.example.security.repo.TrackedRepositoryRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
public class JenkinsConnectorServiceImpl implements JenkinsConnectorService {
    private final ClientRepo clientRepo;
    private final ExternalConnectionRepo externalConnectionRepo;
    private final TrackedRepositoryRepo trackedRepositoryRepo;
    private final JenkinsService jenkinsService;

    public JenkinsConnectorServiceImpl(ClientRepo clientRepo,
                                       ExternalConnectionRepo externalConnectionRepo,
                                       TrackedRepositoryRepo trackedRepositoryRepo,
                                       JenkinsService jenkinsService) {
        this.clientRepo = clientRepo;
        this.externalConnectionRepo = externalConnectionRepo;
        this.trackedRepositoryRepo = trackedRepositoryRepo;
        this.jenkinsService = jenkinsService;
    }
    @Override
    @Transactional
    public void connect(Long clientId, String jenkinsUrl, String username, String apiToken) {
        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        ExternalConnection connection = externalConnectionRepo.findByClientIdAndProvider(clientId, ConnextionProvider.JENKINS)
                .orElse(ExternalConnection.builder()
                        .client(client)
                        .provider(ConnextionProvider.JENKINS)
                        .connectedAt(LocalDateTime.now())
                        .build());

        connection.setAccessToken(STR."\{username}:\{apiToken}");
        connection.setExternalUsername(username);
        connection.setExternalUrl(jenkinsUrl);
        connection.setLastSyncAt(LocalDateTime.now());

        externalConnectionRepo.save(connection);
    }

    @Override
    public boolean isConnected(Long clientId) {
        return externalConnectionRepo.findByClientIdAndProvider(clientId, ConnextionProvider.JENKINS)
                .isPresent();
    }

    @Override
    @Transactional
    public void disconnect(Long clientId) {
        externalConnectionRepo.findByClientIdAndProvider(clientId, ConnextionProvider.JENKINS)
                .ifPresent(externalConnectionRepo::delete);
    }

    @Override
    @Transactional
    public void linkJenkinsJob(Long clientId, Long repoId, String jenkinsJobName) {
        TrackedRepo trackedRepo = trackedRepositoryRepo.findById(repoId)
                .orElseThrow(() -> new RuntimeException("Tracked repo not found"));

        if (!Objects.equals(trackedRepo.getClient().getId(), clientId)) {
            throw new RuntimeException("Access denied: this repo does not belong to the current client");
        }

        ExternalConnection connection = externalConnectionRepo
                .findByClientIdAndProvider(clientId, ConnextionProvider.JENKINS)
                .orElseThrow(() -> new RuntimeException("Jenkins not connected for this client"));

        boolean exists = jenkinsService.jobExists(
                connection.getExternalUrl(), connection.getAccessToken(), jenkinsJobName
        );

        if (!exists) {
            throw new RuntimeException("Jenkins job not found: " + jenkinsJobName);
        }

        trackedRepo.setJenkinsJobName(jenkinsJobName);
        trackedRepositoryRepo.save(trackedRepo);
    }

    @Override
    public JenkinsBuildResponse getLastBuild(Long clientId, Long repoId) {
        TrackedRepo trackedRepo = getVerifiedRepoWithJob(clientId, repoId);
        ExternalConnection connection = getConnection(clientId);

        return jenkinsService.fetchLastBuild(
                connection.getExternalUrl(), connection.getAccessToken(), trackedRepo.getJenkinsJobName()
        );
    }

    @Override
    public JenkinsJobBuildsResponse getBuildList(Long clientId, Long repoId) {
        TrackedRepo trackedRepo = getVerifiedRepoWithJob(clientId, repoId);
        ExternalConnection connection = getConnection(clientId);

        return jenkinsService.fetchBuildList(
                connection.getExternalUrl(), connection.getAccessToken(), trackedRepo.getJenkinsJobName()
        );
    }

    @Override
    public JenkinsBuildResponse getBuildDetail(Long clientId, Long repoId, int buildNumber) {
        TrackedRepo trackedRepo = getVerifiedRepoWithJob(clientId, repoId);
        ExternalConnection connection = getConnection(clientId);

        return jenkinsService.fetchBuildDetail(
                connection.getExternalUrl(), connection.getAccessToken(), trackedRepo.getJenkinsJobName(), buildNumber
        );
    }

    @Override
    public JenkinsBuildResponse findBuildForCommit(Long clientId, Long repoId, String commitSha) {
        JenkinsJobBuildsResponse builds = getBuildList(clientId, repoId);

        for (JenkinsJobBuildsResponse.BuildRef ref : builds.getBuilds()) {
            JenkinsBuildResponse detail = getBuildDetail(clientId, repoId, ref.getNumber());

            boolean found = detail.getChangeSets() != null && detail.getChangeSets().stream()
                    .flatMap(cs -> cs.getItems().stream())
                    .anyMatch(item -> commitSha.equals(item.getCommitId()));

            if (found) {
                return detail;
            }
        }

        return null;
    }

    // --- Méthodes privées utilitaires, pour éviter de répéter la même vérification 3 fois ---

    private TrackedRepo getVerifiedRepoWithJob(Long clientId, Long repoId) {
        TrackedRepo trackedRepo = trackedRepositoryRepo.findById(repoId)
                .orElseThrow(() -> new RuntimeException("Tracked repo not found"));

        if (!Objects.equals(trackedRepo.getClient().getId(), clientId)) {
            throw new RuntimeException("Access denied: this repo does not belong to the current client");
        }

        if (trackedRepo.getJenkinsJobName() == null || trackedRepo.getJenkinsJobName().isBlank()) {
            throw new RuntimeException("This repo is not linked to a Jenkins job yet");
        }

        return trackedRepo;
    }

    private ExternalConnection getConnection(Long clientId) {
        return externalConnectionRepo
                .findByClientIdAndProvider(clientId, ConnextionProvider.JENKINS)
                .orElseThrow(() -> new RuntimeException("Jenkins not connected for this client"));
    }

}