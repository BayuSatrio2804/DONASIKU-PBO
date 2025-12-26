package Donasiku.spring.core.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "Permintaan_Konfirmasi")
public class PermintaanKonfirmasi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "konfirmasi_id")
    private Integer konfirmasiId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permintaan_id", nullable = false)
    private PermintaanDonasi permintaan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donatur_user_id", nullable = false)
    private User donatur;

    @Column(name = "status", length = 50)
    private String status; // offered, confirmed, rejected

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public PermintaanKonfirmasi() {
    }

    public PermintaanKonfirmasi(Integer konfirmasiId, PermintaanDonasi permintaan, User donatur, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.konfirmasiId = konfirmasiId;
        this.permintaan = permintaan;
        this.donatur = donatur;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getKonfirmasiId() {
        return konfirmasiId;
    }

    public void setKonfirmasiId(Integer konfirmasiId) {
        this.konfirmasiId = konfirmasiId;
    }

    public PermintaanDonasi getPermintaan() {
        return permintaan;
    }

    public void setPermintaan(PermintaanDonasi permintaan) {
        this.permintaan = permintaan;
    }

    public User getDonatur() {
        return donatur;
    }

    public void setDonatur(User donatur) {
        this.donatur = donatur;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
        return "PermintaanKonfirmasi{" +
                "konfirmasiId=" + konfirmasiId +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PermintaanKonfirmasi that = (PermintaanKonfirmasi) o;
        return java.util.Objects.equals(konfirmasiId, that.konfirmasiId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(konfirmasiId);
    }
}
