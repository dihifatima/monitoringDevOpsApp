package com.example.security.JenkinsOAuth.service.impl;

import com.example.security.JenkinsOAuth.controller.dto.JenkinsBuildResponse;
import com.example.security.JenkinsOAuth.controller.dto.JenkinsJobBuildsResponse;
import com.example.security.JenkinsOAuth.controller.dto.JenkinsTestReportRaw;
import com.example.security.JenkinsOAuth.controller.dto.TestSummaryResponse;
import com.example.security.JenkinsOAuth.service.facade.JenkinsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Service
public class JenkinsServiceImpl implements JenkinsService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public JenkinsServiceImpl(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public JenkinsBuildResponse fetchLastBuild(String jenkinsUrl, String auth, String jobName) {
        String[] parts = auth.split(":", 2);

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(parts[0], parts[1]);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> request = new HttpEntity<>(headers);

        String url = UriComponentsBuilder.fromHttpUrl(STR."\{jenkinsUrl}/job/\{jobName}/lastBuild/api/json")
                .toUriString();

        var response = restTemplate.exchange(
                url, HttpMethod.GET, request, JenkinsBuildResponse.class
        );

        return response.getBody();
    }
    @Override
    public JenkinsJobBuildsResponse fetchBuildList(String jenkinsUrl, String auth, String jobName) {
        String[] parts = auth.split(":", 2);

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(parts[0], parts[1]);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> request = new HttpEntity<>(headers);

        String buildsListUrl = STR."\{jenkinsUrl}/job/\{jobName}/api/json?tree=builds[number,url,result,building,timestamp,duration,actions[lastBuiltRevision[branch[name]]]]";

        var response = restTemplate.exchange(buildsListUrl, HttpMethod.GET, request, Map.class);
        Map<String, Object> raw = response.getBody();

        if (raw == null) {
            return JenkinsJobBuildsResponse.builder().builds(java.util.List.of()).build();
        }

        Object buildsObj = raw.get("builds");
        if (!(buildsObj instanceof List<?> buildsList)) {
            return JenkinsJobBuildsResponse.builder().builds(java.util.List.of()).build();
        }

        List<JenkinsJobBuildsResponse.BuildRef> refs = buildsList.stream()
                .filter(item -> item instanceof Map<?, ?>)
                .map(item -> {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> buildMap = (Map<String, Object>) item;

                    JenkinsJobBuildsResponse.BuildRef ref = objectMapper.convertValue(
                            buildMap, JenkinsJobBuildsResponse.BuildRef.class
                    );
                    ref.setBranch(extractBranch(buildMap));
                    return ref;
                })
                .toList();

        return JenkinsJobBuildsResponse.builder().builds(refs).build();
    }

    @Override
    public JenkinsBuildResponse fetchBuildDetail(String jenkinsUrl, String auth, String jobName, int buildNumber) {
        String[] parts = auth.split(":", 2);

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(parts[0], parts[1]);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> request = new HttpEntity<>(headers);

        String url = UriComponentsBuilder.fromHttpUrl(jenkinsUrl + "/job/" + jobName + "/" + buildNumber + "/api/json")
                .toUriString();

        var response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
        Map<String, Object> raw = response.getBody();

        if (raw == null) return null;

        JenkinsBuildResponse build = objectMapper.convertValue(raw, JenkinsBuildResponse.class);
        build.setBranch(extractBranch(raw));
        build.setTriggeredBy(extractTriggeredBy(raw)); // NOUVEAU


        return build;
    }

    @SuppressWarnings("unchecked")
    private String extractBranch(Map<String, Object> raw) {
        Object actionsObj = raw.get("actions");
        if (!(actionsObj instanceof List<?> actions)) return null;

        for (Object actionObj : actions) {
            if (!(actionObj instanceof Map<?, ?> action)) continue;
            Object lastBuiltRevision = action.get("lastBuiltRevision");
            if (!(lastBuiltRevision instanceof Map<?, ?> revision)) continue;
            Object branchList = revision.get("branch");
            if (!(branchList instanceof List<?> branches) || branches.isEmpty()) continue;
            Object first = branches.get(0);
            if (first instanceof Map<?, ?> branchMap) {
                Object name = branchMap.get("name");
                if (name != null) return name.toString();
            }
        }
        return null;
    }
    @Override
    public boolean jobExists(String jenkinsUrl, String auth, String jobName) {
        String[] parts = auth.split(":", 2);

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(parts[0], parts[1]);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> request = new HttpEntity<>(headers);

        String url = UriComponentsBuilder.fromHttpUrl(jenkinsUrl + "/job/" + jobName + "/api/json")
                .toUriString();

        try {
            var response = restTemplate.exchange(
                    url, HttpMethod.GET, request, JenkinsJobBuildsResponse.class
            );
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public TestSummaryResponse fetchTestSummary(String jenkinsUrl, String auth, String jobName, int buildNumber) {
        String[] parts = auth.split(":", 2);

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(parts[0], parts[1]);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> request = new HttpEntity<>(headers);

        String url = jenkinsUrl + "/job/" + jobName + "/" + buildNumber
                + "/testReport/api/json?tree=passCount,failCount,skipCount,duration,suites[cases[className,name,status,errorDetails]]";

        try {
            var response = restTemplate.exchange(url, HttpMethod.GET, request, JenkinsTestReportRaw.class);
            JenkinsTestReportRaw raw = response.getBody();

            if (raw == null) return null;

            int pass = raw.getPassCount() != null ? raw.getPassCount() : 0;
            int fail = raw.getFailCount() != null ? raw.getFailCount() : 0;
            int skip = raw.getSkipCount() != null ? raw.getSkipCount() : 0;

            List<TestSummaryResponse.FailedTest> failedTests = raw.getSuites() == null
                    ? java.util.List.of()
                    : raw.getSuites().stream()
                    .filter(suite -> suite.getCases() != null)
                    .flatMap(suite -> suite.getCases().stream())
                    .filter(c -> !"PASSED".equals(c.getStatus()) && !"SKIPPED".equals(c.getStatus()))
                    .map(c -> TestSummaryResponse.FailedTest.builder()
                            .className(c.getClassName())
                            .name(c.getName())
                            .errorDetails(c.getErrorDetails())
                            .build())
                    .toList();

            return TestSummaryResponse.builder()
                    .totalCount(pass + fail + skip)
                    .passCount(pass)
                    .failCount(fail)
                    .skipCount(skip)
                    .duration(raw.getDuration())
                    .failedTests(failedTests)
                    .build();
        } catch (Exception e) {
            // Pas de rapport de tests publié pour ce build (404) — cas normal, pas une erreur
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    private String extractTriggeredBy(Map<String, Object> raw) {
        Object actionsObj = raw.get("actions");
        if (!(actionsObj instanceof List<?> actions)) return null;

        for (Object actionObj : actions) {
            if (!(actionObj instanceof Map<?, ?> action)) continue;
            Object causesObj = action.get("causes");
            if (!(causesObj instanceof List<?> causes) || causes.isEmpty()) continue;
            Object first = causes.get(0);
            if (first instanceof Map<?, ?> causeMap) {
                Object desc = causeMap.get("shortDescription");
                if (desc != null) return desc.toString();
            }
        }
        return null;
    }
}
