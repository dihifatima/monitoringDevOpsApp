package com.example.security.GithubOAuth.controller.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommitSummary {
    private String sha;
    private String message;
    private String authorName;
    private String authorLogin;
    private String authorAvatarUrl;
    private String date;
    private String url;
}