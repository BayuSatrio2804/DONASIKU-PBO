package Donasiku.spring.core.dto;

import jakarta.validation.constraints.NotBlank;


public class LoginRequest {

    @NotBlank(message = "Username atau Email tidak boleh kosong")
    private String usernameOrEmail; // Untuk mendukung login menggunakan username atau email

    @NotBlank(message = "Password tidak boleh kosong")
    private String password;

    public LoginRequest() {
    }

    public LoginRequest(String usernameOrEmail, String password) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }

    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}