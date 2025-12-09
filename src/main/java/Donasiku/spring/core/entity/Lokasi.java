package Donasiku.spring.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Lokasi")
@Data
@NoArgsConstructor
public class Lokasi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lokasi_id")
    private Integer lokasiId;

    @Column(name = "garis_lintang", columnDefinition = "DECIMAL(10,7)", nullable = false)
    private Double garisLintang;

    @Column(name = "garis_bujur", columnDefinition = "DECIMAL(10,7)", nullable = false)
    private Double garisBujur;

    @Column(name = "alamat_lengkap", columnDefinition = "TEXT", nullable = false)
    private String alamatLengkap;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipe_lokasi")
    private TipeLokasi tipeLokasi;
    
    // Enum Java untuk memetakan ENUM SQL
    public enum TipeLokasi {
        donatur, penerima, event, lainnya
    }
}