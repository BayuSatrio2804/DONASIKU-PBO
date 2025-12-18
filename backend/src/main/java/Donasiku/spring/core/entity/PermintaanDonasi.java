package Donasiku.spring.core.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Permintaan_Donasi")
@Data
@NoArgsConstructor
public class PermintaanDonasi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permintaan_id")
    private Integer permintaanId;

    @Column(name = "jenis_barang", length = 99, nullable = false)
    private String jenisBarang;

    @Column(name = "jumlah", nullable = false)
    private Integer jumlah;

    @Column(name = "deskripsi_kebutuhan", columnDefinition = "TEXT")
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
    
    @Column(name = "status", length = 99)
    private String status; // Status permintaan (open/fulfilled/closed)

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}