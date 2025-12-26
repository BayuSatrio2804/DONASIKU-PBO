package Donasiku.spring.core.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import Donasiku.spring.core.repository.*;
import Donasiku.spring.core.entity.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/setup")
public class DataFixController {

    @Autowired
    private PermintaanDonasiRepository permintaanRepo;
    @Autowired
    private DonasiRepository donasiRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private LokasiRepository lokasiRepo;
    @Autowired
    private StatusDonasiRepository statusRepo;

    @GetMapping("/fix-buku")
    public String fixBuku() {
        try {
            // 1. Cari & Hapus "buku" dari Permintaan
            List<PermintaanDonasi> permintaans = permintaanRepo.findAll();
            PermintaanDonasi bukuReq = permintaans.stream()
                    .filter(p -> p.getJenisBarang().equalsIgnoreCase("buku") || p.getJenisBarang().contains("buku"))
                    .findFirst().orElse(null);

            if (bukuReq != null) {
                permintaanRepo.delete(bukuReq);
            }

            // 2. Buat "buku" sebagai Donasi
            User donatur = userRepo.findByUsername("donatur").orElse(null);
            if (donatur == null) {
                // Create dummy donatur if needed
                donatur = new User();
                donatur.setUsername("donatur_fixed");
                donatur.setRole(User.UserRole.donatur);
                // skip full details for speed
                donatur = userRepo.save(donatur);
            }

            Lokasi lokasi = lokasiRepo.findFirstByAlamatLengkap("telkom").orElse(null);
            if (lokasi == null) {
                lokasi = new Lokasi();
                lokasi.setAlamatLengkap("telkom");
                lokasi.setGarisLintang(0.0);
                lokasi.setGarisBujur(0.0);
                lokasi = lokasiRepo.save(lokasi);
            }

            StatusDonasi status = statusRepo.findByStatus("Tersedia").orElse(null);

            Donasi donasi = new Donasi();
            donasi.setKategori("Buku Pelajaran (Fixed)");
            donasi.setDeskripsi("Buku yang sebelumnya salah masuk ke permintaan. Sekarang sudah tersedia.");
            donasi.setJumlah(2);
            donasi.setDonatur(donatur);
            donasi.setLokasi(lokasi);
            donasi.setStatusDonasi(status);
            donasi.setCreatedAt(LocalDateTime.now());

            donasiRepo.save(donasi);

            return "Fixed: Buku moved from Permintaan to Donasi";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    @GetMapping("/delete-dummy")
    public String deleteDummy() {
        try {
            List<PermintaanDonasi> permintaans = permintaanRepo.findAll();
            int count = 0;
            for (PermintaanDonasi p : permintaans) {
                // Delete if part of the known dummy set or owned by penerima_test
                if (p.getPenerima().getUsername().equals("penerima_test")) {
                    permintaanRepo.delete(p);
                    count++;
                }
            }
            return "Deleted " + count + " dummy requests.";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}
