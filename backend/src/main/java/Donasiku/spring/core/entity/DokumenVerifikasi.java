package Donasiku.spring.core.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Dokumen_Verifikasi")
@Data
@NoArgsConstructor
public class DokumenVerifikasi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dokumen_verifikasi_id")
    private Integer dokumenVerifikasiId;

    @Column(name = "penerima_user_id", nullable = false)
    private Integer penerimaUserId;

    @Column(name = "nama_file", length = 99)
    private String namaFile;

    @Column(name = "file_path", length = 99)
    private String filePath;

    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;

    @Column(name = "status_verifikasi", length = 50)
    private String statusVerifikasi; // "pending", "terverifikasi", "ditolak"

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
}