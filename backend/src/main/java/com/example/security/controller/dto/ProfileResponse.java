package com.example.security.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private Long id;
    private String email;
    private String fullName;
    private List<String> roles;
    private String profilePicture;
    private String jobTitle;
    private String company;
    private boolean notificationEnabled;
    private String notificationFrequency;
    private boolean onboardingCompleted;
    private LocalDateTime createdAt;
    private List<ExternalConnectionSummary> externalConnections;
}