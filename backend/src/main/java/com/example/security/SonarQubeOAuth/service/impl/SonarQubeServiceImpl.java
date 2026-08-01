package com.example.security.SonarQubeOAuth.service.impl;



import com.example.security.SonarQubeOAuth.controller.dto.SonarQubeMeasuresResponse;
import com.example.security.SonarQubeOAuth.controller.dto.SonarProjectSearchResponse;
import com.example.security.SonarQubeOAuth.service.facade.SonarQubeService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class SonarQubeServiceImpl implements SonarQubeService {

    private final RestTemplate restTemplate;

    public SonarQubeServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public SonarQubeMeasuresResponse fetchMeasures(String sonarQubeUrl, String projectKey, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
        headers.setBasicAuth(token, "");

        HttpEntity<Void> request = new HttpEntity<>(headers);

        String url = UriComponentsBuilder.fromHttpUrl(sonarQubeUrl + "/api/measures/component")
                .queryParam("component", projectKey)
                .queryParam("metricKeys", "bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density,ncloc")
                .toUriString();

        var response = restTemplate.exchange(
                url, HttpMethod.GET, request, SonarQubeMeasuresResponse.class
        );

        return response.getBody();
    }

    @Override
    public boolean projectExists(String sonarQubeUrl, String token, String projectKey) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
        headers.setBasicAuth(token, "");

        HttpEntity<Void> request = new HttpEntity<>(headers);

        String url = UriComponentsBuilder.fromHttpUrl(sonarQubeUrl + "/api/projects/search")
                .queryParam("projects", projectKey)
                .toUriString();

        try {
            var response = restTemplate.exchange(
                    url, HttpMethod.GET, request, SonarProjectSearchResponse.class
            );

            SonarProjectSearchResponse body = response.getBody();
            return body != null && body.getComponents() != null && !body.getComponents().isEmpty();
        } catch (Exception e) {
            // Token invalide, URL injoignable, projet inexistant... on considère que ça n'existe pas
            return false;
        }
    }
}