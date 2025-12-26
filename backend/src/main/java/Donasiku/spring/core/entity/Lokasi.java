package Donasiku.spring.core.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "Lokasi")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
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

    public Lokasi() {
    }

    public Lokasi(Integer lokasiId, Double garisLintang, Double garisBujur, String alamatLengkap, TipeLokasi tipeLokasi) {
        this.lokasiId = lokasiId;
        this.garisLintang = garisLintang;
        this.garisBujur = garisBujur;
        this.alamatLengkap = alamatLengkap;
        this.tipeLokasi = tipeLokasi;
    }

    public Integer getLokasiId() {
        return lokasiId;
    }

    public void setLokasiId(Integer lokasiId) {
        this.lokasiId = lokasiId;
    }

    public Double getGarisLintang() {
        return garisLintang;
    }

    public void setGarisLintang(Double garisLintang) {
        this.garisLintang = garisLintang;
    }

    public Double getGarisBujur() {
        return garisBujur;
    }

    public void setGarisBujur(Double garisBujur) {
        this.garisBujur = garisBujur;
    }

    public String getAlamatLengkap() {
        return alamatLengkap;
    }

    public void setAlamatLengkap(String alamatLengkap) {
        this.alamatLengkap = alamatLengkap;
    }

    public TipeLokasi getTipeLokasi() {
        return tipeLokasi;
    }

    public void setTipeLokasi(TipeLokasi tipeLokasi) {
        this.tipeLokasi = tipeLokasi;
    }

    @Override
    public String toString() {
        return "Lokasi{" +
                "lokasiId=" + lokasiId +
                ", garisLintang=" + garisLintang +
                ", garisBujur=" + garisBujur +
                ", alamatLengkap='" + alamatLengkap + '\'' +
                ", tipeLokasi=" + tipeLokasi +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Lokasi lokasi = (Lokasi) o;
        return java.util.Objects.equals(lokasiId, lokasi.lokasiId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(lokasiId);
    }
}