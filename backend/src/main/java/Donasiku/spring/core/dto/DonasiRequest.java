package Donasiku.spring.core.dto;



public class DonasiRequest {
    private String deskripsi;
    private String kategori;
    private String foto; // URL atau nama file
    private Integer lokasiId; // ID lokasi penjemputan
    private Integer donaturId; // ID User yang login (Nanti bisa diambil dari Token)
    private Integer jumlah;

    public DonasiRequest() {
    }

    public DonasiRequest(String deskripsi, String kategori, String foto, Integer lokasiId, Integer donaturId, Integer jumlah) {
        this.deskripsi = deskripsi;
        this.kategori = kategori;
        this.foto = foto;
        this.lokasiId = lokasiId;
        this.donaturId = donaturId;
        this.jumlah = jumlah;
    }

    public String getDeskripsi() {
        return deskripsi;
    }

    public void setDeskripsi(String deskripsi) {
        this.deskripsi = deskripsi;
    }

    public String getKategori() {
        return kategori;
    }

    public void setKategori(String kategori) {
        this.kategori = kategori;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public Integer getLokasiId() {
        return lokasiId;
    }

    public void setLokasiId(Integer lokasiId) {
        this.lokasiId = lokasiId;
    }

    public Integer getDonaturId() {
        return donaturId;
    }

    public void setDonaturId(Integer donaturId) {
        this.donaturId = donaturId;
    }

    public Integer getJumlah() {
        return jumlah;
    }

    public void setJumlah(Integer jumlah) {
        this.jumlah = jumlah;
    }
}