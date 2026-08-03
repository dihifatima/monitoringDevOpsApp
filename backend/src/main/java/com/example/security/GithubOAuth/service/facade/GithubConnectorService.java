package com.example.security.GithubOAuth.service.facade;

import com.example.security.GithubOAuth.controller.dto.*;

import java.util.List;

public interface GithubConnectorService {
    String initiateConnection(Long clientId);
    void handleCallback(String code, String state);
    List<RepoSummary> getUserRepos(Long clientId);
    List<TrackedRepoResponse> trackRepo(Long clientId, TrackRepoRequest request);
    List<TrackedRepoResponse> getTrackedRepos(Long clientId);
    List<CommitSummary> getRepoCommits(Long clientId, String owner, String repo);
    GithubStatusResponse getConnectionStatus(Long clientId);
    CommitDetailResponse getCommitDetail(Long clientId, String owner, String repo, String sha);
}
