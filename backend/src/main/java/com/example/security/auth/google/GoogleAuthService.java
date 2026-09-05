package com.example.security.auth.google;

import com.example.security.Enumeration.AuthProvider;
import com.example.security.auth.local.AuthTokenService;
import com.example.security.auth.local.AuthenticationResponse;
import com.example.security.entity.Client;
import com.example.security.role.Role;
import com.example.security.role.RoleRepository;
import com.example.security.exception.GoogleAuthUnavailableException;
import com.example.security.user.User;
import com.example.security.user.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

/**
 * Login Google : une fois l'identité vérifiée et l'utilisateur récupéré/créé,
 * l'émission des tokens passe par AuthTokenService — EXACTEMENT le même chemin
 * que le login classique (access + refresh token, refresh haché en base).
 * Aucune logique de token dupliquée ici.
 */
@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private static final String CLIENT_ROLE = "CLIENT";

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final AuthTokenService authTokenService;

    @Value("${google.client.id}")
    private String googleClientId;

    public AuthenticationResponse authenticate(GoogleAuthenticateRequest request) {

        GoogleIdToken idToken;
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();
            idToken = verifier.verify(request.getIdToken());
        } catch (IOException | GeneralSecurityException e) {
            // Panne réseau, timeout, ou service Google injoignable (récupération des clés
            // publiques de vérification) : ce n'est PAS une faute du client, à ne jamais
            // confondre avec un token invalide -> message clair plutôt qu'une 500 brute.
            throw new GoogleAuthUnavailableException("Google verification service unreachable", e);
        }

        if (idToken == null) {
            // Ici, la vérification a bien eu lieu mais le token est invalide/expiré : faute du client.
            throw new BadCredentialsException("Invalid Google token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String firstname = (String) payload.get("given_name");
        String lastname = (String) payload.get("family_name");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createGoogleUser(email, firstname, lastname));

        return authTokenService.issueTokens(user);
    }

    private User createGoogleUser(String email, String firstname, String lastname) {
        Role clientRole = roleRepository.findByName(CLIENT_ROLE)
                .orElseThrow(() -> new IllegalStateException("CLIENT role not found"));

        Client newClient = Client.builder()
                .firstname(firstname)
                .lastname(lastname)
                .email(email)
                .password(null)
                .accountLocked(false)
                .enabled(true)
                .provider(AuthProvider.GOOGLE)
                .build();
        newClient.setRoles(List.of(clientRole));

        return userRepository.save(newClient);
    }
}