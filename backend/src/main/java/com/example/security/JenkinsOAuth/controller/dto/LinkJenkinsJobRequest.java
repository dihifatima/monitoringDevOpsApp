package com.example.security.JenkinsOAuth.controller.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LinkJenkinsJobRequest {
    private Long repoId;
    private String jenkinsJobName;
}