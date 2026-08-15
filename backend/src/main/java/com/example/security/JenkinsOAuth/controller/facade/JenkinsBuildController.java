package com.example.security.JenkinsOAuth.controller.facade;
import com.example.security.JenkinsOAuth.controller.dto.JenkinsBuildResponse;
import com.example.security.JenkinsOAuth.controller.dto.JenkinsJobBuildsResponse;
import com.example.security.JenkinsOAuth.service.facade.JenkinsConnectorService;
import com.example.security.entity.Client;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jenkins")
public class JenkinsBuildController {

    private final JenkinsConnectorService jenkinsConnectorService;

    public JenkinsBuildController(JenkinsConnectorService jenkinsConnectorService) {
        this.jenkinsConnectorService = jenkinsConnectorService;
    }


    //  NOUVEAU : dernier build d'un repo
    @GetMapping("/{repoId}/last-build")
    public ResponseEntity<JenkinsBuildResponse> getLastBuild(Authentication authentication,
                                                             @PathVariable Long repoId) {
        Client client = (Client) authentication.getPrincipal();
        JenkinsBuildResponse build = jenkinsConnectorService.getLastBuild(client.getId(), repoId);
        return ResponseEntity.ok(build);
    }

    // NOUVEAU : liste des builds d'un repo
    @GetMapping("/{repoId}/builds")
    public ResponseEntity<JenkinsJobBuildsResponse> getBuildList(Authentication authentication,
                                                                 @PathVariable Long repoId) {
        Client client = (Client) authentication.getPrincipal();
        JenkinsJobBuildsResponse builds = jenkinsConnectorService.getBuildList(client.getId(), repoId);
        return ResponseEntity.ok(builds);
    }

    // NOUVEAU : détail d'un build précis
    @GetMapping("/{repoId}/builds/{buildNumber}")
    public ResponseEntity<JenkinsBuildResponse> getBuildDetail(Authentication authentication,
                                                               @PathVariable Long repoId,
                                                               @PathVariable int buildNumber) {
        Client client = (Client) authentication.getPrincipal();
        JenkinsBuildResponse build = jenkinsConnectorService.getBuildDetail(client.getId(), repoId, buildNumber);
        return ResponseEntity.ok(build);
    }
    // NOUVEAU : build correspondant à un commit précis
    @GetMapping("/{repoId}/commit/{sha}/build")
    public ResponseEntity<JenkinsBuildResponse> getBuildForCommit(Authentication authentication,
                                                                  @PathVariable Long repoId,
                                                                  @PathVariable String sha) {
        Client client = (Client) authentication.getPrincipal();
        JenkinsBuildResponse build = jenkinsConnectorService.findBuildForCommit(client.getId(), repoId, sha);
        if (build == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(build);
    }

}
