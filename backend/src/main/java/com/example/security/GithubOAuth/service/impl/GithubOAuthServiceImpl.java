package com.example.security.GithubOAuth.service.impl;


import com.example.security.GithubOAuth.config.GithubOAuthProperties;
import com.example.security.GithubOAuth.controller.dto.*;
import com.example.security.GithubOAuth.service.facade.GithubOAuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;


import java.util.Optional;
import java.util.UUID;

@Service
public class GithubOAuthServiceImpl  implements GithubOAuthService {
    @Value("${github.webhook.secret}")
    private String webhookSecret;
    @Value("${app.webhook.github-url}")
    private String webhookUrl;


    private final GithubOAuthProperties properties;
    private final RestTemplate restTemplate;

    public GithubOAuthServiceImpl(GithubOAuthProperties properties, RestTemplate restTemplate) {
        this.properties = properties;
        this.restTemplate = restTemplate;
    }

    public String generateState() {
        return UUID.randomUUID().toString();
    }

    public String buildAuthorizationUrl(String state) {
        return UriComponentsBuilder.fromHttpUrl(properties.getAuthorizeUrl())
                .queryParam("client_id", properties.getClientId())
                .queryParam("redirect_uri", properties.getRedirectUri())
                .queryParam("scope", "read:user repo")
                .queryParam("state", state)
                .build()
                .toUriString();
    }

    public String exchangeCodeForAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", properties.getClientId());
        body.add("client_secret", properties.getClientSecret());
        body.add("code", code);
        body.add("redirect_uri", properties.getRedirectUri());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        GithubTokenResponse response = restTemplate.postForObject(
                properties.getTokenUrl(), request, GithubTokenResponse.class
        );

        if (response == null || response.getAccess_token() == null) {
            throw new RuntimeException("Failed to obtain GitHub access token");
        }

        return response.getAccess_token();
    }

    public GithubUserResponse fetchGithubUser(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> request = new HttpEntity<>(headers);

        var response = restTemplate.exchange(
                properties.getUserApiUrl(), HttpMethod.GET, request, GithubUserResponse.class
        );

        if (response.getBody() == null) {
            throw new RuntimeException("Failed to fetch GitHub user info");
        }

        return response.getBody();
    }
    public GithubRepoResponse[] fetchUserRepos(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> request = new HttpEntity<>(headers);

        String reposUrl = "https://api.github.com/user/repos?per_page=100&sort=updated";

        var response = restTemplate.exchange(
                reposUrl, HttpMethod.GET, request, GithubRepoResponse[].class
        );

        return response.getBody() != null ? response.getBody() : new GithubRepoResponse[0];
    }

    @Override
    public Optional<GithubCommitResponse> fetchLastCommit(String accessToken, String owner, String repo) {
        try {
            // Pas besoin du paramètre sha=... : GitHub prendra la branche par défaut (main, master, develop, etc.)
            String url = String.format("https://api.github.com/repos/%s/%s/commits?per_page=1", owner, repo);

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setAccept(java.util.List.of(MediaType.parseMediaType("application/vnd.github+json")));
            headers.set("X-GitHub-Api-Version", "2022-11-28");

            ResponseEntity<GithubCommitResponse[]> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), GithubCommitResponse[].class
            );

            GithubCommitResponse[] commits = response.getBody();
            return (commits != null && commits.length > 0) ? Optional.of(commits[0]) : Optional.empty();

        } catch (Exception e) {
            System.err.println("Impossible de récupérer le dernier commit pour " + owner + "/" + repo + " : " + e.getMessage());
            return Optional.empty();
        }
    }


    @Override
    public GithubCommitResponse[] fetchRepoCommits(String accessToken, String owner, String repo) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> request = new HttpEntity<>(headers);

        String commitsUrl = String.format(
                "https://api.github.com/repos/%s/%s/commits?per_page=30", owner, repo
        );

        var response = restTemplate.exchange(
                commitsUrl, HttpMethod.GET, request, GithubCommitResponse[].class
        );

        return response.getBody() != null ? response.getBody() : new GithubCommitResponse[0];
    }
    @Override
    public GithubRepoResponse fetchRepoDetails(String accessToken, String owner, String repo) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> request = new HttpEntity<>(headers);

        String url = String.format("https://api.github.com/repos/%s/%s", owner, repo);

        var response = restTemplate.exchange(
                url, HttpMethod.GET, request, GithubRepoResponse.class
        );

        return response.getBody();
    }


    @Override
    public GithubWebhookRequest createWebhooks(String accessToken, String owner, String repo) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        GithubWebhookRequest.Config config = GithubWebhookRequest.Config.builder()
                .url(webhookUrl) // ton URL de tunnel + /api/webhooks/github, injectée via @Value
                .content_type("json")
                .secret(webhookSecret)
                .build();

        GithubWebhookRequest body = GithubWebhookRequest.builder()
                .name("web")
                .active(true)
                .events(java.util.List.of("push"))
                .config(config)
                .build();

        HttpEntity<GithubWebhookRequest> request = new HttpEntity<>(body, headers);

        String webhooksUrl = String.format("https://api.github.com/repos/%s/%s/hooks", owner, repo);

        var response = restTemplate.exchange(
                webhooksUrl, HttpMethod.POST, request, GithubWebhookRequest.class
        );

        return response.getBody();
    }


}