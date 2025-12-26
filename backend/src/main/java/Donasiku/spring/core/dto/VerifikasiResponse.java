package Donasiku.spring.core.dto;

import java.time.LocalDateTime;



public class VerifikasiResponse {
    private Integer dokumenVerifikasiId;
    private Integer penerimaUserId;
    private String namaFile;
    private String filePath;
    private LocalDateTime uploadedAt;
    private String status;
    private String message;

    // Additional User Info for Admin
    private String username;
    private String email;
    private String noTelepon;
    private String alamat;

    public VerifikasiResponse() {
    }

    public VerifikasiResponse(Integer dokumenVerifikasiId, Integer penerimaUserId, String namaFile, String filePath, LocalDateTime uploadedAt, String status, String message, String username, String email, String noTelepon, String alamat) {
        this.dokumenVerifikasiId = dokumenVerifikasiId;
        this.penerimaUserId = penerimaUserId;
        this.namaFile = namaFile;
        this.filePath = filePath;
        this.uploadedAt = uploadedAt;
        this.status = status;
        this.message = message;
        this.username = username;
        this.email = email;
        this.noTelepon = noTelepon;
        this.alamat = alamat;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNoTelepon() {
        return noTelepon;
    }

    public void setNoTelepon(String noTelepon) {
        this.noTelepon = noTelepon;
    }

    public String getAlamat() {
        return alamat;
    }

    public void setAlamat(String alamat) {
        this.alamat = alamat;
    }
}
