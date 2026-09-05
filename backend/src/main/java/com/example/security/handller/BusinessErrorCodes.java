package com.example.security.handller;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;


public enum BusinessErrorCodes {
    NO_CODE(0, NOT_IMPLEMENTED, "No code"),
    INCORRECT_CURRENT_PASSWORD(300, BAD_REQUEST, "current password is in correct"),
    NEW_PASSWORD_NOT_MATCH(301, BAD_REQUEST, "the new password does not match"),
    ACCOUNT_DISABLED(303, FORBIDDEN, "User account is disabled"),
    BAD_CREDENTIAL(304, FORBIDDEN, "Login and / or password is incorrect  "),
    Account_LOCKED(302, FORBIDDEN, "User account is locked"),

    // --- Ajouts pour le refactor de l'authentification ---
    EMAIL_ALREADY_EXISTS(305, CONFLICT, "Email already exists"),
    INVALID_TOKEN(306, BAD_REQUEST, "Invalid or unknown token"),
    TOKEN_EXPIRED(307, GONE, "Token has expired"),
    TOKEN_ALREADY_USED(308, BAD_REQUEST, "This token has already been used"),
    ROLE_NOT_FOUND(309, INTERNAL_SERVER_ERROR, "Server configuration error"),
    USER_NOT_AUTHENTICATED(310, UNAUTHORIZED, "User is not authenticated"),
    GOOGLE_AUTH_UNAVAILABLE(311, SERVICE_UNAVAILABLE, "Google authentication is temporarily unavailable"),
    ;
    @Getter
    private final int code;
    @Getter
    private final String description;
    @Getter
    private final HttpStatus httpStatus;

    BusinessErrorCodes(int code, HttpStatus httpStatus, String description) {
        this.code = code;
        this.description = description;
        this.httpStatus = httpStatus;
    }
}