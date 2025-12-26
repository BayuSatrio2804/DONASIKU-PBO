package Donasiku.spring.core.controller;

import Donasiku.spring.core.dto.DonasiRequest;
import Donasiku.spring.core.dto.StatusUpdateRequest;
import Donasiku.spring.core.entity.Donasi;
import Donasiku.spring.core.service.DonasiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/donasi")
public class DonasiController {

    @Autowired
    private DonasiService donasiService;

    // FR-03: Tambah Donasi Baru
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createDonasi(
            @RequestParam("namaBarang") String namaBarang,
            @RequestParam("kategori") String kategori, // Added explicit kategori
            @RequestParam("deskripsi") String deskripsi,
            @RequestParam("jumlah") Integer jumlah,
            @RequestParam("lokasi") String lokasi,
            @RequestParam("userId") Integer userId,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            DonasiRequest request = new DonasiRequest();
            // Combine Nama Barang into Deskripsi because Donasi entity has no 'name' field
            String fullDescription = "Barang: " + namaBarang + ". " + deskripsi;
            request.setDeskripsi(fullDescription);

            request.setKategori(kategori); // Map correctly
            request.setJumlah(jumlah);
            request.setDonaturId(userId);

            Donasi donasi = donasiService.createDonasiWithFile(request, lokasi, file);
            return new ResponseEntity<>(donasi, HttpStatus.CREATED);
        } catch (Exception e) {
            // Return JSON error response instead of plain text
            java.util.Map<String, String> errorResponse = new java.util.HashMap<>();
            errorResponse.put("error", "true");
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    // FR-14 & FR-15: Update Status (Dikirim/Diterima)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable("id") Integer donasiId,
            @RequestBody StatusUpdateRequest request) {
        try {
            Donasi updated = donasiService.updateStatusDonasi(donasiId, request.getStatusBaru(), request.getUserId());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN); // 403 jika tidak berhak
        }
    }

    // New Endpoint: Recipient Claims Donation
    @PostMapping("/{id}/claim")
    public ResponseEntity<?> claimDonasi(
            @PathVariable("id") Integer donasiId,
            @RequestParam("userId") Integer userId) {
        try {
            Donasi updated = donasiService.claimDonasi(donasiId, userId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Helper: Lihat Detail Donasi
    @GetMapping("/{id}")
    public ResponseEntity<?> getDonasi(@PathVariable("id") Integer id) {
        try {
            return ResponseEntity.ok(donasiService.getDonasiById(id));
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // FR-06 & FR-08: List & Filter Donasi
    @GetMapping
    public ResponseEntity<List<Donasi>> listDonasi(
            @RequestParam(required = false) String kategori,
            @RequestParam(required = false) String lokasi,
            @RequestParam(required = false) Boolean availableOnly) {
        try {
            // If no filters, return all donations
            if (kategori == null && lokasi == null && availableOnly == null) {
                return ResponseEntity.ok(donasiService.getAllDonasi());
            }

            // Use search with filters
            List<Donasi> results = donasiService.searchDonasi(kategori, lokasi, availableOnly);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of());
        }
    }

    // FR-XX: Hapus Donasi dengan Error Handling
    @DeleteMapping("/{id}")
    public ResponseEntity<?> hapusDonasi(@PathVariable("id") Integer donasiId, @RequestParam("userId") Integer userId) {
        try {
            // Validasi input
            if (donasiId == null || donasiId <= 0) {
                return ResponseEntity.badRequest().body("Error: Donasi ID tidak valid");
            }

            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest().body("Error: User ID tidak valid");
            }

            donasiService.hapusDonasi(donasiId, userId);
            return ResponseEntity.ok("Donasi berhasil dihapus.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("Error: Anda tidak memiliki akses untuk menghapus donasi ini");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Error: Donasi tidak ditemukan - " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: Gagal menghapus donasi");
        }
    }

    // FR-XX: Edit Donasi dengan Error Handling (Updated to support File and Name)
    @PutMapping(path = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> editDonasi(
            @PathVariable("id") Integer donasiId,
            @RequestParam("namaBarang") String namaBarang,
            @RequestParam("kategori") String kategori,
            @RequestParam("deskripsi") String deskripsi,
            @RequestParam("jumlah") Integer jumlah,
            @RequestParam("lokasi") String lokasi,
            @RequestParam("userId") Integer userId,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            // Validasi input
            if (donasiId == null || donasiId <= 0)
                return ResponseEntity.badRequest().body("Error: Donasi ID tidak valid");
            if (userId == null || userId <= 0)
                return ResponseEntity.badRequest().body("Error: User ID tidak valid");

            DonasiRequest request = new DonasiRequest();
            String fullDescription = "Barang: " + namaBarang + ". " + deskripsi;
            request.setDeskripsi(fullDescription);
            request.setKategori(kategori);
            request.setJumlah(jumlah);
            request.setDonaturId(userId);

            donasiService.editDonasiWithFile(donasiId, request, lokasi, file);
            return ResponseEntity.ok("Donasi berhasil diupdate.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("Error: Anda tidak memiliki akses untuk mengedit donasi ini");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Error: Donasi tidak ditemukan - " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: Gagal memperbarui donasi - " + e.getMessage());
        }
    }
}