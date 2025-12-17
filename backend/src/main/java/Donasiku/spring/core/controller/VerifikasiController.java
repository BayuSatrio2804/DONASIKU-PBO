package Donasiku.spring.core.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Donasiku.spring.core.dto.VerifikasiResponse;
import Donasiku.spring.core.service.VerifikasiService;

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
     * "userId": 1,
     * "namaFile": "KTP_12345.pdf",
     * "filePath": "/uploads/verifikasi/KTP_12345.pdf"
     * }
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadDokumenVerifikasi(
            @org.springframework.web.bind.annotation.RequestParam("userId") Integer userId,
            @org.springframework.web.bind.annotation.RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        System.out.println("== REQUEST UPLOAD RECEIVED ==");
        System.out.println("User ID: " + userId);
        System.out.println("File Name: " + file.getOriginalFilename());
        try {
            VerifikasiResponse response = verifikasiService.uploadDokumenVerifikasi(userId, file);
            System.out.println("== UPLOAD SUCCESS RESPONSE SENT ==");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            System.err.println("== UPLOAD FAILED: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(
                    new VerifikasiResponse(null, null, null, null, null, "ERROR", e.getMessage(), null, null, null,
                            null),
                    HttpStatus.BAD_REQUEST);
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
                    new VerifikasiResponse(null, null, null, null, null, "NOT_FOUND", e.getMessage(), null, null, null,
                            null),
                    HttpStatus.NOT_FOUND);
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
                    new VerifikasiResponse(null, null, null, null, null, "ERROR", e.getMessage(), null, null, null,
                            null),
                    HttpStatus.NOT_FOUND);
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
                    new VerifikasiResponse(null, userId, null, null, null, "DELETED",
                            "Dokumen verifikasi berhasil dihapus", null, null, null, null));
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    new VerifikasiResponse(null, null, null, null, null, "ERROR", e.getMessage(), null, null, null,
                            null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Admin: Get semua dokumen yang menunggu verifikasi
     * GET /api/verifikasi/admin/pending
     */
    @GetMapping("/admin/pending")
    public ResponseEntity<?> getPendingVerifikasi() {
        try {
            java.util.List<VerifikasiResponse> responses = verifikasiService.getAllPendingVerifikasi();
            return ResponseEntity.ok(responses);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    new VerifikasiResponse(null, null, null, null, null, "ERROR", e.getMessage(), null, null, null,
                            null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Admin: Update status verifikasi dokumen
     * PUT /api/verifikasi/admin/{dokumenId}/verify
     * 
     * Request body:
     * {
     * "status": "terverifikasi" atau "ditolak"
     * }
     */
    @org.springframework.web.bind.annotation.PutMapping("/admin/{dokumenId}/verify")
    public ResponseEntity<?> updateVerifikasiStatus(
            @PathVariable Integer dokumenId,
            @RequestBody java.util.Map<String, String> request) {
        try {
            String status = request.get("status");
            VerifikasiResponse response = verifikasiService.updateVerifikasiStatus(dokumenId, status, null);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    new VerifikasiResponse(null, null, null, null, null, "ERROR", e.getMessage(), null, null, null,
                            null),
                    HttpStatus.BAD_REQUEST);
        }
    }
}
