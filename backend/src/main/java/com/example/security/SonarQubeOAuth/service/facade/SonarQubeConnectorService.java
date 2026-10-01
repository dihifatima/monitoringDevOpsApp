package com.example.security.sonarQubeOAuth.service.facade;

import com.example.security.sonarQubeOAuth.controller.dto.CommitMeasuresResponse;
import com.example.security.sonarQubeOAuth.controller.dto.SonarQubeMeasuresResponse;

import java.util.List;

public interface SonarQubeConnectorService {
    void connect(Long clientId, String sonarQubeUrl, String token);
    boolean isConnected(Long clientId);
    void disconnect(Long clientId);
    void linkProjectKey(Long clientId, Long repoId, String sonarProjectKey);
    SonarQubeMeasuresResponse getMeasuresForRepo(Long clientId, Long repoId);
    List<CommitMeasuresResponse> getCommitMeasures(Long clientId, Long repoId);
}