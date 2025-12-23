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

    // Get Profil
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfil(@PathVariable("id") Integer userId) {
        try {
            User user = userService.getProfil(userId);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Edit Profil (Metode PUT)
    @PutMapping("/{id}")
    public ResponseEntity<?> editProfil(@PathVariable("id") Integer userId, @RequestBody User updatedData) {
        try {
            userService.editProfil(userId, updatedData);
            return ResponseEntity.ok("Profil berhasil diperbarui.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
