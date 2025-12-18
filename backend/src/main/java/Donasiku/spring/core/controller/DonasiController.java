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

    // Helper: Lihat Detail Donasi
    @GetMapping("/{id}")
    public ResponseEntity<?> getDonasi(@PathVariable("id") Integer id) {
        try {
            return ResponseEntity.ok(donasiService.getDonasiById(id));
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    // Helper: List Semua Donasi
    @GetMapping
    public ResponseEntity<List<Donasi>> listDonasi() {
        return ResponseEntity.ok(donasiService.getAllDonasi());
    }
}