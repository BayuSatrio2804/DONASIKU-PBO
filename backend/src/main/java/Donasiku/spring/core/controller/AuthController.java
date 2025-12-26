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
                    newUser.getRole().toString(),
                    newUser.getNama(),
                    newUser.getFotoProfil());

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            AuthResponse errorResponse = new AuthResponse(
                    false,
                    e.getMessage(),
                    null,
                    null,
                    null,
                    null,
                    null,
                    null);
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    // New Endpoint for Pendaftaran with Document Upload
    @PostMapping(value = "/register", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerUserMultipart(
            @org.springframework.web.bind.annotation.RequestParam("email") String email,
            @org.springframework.web.bind.annotation.RequestParam("password") String password,
            @org.springframework.web.bind.annotation.RequestParam("role") String role,
            @org.springframework.web.bind.annotation.RequestParam(value = "username", required = false) String username,
            @org.springframework.web.bind.annotation.RequestParam(value = "nama", required = false) String nama,
            @org.springframework.web.bind.annotation.RequestParam(value = "alamat", required = false) String alamat,
            @org.springframework.web.bind.annotation.RequestParam(value = "noTelepon", required = false) String noTelepon,
            @org.springframework.web.bind.annotation.RequestParam(value = "document", required = false) org.springframework.web.multipart.MultipartFile document) {
        try {
            RegisterRequest request = new RegisterRequest();
            // Generate username from email if not provided
            request.setUsername(username != null && !username.isEmpty() ? username : email.split("@")[0]);
            request.setEmail(email);
            request.setPassword(password);
            request.setRole(role);
            request.setNama(nama);
            request.setAlamat(alamat);
            request.setNoTelepon(noTelepon);

            User newUser = authService.registerNewUser(request, document);

            AuthResponse response = new AuthResponse(
                    true,
                    "User " + newUser.getUsername() + " berhasil didaftarkan.",
                    newUser.getUsername(),
                    newUser.getUserId(),
                    newUser.getEmail(),
                    newUser.getRole().toString(),
                    newUser.getNama(),
                    newUser.getFotoProfil());

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            AuthResponse errorResponse = new AuthResponse(
                    false,
                    e.getMessage(),
                    null,
                    null,
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
                    authenticatedUser.getRole().toString(),
                    authenticatedUser.getNama(),
                    authenticatedUser.getFotoProfil());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            AuthResponse errorResponse = new AuthResponse(
                    false,
                    e.getMessage(),
                    null,
                    null,
                    null,
                    null,
                    null,
                    null);
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        return ResponseEntity.ok("Logout berhasil.");
    }

    // FR-16: Check verification status by email
    @org.springframework.web.bind.annotation.GetMapping("/check-status")
    public ResponseEntity<?> checkStatus(@org.springframework.web.bind.annotation.RequestParam String email) {
        try {
            User user = authService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email tidak ditemukan");
            }

            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("name", user.getNama());
            response.put("email", user.getEmail());
            response.put("role", user.getRole().toString());
            response.put("status", user.getStatus() != null ? user.getStatus().toString() : "active");
            response.put("isVerified", user.getIsVerified() != null ? user.getIsVerified() : false);
            response.put("createdAt", user.getCreatedAt());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}