package com.example.security.configuration;


import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Converter
@Component
public class TokenAttributeConverter implements AttributeConverter<String, String> {

    private static TokenEncryptionConfig tokenEncryptionConfig;

    // Injection classique par Spring au démarrage de l'app...
    @Autowired
    public void setTokenEncryptionConfig(TokenEncryptionConfig config) {
        // ...mais stockée dans un champ STATIC, car Hibernate instancie
        // ce converter lui-même (via 'new'), en dehors du cycle de vie Spring.
        // Donc l'injection d'instance ne marcherait pas pour les objets
        // qu'Hibernate crée directement.
        TokenAttributeConverter.tokenEncryptionConfig = config;
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) {
            return null;
        }
        return tokenEncryptionConfig.encrypt(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return tokenEncryptionConfig.decrypt(dbData);
    }
}
