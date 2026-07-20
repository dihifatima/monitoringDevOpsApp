package com.example.security.GithubOAuth.controller.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GithubRepoResponse {
    private Long id;
    private String name;
    private String full_name;       // ex: "dihifatima/SmartFlow"
    private String description;
    private String html_url;
    private String language;
    private int stargazers_count;
    private boolean fork;
    private boolean archived;
    private String updated_at;
}