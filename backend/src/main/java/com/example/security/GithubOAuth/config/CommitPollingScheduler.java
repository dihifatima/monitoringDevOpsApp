package com.example.security.GithubOAuth.config;

import com.example.security.Enumeration.ConnextionProvider;
import com.example.security.Enumeration.NotificationType;
import com.example.security.GithubOAuth.controller.dto.GithubCommitResponse;
import com.example.security.entity.TrackedRepo;
import com.example.security.repo.TrackedRepositoryRepo;
import com.example.security.GithubOAuth.service.facade.GithubOAuthService;
import com.example.security.entity.Client;
import com.example.security.entity.ExternalConnection;
import com.example.security.entity.Notification;
import com.example.security.repo.ExternalConnectionRepo;
import com.example.security.repo.NotificationRepo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class CommitPollingScheduler {
    private final TrackedRepositoryRepo trackedRepositoryRepo;
    private final ExternalConnectionRepo externalConnectionRepo;
    private final  GithubOAuthService githubOAuthService;
    private final NotificationRepo notificationRepo;
    public CommitPollingScheduler(TrackedRepositoryRepo trackedRepositoryRepo,
                                  ExternalConnectionRepo externalConnectionRepo,
                                  GithubOAuthService githubOAuthService,
                                  NotificationRepo notificationRepo)
    {
        this.trackedRepositoryRepo= trackedRepositoryRepo;
        this.externalConnectionRepo= externalConnectionRepo;
        this.githubOAuthService= githubOAuthService;
        this.notificationRepo= notificationRepo;
    }
    @Transactional
    @Scheduled(fixedRate = 60000)
    public void pollCommits() {
        List<TrackedRepo> allTracked = trackedRepositoryRepo.findAll();

        for (TrackedRepo repo : allTracked) {
            Client client = repo.getClient();
            if (!client.isNotificationsEnabled()) continue;

            ExternalConnection connection = externalConnectionRepo
                    .findByClientIdAndProvider(client.getId(), ConnextionProvider.GITHUB)
                    .orElse(null);
            if (connection == null) continue; // pas connecté (edge case)

            // owner = à extraire de repo.getFullName(), ex "dihifatima/SmartFlow" -> "dihifatima"
            String owner = repo.getFullName().split("/")[0];

            GithubCommitResponse[] commits = githubOAuthService.fetchRepoCommits(
                    connection.getAccessToken(), owner, repo.getName()
            );

            for (GithubCommitResponse commit : commits) {
                String sha = commit.getSha();
                if (!notificationRepo.existsByCommitsha(sha)) {
                    Notification notif = Notification.builder()
                            .client(client)
                            .trackedRepo(repo)
                            .type(NotificationType.COMMIT)
                            .message(commit.getCommit().getMessage() + " sur " + repo.getName())
                            .commitsha(sha)
                            .build();
                    notificationRepo.save(notif);
                }
            }
        }
    }
}

