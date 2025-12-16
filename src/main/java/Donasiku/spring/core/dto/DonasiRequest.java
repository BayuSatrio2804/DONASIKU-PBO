package Donasiku.spring.core.dto;

import lombok.Data;

@Data
public class DonasiRequest {
    private String deskripsi;
    private String kategori;
    private String foto; // URL atau nama file
    private Integer lokasiId; // ID lokasi penjemputan
    private Integer donaturId; // ID User yang login (Nanti bisa diambil dari Token)
}