package com.example.security.controller.facade;

import com.example.security.controller.dto.*;
import com.example.security.service.facade.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("client")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(clientService.getProfile(authentication));
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @RequestBody @Valid UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(clientService.updateProfile(authentication, request));
    }

    @PutMapping("/profile/picture")
    public ResponseEntity<ProfileResponse> updateProfilePicture(
            Authentication authentication,
            @RequestBody @Valid UpdateProfilePictureRequest request
    ) {
        return ResponseEntity.ok(clientService.updateProfilePicture(authentication, request));
    }

    @PutMapping("/profile/password")
    public ResponseEntity<?> updatePassword(
            Authentication authentication,
            @RequestBody @Valid UpdatePasswordRequest request
    ) {
        clientService.updatePassword(authentication, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile/notifications")
    public ResponseEntity<ProfileResponse> updateNotifications(
            Authentication authentication,
            @RequestBody UpdateNotificationsRequest request
    ) {
        return ResponseEntity.ok(clientService.updateNotifications(authentication, request));
    }

    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteAccount(
            Authentication authentication,
            @RequestBody @Valid DeleteAccountRequest request
    ) {
        clientService.deleteAccount(authentication, request);
        return ResponseEntity.ok().build();
    }
}