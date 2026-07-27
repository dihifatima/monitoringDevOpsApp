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
public class GithubWebhookRequest {
    private String name;
    private List<String> events;
    private Config config;
    private boolean active;


    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Config{
        private String url;
        private String content_type;
        private String secret;
    }

}
