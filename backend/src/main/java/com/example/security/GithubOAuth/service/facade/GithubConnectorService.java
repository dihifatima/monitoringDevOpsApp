package com.example.security.GithubOAuth.service.facade;

import com.example.security.GithubOAuth.controller.dto.RepoSummary;
import com.example.security.GithubOAuth.controller.dto.TrackRepoRequest;
import com.example.security.GithubOAuth.controller.dto.TrackedRepoResponse;

import java.util.List;

public interface GithubConnectorService {
    String initiateConnection(Long clientId);

    void handleCallback(String code, String state);

    List<RepoSummary> getUserRepos(Long clientId);
    List<TrackedRepoResponse> trackRepo(Long clientId, TrackRepoRequest request);

    List<TrackedRepoResponse> getTrackedRepos(Long clientId);
}
