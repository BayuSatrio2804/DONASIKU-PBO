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
            dokumen.setFilePath(filePath.toString());
            dokumen.setUploadedAt(LocalDateTime.now());

            DokumenVerifikasi saved = dokumenVerifikasiRepository.save(dokumen);
            return mapToResponse(saved, "Dokumen verifikasi berhasil diupload");

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
    public VerifikasiResponse getStatusVerifikasi(Integer userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User tidak ditemukan");
        }

        User user = userOpt.get();
        Optional<DokumenVerifikasi> dokumen = dokumenVerifikasiRepository.findByPenerimaUserId(userId);

        VerifikasiResponse response = new VerifikasiResponse();
        response.setPenerimaUserId(userId);

        if (dokumen.isPresent()) {
            DokumenVerifikasi doc = dokumen.get();
            response.setDokumenVerifikasiId(doc.getDokumenVerifikasiId());
            response.setNamaFile(doc.getNamaFile());
            response.setFilePath(doc.getFilePath());
            response.setUploadedAt(doc.getUploadedAt());
            response.setStatus("Dokumen sudah diupload, menunggu verifikasi");
            response.setMessage("Status: Terverifikasi = " + user.getStatus());
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
    private VerifikasiResponse mapToResponse(DokumenVerifikasi dokumen, String message) {
        return new VerifikasiResponse(
                dokumen.getDokumenVerifikasiId(),
                dokumen.getPenerimaUserId(),
                dokumen.getNamaFile(),
                dokumen.getFilePath(),
                dokumen.getUploadedAt(),
                "Dokumen diterima",
                message);
    }
}
