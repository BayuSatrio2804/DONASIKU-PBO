package Donasiku.spring.core.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "Permintaan_Donasi")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class PermintaanDonasi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permintaan_id")
    @com.fasterxml.jackson.annotation.JsonProperty("id")
    private Integer permintaanId;

    @Column(name = "jenis_barang", length = 99, nullable = false)
    @com.fasterxml.jackson.annotation.JsonProperty("judul")
    private String jenisBarang;

    @Column(name = "kategori", length = 99)
    private String kategori;

    @Column(name = "jumlah", nullable = false)
    private Integer jumlah;

    @Column(name = "deskripsi_kebutuhan", columnDefinition = "TEXT")
    @com.fasterxml.jackson.annotation.JsonProperty("deskripsi")
    private String deskripsiKebutuhan;

    // FK penerima_user_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "penerima_user_id", nullable = false)
    private User penerima;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donatur_user_id") // Nullable
    private User donatur;

    // FK lokasi_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lokasi_id", nullable = false)
    private Lokasi lokasi;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donasi_id")
    @com.fasterxml.jackson.annotation.JsonProperty("donation")
    private Donasi donasi;

    @Column(name = "status", length = 99)
    @com.fasterxml.jackson.annotation.JsonProperty("status_permohonan")
    private String status; // Status permintaan (pending/approved/rejected)

    @Column(name = "image")
    private String image; // Bukti kebutuhan

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public PermintaanDonasi() {
    }

    public PermintaanDonasi(Integer permintaanId, String jenisBarang, String kategori, Integer jumlah, String deskripsiKebutuhan, User penerima, User donatur, Lokasi lokasi, Donasi donasi, String status, String image, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.permintaanId = permintaanId;
        this.jenisBarang = jenisBarang;
        this.kategori = kategori;
        this.jumlah = jumlah;
        this.deskripsiKebutuhan = deskripsiKebutuhan;
        this.penerima = penerima;
        this.donatur = donatur;
        this.lokasi = lokasi;
        this.donasi = donasi;
        this.status = status;
        this.image = image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getPermintaanId() {
        return permintaanId;
    }

    public void setPermintaanId(Integer permintaanId) {
        this.permintaanId = permintaanId;
    }

    public String getJenisBarang() {
        return jenisBarang;
    }

    public void setJenisBarang(String jenisBarang) {
        this.jenisBarang = jenisBarang;
    }

    public String getKategori() {
        return kategori;
    }

    public void setKategori(String kategori) {
        this.kategori = kategori;
    }

    public Integer getJumlah() {
        return jumlah;
    }

    public void setJumlah(Integer jumlah) {
        this.jumlah = jumlah;
    }

    public String getDeskripsiKebutuhan() {
        return deskripsiKebutuhan;
    }

    public void setDeskripsiKebutuhan(String deskripsiKebutuhan) {
        this.deskripsiKebutuhan = deskripsiKebutuhan;
    }

    public User getPenerima() {
        return penerima;
    }

    public void setPenerima(User penerima) {
        this.penerima = penerima;
    }

    public User getDonatur() {
        return donatur;
    }

    public void setDonatur(User donatur) {
        this.donatur = donatur;
    }

    public Lokasi getLokasi() {
        return lokasi;
    }

    public void setLokasi(Lokasi lokasi) {
        this.lokasi = lokasi;
    }

    public Donasi getDonasi() {
        return donasi;
    }

    public void setDonasi(Donasi donasi) {
        this.donasi = donasi;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
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
        return "PermintaanDonasi{" +
                "permintaanId=" + permintaanId +
                ", jenisBarang='" + jenisBarang + '\'' +
                ", kategori='" + kategori + '\'' +
                ", jumlah=" + jumlah +
                ", deskripsiKebutuhan='" + deskripsiKebutuhan + '\'' +
                ", status='" + status + '\'' +
                ", image='" + image + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PermintaanDonasi that = (PermintaanDonasi) o;
        return java.util.Objects.equals(permintaanId, that.permintaanId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(permintaanId);
    }
}