package com.example.security.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Component

public class TokenEncryptionConfig {
        private static final String ALGORITHM = "AES";
        @Value("${app.encryption.secret-key}")
        private String secretKey;

        public String encrypt(String plainText) {
            if (plainText == null) {
                return null;
            }
            try {
                SecretKeySpec keySpec = buildKeySpec();
                Cipher cipher = Cipher.getInstance(ALGORITHM);
                cipher.init(Cipher.ENCRYPT_MODE, keySpec);

                byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
                return Base64.getEncoder().encodeToString(encryptedBytes);
            } catch (Exception e) {
                throw new RuntimeException("Failed to encrypt token", e);
            }
        }

        public String decrypt(String encryptedText) {
            if (encryptedText == null) {
                return null;
            }
            try {
                SecretKeySpec keySpec = buildKeySpec();
                Cipher cipher = Cipher.getInstance(ALGORITHM);
                cipher.init(Cipher.DECRYPT_MODE, keySpec);

                byte[] decodedBytes = Base64.getDecoder().decode(encryptedText);
                byte[] decryptedBytes = cipher.doFinal(decodedBytes);
                return new String(decryptedBytes);
            } catch (Exception e) {
                throw new RuntimeException("Failed to decrypt token", e);
            }
        }

    private SecretKeySpec buildKeySpec() {
        byte[] decodedKey = Base64.getDecoder().decode(secretKey.trim());
        return new SecretKeySpec(decodedKey, ALGORITHM);
    }
    public String getSecretKeyDebug() {
        return secretKey;
    }
    }

