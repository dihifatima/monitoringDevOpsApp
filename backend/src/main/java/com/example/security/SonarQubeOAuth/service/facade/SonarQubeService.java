package com.example.security.SonarQubeOAuth.service.facade;

import com.example.security.SonarQubeOAuth.controller.dto.SonarMeasuresHistoryResponse;
import com.example.security.SonarQubeOAuth.controller.dto.SonarProjectAnalysesResponse;
import com.example.security.SonarQubeOAuth.controller.dto.SonarQubeMeasuresResponse;

public interface SonarQubeService {
    SonarQubeMeasuresResponse fetchMeasures(String sonarQubeUrl, String projectKey, String token);
    boolean projectExists(String sonarQubeUrl, String token, String projectKey);
    SonarProjectAnalysesResponse fetchProjectAnalyses(String sonarQubeUrl, String token, String projectKey);
    SonarMeasuresHistoryResponse fetchMeasuresHistory(String sonarQubeUrl, String token, String projectKey);
}