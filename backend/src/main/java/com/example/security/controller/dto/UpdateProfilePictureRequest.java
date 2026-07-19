package com.example.security.controller.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfilePictureRequest {
    @NotEmpty(message = "profilePicture URL is mandatory")
    private String profilePicture; // URL de l'image déjà uploadée (Cloudinary/S3...)
}