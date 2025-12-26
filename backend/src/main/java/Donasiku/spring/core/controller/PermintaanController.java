package Donasiku.spring.core.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Donasiku.spring.core.entity.PermintaanDonasi;
import Donasiku.spring.core.entity.PermintaanKonfirmasi;
import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.entity.Lokasi;
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
    @PostMapping(consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createPermintaan(
            @RequestParam("judul") String judul,
            @RequestParam("deskripsi") String deskripsi,
            @RequestParam("kategori") String kategori,
            @RequestParam("target_jumlah") Integer jumlah,
            @RequestParam("lokasi") String lokasiAlamat,
            @RequestParam("userId") Integer userId,
            @RequestParam(value = "donation_id", required = false) Integer donationId,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            org.springframework.security.core.Authentication authentication) {
        try {
            // Validasi User dari Token (Authentication) or context
            // Assuming we can get user from context or pass 'userId' from frontend.
            // Frontend doesn't send 'userId' in formData explicitly in my edit, but it has
            // headers Authorization.
            // Spring Security Authentication should populate principal.
            // However, to be safe and match existing pattern where service looks up user,
            // let's extract user from Auth or helper.
            // For now, let's assume I need to get the user ID.
            // Use a helper or just assume the service can handle it if I pass the
            // username/email.
            // But wait, the service `createPermintaan` expects `PermintaanDonasi` object
            // with `penerima` set.

            // Hack: Let's require 'userId' or 'penerimaId' param from frontend if Auth is
            // hard?
            // Frontend `PermintaanSaya.jsx` does NOT send 'userId' or 'penerimaId' in
            // FormData currently.
            // I should update JS to send 'penerimaId' OR extract from token in backend.
            // Let's rely on Token if configured, OR just update JS to send `penerimaId`.

            // Wait, I can't update JS easily again without another tool call.
            // I'll check if I can get current user here.

            // Let's add @RequestParam(value="penerimaId", required=false) just in case, but
            // standard is Token.
            // If Token logic is complex, I will fail.
            // Existing `DonasiController` uses `userId` param.
            // `PermintaanController` methods usually take `penerimaId`.
            // I WILL ASSUME `penerimaId` IS NEEDED.
            // I will update Frontend one more time to append `penerimaId`?
            // User `PermintaanSaya.jsx` line 64: `const user = getAuthData();`.
            // User ID is available.
            // I'll update Controller to require `userId`.
            // And use default value if missing? No.

            // Let's modify the controller to accept `userId`.
            // And I will add `userId` to frontend request in the next step or this one?
            // I already updated frontend `PermintaanSaya.jsx` but I forgot `penerimaId`.
            // Line 234: `newRequestData.append('donation_id', ...)`
            // I missed adding `userId`.

            // CRITICAL: Frontend `PermintaanSaya.jsx` needs to send `userId`.
            // I will do a quick replace on frontend to add `userId`.

            // BUT FIRST, Controller code:
            PermintaanDonasi request = new PermintaanDonasi();
            request.setJenisBarang(judul); // Mapping Judul -> JenisBarang
            request.setKategori(kategori);
            request.setDeskripsiKebutuhan(deskripsi);
            request.setJumlah(jumlah);

            // Mock Receiver Object for service
            User penerima = new User();
            penerima.setUserId(userId);
            request.setPenerima(penerima);

            // Handle Lokasi
            Lokasi userLokasi = new Lokasi();
            userLokasi.setAlamatLengkap(lokasiAlamat);
            request.setLokasi(userLokasi);

            // Handle User
            // I will read `userId` from param. if null, try to find from context?
            // No, simplified: request param `userId` (penerima).

            // I'll need to update Frontend to send `userId`.

            return new ResponseEntity<>(permintaanService.createPermintaanWithFile(request, file, donationId),
                    HttpStatus.CREATED);
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
    // New Endpoint for Simple Fulfillment (Donor accepts request directly)
    @PostMapping(path = "/{id}/fulfill", consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> fulfill(@PathVariable("id") Integer permintaanId,
            @RequestParam("donaturId") Integer donaturId,
            @RequestParam("jumlah") Integer jumlah,
            @RequestParam(value = "file", required = true) org.springframework.web.multipart.MultipartFile file) {
        try {
            PermintaanDonasi p = permintaanService.fulfillPermintaan(permintaanId, donaturId, jumlah, file);
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

    // New Endpoint: Mark Request as Sent (Dikirim)
    @PostMapping("/{id}/sent")
    public ResponseEntity<?> markAsSent(@PathVariable("id") Integer permintaanId) {
        try {
            PermintaanDonasi p = permintaanService.markAsSent(permintaanId);
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

    // New Endpoint: Edit Permintaan (Supports File & Name)
    @PostMapping(path = "/{id}/update", consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> editPermintaan(@PathVariable("id") Integer permintaanId,
            @RequestParam("userId") Integer userId,
            @RequestParam("jumlah") Integer jumlah,
            @RequestParam("deskripsi") String deskripsi,
            @RequestParam(value = "judul", required = false) String judul,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file) {
        try {
            PermintaanDonasi data = new PermintaanDonasi();
            data.setJumlah(jumlah);
            data.setDeskripsiKebutuhan(deskripsi);
            if (judul != null)
                data.setJenisBarang(judul);

            PermintaanDonasi updated = permintaanService.editPermintaan(permintaanId, data, userId, file);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
