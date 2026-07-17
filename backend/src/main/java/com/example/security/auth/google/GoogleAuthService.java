package com.example.security.auth.google;

import com.example.security.auth.local.AuthenticationResponse;
import com.example.security.entity.Client;
import com.example.security.role.Role;
import com.example.security.role.RoleRepository;
import com.example.security.security.JwtService;
import com.example.security.user.AuthProvider;
import com.example.security.user.Token;           // 👈 AJOUT
import com.example.security.user.TokenRepository;  // 👈 AJOUT
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

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository; // 👈 AJOUT

    @Value("${google.client.id}")
    private String googleClientId;

    public AuthenticationResponse authenticate(GoogleAuthenticateRequest request) throws Exception {

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = verifier.verify(request.getIdToken());
        if (idToken == null) {
            throw new BadCredentialsException("Invalid Google token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String firstname = (String) payload.get("given_name");
        String lastname = (String) payload.get("family_name");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createGoogleUser(email, firstname, lastname));

        var claims = new HashMap<String, Object>();
        claims.put("fullName", user.getFullName());
        var jwtToken = jwtService.generateToken(claims, user);

        revokeAllUserTokens(user);   // 👈 AJOUT — cohérent avec le login classique
        saveUserToken(user, jwtToken); // 👈 AJOUT

        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    private User createGoogleUser(String email, String firstname, String lastname) {
        Role clientRole = roleRepository.findByName("CLIENT")
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

    // 👇 AJOUT — logique identique à AuthenticateService
    private void saveUserToken(User user, String jwtToken) {
        Token token = Token.builder()
                .user(user)
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(t -> {
            t.setExpired(true);
            t.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }
}