package Donasiku.spring.core.service;

import Donasiku.spring.core.dto.DonasiRequest;
import Donasiku.spring.core.entity.*;
import Donasiku.spring.core.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DonasiService {

    @Autowired
    private DonasiRepository donasiRepository;
    @Autowired
    private StatusDonasiRepository statusRepository;
    @Autowired
    private UserRepository userRepository; // Asumsi ada UserRepository
    @Autowired
    private LokasiRepository lokasiRepository;

    // --- FR-03: Donatur Memposting Barang Donasi (Extended with File and Location
    // String) ---
    @Transactional
    public Donasi createDonasiWithFile(DonasiRequest request, String lokasiName,
            org.springframework.web.multipart.MultipartFile file) {
        // 1. Validasi User
        User donatur = userRepository.findById(request.getDonaturId())
                .orElseThrow(() -> new RuntimeException("Donatur tidak ditemukan"));

        // 2. Handle Lokasi (Find existing or create new)
        Lokasi lokasi = lokasiRepository.findByAlamatLengkap(lokasiName)
                .orElseGet(() -> {
                    Lokasi newLokasi = new Lokasi();
                    newLokasi.setAlamatLengkap(lokasiName);
                    newLokasi.setGarisLintang(0.0); // Dummy for now
                    newLokasi.setGarisBujur(0.0); // Dummy for now
                    return lokasiRepository.save(newLokasi);
                });

        // 3. Set Status Awal
        StatusDonasi statusAwal = statusRepository.findByStatus("Tersedia")
                .or(() -> statusRepository.findByStatus("Available"))
                .orElseThrow(() -> new RuntimeException("Status 'Tersedia' atau 'Available' belum ada di database"));

        // 4. Handle File
        String fileName = null;
        if (file != null && !file.isEmpty()) {
            try {
                // Simplified file saving logic
                fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                java.nio.file.Path path = java.nio.file.Paths.get("uploads/" + fileName);
                java.nio.file.Files.createDirectories(path.getParent());
                java.nio.file.Files.write(path, file.getBytes());
            } catch (java.io.IOException e) {
                throw new RuntimeException("Gagal menyimpan file: " + e.getMessage());
            }
        }

        // 5. Buat Object Donasi
        Donasi donasi = new Donasi();
        donasi.setDeskripsi(request.getDeskripsi());
        donasi.setKategori(request.getKategori());
        donasi.setFoto(fileName != null ? fileName : request.getFoto());
        donasi.setJumlah(request.getJumlah());
        donasi.setLokasi(lokasi);
        donasi.setDonatur(donatur);
        donasi.setStatusDonasi(statusAwal);
        donasi.setCreatedAt(LocalDateTime.now());

        return donasiRepository.save(donasi);
    }

    // --- FR-14 & FR-15: Update Status Barang ---
    @Transactional
    public Donasi updateStatusDonasi(Integer donasiId, String statusBaru, Integer userId) {
        // 1. Cari Donasi
        Donasi donasi = donasiRepository.findById(donasiId)
                .orElseThrow(() -> new RuntimeException("Donasi tidak ditemukan"));

        // 2. Cari Status Baru di DB
        StatusDonasi statusObj = statusRepository.findByStatus(statusBaru)
                .orElseThrow(() -> new RuntimeException("Status tidak valid: " + statusBaru));

        // 3. Validasi Hak Akses (Security Logic)
        // 3. Validasi Hak Akses (Security Logic)
        if (userId == null)
            throw new RuntimeException("User ID tidak valid (null)");

        Integer donaturId = donasi.getDonatur() != null ? donasi.getDonatur().getUserId() : -1;
        Integer penerimaId = donasi.getPenerima() != null ? donasi.getPenerima().getUserId() : -1;

        boolean isDonatur = donaturId.equals(userId);
        boolean isPenerima = penerimaId.equals(userId);

        // FR-14: Donatur mengubah status jadi "Dikirim"
        if (statusBaru.equalsIgnoreCase("Dikirim")) {
            if (!isDonatur)
                throw new RuntimeException("Hanya Donatur yang berhak mengubah status menjadi Dikirim.");
        }

        // FR-15: Penerima mengubah status jadi "Diterima"
        else if (statusBaru.equalsIgnoreCase("Diterima")) {
            if (!isPenerima)
                throw new RuntimeException("Hanya Penerima yang berhak mengubah status menjadi Diterima.");
        }

        else {
            // Validasi umum untuk status lain jika perlu
            if (!isDonatur && !isPenerima)
                throw new RuntimeException("Anda tidak memiliki akses ke donasi ini.");
        }

        // 4. Update
        donasi.setStatusDonasi(statusObj);
        donasi.setUpdatedAt(LocalDateTime.now());

        return donasiRepository.save(donasi);
    }

    // --- New Flow: Penerima Claim Donasi ---
    @Transactional
    public Donasi claimDonasi(Integer donasiId, Integer penerimaId) {
        // 1. Cari Donasi
        Donasi donasi = donasiRepository.findById(donasiId)
                .orElseThrow(() -> new RuntimeException("Donasi tidak ditemukan"));

        // 2. Validasi User Penerima
        User penerima = userRepository.findById(penerimaId)
                .orElseThrow(() -> new RuntimeException("Penerima tidak ditemukan"));

        // 3. Validasi Status Awal (Harus Tersedia/Available)
        String currentStatus = donasi.getStatusDonasi().getStatus();
        if (!currentStatus.equalsIgnoreCase("Tersedia") && !currentStatus.equalsIgnoreCase("Available")) {
            throw new RuntimeException("Donasi tidak dalam status tersedia.");
        }

        // 4. Cari Status 'Menunggu Konfirmasi'
        StatusDonasi statusPending = statusRepository.findByStatus("Menunggu Konfirmasi")
                .orElseThrow(() -> new RuntimeException("Status 'Menunggu Konfirmasi' belum ada di database"));

        // 5. Update Donasi
        donasi.setPenerima(penerima);
        donasi.setStatusDonasi(statusPending);
        donasi.setUpdatedAt(LocalDateTime.now());

        return donasiRepository.save(donasi);
    }

    // Helper untuk FR-08 (Melihat daftar donasi)
    public List<Donasi> getAllDonasi() {
        return donasiRepository.findAll();
    }

    public Donasi getDonasiById(Integer id) {
        return donasiRepository.findById(id).orElseThrow(() -> new RuntimeException("Donasi tidak ditemukan"));
    }

    // --- FR-XX: Edit & Hapus Donasi (Sesuai Diagram) ---
    @Transactional
    public void hapusDonasi(Integer donasiId, Integer userId) {
        Donasi donasi = donasiRepository.findById(donasiId)
                .orElseThrow(() -> new RuntimeException("Donasi tidak ditemukan"));

        if (!donasi.getDonatur().getUserId().equals(userId)) {
            throw new RuntimeException("Anda bukan pemilik donasi ini.");
        }

        donasiRepository.delete(donasi);
    }

    @Transactional
    public void editDonasi(Integer donasiId, Donasi updatedData, Integer userId) {
        Donasi donasi = donasiRepository.findById(donasiId)
                .orElseThrow(() -> new RuntimeException("Donasi tidak ditemukan"));

        if (!donasi.getDonatur().getUserId().equals(userId)) {
            throw new RuntimeException("Anda bukan pemilik donasi ini.");
        }

        if (updatedData.getDeskripsi() != null)
            donasi.setDeskripsi(updatedData.getDeskripsi());
        if (updatedData.getKategori() != null)
            donasi.setKategori(updatedData.getKategori());
        if (updatedData.getJumlah() != null)
            donasi.setJumlah(updatedData.getJumlah());
        // Foto handle separately usually, but minimal logic here
        if (updatedData.getFoto() != null)
            donasi.setFoto(updatedData.getFoto());

        donasi.setUpdatedAt(LocalDateTime.now());
        donasiRepository.save(donasi);
    }
}