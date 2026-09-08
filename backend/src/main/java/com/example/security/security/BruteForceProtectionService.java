package com.example.security.security;

import com.example.security.user.User;
import com.example.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Anti brute-force progressif, par email.
 * Grille : 3 échecs -> 5 min / 6 échecs -> 10 min / 9 échecs -> 20 min / 12+ -> 1h (plafond).
 * Le compteur ne redescend à zéro QUE sur un login réussi (jamais automatiquement).
 */
@Service
@RequiredArgsConstructor
public class BruteForceProtectionService {

    private final UserRepository userRepository;

    // Index i correspond : à partir de THRESHOLDS[i] échecs cumulés -> verrouillage DURATIONS[i]
    private static final int[] THRESHOLDS = {3, 6, 9, 12};
    private static final Duration[] DURATIONS = {
            Duration.ofMinutes(5),
            Duration.ofMinutes(10),
            Duration.ofMinutes(20),
            Duration.ofHours(1) // plafond : au-delà de 12, la durée n'augmente plus
    };

    /**
     * A appeler après un BadCredentialsException (mauvais mot de passe) sur un email donné.
     * Ne fait rien si l'email ne correspond à aucun compte (évite de révéler l'existence
     * d'un compte, cohérent avec le message générique déjà renvoyé côté login).
     */
    @Transactional
    public void onAuthenticationFailure(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            int attempts = user.getFailedAttempts() + 1;
            user.setFailedAttempts(attempts);

            for (int i = THRESHOLDS.length - 1; i >= 0; i--) {
                if (attempts >= THRESHOLDS[i]) {
                    // On ne re-déclenche un NOUVEAU verrouillage que si on vient de franchir
                    // exactement ce palier, sinon chaque échec après un palier prolongerait
                    // indéfiniment le blocage courant.
                    if (attempts == THRESHOLDS[i] || (i == THRESHOLDS.length - 1 && attempts > THRESHOLDS[i] && (attempts - THRESHOLDS[i]) % 3 == 0)) {
                        user.setAccountLocked(true);
                        user.setLockedUntil(LocalDateTime.now().plus(DURATIONS[i]));
                        user.setLockLevel(i + 1);
                    }
                    break;
                }
            }
            userRepository.save(user);
        });
    }

    /**
     * A appeler après une authentification réussie : remet tout le compteur à zéro.
     */
    @Transactional
    public void onAuthenticationSuccess(User user) {
        if (user.getFailedAttempts() > 0 || user.isAccountLocked()) {
            user.setFailedAttempts(0);
            user.setLockLevel(0);
            user.setAccountLocked(false);
            user.setLockedUntil(null);
            userRepository.save(user);
        }
    }

    /**
     * A appeler AVANT le contrôle Spring Security isAccountNonLocked (dans le
     * UserDetailsService, au moment de charger l'utilisateur) : débloque automatiquement
     * si la durée de verrouillage est écoulée, sans attendre une action de l'utilisateur.
     */
    @Transactional
    public void autoUnlockIfExpired(User user) {
        if (user.isAccountLocked()
                && user.getLockedUntil() != null
                && user.getLockedUntil().isBefore(LocalDateTime.now())) {
            user.setAccountLocked(false);
            userRepository.save(user);
        }
    }
}