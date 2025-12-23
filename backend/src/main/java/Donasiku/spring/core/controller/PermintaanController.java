package Donasiku.spring.core.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Donasiku.spring.core.entity.PermintaanDonasi;
import Donasiku.spring.core.entity.PermintaanKonfirmasi;
import Donasiku.spring.core.service.PermintaanService;

@RestController
@RequestMapping("/api/permintaan")
public class PermintaanController {

    private final PermintaanService permintaanService;

    @Autowired
    public PermintaanController(PermintaanService permintaanService) {
        this.permintaanService = permintaanService;
    }

    // FR-07: Penerima membuat permintaan donasi
    @PostMapping
    public ResponseEntity<?> createPermintaan(@RequestBody PermintaanDonasi request) {
        try {
            PermintaanDonasi saved = permintaanService.createPermintaan(request);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Daftar semua permintaan atau filter by status
    @GetMapping
    public ResponseEntity<List<PermintaanDonasi>> listPermintaan(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer penerimaId) {
        List<PermintaanDonasi> all;
        if (penerimaId != null) {
            all = permintaanService.listByPenerima(penerimaId);
        } else {
            all = permintaanService.listAll();
        }

        if (status == null || status.isBlank()) {
            return ResponseEntity.ok(all);
        }
        // simple filter in-memory to avoid adding repo method
        List<PermintaanDonasi> filtered = all.stream().filter(p -> status.equalsIgnoreCase(p.getStatus())).toList();
        return ResponseEntity.ok(filtered);
    }

    // Get detail permintaan by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDetailPermintaan(@PathVariable("id") Integer permintaanId) {
        try {
            PermintaanDonasi permintaan = permintaanService.getById(permintaanId);
            return ResponseEntity.ok(permintaan);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // FR-09: Donatur mengajukan penawaran untuk memenuhi permintaan
    @PostMapping("/{id}/offer")
    public ResponseEntity<?> offer(@PathVariable("id") Integer permintaanId,
            @RequestParam("donaturId") Integer donaturId) {
        try {
            PermintaanKonfirmasi k = permintaanService.offerToFulfill(permintaanId, donaturId);
            return new ResponseEntity<>(k, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // FR-10: Penerima mengkonfirmasi salah satu penawaran
    @PostMapping("/{id}/confirm/{konfirmasiId}")
    public ResponseEntity<?> confirm(@PathVariable("id") Integer permintaanId,
            @PathVariable("konfirmasiId") Integer konfirmasiId,
            @RequestParam("penerimaId") Integer penerimaId) {
        try {
            PermintaanKonfirmasi confirmed = permintaanService.confirmOffer(permintaanId, konfirmasiId, penerimaId);
            return ResponseEntity.ok(confirmed);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // New Endpoint for Simple Fulfillment (Donor accepts request directly)
    @PostMapping("/{id}/fulfill")
    public ResponseEntity<?> fulfill(@PathVariable("id") Integer permintaanId,
            @RequestParam("donaturId") Integer donaturId) {
        try {
            PermintaanDonasi p = permintaanService.fulfillPermintaan(permintaanId, donaturId);
            return ResponseEntity.ok(p);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // New Endpoint for Recipient to Accept the Fulfillment
    @PostMapping("/{id}/accept-offer")
    public ResponseEntity<?> acceptFulfillment(@PathVariable("id") Integer permintaanId) {
        try {
            PermintaanDonasi p = permintaanService.acceptOffer(permintaanId);
            return ResponseEntity.ok(p);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // FR-XX: Batalkan Permintaan dengan Error Handling
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> batalkanPermintaan(@PathVariable("id") Integer permintaanId,
            @RequestParam("userId") Integer userId) {
        try {
            // Validasi input
            if (permintaanId == null || permintaanId <= 0) {
                return ResponseEntity.badRequest().body("Error: Permintaan ID tidak valid");
            }

            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest().body("Error: User ID tidak valid");
            }

            permintaanService.batalkan(permintaanId, userId);
            return ResponseEntity.ok("Permintaan berhasil dibatalkan.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("Error: Anda tidak memiliki akses untuk membatalkan permintaan ini");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body("Error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Error: Permintaan tidak ditemukan - " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: Gagal membatalkan permintaan");
        }
    }
}
