package Donasiku.spring.core.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
