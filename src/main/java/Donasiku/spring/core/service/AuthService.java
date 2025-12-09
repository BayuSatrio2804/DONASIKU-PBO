package Donasiku.spring.core.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Donasiku.spring.core.dto.RegisterRequest;
import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.repository.UserRepository;

// NOTE: Anda perlu menambahkan dependency Spring Security di pom.xml agar PasswordEncoder berfungsi

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Digunakan untuk hashing password

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerNewUser(RegisterRequest request) {
        // 1. Validasi Keunikan
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username sudah digunakan.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email sudah terdaftar.");
        }

        // 2. Buat objek User baru
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        
        // Hashing password sebelum disimpan ke database
        newUser.setPassword(passwordEncoder.encode(request.getPassword())); 
        
        // Set Role dan Status default
        try {
            newUser.setRole(User.UserRole.valueOf(request.getRole().toLowerCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Role tidak valid: " + request.getRole());
        }
        
        newUser.setStatus(User.UserStatus.active);
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setUpdatedAt(LocalDateTime.now());

        // 3. Simpan dan kembalikan User yang disimpan
        return userRepository.save(newUser);
    }
    
    // TODO: Tambahkan metode loginUser(LoginRequest request) di sini
    // Metode ini akan menggunakan Spring Security untuk autentikasi dan JWT (nanti)
}
