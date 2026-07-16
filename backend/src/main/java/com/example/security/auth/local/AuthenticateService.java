package com.example.security.auth.local;

import com.example.security.email.EmailService;
import com.example.security.entity.Admin;
import com.example.security.entity.Client;
import com.example.security.role.Role;
import com.example.security.role.RoleRepository;
import com.example.security.security.JwtService;
import com.example.security.user.Token;
import com.example.security.user.TokenRepository;
import com.example.security.user.User;
import com.example.security.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticateService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public ResponseEntity<?> register(@RequestBody @Valid RegistrationRequest request) throws MessagingException {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already exists"));
        }

        if (request.isAdmin()) {
            Admin admin = Admin.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .accountLocked(false)
                    .enabled(true)
                    .build();

            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new IllegalStateException("ADMIN role not found"));
            admin.setRoles(List.of(adminRole));
            userRepository.save(admin);
            emailService.sendValidationEmail(admin);
        } else {
            Client client = Client.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .accountLocked(false)
                    .enabled(false)
                    .build();

            Role clientRole = roleRepository.findByName("CLIENT")
                    .orElseThrow(() -> new IllegalStateException("CLIENT role not found"));
            client.setRoles(List.of(clientRole));
            userRepository.save(client);
            emailService.sendValidationEmail(client);
        }

        Map<String, String> responseMessage = new HashMap<>();
        String role = request.isAdmin() ? "ADMIN" : "CLIENT";
        responseMessage.put("message", "Registration successful with role: " + role + " !");
        return ResponseEntity.accepted().body(responseMessage);
    }

    @Transactional
    public void deleteAllUsers() {
        tokenRepository.deleteAll();
        userRepository.deleteAll();
    }

    public ResponseEntity<?> authenticate(AuthenticateRequest request, HttpServletResponse response) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var claims = new HashMap<String, Object>();
        var user = ((User) auth.getPrincipal());
        claims.put("fullName", user.getFullName());

        var jwtToken = jwtService.generateToken(claims, user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        List<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        // Réponse enrichie : le mobile a besoin du token ET des infos de base
        // pour éviter un appel /auth/me immédiat après le login
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("token", jwtToken);
        responseBody.put("roles", roles);
        responseBody.put("fullName", user.getFullName());

        return ResponseEntity.ok(responseBody);
    }

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
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    @Transactional
    public void activateAccount(String token) throws MessagingException {
        Token savedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("invalid token"));
        if (LocalDateTime.now().isAfter(savedToken.getExpiredAt())) {
            emailService.sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been sent!");
        }
        var user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("user not found"));
        user.setEnabled(true);
        userRepository.save(user);
        savedToken.setValidateAt(LocalDateTime.now());
        tokenRepository.save(savedToken);
    }

    /**
     * LOGOUT côté mobile : le token vient du header Authorization
     * (jamais d'un cookie — les cookies ne sont pas fiables sur mobile natif).
     * Spring Security a déjà extrait et validé ce token en amont via le filtre JWT,
     * donc ici on le relit simplement depuis la requête pour le révoquer en base.
     */
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String jwt = extractJwtFromHeader(request);

        if (jwt != null) {
            tokenRepository.findByToken(jwt).ifPresent(token -> {
                token.setExpired(true);
                token.setRevoked(true);
                tokenRepository.save(token);
            });
        }

        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }

    private String extractJwtFromHeader(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    public UserResponse getCurrentUser(Authentication authentication) {
        // 1. Protection contre le NullPointerException
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new org.springframework.security.authentication.BadCredentialsException("User is not authenticated");
        }

        User user = (User) authentication.getPrincipal();

        List<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        String profilePicture = null;
        if (user instanceof Client client) {
            profilePicture = client.getProfilePicture();
        }

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(roles)
                .profilePicture(profilePicture)
                .build();
    }
}