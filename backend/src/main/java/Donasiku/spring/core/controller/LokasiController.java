package Donasiku.spring.core.controller;

import Donasiku.spring.core.entity.Lokasi;
import Donasiku.spring.core.service.LokasiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lokasi")
public class LokasiController {

    @Autowired
    private LokasiService lokasiService;

    // FR-05: Get all locations
    @GetMapping
    public ResponseEntity<List<Lokasi>> getAllLokasi(
            @RequestParam(required = false) String address) {
        try {
            if (address != null && !address.trim().isEmpty()) {
                // Search by address
                List<Lokasi> results = lokasiService.searchByAddress(address);
                return ResponseEntity.ok(results);
            }
            // Return all locations
            return ResponseEntity.ok(lokasiService.getAllLokasi());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of());
        }
    }

    // FR-05: Get location by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getLokasiById(@PathVariable Integer id) {
        try {
            Lokasi lokasi = lokasiService.getLokasiById(id);
            return ResponseEntity.ok(lokasi);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }

    // FR-04 & FR-05: Find nearby locations
    // GET /api/lokasi/nearby?lat=-6.2088&lng=106.8456&radius=10
    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyLokasi(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "10.0") Double radius) {
        try {
            // Validate inputs
            if (lat == null || lng == null) {
                return ResponseEntity.badRequest()
                        .body("Error: Parameter lat dan lng harus diisi");
            }

            List<Lokasi> nearbyLokasi = lokasiService.findNearbyLokasi(lat, lng, radius);

            return ResponseEntity.ok(new NearbyResponse(
                    true,
                    "Ditemukan " + nearbyLokasi.size() + " lokasi dalam radius " + radius + " km",
                    lat,
                    lng,
                    radius,
                    nearbyLokasi));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(false, "Error: Gagal mencari lokasi terdekat"));
        }
    }

    // Response DTOs
    static class NearbyResponse {
        public boolean success;
        public String message;
        public Double latitude;
        public Double longitude;
        public Double radiusKm;
        public List<Lokasi> locations;

        public NearbyResponse(boolean success, String message, Double latitude,
                Double longitude, Double radiusKm, List<Lokasi> locations) {
            this.success = success;
            this.message = message;
            this.latitude = latitude;
            this.longitude = longitude;
            this.radiusKm = radiusKm;
            this.locations = locations;
        }
    }

    static class ErrorResponse {
        public boolean success;
        public String message;

        public ErrorResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }
}
