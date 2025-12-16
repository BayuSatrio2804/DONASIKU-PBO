package Donasiku.spring.core.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VerifikasiRequest {
    
    @NotNull(message = "User ID tidak boleh kosong")
    private Integer userId;
    
    @NotBlank(message = "Nama file tidak boleh kosong")
    private String namaFile;
    
    @NotBlank(message = "File path tidak boleh kosong")
    private String filePath;
}
