package com.example.security.GithubOAuth.controller.facade;

import com.example.security.GithubOAuth.service.impl.GithubConnectorServiceImpl;
import com.example.security.entity.Client;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/connectors/github")
public class GithubConnectorController {

    private final GithubConnectorServiceImpl githubConnectorServiceImpl;

    public GithubConnectorController(GithubConnectorServiceImpl githubConnectorServiceImpl) {
        this.githubConnectorServiceImpl = githubConnectorServiceImpl;
    }

    /**
     * Appelé par l'app mobile (authentifiée en JWT).
     * Renvoie l'URL GitHub que l'app doit ouvrir dans un navigateur/webview.
     */
    @GetMapping("/authorize")
    public ResponseEntity<Map<String, String>> authorize(Authentication authentication) {
        Client client = (Client) authentication.getPrincipal();
        String url = githubConnectorServiceImpl.initiateConnection(client.getId());
        return ResponseEntity.ok(Map.of("authorizationUrl", url));
    }

    /**
     * Appelé directement par GitHub (redirection navigateur, PAS de JWT ici).
     * Doit être accessible SANS authentification (à whitelister dans SecurityConfig).
     */
    @GetMapping("/callback")
    public ResponseEntity<String> callback(@RequestParam String code, @RequestParam String state) {
        githubConnectorServiceImpl.handleCallback(code, state);
        // Pour l'instant, une réponse simple. On la remplacera par une redirection
        // vers l'app mobile (deep link) à l'étape suivante.
        return ResponseEntity.ok("GitHub connecté avec succès ! Tu peux retourner sur l'application.");
    }
}