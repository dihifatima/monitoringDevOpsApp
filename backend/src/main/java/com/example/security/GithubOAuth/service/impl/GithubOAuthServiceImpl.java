package com.example.security.GithubOAuth.service.impl;


import com.example.security.GithubOAuth.config.GithubOAuthProperties;
import com.example.security.GithubOAuth.controller.dto.GithubCommitResponse;
import com.example.security.GithubOAuth.controller.dto.GithubRepoResponse;
import com.example.security.GithubOAuth.controller.dto.GithubTokenResponse;
import com.example.security.GithubOAuth.controller.dto.GithubUserResponse;
import com.example.security.GithubOAuth.service.facade.GithubOAuthService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.UUID;

@Service
public class GithubOAuthServiceImpl  implements GithubOAuthService {

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
}