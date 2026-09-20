package com.example.security.auth.google;

import com.example.security.Enumeration.AuthProvider;
import com.example.security.auth.local.AuthTokenService;
import com.example.security.auth.local.AuthenticationResponse;
import com.example.security.entity.Client;
import com.example.security.exception.AccountLockedException;
import com.example.security.handller.BusinessErrorCodes;
import com.example.security.role.Role;
import com.example.security.role.RoleRepository;
import com.example.security.exception.GoogleAuthUnavailableException;
import com.example.security.security.BruteForceProtectionService;
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

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private static final String CLIENT_ROLE = "CLIENT";

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final AuthTokenService authTokenService;
    private final BruteForceProtectionService bruteForceProtectionService; // <-- ajouté

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
            throw new GoogleAuthUnavailableException("Google verification service unreachable", e);
        }

        if (idToken == null) {
            throw new BadCredentialsException("Invalid Google token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String firstname = (String) payload.get("given_name");
        String lastname = (String) payload.get("family_name");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createGoogleUser(email, firstname, lastname));

        // Même contrôle que le login classique : un compte verrouillé (bruteforce
        // détecté sur le mot de passe local, par ex.) reste bloqué même via Google.
        bruteForceProtectionService.autoUnlockIfExpired(user);
        if (user.isAccountLocked()) {
            throw new AccountLockedException(
                    BusinessErrorCodes.Account_LOCKED.getDescription(),
                    user.getLockedUntil()
            );
        }

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