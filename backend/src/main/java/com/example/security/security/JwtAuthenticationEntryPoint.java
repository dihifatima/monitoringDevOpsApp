package com.example.security.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

/**
 * Par défaut, Spring Security répond 403 (Http403ForbiddenEntryPoint) à toute
 * requête non authentifiée quand aucun formLogin/httpBasic n'est configuré -
 * sémantiquement incorrect ici (403 = authentifié mais interdit, 401 = pas authentifié
 * du tout) ET surtout : le frontend n'écoute que le 401 pour déclencher le refresh
 * automatique. Sans ce point d'entrée, un access token expiré renvoie 403 et
 * l'intercepteur Axios ne tente jamais de renouveler le token.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401, pas 403
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(
                objectMapper.writeValueAsString(Map.of(
                        "error", "Unauthorized",
                        "message", "Authentication required or access token expired"
                ))
        );
    }
}