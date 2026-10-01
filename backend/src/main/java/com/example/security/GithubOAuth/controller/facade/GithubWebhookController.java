package com.example.security.githuboauth.controller.facade;

import com.example.security.enumeration.NotificationType;
import com.example.security.githuboauth.controller.dto.GithubPushPayload;
import com.example.security.entity.Client;
import com.example.security.entity.Notification;
import com.example.security.entity.NotificationPushToken;
import com.example.security.entity.TrackedRepo;
import com.example.security.repo.NotificationPushTokenRepo;
import com.example.security.repo.NotificationRepo;
import com.example.security.repo.TrackedRepositoryRepo;
import com.example.security.service.impl.ExpoPushNotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/webhooks/github")
public class GithubWebhookController {

    private static final Logger logger = LoggerFactory.getLogger(GithubWebhookController.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Value("${github.webhook.secret}")
    private String webhookSecret;

    private final TrackedRepositoryRepo trackedRepositoryRepo;
    private final NotificationRepo notificationRepo;
    private final NotificationPushTokenRepo notificationPushTokenRepo;
    private final ExpoPushNotificationService expoPushNotificationService;

    public GithubWebhookController(TrackedRepositoryRepo trackedRepositoryRepo,
                                   NotificationRepo notificationRepo,
                                   NotificationPushTokenRepo notificationPushTokenRepo,
                                   ExpoPushNotificationService expoPushNotificationService) {
        this.trackedRepositoryRepo = trackedRepositoryRepo;
        this.notificationRepo = notificationRepo;
        this.notificationPushTokenRepo = notificationPushTokenRepo;
        this.expoPushNotificationService = expoPushNotificationService;
    }

    @PostMapping
    public ResponseEntity<Void> handlePush(@RequestBody String rawPayload,
                                           @RequestHeader("X-Hub-Signature-256") String signature) throws Exception {

        // Vérification de la signature HMAC (comparaison à temps constant)
        String expectedSignature = computeSignature(rawPayload, webhookSecret);
        if (!MessageDigest.isEqual(
                expectedSignature.getBytes(StandardCharsets.UTF_8),
                signature.getBytes(StandardCharsets.UTF_8))) {
            return ResponseEntity.status(401).build();
        }

        GithubPushPayload payload = MAPPER.readValue(rawPayload, GithubPushPayload.class);

        if (payload.getCommits() == null || payload.getCommits().isEmpty()) {
            logger.info("Événement ignoré (probablement un ping, pas de commits)");
            return ResponseEntity.ok().build();
        }

        String fullName = payload.getRepository().getFull_name();
        logger.info("push reçu sur le repo : {}", fullName);

        Optional<TrackedRepo> trackedRepoOpt = trackedRepositoryRepo.findByFullName(fullName);
        if (trackedRepoOpt.isEmpty()) {
            return ResponseEntity.ok().build();
        }

        TrackedRepo trackedRepo = trackedRepoOpt.get();
        Client client = trackedRepo.getClient();

        for (GithubPushPayload.GithubCommitsInfo commit : payload.getCommits()) {
            String sha = commit.getId();

            if (notificationRepo.existsByCommitsha(sha)) {
                continue;
            }

            String message = commit.getMessage() + " sur " + trackedRepo.getName();

            // Toujours sauvegardée, peu importe le toggle
            Notification notification = Notification.builder()
                    .client(client)
                    .trackedRepo(trackedRepo)
                    .type(NotificationType.COMMIT)
                    .message(message)
                    .commitsha(sha)
                    .build();
            notificationRepo.save(notification);

            // Push envoyé uniquement si l'utilisateur l'a activé
            if (client.isNotificationsEnabled()) {
                List<NotificationPushToken> pushTokens =
                        notificationPushTokenRepo.findAllByClientId(client.getId());

                for (NotificationPushToken pushToken : pushTokens) {
                    Map<String, Object> data = new HashMap<>();
                    data.put("type", "COMMIT");
                    data.put("trackedRepoId", trackedRepo.getId());
                    data.put("commitsha", sha);

                    expoPushNotificationService.sendPushNotification(
                            pushToken.getExpoPushToken(),
                            "Nouveau commit",
                            message,
                            data
                    );
                }
            }
        }

        return ResponseEntity.ok().build();
    }

    private String computeSignature(String payload, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        return "sha256=" + HexFormat.of().formatHex(hash);
    }
}