package com.example.security.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

/**
 * Rate limiting GLOBAL sur les webhooks GitHub : pas de notion d'utilisateur ou de clé API
 * ici (c'est GitHub qui appelle, pas un client final identifiable), donc un seul bucket
 * partagé protège l'endpoint contre un afflux massif d'événements.
 * La signature HMAC (déjà en place) reste la vérification d'authenticité ; ce filtre
 * ne fait que limiter le DÉBIT, peu importe que les requêtes soient authentiques ou non.
 */
@Component
public class WebhookRateLimitingFilter extends OncePerRequestFilter {

    private static final String WEBHOOK_PATH = "/api/webhooks/github/**";
    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    // 60 requêtes par minute : large marge pour un usage normal (plusieurs événements
    // liés à un même push/PR), tout en bornant un afflux anormal.
    private final Bucket bucket = Bucket.builder()
            .addLimit(Bandwidth.builder()
                    .capacity(5)
                    .refillGreedy(5, Duration.ofMinutes(1))
                    .build())
            .build();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !PATH_MATCHER.match(WEBHOOK_PATH, request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            response.setHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            long waitSeconds = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.setStatus(429); // Too Many Requests
            response.setHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitSeconds));
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"error\":\"Too many webhook requests, please retry later\",\"retryAfterSeconds\":" + waitSeconds + "}"
            );
        }
    }
}