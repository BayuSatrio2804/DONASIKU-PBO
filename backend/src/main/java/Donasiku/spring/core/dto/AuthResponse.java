package Donasiku.spring.core.dto;



public class AuthResponse {
    private boolean success;
    private String message;
    private String username;
    private Integer userId;
    private String email;
    private String role;
    private String nama; // User's display name
    private String fotoProfil; // Profile photo filename

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message, String username, Integer userId, String email, String role, String nama, String fotoProfil) {
        this.success = success;
        this.message = message;
        this.username = username;
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.nama = nama;
        this.fotoProfil = fotoProfil;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }

    public String getFotoProfil() {
        return fotoProfil;
    }

    public void setFotoProfil(String fotoProfil) {
        this.fotoProfil = fotoProfil;
    }
}
