package com.example.security.SonarQubeOAuth.service.facade;

import com.example.security.SonarQubeOAuth.controller.dto.SonarQubeMeasuresResponse;

public interface SonarQubeConnectorService {
    void connect(Long clientId, String sonarQubeUrl, String token);
    boolean isConnected(Long clientId);
    void disconnect(Long clientId);
    void linkProjectKey(Long clientId, Long repoId, String sonarProjectKey);
    SonarQubeMeasuresResponse getMeasuresForRepo(Long clientId, Long repoId);
}