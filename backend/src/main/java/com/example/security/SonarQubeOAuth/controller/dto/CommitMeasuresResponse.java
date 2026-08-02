package com.example.security.SonarQubeOAuth.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommitMeasuresResponse {
    private String revision;
    private String date;
    private String projectVersion;
    private List<MeasureEntry> measures;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MeasureEntry {
        private String metric;
        private String value;
    }
}