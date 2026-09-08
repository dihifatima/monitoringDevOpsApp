package com.example.security.auth.local;

import com.example.security.exception.InvalidTokenException;
import com.example.security.exception.TokenAlreadyUsedException;
import com.example.security.exception.TokenExpiredException;
import com.example.security.role.Role;
import com.example.security.security.JwtService;
import com.example.security.security.TokenHasher;
import com.example.security.user.RefreshToken;
import com.example.security.user.RefreshTokenRepository;
import com.example.security.user.User;
import com.example.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

/**
 * Point d'entrée UNIQUE pour tout ce qui concerne les access/refresh tokens.
 * Utilisé à la fois par AuthenticateService (login classique) et GoogleAuthService
 * (login Google) : quelle que soit la façon dont l'utilisateur s'est authentifié,
 * l'émission, le renouvellement et la révocation des tokens suivent EXACTEMENT
 * la même logique. Évite que les deux flows d'authentification divergent.
 */
@Service
@RequiredArgsConstructor
public class AuthTokenService {

    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Transactional
    public AuthenticationResponse issueTokens(User user) {
        var claims = new HashMap<String, Object>();
        claims.put("fullName", user.getFullName());

        String accessToken = jwtService.generateAccessToken(claims, user);
        String refreshToken = jwtService.generateRefreshToken(user);

        LocalDateTime expiresAt = LocalDateTime.now()
                .plus(Duration.ofMillis(jwtService.getRefreshTokenExpirationMillis()));

        refreshTokenRepository.save(
                RefreshToken.builder()
                        .tokenHash(TokenHasher.hash(refreshToken))
                        .user(user)
                        .expiresAt(expiresAt)
                        .revoked(false)
                        .build()
        );

        List<String> roles = user.getRoles().stream().map(Role::getName).toList();

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .roles(roles)
                .fullName(user.getFullName())
                .build();
    }

    @Transactional
    public AuthenticationResponse refresh(RefreshTokenRequest request) {
        String rawToken = request.refreshToken();

        if (!jwtService.isRefreshToken(rawToken)) {
            throw new InvalidTokenException("Provided token is not a valid refresh token");
        }

        String tokenHash = TokenHasher.hash(rawToken);
        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new InvalidTokenException("Refresh token not recognized"));

        if (storedToken.isRevoked()) {
            // Rejeu détecté : ce refresh token a déjà été consommé (rotation) ou révoqué
            // explicitement (logout). Ça signale potentiellement un vol de token -
            // par précaution, on révoque TOUS les refresh tokens de cet utilisateur,
            // pas seulement celui-ci, pour couper court à toute session compromise.
            revokeAllRefreshTokens(storedToken.getUser());
            throw new TokenAlreadyUsedException("This refresh token has already been used or revoked");
        }

        if (storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Refresh token has expired, please log in again");
        }

        String username = jwtService.extractUsername(rawToken);
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new InvalidTokenException("User not found for this token"));

        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        return issueTokens(user);
    }

    @Transactional
    public MessageResponse logout(String rawRefreshToken) {
        if (rawRefreshToken != null) {
            String tokenHash = TokenHasher.hash(rawRefreshToken);
            refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(rt -> {
                rt.setRevoked(true);
                refreshTokenRepository.save(rt);
            });
        }
        return new MessageResponse("Logout successful");
    }

    @Transactional
    public void revokeAllRefreshTokens(User user) {
        var validTokens = refreshTokenRepository.findAllValidByUser(user.getId());
        if (validTokens.isEmpty()) return;
        validTokens.forEach(rt -> rt.setRevoked(true));
        refreshTokenRepository.saveAll(validTokens);
    }

    @Transactional
    public void deleteAll() {
        refreshTokenRepository.deleteAll();
    }
}