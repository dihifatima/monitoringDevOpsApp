package com.example.security.JenkinsOAuth.controller.facade;


import com.example.security.JenkinsOAuth.controller.dto.JenkinsBuildResponse;
import com.example.security.JenkinsOAuth.controller.dto.JenkinsJobBuildsResponse;
import com.example.security.JenkinsOAuth.controller.dto.LinkJenkinsJobRequest;
import com.example.security.JenkinsOAuth.service.facade.JenkinsConnectorService;
import com.example.security.SonarQubeOAuth.controller.dto.LinkSonarProjectRequest;
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


    // ⬇️ NOUVEAU : lier un repo tracké à un job Jenkins
    @PostMapping("/link")
    public ResponseEntity<Void> linkJenkinsJob(Authentication authentication,
                                               @RequestBody LinkJenkinsJobRequest request) {
        Client client = (Client) authentication.getPrincipal();
        jenkinsConnectorService.linkJenkinsJob(client.getId(), request.getRepoId(), request.getJenkinsJobName());
        return ResponseEntity.ok().build();
    }

    // ⬇️ NOUVEAU : dernier build d'un repo
    @GetMapping("/{repoId}/last-build")
    public ResponseEntity<JenkinsBuildResponse> getLastBuild(Authentication authentication,
                                                             @PathVariable Long repoId) {
        Client client = (Client) authentication.getPrincipal();
        JenkinsBuildResponse build = jenkinsConnectorService.getLastBuild(client.getId(), repoId);
        return ResponseEntity.ok(build);
    }

    // ⬇️ NOUVEAU : liste des builds d'un repo
    @GetMapping("/{repoId}/builds")
    public ResponseEntity<JenkinsJobBuildsResponse> getBuildList(Authentication authentication,
                                                                 @PathVariable Long repoId) {
        Client client = (Client) authentication.getPrincipal();
        JenkinsJobBuildsResponse builds = jenkinsConnectorService.getBuildList(client.getId(), repoId);
        return ResponseEntity.ok(builds);
    }

    // ⬇️ NOUVEAU : détail d'un build précis
    @GetMapping("/{repoId}/builds/{buildNumber}")
    public ResponseEntity<JenkinsBuildResponse> getBuildDetail(Authentication authentication,
                                                               @PathVariable Long repoId,
                                                               @PathVariable int buildNumber) {
        Client client = (Client) authentication.getPrincipal();
        JenkinsBuildResponse build = jenkinsConnectorService.getBuildDetail(client.getId(), repoId, buildNumber);
        return ResponseEntity.ok(build);
    }

}
