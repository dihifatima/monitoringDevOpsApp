package com.example.security.SonarQubeOAuth.service.impl;

import com.example.security.Enumeration.ConnextionProvider;
import com.example.security.SonarQubeOAuth.controller.dto.CommitMeasuresResponse;
import com.example.security.SonarQubeOAuth.controller.dto.SonarMeasuresHistoryResponse;
import com.example.security.SonarQubeOAuth.controller.dto.SonarProjectAnalysesResponse;
import com.example.security.SonarQubeOAuth.controller.dto.SonarQubeMeasuresResponse;
import com.example.security.SonarQubeOAuth.service.facade.SonarQubeConnectorService;
import com.example.security.SonarQubeOAuth.service.facade.SonarQubeService;
import com.example.security.entity.Client;
import com.example.security.entity.ExternalConnection;
import com.example.security.entity.TrackedRepo;
import com.example.security.repo.ClientRepo;
import com.example.security.repo.ExternalConnectionRepo;
import com.example.security.repo.TrackedRepositoryRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class SonarQubeConnectorServiceImpl implements SonarQubeConnectorService {

    private final ExternalConnectionRepo externalConnectionRepo;
    private final ClientRepo clientRepo;
    private final TrackedRepositoryRepo trackedRepositoryRepo;
    private final SonarQubeService sonarQubeService;

    public SonarQubeConnectorServiceImpl(ExternalConnectionRepo externalConnectionRepo,
                                         ClientRepo clientRepo,
                                         TrackedRepositoryRepo trackedRepositoryRepo,
                                         SonarQubeService sonarQubeService) {
        this.externalConnectionRepo = externalConnectionRepo;
        this.clientRepo = clientRepo;
        this.trackedRepositoryRepo = trackedRepositoryRepo;
        this.sonarQubeService = sonarQubeService;
    }

    @Override
    @Transactional
    public void connect(Long clientId, String sonarQubeUrl, String token) {
        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        ExternalConnection connection = externalConnectionRepo
                .findByClientIdAndProvider(clientId, ConnextionProvider.SONARQUBE)
                .orElse(ExternalConnection.builder()
                        .client(client)
                        .provider(ConnextionProvider.SONARQUBE)
                        .connectedAt(LocalDateTime.now())
                        .build());

        connection.setAccessToken(token);
        connection.setExternalUrl(sonarQubeUrl);
        connection.setLastSyncAt(LocalDateTime.now());

        externalConnectionRepo.save(connection);
    }

    @Override
    public boolean isConnected(Long clientId) {
        return externalConnectionRepo
                .findByClientIdAndProvider(clientId, ConnextionProvider.SONARQUBE)
                .isPresent();
    }

    @Override
    @Transactional
    public void disconnect(Long clientId) {
        externalConnectionRepo
                .findByClientIdAndProvider(clientId, ConnextionProvider.SONARQUBE)
                .ifPresent(externalConnectionRepo::delete);
    }

    @Override
    @Transactional
    public void linkProjectKey(Long clientId, Long repoId, String sonarProjectKey) {
        TrackedRepo trackedRepo = trackedRepositoryRepo.findById(repoId)
                .orElseThrow(() -> new RuntimeException("Tracked repo not found"));

        if (!Objects.equals(trackedRepo.getClient().getId(), clientId)) {
            throw new RuntimeException("Access denied: this repo does not belong to the current client");
        }

        ExternalConnection connection = externalConnectionRepo
                .findByClientIdAndProvider(clientId, ConnextionProvider.SONARQUBE)
                .orElseThrow(() -> new RuntimeException("SonarQube not connected for this client"));

        boolean exists = sonarQubeService.projectExists(
                connection.getExternalUrl(), connection.getAccessToken(), sonarProjectKey
        );

        if (!exists) {
            throw new RuntimeException("Sonar project not found: " + sonarProjectKey);
        }

        trackedRepo.setSonarProjectKey(sonarProjectKey);
        trackedRepositoryRepo.save(trackedRepo);
    }

    @Override
    public SonarQubeMeasuresResponse getMeasuresForRepo(Long clientId, Long repoId) {
        TrackedRepo trackedRepo = trackedRepositoryRepo.findById(repoId)
                .orElseThrow(() -> new RuntimeException("Tracked repo not found"));

        if (!Objects.equals(trackedRepo.getClient().getId(), clientId)) {
            throw new RuntimeException("Access denied: this repo does not belong to the current client");
        }

        if (trackedRepo.getSonarProjectKey() == null || trackedRepo.getSonarProjectKey().isBlank()) {
            throw new RuntimeException("This repo is not linked to a Sonar project yet");
        }

        ExternalConnection connection = externalConnectionRepo
                .findByClientIdAndProvider(clientId, ConnextionProvider.SONARQUBE)
                .orElseThrow(() -> new RuntimeException("SonarQube not connected for this client"));

        return sonarQubeService.fetchMeasures(
                connection.getExternalUrl(),
                trackedRepo.getSonarProjectKey(),
                connection.getAccessToken()
        );
    }
    @Override
    public List<CommitMeasuresResponse> getCommitMeasures(Long clientId, Long repoId) {
        TrackedRepo trackedRepo = trackedRepositoryRepo.findById(repoId)
                .orElseThrow(() -> new RuntimeException("Tracked repo not found"));

        if (!Objects.equals(trackedRepo.getClient().getId(), clientId)) {
            throw new RuntimeException("Access denied: this repo does not belong to the current client");
        }

        if (trackedRepo.getSonarProjectKey() == null || trackedRepo.getSonarProjectKey().isBlank()) {
            throw new RuntimeException("This repo is not linked to a Sonar project yet");
        }

        ExternalConnection connection = externalConnectionRepo
                .findByClientIdAndProvider(clientId, ConnextionProvider.SONARQUBE)
                .orElseThrow(() -> new RuntimeException("SonarQube not connected for this client"));

        String url = connection.getExternalUrl();
        String token = connection.getAccessToken();
        String projectKey = trackedRepo.getSonarProjectKey();

        // 1. Récupère la liste des analyses (date + revision)
        SonarProjectAnalysesResponse analysesResponse = sonarQubeService.fetchProjectAnalyses(url, token, projectKey);
        List<SonarProjectAnalysesResponse.Analysis> analyses =
                analysesResponse != null && analysesResponse.getAnalyses() != null
                        ? analysesResponse.getAnalyses()
                        : List.of();

        // 2. Récupère l'historique de chaque métrique
        SonarMeasuresHistoryResponse historyResponse = sonarQubeService.fetchMeasuresHistory(url, token, projectKey);
        List<SonarMeasuresHistoryResponse.MetricHistory> metricHistories =
                historyResponse != null && historyResponse.getMeasures() != null
                        ? historyResponse.getMeasures()
                        : List.of();

        // 3. Pivote l'historique : regroupe les valeurs de métriques par date
        //    (au lieu de "par métrique", on veut "par date, toutes les métriques")
        Map<String, List<CommitMeasuresResponse.MeasureEntry>> measuresByDate = new HashMap<>();

        for (SonarMeasuresHistoryResponse.MetricHistory metricHistory : metricHistories) {
            String metricName = metricHistory.getMetric();
            for (SonarMeasuresHistoryResponse.HistoryPoint point : metricHistory.getHistory()) {
                measuresByDate
                        .computeIfAbsent(point.getDate(), d -> new ArrayList<>())
                        .add(CommitMeasuresResponse.MeasureEntry.builder()
                                .metric(metricName)
                                .value(point.getValue())
                                .build());
            }
        }

        // 4. Pour chaque analyse, associe ses métriques via la date correspondante
        return analyses.stream()
                .map(analysis -> CommitMeasuresResponse.builder()
                        .revision(analysis.getRevision())
                        .date(analysis.getDate())
                        .projectVersion(analysis.getProjectVersion())
                        .measures(measuresByDate.getOrDefault(analysis.getDate(), List.of()))
                        .build())
                .toList();
    }
}