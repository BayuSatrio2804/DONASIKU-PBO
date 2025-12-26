package Donasiku.spring.core.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public class VerifikasiRequest {
    
    @NotNull(message = "User ID tidak boleh kosong")
    private Integer userId;
    
    @NotBlank(message = "Nama file tidak boleh kosong")
    private String namaFile;
    
    @NotBlank(message = "File path tidak boleh kosong")
    private String filePath;

    public VerifikasiRequest() {
    }

    public VerifikasiRequest(Integer userId, String namaFile, String filePath) {
        this.userId = userId;
        this.namaFile = namaFile;
        this.filePath = filePath;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
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
}
