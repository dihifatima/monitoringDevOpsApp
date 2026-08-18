package com.example.security.JenkinsOAuth.controller.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TestSummaryResponse {
    private Integer totalCount;
    private Integer passCount;
    private Integer failCount;
    private Integer skipCount;
    private Double duration;              // NOUVEAU — durée totale en secondes
    private List<FailedTest> failedTests;  // NOUVEAU — détail des échecs uniquement

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class FailedTest {
        private String className;
        private String name;
        private String errorDetails;
    }
}