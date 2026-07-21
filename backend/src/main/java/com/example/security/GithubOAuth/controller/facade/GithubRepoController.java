package com.example.security.GithubOAuth.controller.facade;


import com.example.security.GithubOAuth.controller.dto.CommitSummary;
import com.example.security.GithubOAuth.controller.dto.RepoSummary;
import com.example.security.GithubOAuth.controller.dto.TrackRepoRequest;
import com.example.security.GithubOAuth.controller.dto.TrackedRepoResponse;
import com.example.security.GithubOAuth.service.facade.GithubConnectorService;
import com.example.security.entity.Client;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connectors/github/repos")
public class GithubRepoController {

    private final GithubConnectorService githubConnectorService;

    public GithubRepoController(GithubConnectorService githubConnectorService) {
        this.githubConnectorService = githubConnectorService;
    }

    @GetMapping
    public ResponseEntity<List<RepoSummary>> getRepos(Authentication authentication) {
        Client client = (Client) authentication.getPrincipal();
        List<RepoSummary> repos = githubConnectorService.getUserRepos(client.getId());
        return ResponseEntity.ok(repos);
    }

    @PostMapping("/track")
    public ResponseEntity<List<TrackedRepoResponse>> trackRepo(
            Authentication authentication,
            @RequestBody TrackRepoRequest request) {
        Client client = (Client) authentication.getPrincipal();
        List<TrackedRepoResponse> tracked = githubConnectorService.trackRepo(client.getId(), request);
        return ResponseEntity.ok(tracked);
    }

    @GetMapping("/tracked")
    public ResponseEntity<List<TrackedRepoResponse>> getTrackedRepos(Authentication authentication) {
        Client client = (Client) authentication.getPrincipal();
        List<TrackedRepoResponse> tracked = githubConnectorService.getTrackedRepos(client.getId());
        return ResponseEntity.ok(tracked);
    }

    @GetMapping("/{owner}/{repo}/commits")
    public ResponseEntity<List<CommitSummary>> getCommits(
            Authentication authentication,
            @PathVariable String owner,
            @PathVariable String repo) {
        Client client = (Client) authentication.getPrincipal();
        List<CommitSummary> commits = githubConnectorService.getRepoCommits(client.getId(), owner, repo);
        return ResponseEntity.ok(commits);
    }
}