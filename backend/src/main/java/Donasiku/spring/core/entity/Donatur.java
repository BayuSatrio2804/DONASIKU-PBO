package Donasiku.spring.core.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "Donatur")
public class Donatur {

    @Id // PK
    @Column(name = "user_id")
    private Integer userId; // PK-as-FK ke Users.user_id

    @Column(name = "daftar_donasi_count")
    private Integer daftarDonasiCount;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    // Relasi One-to-One dengan Users
    @OneToOne
    @MapsId // Menggunakan userId sebagai Primary Key dan Foreign Key ke Users
    @JoinColumn(name = "user_id") // Nama kolom FK di tabel Donatur
    private User user;

    public Donatur() {
    }

    public Donatur(Integer userId, Integer daftarDonasiCount, LocalDateTime createdAt, User user) {
        this.userId = userId;
        this.daftarDonasiCount = daftarDonasiCount;
        this.createdAt = createdAt;
        this.user = user;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getDaftarDonasiCount() {
        return daftarDonasiCount;
    }

    public void setDaftarDonasiCount(Integer daftarDonasiCount) {
        this.daftarDonasiCount = daftarDonasiCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Donatur{" +
                "userId=" + userId +
                ", daftarDonasiCount=" + daftarDonasiCount +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Donatur donatur = (Donatur) o;
        return java.util.Objects.equals(userId, donatur.userId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(userId);
    }
}