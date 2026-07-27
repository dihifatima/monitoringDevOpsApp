package com.example.security.GithubOAuth.service.facade;

import com.example.security.GithubOAuth.controller.dto.GithubCommitResponse;
import com.example.security.GithubOAuth.controller.dto.GithubRepoResponse;
import com.example.security.GithubOAuth.controller.dto.GithubUserResponse;
import com.example.security.GithubOAuth.controller.dto.GithubWebhookRequest;

public interface GithubOAuthService {
    String generateState();

    String buildAuthorizationUrl(String state);

    String exchangeCodeForAccessToken(String code);

    GithubUserResponse fetchGithubUser(String accessToken);

    GithubRepoResponse[] fetchUserRepos(String accessToken);

    GithubCommitResponse[] fetchRepoCommits(String accessToken, String owner, String repo);
    GithubWebhookRequest createWebhooks(String accessToken, String owner, String repo);
}
