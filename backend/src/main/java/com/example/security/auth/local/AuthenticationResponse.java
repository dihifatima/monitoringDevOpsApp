package com.example.security.auth.local;

import lombok.Builder;

import java.util.List;

@Builder
public record AuthenticationResponse(
        String accessToken,
        String refreshToken,
        List<String> roles,
        String fullName
) {}