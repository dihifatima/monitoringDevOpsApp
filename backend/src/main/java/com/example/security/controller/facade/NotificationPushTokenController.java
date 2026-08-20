package com.example.security.controller.facade;

import com.example.security.repo.NotificationPushTokenRepo;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.security.controller.dto.RegisterNotificationPushTokenRequest;
import com.example.security.entity.Client;
import com.example.security.entity.NotificationPushToken;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/notifications")
public class NotificationPushTokenController {
    private final NotificationPushTokenRepo notificationPushTokenRepo;

    public NotificationPushTokenController(NotificationPushTokenRepo notificationPushTokenRepo) {
        this.notificationPushTokenRepo = notificationPushTokenRepo;
    }


    @PostMapping("/push-token")
    public ResponseEntity<Void> registerPushToken(Authentication authentication,
                                                  @RequestBody RegisterNotificationPushTokenRequest request) {
        Client client = (Client) authentication.getPrincipal();

        // Évite les doublons : si ce token existe déjà (même appareil), on le réassocie au client courant
        NotificationPushToken token = notificationPushTokenRepo.findByExpoPushToken(request.getExpoPushToken())
                .orElse(NotificationPushToken.builder()
                        .expoPushToken(request.getExpoPushToken())
                        .build());

        token.setClient(client);
        token.setRegisteredAt(LocalDateTime.now());
        notificationPushTokenRepo.save(token);

        return ResponseEntity.ok().build();
    }
}
