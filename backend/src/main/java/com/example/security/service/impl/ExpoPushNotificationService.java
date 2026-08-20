package com.example.security.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;


@Service

public class ExpoPushNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(ExpoPushNotificationService.class);
    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendPushNotification(String expoPushToken, String title, String body) {
        if (expoPushToken == null || expoPushToken.isBlank()) {
            logger.warn("Pas de token push pour ce client, envoi ignoré");
            return;
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("to", expoPushToken);
        payload.put("title", title);
        payload.put("body", body);
        payload.put("sound", "default");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            restTemplate.postForEntity(EXPO_PUSH_URL, request, String.class);
            logger.info("Notification push envoyée à {}", expoPushToken);
        } catch (Exception e) {
            logger.error("Échec envoi push: {}", e.getMessage());
        }
    }
}
