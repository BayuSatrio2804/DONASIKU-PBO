package Donasiku.spring.core.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "Penerima")
public class Penerima {

    @Id 
    @Column(name = "user_id")
    private Integer userId; 

    @Column(name = "status_verifikasi")
    private Boolean statusVerifikasi;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToOne
    @MapsId 
    @JoinColumn(name = "user_id") 
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dokumen_verifikasi_id")
    private DokumenVerifikasi dokumenVerifikasi;

    public Penerima() {
    }

    public Penerima(Integer userId, Boolean statusVerifikasi, LocalDateTime createdAt, User user, DokumenVerifikasi dokumenVerifikasi) {
        this.userId = userId;
        this.statusVerifikasi = statusVerifikasi;
        this.createdAt = createdAt;
        this.user = user;
        this.dokumenVerifikasi = dokumenVerifikasi;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Boolean getStatusVerifikasi() {
        return statusVerifikasi;
    }

    public void setStatusVerifikasi(Boolean statusVerifikasi) {
        this.statusVerifikasi = statusVerifikasi;
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

    public DokumenVerifikasi getDokumenVerifikasi() {
        return dokumenVerifikasi;
    }

    public void setDokumenVerifikasi(DokumenVerifikasi dokumenVerifikasi) {
        this.dokumenVerifikasi = dokumenVerifikasi;
    }

    @Override
    public String toString() {
        return "Penerima{" +
                "userId=" + userId +
                ", statusVerifikasi=" + statusVerifikasi +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Penerima penerima = (Penerima) o;
        return java.util.Objects.equals(userId, penerima.userId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(userId);
    }
}