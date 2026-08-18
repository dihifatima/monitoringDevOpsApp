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
public class JenkinsTestReportRaw {
    private Integer passCount;
    private Integer failCount;
    private Integer skipCount;
    private Double duration;
    private List<Suite> suites;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Suite {
        private List<Case> cases;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Case {
        private String className;
        private String name;
        private String status;
        private String errorDetails;
    }
}