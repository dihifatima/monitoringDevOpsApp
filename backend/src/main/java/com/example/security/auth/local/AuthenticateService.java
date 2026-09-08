package com.example.security.auth.local;

import com.example.security.email.EmailService;
import com.example.security.entity.Client;
import com.example.security.exception.*;
import com.example.security.role.Role;
import com.example.security.role.RoleRepository;
import com.example.security.security.BruteForceProtectionService;
import com.example.security.user.Token;
import com.example.security.user.TokenRepository;
import com.example.security.user.User;
import com.example.security.user.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticateService {

    private static final String CLIENT_ROLE = "CLIENT";

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenRepository tokenRepository;                   // codes activation / reset uniquement
    private final AuthTokenService authTokenService;                 // access/refresh tokens
    private final BruteForceProtectionService bruteForceProtectionService; // anti brute-force login
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public MessageResponse register(RegistrationRequest request) throws MessagingException {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        Role clientRole = roleRepository.findByName(CLIENT_ROLE)
                .orElseThrow(() -> new RoleNotFoundException(CLIENT_ROLE));

        Client client = Client.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountLocked(false)
                .enabled(false)
                .build();
        client.setRoles(List.of(clientRole));

        userRepository.save(client);
        emailService.sendValidationEmail(client);

        return new MessageResponse("Registration successful. Please check your email to activate your account.");
    }

    @Transactional
    public void deleteAllUsers() {
        tokenRepository.deleteAll();
        authTokenService.deleteAll();
        userRepository.deleteAll();
    }

    /**
     * Si le compte est verrouillé (accountLocked=true), authenticationManager.authenticate()
     * lève LockedException AVANT même de vérifier le mot de passe (contrôle Spring Security
     * standard) -> gérée telle quelle par le GlobalExceptionHandler existant, rien à changer ici.
     * Seul le cas "mauvais mot de passe" (BadCredentialsException) doit déclencher le compteur.
     */
    public AuthenticationResponse authenticate(AuthenticateRequest request) {
        Authentication auth;
        try {
            auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            bruteForceProtectionService.onAuthenticationFailure(request.getEmail());
            throw ex; // le GlobalExceptionHandler renvoie déjà le message générique existant
        }

        var user = (User) auth.getPrincipal();
        bruteForceProtectionService.onAuthenticationSuccess(user);

        return authTokenService.issueTokens(user);
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest request) {
        return authTokenService.refresh(request);
    }

    @Transactional
    public void activateAccount(String token) throws MessagingException {
        Token savedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid activation token"));

        if (LocalDateTime.now().isAfter(savedToken.getExpiredAt())) {
            emailService.sendValidationEmail(savedToken.getUser());
            throw new TokenExpiredException("Activation token has expired. A new token has been sent!");
        }

        var user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new InvalidTokenException("User not found for this token"));

        user.setEnabled(true);
        userRepository.save(user);
        savedToken.setValidateAt(LocalDateTime.now());
        tokenRepository.save(savedToken);
    }

    public MessageResponse logout(String rawRefreshToken) {
        return authTokenService.logout(rawRefreshToken);
    }

    public UserResponse getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UserNotAuthenticatedException("User is not authenticated");
        }

        User user = (User) authentication.getPrincipal();
        List<String> roles = user.getRoles().stream().map(Role::getName).toList();

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(roles)
                .build();
    }

    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) throws MessagingException {
        var userOptional = userRepository.findByEmail(request.getEmail());
        MessageResponse genericResponse = new MessageResponse("If this email exists, a reset code has been sent");

        if (userOptional.isEmpty()) {
            return genericResponse;
        }

        User user = userOptional.get();
        String resetCode = emailService.generateActiveCode(6);

        Token resetToken = Token.builder()
                .token(resetCode)
                .createAt(LocalDateTime.now())
                .expiredAt(LocalDateTime.now().plusMinutes(15))
                .expired(false)
                .revoked(false)
                .user(user)
                .build();
        tokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user, resetCode);

        return genericResponse;
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        Token savedToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid reset code"));

        if (savedToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Reset code has expired. Please request a new one.");
        }

        if (savedToken.isRevoked() || savedToken.getValidateAt() != null) {
            throw new TokenAlreadyUsedException("This reset code has already been used");
        }

        User user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new InvalidTokenException("User not found for this token"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        savedToken.setValidateAt(LocalDateTime.now());
        savedToken.setRevoked(true);
        tokenRepository.save(savedToken);

        // Sécurité : un changement de mot de passe invalide TOUTES les sessions actives
        authTokenService.revokeAllRefreshTokens(user);

        return new MessageResponse("Password reset successful");
    }
}