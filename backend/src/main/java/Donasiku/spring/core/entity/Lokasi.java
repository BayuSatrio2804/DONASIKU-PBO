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

    // --- Method Sesuai Class Diagram: hitungJarak(Lokasi l) ---
    // Menggunakan Haversine Formula untuk menghitung jarak dalam KM
    public double hitungJarak(Lokasi lokasiLain) {
        if (lokasiLain == null)
            return -1;

        final int R = 6371; // Radius bumi dalam KM

        double lat1 = this.garisLintang;
        double lon1 = this.garisBujur;
        double lat2 = lokasiLain.getGarisLintang();
        double lon2 = lokasiLain.getGarisBujur();

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Jarak dalam Kilometer
    }
}