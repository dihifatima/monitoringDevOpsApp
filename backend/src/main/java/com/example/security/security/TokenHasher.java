package com.example.security.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Les refresh tokens vivent longtemps (jours/semaines) : s'ils étaient stockés
 * en clair et que la base fuite, un attaquant pourrait les utiliser directement.
 * On stocke donc uniquement leur empreinte SHA-256, jamais la valeur brute.
 */
public final class TokenHasher {

    private TokenHasher() {}

    public static String hash(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }
}