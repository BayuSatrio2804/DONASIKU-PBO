package Donasiku.spring.core.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "Dokumen_Verifikasi")
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

    public DokumenVerifikasi() {
    }

    public DokumenVerifikasi(Integer dokumenVerifikasiId, Integer penerimaUserId, String namaFile, String filePath, LocalDateTime uploadedAt, String statusVerifikasi, LocalDateTime verifiedAt) {
        this.dokumenVerifikasiId = dokumenVerifikasiId;
        this.penerimaUserId = penerimaUserId;
        this.namaFile = namaFile;
        this.filePath = filePath;
        this.uploadedAt = uploadedAt;
        this.statusVerifikasi = statusVerifikasi;
        this.verifiedAt = verifiedAt;
    }

    public Integer getDokumenVerifikasiId() {
        return dokumenVerifikasiId;
    }

    public void setDokumenVerifikasiId(Integer dokumenVerifikasiId) {
        this.dokumenVerifikasiId = dokumenVerifikasiId;
    }

    public Integer getPenerimaUserId() {
        return penerimaUserId;
    }

    public void setPenerimaUserId(Integer penerimaUserId) {
        this.penerimaUserId = penerimaUserId;
    }

    public String getNamaFile() {
        return namaFile;
    }

    public void setNamaFile(String namaFile) {
        this.namaFile = namaFile;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public String getStatusVerifikasi() {
        return statusVerifikasi;
    }

    public void setStatusVerifikasi(String statusVerifikasi) {
        this.statusVerifikasi = statusVerifikasi;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    @Override
    public String toString() {
        return "DokumenVerifikasi{" +
                "dokumenVerifikasiId=" + dokumenVerifikasiId +
                ", penerimaUserId=" + penerimaUserId +
                ", namaFile='" + namaFile + '\'' +
                ", filePath='" + filePath + '\'' +
                ", uploadedAt=" + uploadedAt +
                ", statusVerifikasi='" + statusVerifikasi + '\'' +
                ", verifiedAt=" + verifiedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DokumenVerifikasi that = (DokumenVerifikasi) o;
        return java.util.Objects.equals(dokumenVerifikasiId, that.dokumenVerifikasiId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(dokumenVerifikasiId);
    }
}