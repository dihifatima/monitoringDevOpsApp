package com.example.security.GithubOAuth.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommitDetailResponse {
    private String sha;
    private String message;
    private String authorName;
    private String authorLogin;
    private String authorAvatarUrl;
    private String date;
    private String url;

    private Integer totalAdditions;
    private Integer totalDeletions;
    private Integer totalChanges;
    private List<CommitFile> files;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommitFile {
        private String filename;
        private String status;
        private Integer additions;
        private Integer deletions;
        private Integer changes;
    }
}