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
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Donasi")
@Data
@NoArgsConstructor
public class Donasi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donasi_id")
    private Integer donasiId;

    @Column(name = "deskripsi", columnDefinition = "TEXT")
    private String deskripsi;

    @Column(name = "kategori", length = 99)
    private String kategori;

    @Column(name = "foto", length = 99)
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
}