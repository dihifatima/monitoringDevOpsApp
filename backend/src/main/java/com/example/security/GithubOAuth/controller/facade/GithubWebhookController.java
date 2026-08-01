package com.example.security.GithubOAuth.controller.facade;

import com.example.security.Enumeration.NotificationType;
import com.example.security.GithubOAuth.controller.dto.GithubPushPayload;
import com.example.security.entity.TrackedRepo;
import com.example.security.repo.TrackedRepositoryRepo;
import com.example.security.entity.Client;
import com.example.security.entity.Notification;
import com.example.security.repo.NotificationRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Optional;

@RestController
@RequestMapping("/api/webhooks/github")
public class GithubWebhookController {
    @Value("${github.webhook.secret}")
    private String webhookSecret;
    private static final Logger logger = LoggerFactory.getLogger(GithubWebhookController.class);

    private final TrackedRepositoryRepo trackedRepositoryRepo;
    private final NotificationRepo notificationRepo;

    public GithubWebhookController(TrackedRepositoryRepo trackedRepositoryRepo, NotificationRepo notificationRepo) {
        this.trackedRepositoryRepo = trackedRepositoryRepo;
        this.notificationRepo = notificationRepo;
    }

    @PostMapping
    public ResponseEntity<Void> handlePush(@RequestBody String rawPayload, @RequestHeader("X-Hub-Signature-256") String signature) throws Exception {
        String expectedSignature = computeSignature(rawPayload,webhookSecret);
            if(!expectedSignature.equals(signature)){
                return  ResponseEntity.status(401).build();
        }
        ObjectMapper mapper = new ObjectMapper();
        GithubPushPayload payload = mapper.readValue(rawPayload, GithubPushPayload.class);

        if (payload.getCommits() == null || payload.getCommits().isEmpty()) {
            logger.info("Événement ignoré (probablement un ping, pas de commits)");
            return ResponseEntity.ok().build();
        }

        logger.info(STR."push reçu sur le repo :\{payload.getRepository().getFull_name()}");

        String fullName = payload.getRepository().getFull_name();
        Optional<TrackedRepo> trackedRepoOpt = trackedRepositoryRepo.findByFullName(fullName);

        if (trackedRepoOpt.isEmpty()) {
            return ResponseEntity.ok().build();
        }
        TrackedRepo trackedRepo = trackedRepoOpt.get();

        Client client = trackedRepo.getClient();
        if (!client.isNotificationsEnabled()) {
            return ResponseEntity.ok().build();
        }

        for (GithubPushPayload.GithubCommitsInfo commit : payload.getCommits()) {
            String sha = commit.getId();
            if (!notificationRepo.existsByCommitsha(sha)) {
                Notification notification = Notification.builder()
                        .client(client)
                        .trackedRepo(trackedRepo)
                        .type(NotificationType.COMMIT)
                        .message(STR."\{commit.getMessage()} sur \{trackedRepo.getName()}")
                        .commitsha(sha)
                        .build();
                notificationRepo.save(notification);
            }
        }

        return ResponseEntity.ok().build();
    }
    private String computeSignature(String payload, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        mac.init(secretKey);
        byte[] hash = mac.doFinal(payload.getBytes());
        // convertir en hexadécimal
        StringBuilder hex = new StringBuilder();
        for (byte b : hash) {
            hex.append(String.format("%02x", b));
        }
        return "sha256=" + hex;
    }
}
