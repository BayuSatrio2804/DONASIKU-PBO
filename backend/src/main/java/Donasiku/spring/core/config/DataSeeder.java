package Donasiku.spring.core.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import Donasiku.spring.core.entity.Donasi;
import Donasiku.spring.core.entity.Lokasi;
import Donasiku.spring.core.entity.StatusDonasi;
import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.entity.User.UserRole;
import Donasiku.spring.core.repository.DonasiRepository;
import Donasiku.spring.core.repository.LokasiRepository;
import Donasiku.spring.core.repository.StatusDonasiRepository;
import Donasiku.spring.core.repository.UserRepository;

@Configuration
public class DataSeeder {

    // TEMPORARILY DISABLED - Need to update DB schema first
    // @org.springframework.context.annotation.Bean
    CommandLineRunner initDatabaseDisabled(StatusDonasiRepository statusRepo, 
                                   UserRepository userRepo, 
                                   LokasiRepository lokasiRepo,
                                   DonasiRepository donasiRepo, // Tambah ini
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Status Donasi
            StatusDonasi statusDikirim = null;
            if (statusRepo.findByStatus("Available").isEmpty()) {
                StatusDonasi s1 = new StatusDonasi(); s1.setStatus("Available"); s1.setStatusVerifikasi(true);
                statusRepo.save(s1);
            }
            if (statusRepo.findByStatus("Dikirim").isEmpty()) {
                StatusDonasi s2 = new StatusDonasi(); s2.setStatus("Dikirim"); s2.setStatusVerifikasi(true);
                statusDikirim = statusRepo.save(s2); // Simpan referensi
            } else {
                statusDikirim = statusRepo.findByStatus("Dikirim").get();
            }
            if (statusRepo.findByStatus("Diterima").isEmpty()) {
                StatusDonasi s3 = new StatusDonasi(); s3.setStatus("Diterima"); s3.setStatusVerifikasi(true);
                statusRepo.save(s3);
            }
            
            // 2. Lokasi
            Lokasi loc = null;
            if (lokasiRepo.count() == 0) {
                Lokasi l = new Lokasi();
                l.setAlamatLengkap("Jl. Telekomunikasi No. 1");
                l.setGarisLintang(-6.97);
                l.setGarisBujur(107.63);
                loc = lokasiRepo.save(l);
            } else {
                loc = lokasiRepo.findAll().get(0);
            }
            
            // 3. User - Admin
            User admin = null;
            if (userRepo.findByUsername("admin").isEmpty()) {
                User u = new User();
                u.setUsername("admin");
                u.setEmail("admin@donasiku.com");
                u.setPassword(passwordEncoder.encode("admin123")); 
                u.setNama("Administrator");
                u.setRole(UserRole.admin);
                u.setStatus(User.UserStatus.active);
                admin = userRepo.save(u);
                System.out.println("=== AUTO-CREATED ADMIN USER ===");
                System.out.println("Username: admin");
                System.out.println("Password: admin123");
                System.out.println("==================================");
            } else {
                admin = userRepo.findByUsername("admin").get();
            }

            // 3. User - Donatur & Penerima
            User donatur = null;
            User penerima = null;
            
            if (userRepo.findByUsername("nauval").isEmpty()) {
                User u = new User();
                u.setUsername("nauval");
                u.setEmail("nauval@test.com");
                u.setPassword(passwordEncoder.encode("123456")); 
                u.setNama("Nauval Athalla");
                u.setRole(UserRole.donatur); 
                u.setStatus(User.UserStatus.active);
                donatur = userRepo.save(u);
            } else {
                donatur = userRepo.findByUsername("nauval").get();
            }

            if (userRepo.findByUsername("penerima1").isEmpty()) {
                User u2 = new User();
                u2.setUsername("penerima1");
                u2.setEmail("penerima@test.com");
                u2.setPassword(passwordEncoder.encode("123456"));
                u2.setNama("Panti Asuhan");
                u2.setRole(UserRole.penerima);
                u2.setStatus(User.UserStatus.active);
                penerima = userRepo.save(u2);
            } else {
                penerima = userRepo.findByUsername("penerima1").get();
            }

            // 4. DATA KHUSUS TES FR-15 (Donasi yang sudah ada penerimanya)
            if (donasiRepo.count() == 0) {
                Donasi d = new Donasi();
                d.setDeskripsi("Paket Sembako Siap Terima");
                d.setKategori("Makanan");
                d.setLokasi(loc);
                d.setDonatur(donatur);
                d.setPenerima(penerima); // PENTING: Set Penerima agar bisa diterima
                d.setStatusDonasi(statusDikirim); // Status awal: Dikirim
                donasiRepo.save(d);
                System.out.println("=== DATA DUMMY FR-15 SIAP (ID DONASI: " + d.getDonasiId() + ") ===");
            }
        };
    }
}