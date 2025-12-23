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

    @Autowired
    private PermintaanDonasiRepository permintaanRepository;
    @Autowired
    private PermintaanKonfirmasiRepository konfirmasiRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LokasiRepository lokasiRepository;
    @Autowired
    private DonasiRepository donasiRepository;
    @Autowired
    private StatusDonasiRepository statusRepository;

    // --- FR-07: Penerima Membuat Permintaan (Support utk FR-08) ---
    @Transactional
    public PermintaanDonasi createPermintaan(PermintaanDonasi request) {
        // ... (existing code, not modifying this part, just context)
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
            if (lokasi.getGarisLintang() == null)
                lokasi.setGarisLintang(-6.1751);
            if (lokasi.getGarisBujur() == null)
                lokasi.setGarisBujur(106.8270);
            if (lokasi.getTipeLokasi() == null)
                lokasi.setTipeLokasi(Lokasi.TipeLokasi.penerima);

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

    public List<PermintaanDonasi> listByPenerima(Integer userId) {
        return permintaanRepository.findByPenerima_UserId(userId);
    }

    public PermintaanDonasi getById(Integer permintaanId) {
        return permintaanRepository.findById(permintaanId)
                .orElseThrow(() -> new RuntimeException("Permintaan dengan ID " + permintaanId + " tidak ditemukan"));
    }

    @Transactional
    public PermintaanKonfirmasi offerToFulfill(Integer permintaanId, Integer donaturId) {
        PermintaanDonasi permintaan = permintaanRepository.findById(permintaanId)
                .orElseThrow(() -> new RuntimeException("Permintaan tidak ditemukan"));
        User donatur = userRepository.findById(donaturId)
                .orElseThrow(() -> new RuntimeException("Donatur tidak ditemukan"));
        if (permintaan.getPenerima().getUserId().equals(donaturId)) {
            throw new RuntimeException("Anda tidak bisa menawarkan bantuan ke permintaan sendiri.");
        }
        PermintaanKonfirmasi offer = new PermintaanKonfirmasi();
        offer.setPermintaan(permintaan);
        offer.setDonatur(donatur);
        offer.setStatus("Offered");
        offer.setCreatedAt(LocalDateTime.now());
        return konfirmasiRepository.save(offer);
    }

    @Transactional
    public PermintaanKonfirmasi confirmOffer(Integer permintaanId, Integer konfirmasiId, Integer penerimaId) {
        PermintaanKonfirmasi pk = konfirmasiRepository.findById(konfirmasiId)
                .orElseThrow(() -> new RuntimeException("Data konfirmasi tidak ditemukan"));
        pk.setStatus("Confirmed");
        pk.setUpdatedAt(LocalDateTime.now());
        PermintaanDonasi pd = pk.getPermintaan();
        pd.setStatus("Fulfilled");
        permintaanRepository.save(pd);
        return konfirmasiRepository.save(pk);
    }

    @Transactional
    public PermintaanDonasi fulfillPermintaan(Integer permintaanId, Integer donaturId) {
        PermintaanDonasi permintaan = permintaanRepository.findById(permintaanId)
                .orElseThrow(() -> new RuntimeException("Permintaan tidak ditemukan"));

        User donatur = userRepository.findById(donaturId)
                .orElseThrow(() -> new RuntimeException("Donatur tidak ditemukan"));

        if (!"Open".equalsIgnoreCase(permintaan.getStatus())) {
            throw new RuntimeException("Permintaan tidak dalam status Open.");
        }

        permintaan.setDonatur(donatur);
        permintaan.setStatus("Diproses"); // Menunggu Konfirmasi Penerima (Sesuai keinginan user)
        return permintaanRepository.save(permintaan);
    }

    @Transactional
    public PermintaanDonasi acceptOffer(Integer permintaanId) {
        PermintaanDonasi permintaan = permintaanRepository.findById(permintaanId)
                .orElseThrow(() -> new RuntimeException("Permintaan tidak ditemukan"));

        // Izinkan Diproses atau Offered agar data lama tetap bisa ditransisi
        if (!"Diproses".equalsIgnoreCase(permintaan.getStatus())
                && !"Offered".equalsIgnoreCase(permintaan.getStatus())) {
            throw new RuntimeException("Permintaan belum ditawarkan bantuan oleh donatur.");
        }

        // 1. Update Permintaan -> Fulfilled
        permintaan.setStatus("Fulfilled");

        // 2. Create Donasi (Status: Dikirim)
        Donasi donasi = new Donasi();
        donasi.setDonatur(permintaan.getDonatur()); // Donatur sudah diset di tahap offered
        donasi.setPenerima(permintaan.getPenerima());
        donasi.setKategori(permintaan.getJenisBarang());
        donasi.setDeskripsi("PERMINTAAN DIPENUHI: " + permintaan.getDeskripsiKebutuhan());
        donasi.setJumlah(permintaan.getJumlah());
        donasi.setLokasi(permintaan.getLokasi());
        donasi.setCreatedAt(LocalDateTime.now());
        donasi.setUpdatedAt(LocalDateTime.now());
        donasi.setFoto("default_fulfillment.png");

        StatusDonasi statusDikirim = statusRepository.findByStatus("Dikirim")
                .orElseGet(() -> {
                    StatusDonasi s = new StatusDonasi();
                    s.setStatus("Dikirim");
                    s.setStatusVerifikasi(true);
                    return statusRepository.save(s);
                });
        donasi.setStatusDonasi(statusDikirim);

        donasiRepository.save(donasi);
        return permintaanRepository.save(permintaan);
    }

    @Transactional
    public void batalkan(Integer permintaanId, Integer userId) {
        PermintaanDonasi permintaan = permintaanRepository.findById(permintaanId)
                .orElseThrow(() -> new RuntimeException("Permintaan tidak ditemukan"));

        if (!permintaan.getPenerima().getUserId().equals(userId)) {
            throw new RuntimeException("Anda tidak berhak membatalkan permintaan ini.");
        }

        permintaan.setStatus("Cancelled");
        permintaan.setUpdatedAt(LocalDateTime.now()); // Pastikan field updatedAt ada di entity atau handle error later
        permintaanRepository.save(permintaan);
    }
}