package Donasiku.spring.core.service;

import Donasiku.spring.core.entity.Lokasi;
import Donasiku.spring.core.repository.LokasiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LokasiService {

    @Autowired
    private LokasiRepository lokasiRepository;

    // Get all locations
    public List<Lokasi> getAllLokasi() {
        return lokasiRepository.findAll();
    }

    // Get location by ID
    public Lokasi getLokasiById(Integer id) {
        return lokasiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lokasi tidak ditemukan"));
    }

    // FR-04 & FR-05: Find nearby locations
    public List<Lokasi> findNearbyLokasi(Double latitude, Double longitude, Double radiusKm) {
        // Validate input
        if (latitude == null || longitude == null || radiusKm == null) {
            throw new IllegalArgumentException("Latitude, longitude, dan radius harus diisi");
        }

        if (latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException("Latitude harus antara -90 dan 90");
        }

        if (longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("Longitude harus antara -180 dan 180");
        }

        if (radiusKm <= 0) {
            throw new IllegalArgumentException("Radius harus lebih dari 0");
        }

        // Create temporary Lokasi for reference point
        Lokasi referencePoint = new Lokasi();
        referencePoint.setGarisLintang(latitude);
        referencePoint.setGarisBujur(longitude);

        // Get all locations and filter by distance
        List<Lokasi> allLokasi = lokasiRepository.findAll();
        List<Lokasi> nearbyLokasi = new ArrayList<>();

        for (Lokasi lokasi : allLokasi) {
            if (lokasi.getGarisLintang() != null && lokasi.getGarisBujur() != null) {
                double distance = referencePoint.hitungJarak(lokasi);
                if (distance <= radiusKm) {
                    nearbyLokasi.add(lokasi);
                }
            }
        }

        return nearbyLokasi;
    }

    // Search locations by address
    public List<Lokasi> searchByAddress(String address) {
        if (address == null || address.trim().isEmpty()) {
            return getAllLokasi();
        }
        return lokasiRepository.findByAlamatLengkapContainingIgnoreCase(address);
    }
}
