package com.example.security.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;

@Component
public class TokenEncryptionConfig {

    private static final String KEY_ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int IV_LENGTH_BYTES = 12;
    private static final int TAG_LENGTH_BITS = 128;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Value("${app.encryption.secret-key}")
    private String secretKey;

    public String encrypt(String plainText) {
        if (plainText == null) {
            return null;
        }
        try {
            // IV aléatoire différent à chaque chiffrement
            byte[] iv = new byte[IV_LENGTH_BYTES];
            RANDOM.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, buildKeySpec(), new GCMParameterSpec(TAG_LENGTH_BITS, iv));
            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

            // On stocke IV + données chiffrées ensemble
            ByteBuffer buffer = ByteBuffer.allocate(iv.length + encryptedBytes.length);
            buffer.put(iv);
            buffer.put(encryptedBytes);
            return Base64.getEncoder().encodeToString(buffer.array());
        } catch (Exception e) {
            throw new IllegalStateException("Failed to encrypt token", e);
        }
    }

    public String decrypt(String encryptedText) {
        if (encryptedText == null) {
            return null;
        }
        try {
            byte[] data = Base64.getDecoder().decode(encryptedText);
            byte[] iv = Arrays.copyOfRange(data, 0, IV_LENGTH_BYTES);
            byte[] encryptedBytes = Arrays.copyOfRange(data, IV_LENGTH_BYTES, data.length);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, buildKeySpec(), new GCMParameterSpec(TAG_LENGTH_BITS, iv));
            return new String(cipher.doFinal(encryptedBytes), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to decrypt token", e);
        }
    }

    private SecretKeySpec buildKeySpec() {
        byte[] decodedKey = Base64.getDecoder().decode(secretKey.trim());
        return new SecretKeySpec(decodedKey, KEY_ALGORITHM);
    }
}
