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
    public User registerNewUser(RegisterRequest request, org.springframework.web.multipart.MultipartFile document) {
        // Check for existing users (username or email)
        Optional<User> existingUserByUsername = userRepository.findByUsername(request.getUsername());
        Optional<User> existingUserByEmail = userRepository.findByEmail(request.getEmail());

        User userToUpdate = null;

        if (existingUserByUsername.isPresent()) {
            User u = existingUserByUsername.get();
            if (u.getStatus() != User.UserStatus.suspended) {
                throw new RuntimeException("Username sudah digunakan.");
            }
            userToUpdate = u;
        }

        if (existingUserByEmail.isPresent()) {
            User u = existingUserByEmail.get();
            if (u.getStatus() != User.UserStatus.suspended) {
                throw new RuntimeException("Email sudah terdaftar.");
            }
            if (userToUpdate != null && !userToUpdate.getUserId().equals(u.getUserId())) {
                throw new RuntimeException("Konflik data: Username dan Email terdaftar pada user yang berbeda.");
            }
            userToUpdate = u;
        }

        User newUser;
        if (userToUpdate != null) {
            // Update existing suspended user (Re-registration)
            newUser = userToUpdate;
            // Note: We don't change username/email as they matched or are new (if only one
            // matched)
            // But if only one matched, we should probably update the other field if needed?
            // For simplicity, let's assume they re-register with same credentials or we
            // just update fields.
            newUser.setEmail(request.getEmail()); // Ensure email is fresh if it was unique-username match
            newUser.setUsername(request.getUsername());
        } else {
            // Create new user
            newUser = new User();
            newUser.setUsername(request.getUsername());
            newUser.setEmail(request.getEmail());
        }

        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setNama(request.getNama() != null ? request.getNama() : request.getUsername());
        newUser.setAlamat(request.getAlamat());
        newUser.setNoTelepon(request.getNoTelepon());

        try {
            String roleInput = request.getRole().toLowerCase();
            if ("admin".equals(roleInput)) {
                throw new RuntimeException("Role admin tidak dapat didaftarkan melalui registration endpoint.");
            }
            newUser.setRole(User.UserRole.valueOf(roleInput));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Role tidak valid: " + request.getRole());
        }

        newUser.setStatus(User.UserStatus.active); // Reactivate user
        newUser.setCreatedAt(LocalDateTime.now()); // Reset created time? Or keep original? Let's update it.
        newUser.setUpdatedAt(LocalDateTime.now());

        if (newUser.getRole() == User.UserRole.penerima) {
            newUser.setIsVerified(false); // Reset to pending

            if (document != null && !document.isEmpty()) {
                try {
                    String fileName = "verif_" + newUser.getUsername() + "_" + System.currentTimeMillis() + "_"
                            + document.getOriginalFilename();
                    java.nio.file.Path path = java.nio.file.Paths.get("uploads/" + fileName);
                    java.nio.file.Files.createDirectories(path.getParent());
                    java.nio.file.Files.write(path, document.getBytes());
                    newUser.setDocumentPath(fileName);
                } catch (java.io.IOException e) {
                    throw new RuntimeException("Gagal mengunggah dokumen: " + e.getMessage());
                }
            }
        } else {
            newUser.setIsVerified(true);
        }

        return userRepository.save(newUser);
    }

    @Transactional
    public User registerNewUser(RegisterRequest request) {
        return registerNewUser(request, null);
    }

    /**
     * Metode untuk memverifikasi kredensial pengguna tanpa JWT/Spring Security
     * penuh.
     * Digunakan sebagai dasar untuk login.
     */
    public User authenticateSimple(LoginRequest request) {
        // Cari user berdasarkan username/email
        Optional<User> userOptional = userRepository.findByUsername(request.getUsernameOrEmail());

        // Jika tidak ditemukan, coba cari berdasarkan email
        if (userOptional.isEmpty()) {
            // Karena findByUsernameOrEmail belum ada di UserRepository, kita asumsikan
            // input adalah username untuk saat ini
            // Jika Anda ingin mendukung login email, Anda harus menambahkan method di
            // UserRepository
            userOptional = userRepository.findByEmail(request.getUsernameOrEmail());
        }

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Username atau Email tidak ditemukan.");
        }

        User user = userOptional.get();

        // Verifikasi password: membandingkan input dengan hash yang tersimpan
        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            // FR-16: Check if penerima is verified by admin
            if (user.getRole() == User.UserRole.penerima) {
                Boolean isVerified = user.getIsVerified();
                if (isVerified == null || !isVerified) {
                    throw new RuntimeException(
                            "Akun Anda masih menunggu verifikasi Admin. Silakan cek status di halaman Cek Status Verifikasi.");
                }
            }
            return user; // Autentikasi berhasil
        } else {
            throw new RuntimeException("Password salah.");
        }
    }

    // FR-16: Find user by email for status check
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}