package Donasiku.spring.core.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Donasiku.spring.core.dto.AuthResponse;
import Donasiku.spring.core.dto.LoginRequest;
import Donasiku.spring.core.dto.RegisterRequest;
import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.service.AuthService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Endpoint Pendaftaran (Register) - FR-02
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            User newUser = authService.registerNewUser(request);

            AuthResponse response = new AuthResponse(
                    true,
                    "User " + newUser.getUsername() + " berhasil didaftarkan.",
                    newUser.getUsername(),
                    newUser.getUserId(),
                    newUser.getEmail(),
                    newUser.getRole().toString());

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            AuthResponse errorResponse = new AuthResponse(
                    false,
                    e.getMessage(),
                    null,
                    null,
                    null,
                    null);
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    // Endpoint untuk Login - FR-01
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request) {
        try {
            User authenticatedUser = authService.authenticateSimple(request);

            AuthResponse response = new AuthResponse(
                    true,
                    "Login berhasil! Selamat datang, " + authenticatedUser.getUsername() + ".",
                    authenticatedUser.getUsername(),
                    authenticatedUser.getUserId(),
                    authenticatedUser.getEmail(),
                    authenticatedUser.getRole().toString());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            AuthResponse errorResponse = new AuthResponse(
                    false,
                    e.getMessage(),
                    null,
                    null,
                    null,
                    null);
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
    }
}