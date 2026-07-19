package com.example.security.controller.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePasswordRequest {
    @NotEmpty(message = "Current password is mandatory")
    private String currentPassword;

    @NotEmpty(message = "New password is mandatory")
    @Size(min = 8, message = "Password should be 8 characters long minimum")
    private String newPassword;
}