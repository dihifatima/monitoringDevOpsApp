package com.example.security.GithubOAuth.controller.facade;

import com.example.security.GithubOAuth.service.impl.GithubConnectorServiceImpl;
import com.example.security.entity.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/connectors/github")
public class GithubConnectorController {

    private final GithubConnectorServiceImpl githubConnectorServiceImpl;

    // Base du deep link vers lequel on redirige l'app mobile une fois le callback traité.
    // Externalisé en config plutôt qu'en dur, au cas où le scheme change ou qu'on ait
    // plusieurs environnements (dev/prod).
    @Value("${app.mobile-deep-link.github-callback:monapp://github-connected}")
    private String githubCallbackDeepLink;

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
     *
     * Ne renvoie plus de texte : redirige (302) vers un deep link de l'app mobile,
     * pour que expo-web-browser (openAuthSessionAsync côté app) détecte cette navigation
     * et referme automatiquement le navigateur en rendant la main à l'app.
     */
    @GetMapping("/callback")
    public ResponseEntity<Void> callback(@RequestParam String code, @RequestParam String state) {
        String status;
        try {
            githubConnectorServiceImpl.handleCallback(code, state);
            status = "success";
        } catch (Exception e) {
            // On ne laisse jamais remonter une erreur brute ici : le navigateur DOIT
            // toujours finir par naviguer vers le deep link, succès ou échec, sinon
            // openAuthSessionAsync ne se fermera jamais côté app.
            status = "error";
        }

        URI redirectUri = URI.create(githubCallbackDeepLink + "?status=" + status);

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(redirectUri)
                .build();
    }
}