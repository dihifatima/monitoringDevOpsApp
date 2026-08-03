package com.example.security.GithubOAuth.controller.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GithubCommitResponse {
    private String sha;
    private String html_url;
    private CommitDetail commit;
    private GithubAuthor author;

    // ⬇️ Ajout : présents uniquement sur GET /commits/{sha}, null sur GET /commits (liste)
    private Stats stats;
    private List<FileEntry> files;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CommitDetail {
        private String message;
        private CommitAuthorInfo author;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CommitAuthorInfo {
        private String name;
        private String email;
        private String date;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GithubAuthor {
        private String login;
        private String avatar_url;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Stats {
        private Integer additions;
        private Integer deletions;
        private Integer total;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class FileEntry {
        private String filename;
        private String status;
        private Integer additions;
        private Integer deletions;
        private Integer changes;
    }
}