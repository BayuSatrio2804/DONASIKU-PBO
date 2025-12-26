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
@Table(name = "Admin")
public class Admin {

    @Id
    @Column(name = "user_id")
    private Integer userId; // PK-as-FK ke Users.user_id

    @Column(name = "note", length = 99)
    private String note; // Catatan admin / hak khusus

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Relasi One-to-One dengan Users
    @OneToOne
    @MapsId // Menggunakan userId sebagai Primary Key dan Foreign Key ke Users
    @JoinColumn(name = "user_id") // Nama kolom FK di tabel Admin
    private User user;

    public Admin() {
    }

    public Admin(Integer userId, String note, LocalDateTime createdAt, User user) {
        this.userId = userId;
        this.note = note;
        this.createdAt = createdAt;
        this.user = user;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
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
        return "Admin{" +
                "userId=" + userId +
                ", note='" + note + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Admin admin = (Admin) o;
        return java.util.Objects.equals(userId, admin.userId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(userId);
    }
}
