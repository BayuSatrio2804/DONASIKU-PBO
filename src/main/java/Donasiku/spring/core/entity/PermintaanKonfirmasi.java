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
@Table(name = "Permintaan_Konfirmasi")
@Data
@NoArgsConstructor
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
}
