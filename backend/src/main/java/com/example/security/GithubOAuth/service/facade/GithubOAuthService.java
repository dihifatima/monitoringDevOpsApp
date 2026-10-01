package com.example.security.githuboauth.service.facade;

import com.example.security.githuboauth.controller.dto.GithubCommitResponse;
import com.example.security.githuboauth.controller.dto.GithubRepoResponse;
import com.example.security.githuboauth.controller.dto.GithubUserResponse;
import com.example.security.githuboauth.controller.dto.GithubWebhookRequest;

import java.util.Optional;

public interface GithubOAuthService {
    String generateState();

    String buildAuthorizationUrl(String state);

    String exchangeCodeForAccessToken(String code);

    GithubUserResponse fetchGithubUser(String accessToken);

    GithubRepoResponse[] fetchUserRepos(String accessToken);
    public Optional<GithubCommitResponse> fetchLastCommit(String accessToken, String owner, String repo);

    GithubCommitResponse[] fetchRepoCommits(String accessToken, String owner, String repo);
    GithubWebhookRequest createWebhooks(String accessToken, String owner, String repo);

    GithubRepoResponse fetchRepoDetails(String token, String owner, String repoName);
    GithubCommitResponse fetchCommitDetail(String accessToken, String owner, String repo, String sha);
    void deleteWebhook(String accessToken, String owner, String repo);
}
