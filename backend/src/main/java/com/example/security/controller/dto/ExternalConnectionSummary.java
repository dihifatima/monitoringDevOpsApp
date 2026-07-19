package com.example.security.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExternalConnectionSummary {
    private String provider;
    private String externalUsername;
    private LocalDateTime connectedAt;
    private LocalDateTime lastSyncAt;
}