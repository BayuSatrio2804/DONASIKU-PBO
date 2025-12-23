package Donasiku.spring.core.controller;

import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

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

    // Edit Profil dengan Error Handling
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
}
