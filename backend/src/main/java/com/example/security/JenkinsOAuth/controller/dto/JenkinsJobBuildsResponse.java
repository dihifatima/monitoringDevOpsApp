package com.example.security.jenkinsoauth.controller.dto;

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

public class JenkinsJobBuildsResponse {
    private List<BuildRef> builds;
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BuildRef {
        private Integer number;
        private String url;
        private String result;      // NOUVEAU
        private boolean building;   // NOUVEAU
        private Long timestamp;     // NOUVEAU
        private Long duration;      // NOUVEAU
        private String branch; // NOUVEAU

    }
}