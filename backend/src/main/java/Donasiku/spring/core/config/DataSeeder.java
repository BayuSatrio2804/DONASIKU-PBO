package Donasiku.spring.core.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import Donasiku.spring.core.entity.Donasi;
import Donasiku.spring.core.entity.Lokasi;
import Donasiku.spring.core.entity.PermintaanDonasi;
import Donasiku.spring.core.entity.StatusDonasi;
import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.entity.User.UserRole;
import Donasiku.spring.core.repository.DonasiRepository;
import Donasiku.spring.core.repository.LokasiRepository;
import Donasiku.spring.core.repository.PermintaanDonasiRepository;
import Donasiku.spring.core.repository.StatusDonasiRepository;
import Donasiku.spring.core.repository.UserRepository;

@Configuration
public class DataSeeder {

    @org.springframework.context.annotation.Bean
    CommandLineRunner initDatabase(StatusDonasiRepository statusRepo, 
                                   UserRepository userRepo, 
                                   LokasiRepository lokasiRepo,
                                   DonasiRepository donasiRepo,
                                   PermintaanDonasiRepository permintaanRepo,
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

            // 3. User - Donatur
            User donatur = null;
            
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

            // 4. Create Penerima for testing permintaan
            User penerima = null;
            if (userRepo.findByUsername("penerima_test").isEmpty()) {
                User u2 = new User();
                u2.setUsername("penerima_test");
                u2.setEmail("penerima_test@test.com");
                u2.setPassword(passwordEncoder.encode("123456"));
                u2.setNama("Panti Asuhan Harapan");
                u2.setRole(UserRole.penerima);
                u2.setStatus(User.UserStatus.active);
                penerima = userRepo.save(u2);
                System.out.println("=== AUTO-CREATED PENERIMA USER ===");
                System.out.println("Username: penerima_test");
                System.out.println("Password: 123456");
                System.out.println("===================================");
            } else {
                penerima = userRepo.findByUsername("penerima_test").get();
            }

            // 5. Create Dummy Permintaan
            // if (permintaanRepo.count() == 0 && penerima != null) {
            //     // Permintaan 1
            //     Lokasi lokasi1 = new Lokasi();
            //     lokasi1.setAlamatLengkap("Jl. Ahmad Yani No. 50, Jakarta Timur");
            //     lokasi1.setGarisLintang(-6.2088);
            //     lokasi1.setGarisBujur(106.8905);
            //     lokasi1.setTipeLokasi(Lokasi.TipeLokasi.penerima);
            //     lokasi1 = lokasiRepo.save(lokasi1);

            //     PermintaanDonasi p1 = new PermintaanDonasi();
            //     p1.setJenisBarang("Buku Pelajaran SD");
            //     p1.setJumlah(20);
            //     p1.setDeskripsiKebutuhan("Butuh buku pelajaran untuk siswa kelas 3-5 SD. Buku dalam kondisi baik atau seperti baru.");
            //     p1.setPenerima(penerima);
            //     p1.setLokasi(lokasi1);
            //     p1.setStatus("Open");
            //     p1.setCreatedAt(java.time.LocalDateTime.now());
            //     permintaanRepo.save(p1);

            //     // Permintaan 2
            //     Lokasi lokasi2 = new Lokasi();
            //     lokasi2.setAlamatLengkap("Jl. Gatot Subroto No. 100, Bandung");
            //     lokasi2.setGarisLintang(-6.9271);
            //     lokasi2.setGarisBujur(107.6411);
            //     lokasi2.setTipeLokasi(Lokasi.TipeLokasi.penerima);
            //     lokasi2 = lokasiRepo.save(lokasi2);

            //     PermintaanDonasi p2 = new PermintaanDonasi();
            //     p2.setJenisBarang("Pakaian Anak-anak");
            //     p2.setJumlah(50);
            //     p2.setDeskripsiKebutuhan("Membutuhkan pakaian untuk anak-anak berusia 5-12 tahun. Ukuran S, M, L. Pakaian sudah tidak terpakai.");
            //     p2.setPenerima(penerima);
            //     p2.setLokasi(lokasi2);
            //     p2.setStatus("Open");
            //     p2.setCreatedAt(java.time.LocalDateTime.now());
            //     permintaanRepo.save(p2);

            //     // Permintaan 3 (Urgent)
            //     Lokasi lokasi3 = new Lokasi();
            //     lokasi3.setAlamatLengkap("Jl. Sudirman No. 25, Surabaya");
            //     lokasi3.setGarisLintang(-7.2506);
            //     lokasi3.setGarisBujur(112.7508);
            //     lokasi3.setTipeLokasi(Lokasi.TipeLokasi.penerima);
            //     lokasi3 = lokasiRepo.save(lokasi3);

            //     PermintaanDonasi p3 = new PermintaanDonasi();
            //     p3.setJenisBarang("Makanan Pokok & Susu");
            //     p3.setJumlah(100);
            //     p3.setDeskripsiKebutuhan("URGENT! Anak-anak kami membutuhkan makanan pokok dan susu untuk kebutuhan sebulan ke depan. Mohon bantuan segera.");
            //     p3.setPenerima(penerima);
            //     p3.setLokasi(lokasi3);
            //     p3.setStatus("Urgent");
            //     p3.setCreatedAt(java.time.LocalDateTime.now());
            //     permintaanRepo.save(p3);

            //     System.out.println("=== SAMPLE PERMINTAAN DATA CREATED ===");
            //     System.out.println("3 dummy permintaan telah dibuat");
            //     System.out.println("======================================");
            // }
        };
    }
}