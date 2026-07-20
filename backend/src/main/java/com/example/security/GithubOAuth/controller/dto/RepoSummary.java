package com.example.security.GithubOAuth.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepoSummary {
    private Long externalId;
    private String name;
    private String fullName;
    private String description;
    private String url;
    private String language;
    private int stars;
    private boolean isFork;
    private boolean isArchived;
    private String updatedAt;
}