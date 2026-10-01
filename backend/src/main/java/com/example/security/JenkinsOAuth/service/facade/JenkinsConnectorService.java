package com.example.security.jenkinsOAuth.service.facade;

import com.example.security.jenkinsOAuth.controller.dto.JenkinsBuildResponse;
import com.example.security.jenkinsOAuth.controller.dto.JenkinsJobBuildsResponse;
import com.example.security.jenkinsOAuth.controller.dto.TestSummaryResponse;

public interface JenkinsConnectorService {
    void connect(Long clientId, String jenkinsUrl, String username, String apiToken);
    boolean isConnected(Long clientId);
    void disconnect(Long clientId);
    void linkJenkinsJob(Long clientId, Long repoId, String jenkinsJobName);
    JenkinsBuildResponse getLastBuild(Long clientId, Long repoId);
    JenkinsJobBuildsResponse getBuildList(Long clientId, Long repoId);
    JenkinsBuildResponse getBuildDetail(Long clientId, Long repoId, int buildNumber);

    JenkinsBuildResponse findBuildForCommit(Long clientId, Long repoId, String commitSha);

    TestSummaryResponse getTestSummary(Long id, Long repoId, int buildNumber);
}
