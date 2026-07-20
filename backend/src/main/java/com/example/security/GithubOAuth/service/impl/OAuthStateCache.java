package com.example.security.GithubOAuth.service.impl;


import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OAuthStateCache {

    private static final long EXPIRATION_SECONDS = 300; // 5 minutes

    private record StateEntry(Long clientId, Instant expiresAt) {}

    private final ConcurrentHashMap<String, StateEntry> cache = new ConcurrentHashMap<>();

    public void store(String state, Long clientId) {
        cache.put(state, new StateEntry(clientId, Instant.now().plusSeconds(EXPIRATION_SECONDS)));
    }

    /**
     * Récupère le clientId associé au state, et le supprime immédiatement (usage unique).
     * Retourne null si le state est inconnu ou expiré.
     */
    public Long consume(String state) {
        StateEntry entry = cache.remove(state);
        if (entry == null || entry.expiresAt().isBefore(Instant.now())) {
            return null;
        }
        return entry.clientId();
    }
}