package com.example.security.service.impl;

import com.example.security.Enumeration.NotificationFrequency;
import com.example.security.controller.dto.*;
import com.example.security.entity.Client;
import com.example.security.entity.ExternalConnection;
import com.example.security.role.Role;
import com.example.security.service.facade.ClientService;
import com.example.security.user.TokenRepository;
import com.example.security.user.User;
import com.example.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileClientServiceImpl implements ClientService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Authentication authentication) {
        User user = requireAuthenticatedUser(authentication);
        return mapToProfileResponse(user);
    }

    @Override
    @Transactional
    public ProfileResponse updateProfile(Authentication authentication, UpdateProfileRequest request) {
        User user = requireAuthenticatedUser(authentication);

        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());

        if (user instanceof Client client) {
            client.setJobTitle(request.getJobTitle());
            client.setCompany(request.getCompany());
        }

        userRepository.save(user);
        return mapToProfileResponse(user);
    }

    @Override
    @Transactional
    public ProfileResponse updateProfilePicture(Authentication authentication, UpdateProfilePictureRequest request) {
        User user = requireAuthenticatedUser(authentication);

        if (user instanceof Client client) {
            client.setProfilePicture(request.getProfilePicture());
        }

        userRepository.save(user);
        return mapToProfileResponse(user);
    }

    @Override
    @Transactional
    public void updatePassword(Authentication authentication, UpdatePasswordRequest request) {
        User user = requireAuthenticatedUser(authentication);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        revokeAllUserTokens(user);
    }

    @Override
    @Transactional
    public ProfileResponse updateNotifications(Authentication authentication, UpdateNotificationsRequest request) {
        User user = requireAuthenticatedUser(authentication);

        if (user instanceof Client client) {
            client.setNotificationsEnabled(request.isNotificationsEnabled());
            client.setNotificationFrequency(
                    NotificationFrequency.valueOf(request.getNotificationFrequency())
            );
        }

        userRepository.save(user);
        return mapToProfileResponse(user);
    }

    @Override
    @Transactional
    public void deleteAccount(Authentication authentication, DeleteAccountRequest request) {
        User user = requireAuthenticatedUser(authentication);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Password is incorrect");
        }

        // Soft delete : on désactive le compte plutôt que de le supprimer physiquement,
        // pour préserver l'intégrité des données liées (repos suivis, historiques...).
        user.setEnabled(false);
        userRepository.save(user);

        revokeAllUserTokens(user);
    }

    // ==================== MÉTHODES PRIVÉES UTILITAIRES ====================

    private User requireAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadCredentialsException("User is not authenticated");
        }
        return (User) authentication.getPrincipal();
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty()) return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    private ProfileResponse mapToProfileResponse(User user) {
        // Recharger l'entité pour être sûr qu'elle est attachée à la session courante
        User managedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> roles = managedUser.getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        ProfileResponse.ProfileResponseBuilder builder = ProfileResponse.builder()
                .id(managedUser.getId())
                .email(managedUser.getEmail())
                .fullName(managedUser.getFullName())
                .roles(roles)
                .createdAt(managedUser.getCreatedAt());

        if (managedUser instanceof Client client) {
            builder.profilePicture(client.getProfilePicture())
                    .jobTitle(client.getJobTitle())
                    .company(client.getCompany())
                    .notificationEnabled(client.isNotificationsEnabled())
                    .notificationFrequency(client.getNotificationFrequency().name())
                    .onboardingCompleted(client.isOnboardingCompleted())
                    .externalConnections(mapConnections(client.getExternalConnections()));
        }

        return builder.build();
    }
    private List<ExternalConnectionSummary> mapConnections(List<ExternalConnection> connections) {
        if (connections == null) return List.of();
        return connections.stream()
                .map(conn -> ExternalConnectionSummary.builder()
                        .provider(conn.getProvider().name())
                        .externalUsername(conn.getExternalUsername())
                        .connectedAt(conn.getConnectedAt())
                        .lastSyncAt(conn.getLastSyncAt())
                        .build())
                .collect(Collectors.toList());
    }
}