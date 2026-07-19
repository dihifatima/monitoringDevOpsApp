package com.example.security.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateNotificationsRequest {
    private boolean notificationsEnabled;
    private String notificationFrequency; // "REALTIME", "DAILY_SUMMARY", "WEEKLY_SUMMARY"
}