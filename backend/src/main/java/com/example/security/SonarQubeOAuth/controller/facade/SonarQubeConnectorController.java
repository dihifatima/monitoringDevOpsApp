package com.example.security.SonarQubeOAuth.controller.facade;


import com.example.security.SonarQubeOAuth.controller.dto.LinkSonarProjectRequest;
import com.example.security.SonarQubeOAuth.service.facade.SonarQubeConnectorService;
import com.example.security.entity.Client;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/connectors/sonarqube")
public class SonarQubeConnectorController {

    private final SonarQubeConnectorService sonarQubeConnectorService;

    public SonarQubeConnectorController(SonarQubeConnectorService sonarQubeConnectorService) {
        this.sonarQubeConnectorService = sonarQubeConnectorService;
    }

    @PostMapping("/connect")
    public ResponseEntity<Void> connect(Authentication authentication,
                                        @RequestParam String sonarQubeUrl,
                                        @RequestParam String token) {
        Client client = (Client) authentication.getPrincipal();
        sonarQubeConnectorService.connect(client.getId(), sonarQubeUrl, token);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> status(Authentication authentication) {
        Client client = (Client) authentication.getPrincipal();
        boolean connected = sonarQubeConnectorService.isConnected(client.getId());
        return ResponseEntity.ok(Map.of("connected", connected));
    }

    @DeleteMapping("/disconnect")
    public ResponseEntity<Void> disconnect(Authentication authentication) {
        Client client = (Client) authentication.getPrincipal();
        sonarQubeConnectorService.disconnect(client.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/repos/{repoId}/sonar-project-key")
    public ResponseEntity<Void> linkProjectKey(
            Authentication authentication,
            @PathVariable Long repoId,
            @RequestBody LinkSonarProjectRequest request) {
        Client client = (Client) authentication.getPrincipal();
        sonarQubeConnectorService.linkProjectKey(client.getId(), repoId, request.getSonarProjectKey());
        return ResponseEntity.ok().build();
    }
}