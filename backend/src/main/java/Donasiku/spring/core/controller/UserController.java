package Donasiku.spring.core.controller;

import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.service.UserService;
import Donasiku.spring.core.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import java.util.List;
import Donasiku.spring.core.entity.Donasi;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // Admin: Get All Users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // Get Profil dengan Error Handling
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfil(@PathVariable("id") Integer userId) {
        try {
            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest().body("Error: User ID tidak valid");
            }

            User user = userService.getProfil(userId);

            if (user == null) {
                return ResponseEntity.status(404).body("Error: User dengan ID " + userId + " tidak ditemukan");
            }

            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Error: User tidak ditemukan - " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: Gagal mengambil data profil");
        }
    }

    // Endpoint for updating profile with photo
    @PostMapping(value = "/{id}/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfileWithPhoto(
            @PathVariable("id") Integer userId,
            @RequestParam("name") String name,
            @RequestParam("phone") String phone,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "photo", required = false) MultipartFile photo) {
        try {
            User updatedData = new User();
            updatedData.setNama(name);
            updatedData.setNoTelepon(phone);
            updatedData.setEmail(email);
            // We ignore address/password here for simplicity as per frontend form, or add
            // them if needed.
            // Frontend sends: name, phone.

            userService.editProfilWithPhoto(userId, updatedData, photo);
            // Fetch updated user to return
            User updatedUser = userService.getProfil(userId);

            // Wrap in expected structure if needed, or just return user
            // DetailAkunDonatur expects response.data.data.user or similar?
            // "const updatedUser = response.data.data.user;" -> Backend usually returns
            // standardized response?
            // Let's check AuthController response format. It returns AuthResponse.
            // But DetailAkunDonatur expects: response.data.data.user...
            // Standardizing response:
            java.util.Map<String, Object> data = new java.util.HashMap<>();
            data.put("user", updatedUser);

            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("success", true);
            response.put("message", "Profil berhasil diperbarui");
            response.put("data", data);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // Edit Profil (JSON only) - Keep existing
    @PutMapping("/{id}")
    public ResponseEntity<?> editProfil(@PathVariable("id") Integer userId, @RequestBody User updatedData) {
        try {
            // Validasi ID
            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest().body("Error: User ID tidak valid");
            }

            if (updatedData == null) {
                return ResponseEntity.badRequest().body("Error: Data user tidak boleh kosong");
            }

            // Validasi field username
            if (updatedData.getUsername() != null) {
                String username = updatedData.getUsername().trim();
                if (username.isEmpty()) {
                    return ResponseEntity.badRequest().body("Error: Username tidak boleh kosong");
                }
                if (username.length() < 3) {
                    return ResponseEntity.badRequest().body("Error: Username minimal 3 karakter");
                }
                if (username.length() > 50) {
                    return ResponseEntity.badRequest().body("Error: Username maksimal 50 karakter");
                }
            }

            // Validasi field noTelepon
            if (updatedData.getNoTelepon() != null && !updatedData.getNoTelepon().trim().isEmpty()) {
                String phone = updatedData.getNoTelepon().trim();
                if (!phone.matches("^[0-9+\\-\\s()]+$")) {
                    return ResponseEntity.badRequest().body("Error: Format nomor telepon tidak valid");
                }
                if (phone.replaceAll("[^0-9]", "").length() < 10) {
                    return ResponseEntity.badRequest().body("Error: Nomor telepon minimal 10 digit");
                }
            }

            // Validasi field alamat
            if (updatedData.getAlamat() != null && updatedData.getAlamat().trim().length() > 500) {
                return ResponseEntity.badRequest().body("Error: Alamat maksimal 500 karakter");
            }

            userService.editProfil(userId, updatedData);
            return ResponseEntity.ok("Profil berhasil diperbarui.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Error: User tidak ditemukan - " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: Gagal memperbarui profil - " + e.getMessage());
        }
    }

    // FR-XX: Lihat Riwayat Donasi (Class Diagram: lihatRiwayat)
    @GetMapping("/{userId}/riwayat")
    public ResponseEntity<?> getRiwayatDonasi(@PathVariable Integer userId) {
        try {
            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest().body("Error: User ID tidak valid");
            }

            List<Donasi> riwayat = userService.getRiwayatDonasi(userId);
            return ResponseEntity.ok(riwayat);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Error: User tidak ditemukan");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: Gagal mengambil riwayat donasi");
        }
    }

    // FR-16: Admin - Get Penerima Pending Verification
    @GetMapping("/penerima/pending")
    public ResponseEntity<List<User>> getPendingPenerima() {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.UserRole.penerima &&
                        (u.getIsVerified() == null || !u.getIsVerified()) &&
                        (u.getStatus() == null || u.getStatus() != User.UserStatus.suspended))
                .toList();
        return ResponseEntity.ok(users);
    }

    // FR-16: Admin - Verify Penerima
    @PostMapping("/{id}/verify")
    public ResponseEntity<?> verifyUser(@PathVariable("id") Integer userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

            user.setIsVerified(true);
            user.setStatus(User.UserStatus.active); // Fix: Ensure status is active
            userRepository.save(user);

            return ResponseEntity.ok("User berhasil diverifikasi");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // Temporary Fix for Data
    @GetMapping("/fix-data")
    public ResponseEntity<?> fixData() {
        try {
            List<User> users = userRepository.findAll();
            int count = 0;
            for (User u : users) {
                if (Boolean.TRUE.equals(u.getIsVerified()) && u.getStatus() == User.UserStatus.suspended) {
                    u.setStatus(User.UserStatus.active);
                    userRepository.save(u);
                    count++;
                }
            }
            return ResponseEntity.ok("Fixed " + count + " users.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // FR-16: Admin - Reject Penerima Verification
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectUser(@PathVariable("id") Integer userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

            user.setIsVerified(false);
            user.setStatus(User.UserStatus.suspended);
            userRepository.save(user);

            return ResponseEntity.ok("User berhasil ditolak");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
