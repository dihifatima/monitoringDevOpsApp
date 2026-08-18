package com.example.security.JenkinsOAuth.service.facade;

import com.example.security.JenkinsOAuth.controller.dto.JenkinsBuildResponse;
import com.example.security.JenkinsOAuth.controller.dto.JenkinsJobBuildsResponse;
import com.example.security.JenkinsOAuth.controller.dto.TestSummaryResponse;

public interface JenkinsService {
    JenkinsBuildResponse fetchLastBuild(String jenkinsUrl, String auth, String jobName);
    JenkinsJobBuildsResponse fetchBuildList(String jenkinsUrl, String auth, String jobName);
    JenkinsBuildResponse fetchBuildDetail(String jenkinsUrl, String auth, String jobName, int buildNumber);
    boolean jobExists(String jenkinsUrl, String auth, String jobName);

    TestSummaryResponse fetchTestSummary(String jenkinsUrl, String auth, String jobName, int buildNumber);
}
