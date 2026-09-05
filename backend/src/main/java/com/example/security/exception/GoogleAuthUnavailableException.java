package com.example.security.exception;

public class GoogleAuthUnavailableException extends RuntimeException {
    public GoogleAuthUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
