package com.example.security.auth.local;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * IMPORTANT : le champ "isAdmin" a été retiré volontairement.
 * Un endpoint d'inscription PUBLIC ne doit jamais permettre à l'appelant
 * de choisir son propre rôle -> faille de privilege escalation.
 * Toute inscription via /auth/register crée désormais un compte CLIENT.
 * La création d'un compte ADMIN doit passer par un endpoint séparé,
 * protégé par @PreAuthorize("hasRole('ADMIN')") (cf. AdminController).
 */
@Getter
@Setter
@Builder
public class RegistrationRequest {

    @NotBlank(message = "Firstname is mandatory")
    private String firstname;

    @NotBlank(message = "Lastname is mandatory")
    private String lastname;

    @Email(message = "Email is not well formatted")
    @NotBlank(message = "Email is mandatory")
    private String email;

    @NotBlank(message = "Password is mandatory")
    @Size(min = 8, message = "Password should be at least 8 characters long")
    private String password;
}