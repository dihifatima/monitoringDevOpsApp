package com.example.security.GithubOAuth.controller.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GithubUserResponse {
    private Long id;
    private String login;        // le username GitHub
    private String html_url;     // l'URL du profil GitHub
    private String avatar_url;
}