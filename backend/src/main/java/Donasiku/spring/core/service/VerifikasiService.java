package Donasiku.spring.core.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Donasiku.spring.core.dto.VerifikasiRequest;
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
    @Transactional
    public VerifikasiResponse uploadDokumenVerifikasi(VerifikasiRequest request) {
        // Cek apakah user ada dan adalah Penerima
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User tidak ditemukan dengan ID: " + request.getUserId());
        }

        User user = userOpt.get();
        
        // Hanya Penerima yang boleh upload dokumen
        if (!user.getRole().equals(User.UserRole.penerima)) {
            throw new RuntimeException("Hanya Penerima yang dapat melakukan verifikasi. User ini adalah: " + user.getRole());
        }

        // Cek apakah sudah ada dokumen sebelumnya
        Optional<DokumenVerifikasi> existingDoc = dokumenVerifikasiRepository
                .findByPenerimaUserId(request.getUserId());

        DokumenVerifikasi dokumen;
        if (existingDoc.isPresent()) {
            // Update dokumen yang sudah ada
            dokumen = existingDoc.get();
            dokumen.setNamaFile(request.getNamaFile());
            dokumen.setFilePath(request.getFilePath());
        } else {
            // Buat dokumen baru
            dokumen = new DokumenVerifikasi();
            dokumen.setPenerimaUserId(request.getUserId());
            dokumen.setNamaFile(request.getNamaFile());
            dokumen.setFilePath(request.getFilePath());
        }

        dokumen.setUploadedAt(LocalDateTime.now());
        DokumenVerifikasi saved = dokumenVerifikasiRepository.save(dokumen);

        return mapToResponse(saved, "Dokumen verifikasi berhasil diupload");
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
            message
        );
    }
}
