package Donasiku.spring.core.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Permintaan_Donasi")
@Data
@NoArgsConstructor
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
}