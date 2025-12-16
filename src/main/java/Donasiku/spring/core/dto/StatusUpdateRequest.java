package Donasiku.spring.core.dto;

import lombok.Data;

@Data
public class StatusUpdateRequest {
    private String statusBaru; // Contoh: "Dikirim", "Diterima"
    private Integer userId;    // Siapa yang mengubah (untuk validasi keamanan)
}