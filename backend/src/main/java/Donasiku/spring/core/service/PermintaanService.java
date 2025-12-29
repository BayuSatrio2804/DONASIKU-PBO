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
        return createPermintaanWithFile(request, null, null);
    }

    @Transactional
    public PermintaanDonasi createPermintaanWithFile(PermintaanDonasi request,
            org.springframework.web.multipart.MultipartFile file, Integer donationId) {
        // Handle File upload if present
        if (file != null && !file.isEmpty()) {
            try {
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                java.nio.file.Path uploadPath = java.nio.file.Paths.get("uploads");
                if (!java.nio.file.Files.exists(uploadPath)) {
                    java.nio.file.Files.createDirectories(uploadPath);
                }
                java.nio.file.Files.copy(file.getInputStream(), uploadPath.resolve(fileName));
                request.setImage(fileName);
            } catch (java.io.IOException e) {
                throw new RuntimeException("Gagal menyimpan file bukti: " + e.getMessage());
            }
        }

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
        request.setStatus(request.getStatus() == null ? "pending" : request.getStatus());
        request.setCreatedAt(LocalDateTime.now());

        // Handle Donation Link and Target Donor (FR-08 improvement)
        if (donationId != null) {
            Donasi donasi = donasiRepository.findById(donationId)
                    .orElseThrow(() -> new RuntimeException("Donasi tidak ditemukan"));
            request.setDonasi(donasi);
            // If the donation has a donor, set that donor as the target for this request
            if (donasi.getDonatur() != null) {
                request.setDonatur(donasi.getDonatur());
            }
        }

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
    public PermintaanDonasi fulfillPermintaan(Integer permintaanId, Integer donaturId, Integer jumlahDonasi,
            org.springframework.web.multipart.MultipartFile file) {
        PermintaanDonasi permintaan = permintaanRepository.findById(permintaanId)
                .orElseThrow(() -> new RuntimeException("Permintaan tidak ditemukan"));

        User donatur = userRepository.findById(donaturId)
                .orElseThrow(() -> new RuntimeException("Donatur tidak ditemukan"));

        // Accept both 'Open' and 'pending' statuses
        String currentStatus = permintaan.getStatus();
        if (!"Open".equalsIgnoreCase(currentStatus) && !"pending".equalsIgnoreCase(currentStatus)) {
            throw new RuntimeException("Permintaan tidak dalam status Open/Pending. Status saat ini: " + currentStatus);
        }

        if (jumlahDonasi <= 0) {
            throw new RuntimeException("Jumlah donasi harus lebih dari 0");
        }

        if (jumlahDonasi > permintaan.getJumlah()) {
            throw new RuntimeException("Jumlah donasi melebihi kebutuhan permintaan (" + permintaan.getJumlah() + ")");
        }

        // Handle File Upload for Proof
        String fileName = null;
        if (file != null && !file.isEmpty()) {
            try {
                fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                java.nio.file.Path uploadPath = java.nio.file.Paths.get("uploads");
                if (!java.nio.file.Files.exists(uploadPath)) {
                    java.nio.file.Files.createDirectories(uploadPath);
                }
                java.nio.file.Files.copy(file.getInputStream(), uploadPath.resolve(fileName));
            } catch (java.io.IOException e) {
                throw new RuntimeException("Gagal menyimpan foto bukti: " + e.getMessage());
            }
        }

        // Logic: Partial vs Full
        if (jumlahDonasi < permintaan.getJumlah()) {
            // PARTIAL FULFILLMENT -> SPLIT Request
            // 1. Create New "Processed" Request
            PermintaanDonasi processedRequest = new PermintaanDonasi();
            processedRequest.setPenerima(permintaan.getPenerima());
            processedRequest.setJenisBarang(permintaan.getJenisBarang());
            processedRequest.setKategori(permintaan.getKategori());
            processedRequest.setDeskripsiKebutuhan(permintaan.getDeskripsiKebutuhan() + " (Dipenuhi Sebagian)");
            processedRequest.setLokasi(permintaan.getLokasi());
            processedRequest.setCreatedAt(permintaan.getCreatedAt()); // Keep original date? or now? Let's keep original
                                                                      // context.
            processedRequest.setUpdatedAt(LocalDateTime.now());

            // Set specific data for the fulfilled part
            processedRequest.setJumlah(jumlahDonasi);
            processedRequest.setDonatur(donatur);
            processedRequest.setStatus("approved"); // Langsung diproses
            if (fileName != null)
                processedRequest.setImage(fileName);

            permintaanRepository.save(processedRequest);

            // 2. Update Original Request (Remain Open)
            permintaan.setJumlah(permintaan.getJumlah() - jumlahDonasi);
            permintaan.setUpdatedAt(LocalDateTime.now());
            permintaanRepository.save(permintaan);

            return processedRequest; // Return the one that is being processed so donor sees success
        } else {
            // FULL FULFILLMENT
            permintaan.setDonatur(donatur);
            permintaan.setStatus("approved");
            if (fileName != null)
                permintaan.setImage(fileName);
            permintaan.setUpdatedAt(LocalDateTime.now());
            return permintaanRepository.save(permintaan);
        }
    }

    @Transactional
    public PermintaanDonasi markAsSent(Integer permintaanId) {
        PermintaanDonasi permintaan = permintaanRepository.findById(permintaanId)
                .orElseThrow(() -> new RuntimeException("Permintaan tidak ditemukan"));

        if (!"approved".equalsIgnoreCase(permintaan.getStatus())) {
            throw new RuntimeException("Permintaan harus dalam status approved untuk dikirim.");
        }

        permintaan.setStatus("sent");
        return permintaanRepository.save(permintaan);
    }

    @Transactional
    public PermintaanDonasi acceptOffer(Integer permintaanId) {
        PermintaanDonasi permintaan = permintaanRepository.findById(permintaanId)
                .orElseThrow(() -> new RuntimeException("Permintaan tidak ditemukan"));

        if (!"sent".equalsIgnoreCase(permintaan.getStatus())) {
            throw new RuntimeException("Permintaan harus dalam status 'sent' untuk dikonfirmasi diterima.");
        }

        // 1. Update Permintaan -> received
        permintaan.setStatus("received");

        Donasi donasi;
        if (permintaan.getDonasi() != null) {
            // Use existing donation
            donasi = permintaan.getDonasi();
            donasi.setUpdatedAt(LocalDateTime.now());
            // donasi.setFoto() -> Keep existing photo!!
        } else {
            // 2. Create New Donasi (Fallback for new fulfillments)
            donasi = new Donasi();
            donasi.setDonatur(permintaan.getDonatur());
            donasi.setKategori(permintaan.getJenisBarang());
            donasi.setDeskripsi("PERMINTAAN SELESAI: " + permintaan.getDeskripsiKebutuhan());
            donasi.setJumlah(permintaan.getJumlah());
            donasi.setLokasi(permintaan.getLokasi());
            donasi.setCreatedAt(LocalDateTime.now());
            donasi.setUpdatedAt(LocalDateTime.now());

            // Try to use proof image if available, otherwise default
            if (permintaan.getImage() != null) {
                donasi.setFoto(permintaan.getImage());
            } else {
                donasi.setFoto("default_fulfillment.png");
            }
        }

        // Common Updates
        donasi.setPenerima(permintaan.getPenerima());

        StatusDonasi statusSelesai = statusRepository.findByStatus("Selesai")
                .orElseGet(() -> {
                    StatusDonasi s = new StatusDonasi();
                    s.setStatus("Selesai");
                    s.setStatusVerifikasi(true);
                    return statusRepository.save(s);
                });
        donasi.setStatusDonasi(statusSelesai);

        Donasi savedDonasi = donasiRepository.save(donasi);
        permintaan.setDonasi(savedDonasi);

        return permintaanRepository.save(permintaan);
    }

    @Transactional
    public PermintaanDonasi editPermintaan(Integer permintaanId, PermintaanDonasi updatedData, Integer userId,
            org.springframework.web.multipart.MultipartFile file) {
        PermintaanDonasi permintaan = permintaanRepository.findById(permintaanId)
                .orElseThrow(() -> new RuntimeException("Permintaan tidak ditemukan"));

        if (!permintaan.getPenerima().getUserId().equals(userId)) {
            throw new RuntimeException("Anda tidak berhak mengedit permintaan ini.");
        }

        // Only allow edits if status is pending or Open
        if (!"pending".equalsIgnoreCase(permintaan.getStatus()) && !"Open".equalsIgnoreCase(permintaan.getStatus())) {
            throw new RuntimeException("Permintaan tidak dapat diedit karena status sudah: " + permintaan.getStatus());
        }

        permintaan.setJumlah(updatedData.getJumlah());
        permintaan.setDeskripsiKebutuhan(updatedData.getDeskripsiKebutuhan());

        // Update Nama Barang (Jenis Barang)
        if (updatedData.getJenisBarang() != null && !updatedData.getJenisBarang().isBlank()) {
            permintaan.setJenisBarang(updatedData.getJenisBarang());
        }

        // Handle File Update
        if (file != null && !file.isEmpty()) {
            try {
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                java.nio.file.Path uploadPath = java.nio.file.Paths.get("uploads");
                if (!java.nio.file.Files.exists(uploadPath)) {
                    java.nio.file.Files.createDirectories(uploadPath);
                }
                java.nio.file.Files.copy(file.getInputStream(), uploadPath.resolve(fileName));

                // Delete old image if exists? (Optional, maybe skip for now to avoid deleting
                // default assets)
                permintaan.setImage(fileName);
            } catch (java.io.IOException e) {
                throw new RuntimeException("Gagal mengupdate file bukti: " + e.getMessage());
            }
        }

        permintaan.setUpdatedAt(LocalDateTime.now());

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

    public List<PermintaanDonasi> searchPermintaan(String kategori, String lokasi, Boolean pendingOnly) {
        List<PermintaanDonasi> all = this.listAll();
        return all.stream()
                .filter(p -> {
                    boolean matchesKategori = (kategori == null || kategori.isBlank()) ||
                            (p.getKategori() != null && p.getKategori().equalsIgnoreCase(kategori));

                    boolean matchesLokasi = (lokasi == null || lokasi.isBlank()) ||
                            (p.getLokasi() != null && p.getLokasi().getAlamatLengkap() != null &&
                                    p.getLokasi().getAlamatLengkap().toLowerCase().contains(lokasi.toLowerCase()));

                    boolean matchesStatus = Boolean.TRUE.equals(pendingOnly)
                            ? ("pending".equalsIgnoreCase(p.getStatus()) || "Open".equalsIgnoreCase(p.getStatus()))
                            : true;

                    return matchesKategori && matchesLokasi && matchesStatus;
                })
                .toList();
    }
}