package com.example.security.JenkinsOAuth.controller.facade;


import com.example.security.JenkinsOAuth.controller.dto.JenkinsBuildResponse;
import com.example.security.JenkinsOAuth.controller.dto.JenkinsJobBuildsResponse;
import com.example.security.JenkinsOAuth.controller.dto.LinkJenkinsJobRequest;
import com.example.security.JenkinsOAuth.service.facade.JenkinsConnectorService;
import com.example.security.entity.Client;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/connectors/jenkins")
public class JenkinsConnectorController {

    private final JenkinsConnectorService jenkinsConnectorService;

    public JenkinsConnectorController(JenkinsConnectorService jenkinsConnectorService) {
        this.jenkinsConnectorService = jenkinsConnectorService;
    }

    @PostMapping("/connect")
    public ResponseEntity<Void> connect(Authentication authentication,
                                        @RequestParam String jenkinsUrl,
                                        @RequestParam String username,
                                        @RequestParam String apiToken) {
        Client client = (Client) authentication.getPrincipal();
        jenkinsConnectorService.connect(client.getId(),jenkinsUrl,username,apiToken);
        return ResponseEntity.ok().build();

    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> status(Authentication authentication) {
        Client client = (Client) authentication.getPrincipal();
        boolean connected = jenkinsConnectorService.isConnected(client.getId());
        return ResponseEntity.ok(Map.of("connected", connected));    }

    @DeleteMapping("/disconnect")
    public ResponseEntity<Void> disconnect(Authentication authentication) {
        Client client = (Client) authentication.getPrincipal();
        jenkinsConnectorService.disconnect(client.getId());
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/link")
    public ResponseEntity<Void> linkJenkinsJob(Authentication authentication,
                                               @RequestBody LinkJenkinsJobRequest request) {
        Client client = (Client) authentication.getPrincipal();
        jenkinsConnectorService.linkJenkinsJob(client.getId(), request.getRepoId(), request.getJenkinsJobName());
        return ResponseEntity.ok().build();
    }





}
