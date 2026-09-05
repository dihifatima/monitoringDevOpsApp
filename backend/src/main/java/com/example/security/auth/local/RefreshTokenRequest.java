package com.example.security.auth.local;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
        @NotBlank(message = "Refresh token is mandatory") String refreshToken
) {}