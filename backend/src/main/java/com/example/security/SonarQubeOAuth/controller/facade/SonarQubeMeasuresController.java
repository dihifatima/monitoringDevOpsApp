package com.example.security.SonarQubeOAuth.controller.facade;

import com.example.security.SonarQubeOAuth.controller.dto.SonarQubeMeasuresResponse;
import com.example.security.SonarQubeOAuth.service.facade.SonarQubeConnectorService;
import com.example.security.entity.Client;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sonarqube")
public class SonarQubeMeasuresController {

    private final SonarQubeConnectorService sonarQubeConnectorService;

    public SonarQubeMeasuresController(SonarQubeConnectorService sonarQubeConnectorService) {
        this.sonarQubeConnectorService = sonarQubeConnectorService;
    }

    @GetMapping("/measures")
    public ResponseEntity<SonarQubeMeasuresResponse> getMeasures(
            Authentication authentication,
            @RequestParam Long repoId) {
        Client client = (Client) authentication.getPrincipal();
        SonarQubeMeasuresResponse response = sonarQubeConnectorService.getMeasuresForRepo(client.getId(), repoId);
        return ResponseEntity.ok(response);
    }
}