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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Users") // Memetakan ke tabel Users di database
@Data // Lombok: Membuat getters, setters, toString, equals, dan hashCode
@NoArgsConstructor // Lombok: Konstruktor tanpa argumen
@AllArgsConstructor // Lombok: Konstruktor dengan semua argumen

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Sesuai dengan AUTO_INCREMENT
    @Column(name = "user_id")
    private Integer userId; // PK

    @Column(name = "username", unique = true, nullable = false, length = 99)
    private String username;

    @Column(name = "email", unique = true, nullable = false, length = 99)
    private String email;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @Column(name = "password", nullable = false, length = 319) // Panjang 319 sesuai SQL Anda
    private String password;

    @Column(name = "nama", nullable = false, length = 99)
    private String nama;

    @Column(name = "alamat", columnDefinition = "TEXT") // Mapped ke TEXT
    private String alamat;

    @Column(name = "no_telepon", length = 99)
    private String noTelepon;

    @Column(name = "foto_profil", length = 99)
    private String fotoProfil;

    // Mapping Enum SQL ke Enum Java
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UserStatus status;

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
}