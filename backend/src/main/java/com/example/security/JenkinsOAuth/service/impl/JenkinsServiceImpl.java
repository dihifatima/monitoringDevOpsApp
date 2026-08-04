package com.example.security.JenkinsOAuth.service.impl;

import com.example.security.GithubOAuth.controller.dto.GithubRepoResponse;
import com.example.security.JenkinsOAuth.controller.dto.JenkinsBuildResponse;
import com.example.security.JenkinsOAuth.controller.dto.JenkinsJobBuildsResponse;
import com.example.security.JenkinsOAuth.service.facade.JenkinsService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class JenkinsServiceImpl implements JenkinsService {
    private final RestTemplate restTemplate;

    public JenkinsServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    @Override
    public JenkinsBuildResponse fetchLastBuild(String jenkinsUrl, String auth, String jobName) {
        String[] parts = auth.split(":", 2);

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(parts[0], parts[1]);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> request = new HttpEntity<>(headers);

        String url = UriComponentsBuilder.fromHttpUrl(jenkinsUrl + "/job/" + jobName + "/lastBuild/api/json")
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

        String buildsListUrl = UriComponentsBuilder.fromHttpUrl(jenkinsUrl + "/job/" + jobName + "/api/json")
                .toUriString();

        var response = restTemplate.exchange(
                buildsListUrl, HttpMethod.GET, request, JenkinsJobBuildsResponse.class
        );

        return response.getBody() != null
                ? response.getBody()
                : JenkinsJobBuildsResponse.builder().builds(java.util.List.of()).build();
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

        var response = restTemplate.exchange(
                url, HttpMethod.GET, request, JenkinsBuildResponse.class
        );

        return response.getBody();
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
            // Job inexistant (404), identifiants invalides, instance injoignable...
            return false;
        }
    }
}
