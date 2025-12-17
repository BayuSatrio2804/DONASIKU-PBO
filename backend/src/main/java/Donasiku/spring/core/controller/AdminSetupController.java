package Donasiku.spring.core.controller;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.repository.UserRepository;

/**
 * Endpoint untuk setup awal user admin dan skema database
 * Hanya untuk development
 */
@RestController
@RequestMapping("/api/setup")
public class AdminSetupController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Endpoint untuk memperbarui skema database dan membuat user admin
     * GET atau POST /api/setup/init-admin
     */
    @GetMapping("/init-admin")
    @PostMapping("/init-admin")
    public ResponseEntity<?> initializeAdmin() {
        try {
            // 1. Perbarui skema database untuk menambahkan role admin ke enum
            String updateSchemaSql = "ALTER TABLE Users MODIFY COLUMN role ENUM('donatur', 'penerima', 'admin') NOT NULL";
            try {
                jdbcTemplate.execute(updateSchemaSql);
                System.out.println("✓ Skema database diperbarui: Role 'admin' ditambahkan ke enum");
            } catch (Exception e) {
                // Mungkin admin enum sudah ada, lanjutkan saja
                System.out.println("⚠ Pembaruan skema dilewati (kemungkinan sudah ada): " + e.getMessage());
            }

            // 2. Buat user admin jika belum ada
            Optional<User> existingAdmin = userRepository.findByUsername("admin");
            User admin;

            if (existingAdmin.isEmpty()) {
                admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@donasiku.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setNama("Administrator");
                admin.setRole(User.UserRole.admin);
                admin.setStatus(User.UserStatus.active);
                admin.setCreatedAt(LocalDateTime.now());
                admin.setUpdatedAt(LocalDateTime.now());

                userRepository.save(admin);
                System.out.println("\n✓ User admin berhasil dibuat!");
                System.out.println("  Nama pengguna: admin");
                System.out.println("  Kata sandi: admin123\n");
            } else {
                admin = existingAdmin.get();
                System.out.println("✓ User admin sudah ada");
            }

            return ResponseEntity.ok(new java.util.HashMap<String, Object>() {
                {
                    put("success", true);
                    put("message", "Setup admin selesai");
                    put("username", admin.getUsername());
                    put("role", admin.getRole().toString());
                }
            });

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    new java.util.HashMap<String, Object>() {
                        {
                            put("success", false);
                            put("error", e.getMessage());
                        }
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
