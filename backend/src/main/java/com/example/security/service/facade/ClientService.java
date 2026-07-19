package com.example.security.service.facade;

import com.example.security.controller.dto.*;
import org.springframework.security.core.Authentication;

public interface ClientService {
    ProfileResponse getProfile(Authentication authentication);
    ProfileResponse updateProfile(Authentication authentication, UpdateProfileRequest request);
    ProfileResponse updateProfilePicture(Authentication authentication, UpdateProfilePictureRequest request);
    void updatePassword(Authentication authentication, UpdatePasswordRequest request);
    ProfileResponse updateNotifications(Authentication authentication, UpdateNotificationsRequest request);
    void deleteAccount(Authentication authentication, DeleteAccountRequest request);
}