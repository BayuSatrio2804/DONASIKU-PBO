package Donasiku.spring.core.service;

import Donasiku.spring.core.entity.*;
import Donasiku.spring.core.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PermintaanService {

    @Autowired private PermintaanDonasiRepository permintaanRepository;
    @Autowired private PermintaanKonfirmasiRepository konfirmasiRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private LokasiRepository lokasiRepository;

    // --- FR-07: Penerima Membuat Permintaan (Support utk FR-08) ---
    @Transactional
    public PermintaanDonasi createPermintaan(PermintaanDonasi request) {
        // Pastikan User ada
        User penerima = userRepository.findById(request.getPenerima().getUserId())
                .orElseThrow(() -> new RuntimeException("User penerima tidak ditemukan"));

        // Handle Lokasi - buat baru jika belum ada
        Lokasi lokasi = request.getLokasi();
        if (lokasi == null) {
            throw new RuntimeException("Lokasi harus disediakan");
        }
        
        // Jika lokasi belum punya ID, simpan dulu
        if (lokasi.getLokasiId() == null) {
            if (lokasi.getAlamatLengkap() == null || lokasi.getAlamatLengkap().isBlank()) {
                throw new RuntimeException("Alamat lokasi tidak boleh kosong");
            }
            // Set default koordinat jika belum ada
            if (lokasi.getGarisLintang() == null) lokasi.setGarisLintang(-6.1751);
            if (lokasi.getGarisBujur() == null) lokasi.setGarisBujur(106.8270);
            if (lokasi.getTipeLokasi() == null) lokasi.setTipeLokasi(Lokasi.TipeLokasi.penerima);
            
            lokasi = lokasiRepository.save(lokasi);
        }
        
        request.setPenerima(penerima);
        request.setLokasi(lokasi);
        request.setStatus(request.getStatus() == null ? "Open" : request.getStatus());
        request.setCreatedAt(LocalDateTime.now());
        return permintaanRepository.save(request);
    }

    public List<PermintaanDonasi> listAll() {
        return permintaanRepository.findAll();
    }

    public PermintaanDonasi getById(Integer permintaanId) {
        return permintaanRepository.findById(permintaanId)
                .orElseThrow(() -> new RuntimeException("Permintaan dengan ID " + permintaanId + " tidak ditemukan"));
    }

    // --- FR-08: Donatur Menawarkan Bantuan (INTI TUGASMU) ---
    @Transactional
    public PermintaanKonfirmasi offerToFulfill(Integer permintaanId, Integer donaturId) {
        // 1. Cek Permintaan
        PermintaanDonasi permintaan = permintaanRepository.findById(permintaanId)
                .orElseThrow(() -> new RuntimeException("Permintaan tidak ditemukan"));

        // 2. Cek Donatur
        User donatur = userRepository.findById(donaturId)
                .orElseThrow(() -> new RuntimeException("Donatur tidak ditemukan"));

        // 3. Validasi: Jangan sampai penerima menawarkan ke permintaannya sendiri
        if (permintaan.getPenerima().getUserId().equals(donaturId)) {
            throw new RuntimeException("Anda tidak bisa menawarkan bantuan ke permintaan sendiri.");
        }

        // 4. Validasi: Apakah sudah pernah offer sebelumnya? (Opsional, biar data bersih)
        // (Bisa ditambahkan cek ke konfirmasiRepository)

        // 5. Buat Konfirmasi (Offer)
        PermintaanKonfirmasi offer = new PermintaanKonfirmasi();
        offer.setPermintaan(permintaan);
        offer.setDonatur(donatur);
        offer.setStatus("Offered"); // Status penawaran
        offer.setCreatedAt(LocalDateTime.now());

        return konfirmasiRepository.save(offer);
    }

    // --- FR-10: Konfirmasi Offer (Bagian Nabiel, tapi perlu ada biar tidak error compile) ---
    @Transactional
    public PermintaanKonfirmasi confirmOffer(Integer permintaanId, Integer konfirmasiId, Integer penerimaId) {
        PermintaanKonfirmasi pk = konfirmasiRepository.findById(konfirmasiId)
                .orElseThrow(() -> new RuntimeException("Data konfirmasi tidak ditemukan"));
        
        // Logika validasi penerimaId == pk.getPermintaan().getPenerima().getId()...
        pk.setStatus("Confirmed");
        pk.setUpdatedAt(LocalDateTime.now());
        
        // Update status permintaan jadi fulfilled/closed
        PermintaanDonasi pd = pk.getPermintaan();
        pd.setStatus("Fulfilled");
        permintaanRepository.save(pd);
        
        return konfirmasiRepository.save(pk);
    }
}