package com.example.security.GithubOAuth.controller.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GithubCommitResponse {
    private String sha;
    private String html_url;
    private CommitDetail commit;
    private GithubAuthor author; // peut être null si l'auteur n'a pas de compte GitHub

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
}