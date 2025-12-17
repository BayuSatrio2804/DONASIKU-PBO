package Donasiku.spring.core.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Donasiku.spring.core.dto.LoginRequest;
import Donasiku.spring.core.dto.RegisterRequest;
import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerNewUser(RegisterRequest request) {
        // [Kode registerNewUser sudah ada]
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username sudah digunakan.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email sudah terdaftar.");
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setNama(request.getNama() != null ? request.getNama() : request.getUsername());
        newUser.setAlamat(request.getAlamat());
        newUser.setNoTelepon(request.getNoTelepon());

        try {
            String roleInput = request.getRole().toLowerCase();
            
            // Restrict role admin - hanya bisa dibuat via backend/seeder
            if ("admin".equals(roleInput)) {
                throw new RuntimeException("Role admin tidak dapat didaftarkan melalui registration endpoint.");
            }
            
            newUser.setRole(User.UserRole.valueOf(roleInput));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Role tidak valid: " + request.getRole());
        }
        
        newUser.setStatus(User.UserStatus.active);
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(newUser);
    }

    /**
     * Metode untuk memverifikasi kredensial pengguna tanpa JWT/Spring Security penuh.
     * Digunakan sebagai dasar untuk login.
     */
    public User authenticateSimple(LoginRequest request) {
        // Cari user berdasarkan username/email
        Optional<User> userOptional = userRepository.findByUsername(request.getUsernameOrEmail());
        
        // Jika tidak ditemukan, coba cari berdasarkan email
        if (userOptional.isEmpty()) {
            // Karena findByUsernameOrEmail belum ada di UserRepository, kita asumsikan input adalah username untuk saat ini
            // Jika Anda ingin mendukung login email, Anda harus menambahkan method di UserRepository
             userOptional = userRepository.findByEmail(request.getUsernameOrEmail()); 
        }

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Username atau Email tidak ditemukan.");
        }

        User user = userOptional.get();

        // Verifikasi password: membandingkan input dengan hash yang tersimpan
        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return user; // Autentikasi berhasil
        } else {
            throw new RuntimeException("Password salah.");
        }
    }
}