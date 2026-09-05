package com.example.security.auth.google;


import com.example.security.auth.local.AuthenticationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class GoogleAuthController {

    private final GoogleAuthService googleAuthService;

    @PostMapping("/google")
    public ResponseEntity<AuthenticationResponse> authenticateGoogle(
            @RequestBody GoogleAuthenticateRequest request) {
        return ResponseEntity.ok(googleAuthService.authenticate(request));
    }
}