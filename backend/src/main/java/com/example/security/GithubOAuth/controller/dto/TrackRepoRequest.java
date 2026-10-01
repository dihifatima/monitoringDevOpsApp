package com.example.security.githubOAuth.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackRepoRequest {
    private Long externalRepoId;
    private String name;
    private String fullName;
    private String url;
}