package Donasiku.spring.core.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "Users") // Memetakan ke tabel Users di database
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonProperty("id")
    private Integer userId;

    @Column(name = "username", unique = true, nullable = false, length = 99)
    private String username;

    @Column(name = "email", unique = true, nullable = false, length = 99)
    private String email;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @Column(name = "password", nullable = false, length = 319) // Panjang 319 sesuai SQL Anda
    private String password;

    @Column(name = "nama", nullable = false, length = 99)
    @com.fasterxml.jackson.annotation.JsonProperty("name")
    private String nama;

    @Column(name = "alamat", columnDefinition = "TEXT") // Mapped ke TEXT
    private String alamat;

    @Column(name = "no_telepon", length = 99)
    private String noTelepon;

    @Column(name = "foto_profil", length = 99)
    @com.fasterxml.jackson.annotation.JsonProperty("photo")
    private String fotoProfil;

    // Mapping Enum SQL ke Enum Java
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UserStatus status;

    // Verification fields for FR-16
    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "document_path", length = 255)
    private String documentPath;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- Inner Enums untuk Mapping SQL ENUM ---

    public enum UserRole {
        donatur, penerima, admin
    }

    public enum UserStatus {
        active, deleted, suspended
    }

    // Manual Boilerplate

    public User() {
    }

    public User(Integer userId, String username, String email, String password, String nama, String alamat, String noTelepon, String fotoProfil, UserRole role, UserStatus status, Boolean isVerified, String documentPath, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.nama = nama;
        this.alamat = alamat;
        this.noTelepon = noTelepon;
        this.fotoProfil = fotoProfil;
        this.role = role;
        this.status = status;
        this.isVerified = isVerified;
        this.documentPath = documentPath;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }

    public String getAlamat() {
        return alamat;
    }

    public void setAlamat(String alamat) {
        this.alamat = alamat;
    }

    public String getNoTelepon() {
        return noTelepon;
    }

    public void setNoTelepon(String noTelepon) {
        this.noTelepon = noTelepon;
    }

    public String getFotoProfil() {
        return fotoProfil;
    }

    public void setFotoProfil(String fotoProfil) {
        this.fotoProfil = fotoProfil;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getDocumentPath() {
        return documentPath;
    }

    public void setDocumentPath(String documentPath) {
        this.documentPath = documentPath;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", nama='" + nama + '\'' +
                ", alamat='" + alamat + '\'' +
                ", noTelepon='" + noTelepon + '\'' +
                ", fotoProfil='" + fotoProfil + '\'' +
                ", role=" + role +
                ", status=" + status +
                ", isVerified=" + isVerified +
                ", documentPath='" + documentPath + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return java.util.Objects.equals(userId, user.userId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(userId);
    }
}