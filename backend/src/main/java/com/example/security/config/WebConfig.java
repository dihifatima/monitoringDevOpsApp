package com.example.security.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // On applique CORS à tous les endpoints de l'application
                .allowedOriginPatterns("*") // Permet d'accepter le mobile (émulateurs et vrais téléphones)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Authorization", "Content-Type", "Accept", "X-Requested-With") // Indispensable pour laisser passer ton JWT Header !
                .allowCredentials(true); // Conserve la compatibilité avec tes cookies Next.js
    }
}