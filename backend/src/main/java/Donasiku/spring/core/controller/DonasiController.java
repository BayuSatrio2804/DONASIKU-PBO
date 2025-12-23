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
            @RequestParam("deskripsi") String deskripsi,
            @RequestParam("jumlah") Integer jumlah,
            @RequestParam("lokasi") String lokasi,
            @RequestParam("userId") Integer userId,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            DonasiRequest request = new DonasiRequest();
            request.setDeskripsi(deskripsi);
            request.setKategori(namaBarang); // Map namaBarang to kategori
            request.setJumlah(jumlah);
            request.setDonaturId(userId);

            Donasi donasi = donasiService.createDonasiWithFile(request, lokasi, file);
            return new ResponseEntity<>(donasi, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
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

    // Helper: List/Search Donasi (Class Diagram: cariDonasi)
    @GetMapping
    public ResponseEntity<List<Donasi>> searchDonasi(
            @RequestParam(required = false) String kategori,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false) Double radius) {
        try {
            // Validate location parameters - all must be provided together
            if ((lat != null || lon != null || radius != null) &&
                    !(lat != null && lon != null && radius != null)) {
                return ResponseEntity.badRequest().body(null);
            }

            List<Donasi> results = donasiService.cariDonasi(kategori, lat, lon, radius);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
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

    // FR-XX: Edit Donasi dengan Error Handling
    @PutMapping("/{id}")
    public ResponseEntity<?> editDonasi(
            @PathVariable("id") Integer donasiId,
            @RequestBody Donasi updatedData,
            @RequestParam("userId") Integer userId) {
        try {
            // Validasi input
            if (donasiId == null || donasiId <= 0) {
                return ResponseEntity.badRequest().body("Error: Donasi ID tidak valid");
            }

            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest().body("Error: User ID tidak valid");
            }

            if (updatedData == null) {
                return ResponseEntity.badRequest().body("Error: Data donasi tidak boleh kosong");
            }

            // Validasi field deskripsi
            if (updatedData.getDeskripsi() != null) {
                String desc = updatedData.getDeskripsi().trim();
                if (desc.isEmpty()) {
                    return ResponseEntity.badRequest().body("Error: Deskripsi tidak boleh kosong");
                }
                if (desc.length() > 1000) {
                    return ResponseEntity.badRequest().body("Error: Deskripsi maksimal 1000 karakter");
                }
            }

            // Validasi field kategori
            if (updatedData.getKategori() != null) {
                String kategori = updatedData.getKategori().trim();
                if (kategori.isEmpty()) {
                    return ResponseEntity.badRequest().body("Error: Kategori tidak boleh kosong");
                }
                if (kategori.length() > 100) {
                    return ResponseEntity.badRequest().body("Error: Kategori maksimal 100 karakter");
                }
            }

            // Validasi field jumlah
            if (updatedData.getJumlah() != null && updatedData.getJumlah() <= 0) {
                return ResponseEntity.badRequest().body("Error: Jumlah harus lebih dari 0");
            }

            donasiService.editDonasi(donasiId, updatedData, userId);
            return ResponseEntity.ok("Donasi berhasil diupdate.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("Error: Anda tidak memiliki akses untuk mengedit donasi ini");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Error: Donasi tidak ditemukan - " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: Gagal memperbarui donasi");
        }
    }
}