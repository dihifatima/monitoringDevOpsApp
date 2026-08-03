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
    private String language;
    private LocalDateTime pushed_at;
    private String default_branch;
    private String fullName;
    private String url;
    private LocalDateTime trackedAt;
    // --- Dernier commit ---
    private String lastCommitSha;
    private String lastCommitMessage;
    private String lastCommitAuthorLogin;   // username GitHub (author.login)
    private String lastCommitAuthorName;    // nom saisi dans git (commit.author.name)
    private String lastCommitAuthorAvatarUrl;
    private LocalDateTime lastCommitDate;
}