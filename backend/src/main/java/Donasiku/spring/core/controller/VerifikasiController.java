package Donasiku.spring.core.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Donasiku.spring.core.dto.VerifikasiRequest;
import Donasiku.spring.core.dto.VerifikasiResponse;
import Donasiku.spring.core.service.VerifikasiService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/verifikasi")
public class VerifikasiController {

    @Autowired
    private VerifikasiService verifikasiService;

    /**
     * FR-16: Upload dokumen verifikasi untuk Penerima Donasi
     * POST /api/verifikasi/upload
     * 
     * Request body:
     * {
     *   "userId": 1,
     *   "namaFile": "KTP_12345.pdf",
     *   "filePath": "/uploads/verifikasi/KTP_12345.pdf"
     * }
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadDokumenVerifikasi(@Valid @RequestBody VerifikasiRequest request) {
        try {
            VerifikasiResponse response = verifikasiService.uploadDokumenVerifikasi(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                new VerifikasiResponse(null, null, null, null, null, "ERROR", e.getMessage()),
                HttpStatus.BAD_REQUEST
            );
        }
    }

    /**
     * Get dokumen verifikasi berdasarkan User ID
     * GET /api/verifikasi/{userId}/dokumen
     */
    @GetMapping("/{userId}/dokumen")
    public ResponseEntity<?> getDokumenVerifikasi(@PathVariable Integer userId) {
        try {
            VerifikasiResponse response = verifikasiService.getDokumenVerifikasi(userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                new VerifikasiResponse(null, null, null, null, null, "NOT_FOUND", e.getMessage()),
                HttpStatus.NOT_FOUND
            );
        }
    }

    /**
     * Check status verifikasi user
     * GET /api/verifikasi/{userId}/status
     */
    @GetMapping("/{userId}/status")
    public ResponseEntity<?> getStatusVerifikasi(@PathVariable Integer userId) {
        try {
            VerifikasiResponse response = verifikasiService.getStatusVerifikasi(userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                new VerifikasiResponse(null, null, null, null, null, "ERROR", e.getMessage()),
                HttpStatus.NOT_FOUND
            );
        }
    }

    /**
     * Delete dokumen verifikasi (untuk re-upload)
     * DELETE /api/verifikasi/{userId}/dokumen
     */
    @DeleteMapping("/{userId}/dokumen")
    public ResponseEntity<?> deleteDokumenVerifikasi(@PathVariable Integer userId) {
        try {
            verifikasiService.deleteDokumenVerifikasi(userId);
            return ResponseEntity.ok(
                new VerifikasiResponse(null, userId, null, null, null, "DELETED", "Dokumen verifikasi berhasil dihapus")
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                new VerifikasiResponse(null, null, null, null, null, "ERROR", e.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
