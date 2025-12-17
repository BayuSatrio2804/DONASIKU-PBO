package Donasiku.spring.core.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Donasiku.spring.core.dto.VerifikasiResponse;
import Donasiku.spring.core.entity.DokumenVerifikasi;
import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.repository.DokumenVerifikasiRepository;
import Donasiku.spring.core.repository.UserRepository;

@Service
public class VerifikasiService {

    @Autowired
    private DokumenVerifikasiRepository dokumenVerifikasiRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * FR-16: Upload dokumen verifikasi untuk pengguna
     * Hanya Penerima Donasi yang bisa upload dokumen
     */
    /**
     * FR-16: Upload dokumen verifikasi untuk pengguna (Multipart)
     */
    @Transactional
    public VerifikasiResponse uploadDokumenVerifikasi(Integer userId,
            org.springframework.web.multipart.MultipartFile file) {
        // Cek apakah user ada dan adalah Penerima
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User tidak ditemukan dengan ID: " + userId);
        }

        User user = userOpt.get();
        if (!user.getRole().equals(User.UserRole.penerima)) {
            throw new RuntimeException("Hanya Penerima yang dapat melakukan verifikasi.");
        }

        if (file.isEmpty()) {
            throw new RuntimeException("File tidak boleh kosong");
        }

        try {
            // Setup directory
            String uploadDir = "uploads/verification/";
            java.io.File directory = new java.io.File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Save file
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir + fileName);
            java.nio.file.Files.copy(file.getInputStream(), filePath,
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Update Database
            Optional<DokumenVerifikasi> existingDoc = dokumenVerifikasiRepository.findByPenerimaUserId(userId);
            DokumenVerifikasi dokumen;

            if (existingDoc.isPresent()) {
                dokumen = existingDoc.get();
            } else {
                dokumen = new DokumenVerifikasi();
                dokumen.setPenerimaUserId(userId);
            }

            dokumen.setNamaFile(file.getOriginalFilename());
            // Store relative URL path (convert backslash to forward slash for web URLs)
            String urlPath = "/" + uploadDir.replace("\\", "/") + fileName;
            dokumen.setFilePath(urlPath);
            dokumen.setUploadedAt(LocalDateTime.now());
            // Status awal: menunggu verifikasi dari admin
            dokumen.setStatusVerifikasi("menunggu_verifikasi");

            System.out.println("Menyimpan ke repository...");
            DokumenVerifikasi saved = dokumenVerifikasiRepository.save(dokumen);
            System.out.println("Tersimpan! ID: " + saved.getDokumenVerifikasiId());
            return mapToResponse(saved, "Dokumen verifikasi berhasil diupload. Menunggu verifikasi dari admin");

        } catch (java.io.IOException e) {
            throw new RuntimeException("Gagal menyimpan file: " + e.getMessage());
        }
    }

    /**
     * Get dokumen verifikasi berdasarkan User ID
     */
    public VerifikasiResponse getDokumenVerifikasi(Integer userId) {
        Optional<DokumenVerifikasi> dokumen = dokumenVerifikasiRepository.findByPenerimaUserId(userId);

        if (dokumen.isEmpty()) {
            throw new RuntimeException("Dokumen verifikasi tidak ditemukan untuk User ID: " + userId);
        }

        return mapToResponse(dokumen.get(), "Dokumen ditemukan");
    }

    /**
     * Check status verifikasi user
     */
    /**
     * Check status verifikasi user
     */
    public VerifikasiResponse getStatusVerifikasi(Integer userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User tidak ditemukan");
        }

        User user = userOpt.get();
        Optional<DokumenVerifikasi> dokumen = dokumenVerifikasiRepository.findByPenerimaUserId(userId);

        VerifikasiResponse response = new VerifikasiResponse();
        response.setPenerimaUserId(userId);

        // Populate User Info
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setNoTelepon(user.getNoTelepon());
        response.setAlamat(user.getAlamat());

        if (dokumen.isPresent()) {
            DokumenVerifikasi doc = dokumen.get();
            response.setDokumenVerifikasiId(doc.getDokumenVerifikasiId());
            response.setNamaFile(doc.getNamaFile());
            response.setFilePath(doc.getFilePath());
            response.setUploadedAt(doc.getUploadedAt());
            response.setStatus(doc.getStatusVerifikasi() != null ? doc.getStatusVerifikasi() : "menunggu_verifikasi");
            response.setMessage("Status verifikasi: "
                    + (doc.getStatusVerifikasi() != null ? doc.getStatusVerifikasi() : "menunggu_verifikasi"));
        } else {
            response.setStatus("Belum ada dokumen verifikasi");
            response.setMessage("User belum melakukan upload dokumen");
        }

        return response;
    }

    /**
     * Hapus dokumen verifikasi (untuk edit)
     */
    @Transactional
    public void deleteDokumenVerifikasi(Integer userId) {
        Optional<DokumenVerifikasi> dokumen = dokumenVerifikasiRepository.findByPenerimaUserId(userId);
        if (dokumen.isPresent()) {
            dokumenVerifikasiRepository.delete(dokumen.get());
        }
    }

    /**
     * Mapping helper
     */
    /**
     * Admin approve/reject dokumen verifikasi
     */
    @Transactional
    public VerifikasiResponse updateVerifikasiStatus(Integer dokumenId, String status, Integer adminUserId) {
        Optional<DokumenVerifikasi> dokumenOpt = dokumenVerifikasiRepository.findById(dokumenId);
        if (dokumenOpt.isEmpty()) {
            throw new RuntimeException("Dokumen verifikasi tidak ditemukan dengan ID: " + dokumenId);
        }

        // Validasi status
        if (!status.equals("terverifikasi") && !status.equals("ditolak")) {
            throw new RuntimeException("Status tidak valid. Hanya 'terverifikasi' atau 'ditolak' yang diperbolehkan");
        }

        DokumenVerifikasi dokumen = dokumenOpt.get();
        dokumen.setStatusVerifikasi(status);
        dokumen.setVerifiedAt(LocalDateTime.now());

        DokumenVerifikasi saved = dokumenVerifikasiRepository.save(dokumen);
        return mapToResponse(saved, "Status dokumen diupdate menjadi: " + status);
    }

    /**
     * Get semua dokumen yang menunggu verifikasi (untuk admin)
     */
    public java.util.List<VerifikasiResponse> getAllPendingVerifikasi() {
        // Query dokumen dengan status "menunggu_verifikasi"
        java.util.List<DokumenVerifikasi> dokumenList = dokumenVerifikasiRepository.findAll();
        return dokumenList.stream()
                .filter(d -> "menunggu_verifikasi".equals(d.getStatusVerifikasi()))
                .map(d -> mapToResponse(d, "Dokumen menunggu verifikasi"))
                .collect(java.util.stream.Collectors.toList());
    }

    private VerifikasiResponse mapToResponse(DokumenVerifikasi dokumen, String message) {
        String username = "-";
        String email = "-";
        String noTelepon = "-";
        String alamat = "-";

        Optional<User> userOpt = userRepository.findById(dokumen.getPenerimaUserId());
        if (userOpt.isPresent()) {
            User u = userOpt.get();
            username = u.getUsername();
            email = u.getEmail();
            noTelepon = u.getNoTelepon();
            alamat = u.getAlamat();
        }

        return new VerifikasiResponse(
                dokumen.getDokumenVerifikasiId(),
                dokumen.getPenerimaUserId(),
                dokumen.getNamaFile(),
                dokumen.getFilePath(),
                dokumen.getUploadedAt(),
                dokumen.getStatusVerifikasi() != null ? dokumen.getStatusVerifikasi() : "menunggu_verifikasi",
                message,
                username,
                email,
                noTelepon,
                alamat);
    }
}
