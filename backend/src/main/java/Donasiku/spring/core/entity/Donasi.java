package Donasiku.spring.core.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
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
@Table(name = "Donasi")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Donasi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donasi_id")
    @JsonProperty("id")
    private Integer donasiId;

    @Column(name = "deskripsi", columnDefinition = "TEXT")
    private String deskripsi;

    @Column(name = "kategori", length = 99)
    private String kategori;

    @Column(name = "foto", length = 99)
    @JsonProperty("image")
    private String foto;

    @Column(name = "jumlah")
    private Integer jumlah;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lokasi_id", nullable = false)
    private Lokasi lokasi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false)
    private StatusDonasi statusDonasi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donatur_user_id", nullable = false)
    private User donatur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "penerima_user_id")
    private User penerima;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Donasi() {
    }

    public Donasi(Integer donasiId, String deskripsi, String kategori, String foto, Integer jumlah, Lokasi lokasi, StatusDonasi statusDonasi, User donatur, User penerima, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.donasiId = donasiId;
        this.deskripsi = deskripsi;
        this.kategori = kategori;
        this.foto = foto;
        this.jumlah = jumlah;
        this.lokasi = lokasi;
        this.statusDonasi = statusDonasi;
        this.donatur = donatur;
        this.penerima = penerima;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getDonasiId() {
        return donasiId;
    }

    public void setDonasiId(Integer donasiId) {
        this.donasiId = donasiId;
    }

    public String getDeskripsi() {
        return deskripsi;
    }

    public void setDeskripsi(String deskripsi) {
        this.deskripsi = deskripsi;
    }

    public String getKategori() {
        return kategori;
    }

    public void setKategori(String kategori) {
        this.kategori = kategori;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public Integer getJumlah() {
        return jumlah;
    }

    public void setJumlah(Integer jumlah) {
        this.jumlah = jumlah;
    }

    public Lokasi getLokasi() {
        return lokasi;
    }

    public void setLokasi(Lokasi lokasi) {
        this.lokasi = lokasi;
    }

    public StatusDonasi getStatusDonasi() {
        return statusDonasi;
    }

    public void setStatusDonasi(StatusDonasi statusDonasi) {
        this.statusDonasi = statusDonasi;
    }

    public User getDonatur() {
        return donatur;
    }

    public void setDonatur(User donatur) {
        this.donatur = donatur;
    }

    public User getPenerima() {
        return penerima;
    }

    public void setPenerima(User penerima) {
        this.penerima = penerima;
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
        return "Donasi{" +
                "donasiId=" + donasiId +
                ", deskripsi='" + deskripsi + '\'' +
                ", kategori='" + kategori + '\'' +
                ", foto='" + foto + '\'' +
                ", jumlah=" + jumlah +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Donasi donasi = (Donasi) o;
        return java.util.Objects.equals(donasiId, donasi.donasiId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(donasiId);
    }
}