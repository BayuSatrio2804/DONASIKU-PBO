package Donasiku.spring.core.service;

import Donasiku.spring.core.dto.DonasiRequest;
import Donasiku.spring.core.entity.*;
import Donasiku.spring.core.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonasiService {

    @Autowired private DonasiRepository donasiRepository;
    @Autowired private StatusDonasiRepository statusRepository;
    @Autowired private UserRepository userRepository; // Asumsi ada UserRepository
    @Autowired private LokasiRepository lokasiRepository;

    // --- FR-03: Donatur Memposting Barang Donasi ---
    @Transactional
    public Donasi createDonasi(DonasiRequest request) {
        // 1. Validasi User
        User donatur = userRepository.findById(request.getDonaturId())
                .orElseThrow(() -> new RuntimeException("Donatur tidak ditemukan"));

        // 2. Validasi Lokasi
        Lokasi lokasi = lokasiRepository.findById(request.getLokasiId())
                .orElseThrow(() -> new RuntimeException("Lokasi tidak ditemukan"));

        // 3. Set Status Awal (Misal: "Available" atau "Pending")
        StatusDonasi statusAwal = statusRepository.findByStatus("Available")
                .orElseThrow(() -> new RuntimeException("Status 'Available' belum ada di database"));

        // 4. Buat Object Donasi
        Donasi donasi = new Donasi();
        donasi.setDeskripsi(request.getDeskripsi());
        donasi.setKategori(request.getKategori());
        donasi.setFoto(request.getFoto());
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
        boolean isDonatur = donasi.getDonatur().getUserId().equals(userId);
        boolean isPenerima = donasi.getPenerima() != null && donasi.getPenerima().getUserId().equals(userId);

        // FR-14: Donatur mengubah status jadi "Dikirim"
        if (statusBaru.equalsIgnoreCase("Dikirim")) {
            if (!isDonatur) throw new RuntimeException("Hanya Donatur yang berhak mengubah status menjadi Dikirim.");
        }
        
        // FR-15: Penerima mengubah status jadi "Diterima"
        else if (statusBaru.equalsIgnoreCase("Diterima")) {
            if (!isPenerima) throw new RuntimeException("Hanya Penerima yang berhak mengubah status menjadi Diterima.");
        } 
        
        else {
            // Validasi umum untuk status lain jika perlu
             if (!isDonatur && !isPenerima) throw new RuntimeException("Anda tidak memiliki akses ke donasi ini.");
        }

        // 4. Update
        donasi.setStatusDonasi(statusObj);
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
}