package com.example.security.GithubOAuth.controller.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackedRepoResponse {
    private Long id;
    private Long externalRepoId;
    private String sonarProjectKey;
    private String name;
    private String fullName;
    private String url;
    private LocalDateTime trackedAt;
}