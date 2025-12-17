package Donasiku.spring.core.config;

import Donasiku.spring.core.entity.Lokasi;
import Donasiku.spring.core.entity.StatusDonasi;
import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.repository.LokasiRepository;
import Donasiku.spring.core.repository.StatusDonasiRepository;
import Donasiku.spring.core.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private StatusDonasiRepository statusRepository;

    @Autowired
    private LokasiRepository lokasiRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- Starting Data Seeding ---");

        // 1. Seed StatusDonasi
        seedStatus("Available");
        seedStatus("Pending");
        seedStatus("Dikirim");
        seedStatus("Diterima");
        seedStatus("Dibatalkan");

        // 2. Seed Lokasi (ID 1 is required by frontend)
        if (lokasiRepository.count() == 0) {
            Lokasi loc = new Lokasi();
            loc.setAlamatLengkap("Gudang Utama Donasiku, Jakarta");
            loc.setGarisLintang(-6.2088);
            loc.setGarisBujur(106.8456);
            loc.setTipeLokasi(Lokasi.TipeLokasi.lainnya);
            lokasiRepository.save(loc);
            System.out.println("Seeded Lokasi: Gudang Utama");
        }

        // 3. Seed Default Donatur (For testing)
        // Check if user with ID 1 exists or create a test user
        
        System.out.println("--- Data Seeding Completed ---");
    }

    private void seedStatus(String statusName) {
        if (statusRepository.findByStatus(statusName).isEmpty()) {
            StatusDonasi status = new StatusDonasi();
            status.setStatus(statusName);
            status.setStatusVerifikasi(true); // Assuming this field exists based on previous SQL
            statusRepository.save(status);
            System.out.println("Seeded Status: " + statusName);
        }
    }
}
