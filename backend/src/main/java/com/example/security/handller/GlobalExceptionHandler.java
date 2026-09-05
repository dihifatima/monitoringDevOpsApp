package com.example.security.handller;

import com.example.security.exception.*;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashSet;
import java.util.Set;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ExceptionResponse> handleException(LockedException exp) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ExceptionResponse.builder()
                        .businessErrorCode(BusinessErrorCodes.Account_LOCKED.getCode())
                        .businessErrorDescription(BusinessErrorCodes.Account_LOCKED.getDescription())
                        .error(exp.getMessage())
                        .build());
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ExceptionResponse> handleException(DisabledException exp) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ExceptionResponse.builder()
                        .businessErrorCode(BusinessErrorCodes.ACCOUNT_DISABLED.getCode())
                        .businessErrorDescription(BusinessErrorCodes.ACCOUNT_DISABLED.getDescription())
                        .error(exp.getMessage())
                        .build());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ExceptionResponse> handleException(BadCredentialsException exp) {
        // Message volontairement générique : on ne révèle jamais si c'est l'email ou le mot de passe qui cloche
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ExceptionResponse.builder()
                        .businessErrorCode(BusinessErrorCodes.BAD_CREDENTIAL.getCode())
                        .businessErrorDescription(BusinessErrorCodes.BAD_CREDENTIAL.getDescription())
                        .error(BusinessErrorCodes.BAD_CREDENTIAL.getDescription())
                        .build());
    }

    // Même traitement que BadCredentials : évite l'énumération de comptes
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleException(UsernameNotFoundException exp) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ExceptionResponse.builder()
                        .businessErrorCode(BusinessErrorCodes.BAD_CREDENTIAL.getCode())
                        .businessErrorDescription(BusinessErrorCodes.BAD_CREDENTIAL.getDescription())
                        .error(BusinessErrorCodes.BAD_CREDENTIAL.getDescription())
                        .build());
    }

    @ExceptionHandler(MessagingException.class)
    public ResponseEntity<ExceptionResponse> handleException(MessagingException exp) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ExceptionResponse.builder()
                        .error(exp.getMessage())
                        .build());
    }

    // --- Nouveaux handlers pour les exceptions custom du refactor auth ---

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ExceptionResponse> handleException(EmailAlreadyExistsException exp) {
        return ResponseEntity
                .status(BusinessErrorCodes.EMAIL_ALREADY_EXISTS.getHttpStatus())
                .body(ExceptionResponse.builder()
                        .businessErrorCode(BusinessErrorCodes.EMAIL_ALREADY_EXISTS.getCode())
                        .businessErrorDescription(BusinessErrorCodes.EMAIL_ALREADY_EXISTS.getDescription())
                        .error(exp.getMessage())
                        .build());
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ExceptionResponse> handleException(InvalidTokenException exp) {
        return ResponseEntity
                .status(BusinessErrorCodes.INVALID_TOKEN.getHttpStatus())
                .body(ExceptionResponse.builder()
                        .businessErrorCode(BusinessErrorCodes.INVALID_TOKEN.getCode())
                        .businessErrorDescription(BusinessErrorCodes.INVALID_TOKEN.getDescription())
                        .error(exp.getMessage())
                        .build());
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ExceptionResponse> handleException(TokenExpiredException exp) {
        return ResponseEntity
                .status(BusinessErrorCodes.TOKEN_EXPIRED.getHttpStatus())
                .body(ExceptionResponse.builder()
                        .businessErrorCode(BusinessErrorCodes.TOKEN_EXPIRED.getCode())
                        .businessErrorDescription(BusinessErrorCodes.TOKEN_EXPIRED.getDescription())
                        .error(exp.getMessage())
                        .build());
    }

    @ExceptionHandler(TokenAlreadyUsedException.class)
    public ResponseEntity<ExceptionResponse> handleException(TokenAlreadyUsedException exp) {
        return ResponseEntity
                .status(BusinessErrorCodes.TOKEN_ALREADY_USED.getHttpStatus())
                .body(ExceptionResponse.builder()
                        .businessErrorCode(BusinessErrorCodes.TOKEN_ALREADY_USED.getCode())
                        .businessErrorDescription(BusinessErrorCodes.TOKEN_ALREADY_USED.getDescription())
                        .error(exp.getMessage())
                        .build());
    }

    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleException(RoleNotFoundException exp) {
        // Erreur de configuration serveur (rôle absent en base) : on ne détaille pas au client
        return ResponseEntity
                .status(BusinessErrorCodes.ROLE_NOT_FOUND.getHttpStatus())
                .body(ExceptionResponse.builder()
                        .businessErrorCode(BusinessErrorCodes.ROLE_NOT_FOUND.getCode())
                        .businessErrorDescription(BusinessErrorCodes.ROLE_NOT_FOUND.getDescription())
                        .build());
    }

    @ExceptionHandler(UserNotAuthenticatedException.class)
    public ResponseEntity<ExceptionResponse> handleException(UserNotAuthenticatedException exp) {
        return ResponseEntity
                .status(BusinessErrorCodes.USER_NOT_AUTHENTICATED.getHttpStatus())
                .body(ExceptionResponse.builder()
                        .businessErrorCode(BusinessErrorCodes.USER_NOT_AUTHENTICATED.getCode())
                        .businessErrorDescription(BusinessErrorCodes.USER_NOT_AUTHENTICATED.getDescription())
                        .error(exp.getMessage())
                        .build());
    }

    @ExceptionHandler(GoogleAuthUnavailableException.class)
    public ResponseEntity<ExceptionResponse> handleException(GoogleAuthUnavailableException exp) {
        // On ne renvoie jamais la cause technique brute au client (timeout, IOException...)
        // juste un message clair et actionnable : "réessayez plus tard".
        return ResponseEntity
                .status(BusinessErrorCodes.GOOGLE_AUTH_UNAVAILABLE.getHttpStatus())
                .body(ExceptionResponse.builder()
                        .businessErrorCode(BusinessErrorCodes.GOOGLE_AUTH_UNAVAILABLE.getCode())
                        .businessErrorDescription(BusinessErrorCodes.GOOGLE_AUTH_UNAVAILABLE.getDescription())
                        .error("Impossible de vérifier votre compte Google pour le moment. Réessayez dans quelques instants.")
                        .build());
    }

    // exception @valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleException(MethodArgumentNotValidException exp) {
        Set<String> errors = new HashSet<>();
        exp.getBindingResult().getAllErrors()
                .forEach(error -> {
                    var errorMessage = error.getDefaultMessage();
                    errors.add(errorMessage);
                });
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ExceptionResponse.builder()
                        .validationErrors(errors)
                        .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleException(Exception exp) {
        // log the exception
        exp.printStackTrace();
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ExceptionResponse.builder()
                        .businessErrorDescription("Internal error, contact the admin")
                        .error(exp.getMessage())
                        .build());
    }
}