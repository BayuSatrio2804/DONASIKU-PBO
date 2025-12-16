package Donasiku.spring.core.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Username tidak boleh kosong")
    @Size(min = 3, max = 99, message = "Username minimal 3 karakter")
    private String username;

    @NotBlank(message = "Email tidak boleh kosong")
    @Email(message = "Format email tidak valid")
    private String email;

    @NotBlank(message = "Password tidak boleh kosong")
    @Size(min = 6, message = "Password minimal 6 karakter")
    private String password;

    // Role dikirim sebagai String, akan dikonversi ke Enum di Service
    @NotBlank(message = "Role harus diisi (donatur atau penerima)")
    private String role;

    // Field tambahan untuk profil pengguna
    private String nama;
    private String alamat;
    private String noTelepon;
}