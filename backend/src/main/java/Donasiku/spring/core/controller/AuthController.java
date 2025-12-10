package Donasiku.spring.core.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
            // Respons yang ideal adalah mengembalikan detail user atau token
            return new ResponseEntity<>("User " + newUser.getUsername() + " berhasil didaftarkan.", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Endpoint untuk Login - FR-01
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request) {
        try {
            User authenticatedUser = authService.authenticateSimple(request);
            
            // TODO: Di sini, Anda harusnya membuat dan mengembalikan JWT Token.
            // Untuk saat ini, kita kembalikan status sukses sederhana.
            
            return ResponseEntity.ok("Login berhasil! Selamat datang, " + authenticatedUser.getUsername() + ".");
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED); // 401 Unauthorized
        }
    }
}