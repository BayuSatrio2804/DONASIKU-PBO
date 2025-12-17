package Donasiku.spring.core.seeder;

import Donasiku.spring.core.entity.Lokasi;
import Donasiku.spring.core.entity.StatusDonasi;
import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.repository.LokasiRepository;
import Donasiku.spring.core.repository.StatusDonasiRepository;
import Donasiku.spring.core.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LokasiRepository lokasiRepository;

    @Autowired
    private StatusDonasiRepository statusDonasiRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("Starting Data Seeding...");

            if (userRepository.count() == 0) {
                User user = new User();
                // user.setUserId(1); // Let DB generate ID
                user.setEmail("user@example.com");
                user.setPassword("password");
                user.setRole(User.UserRole.donatur);
                user.setUsername("TestUser");
                user.setNama("Test Nama");
                user.setAlamat("Jl. Test No. 1");
                user.setNoTelepon("08123456789");
                user.setStatus(User.UserStatus.active);
                User savedUser = userRepository.save(user);
                System.out.println("Seeded Default User with ID: " + savedUser.getUserId());
            }

            if (lokasiRepository.count() == 0) {
                Lokasi lokasi = new Lokasi();
                // lokasi.setLokasiId(1); // Let DB generate ID
                lokasi.setGarisLintang(-6.2088);
                lokasi.setGarisBujur(106.8456);
                lokasi.setAlamatLengkap("Jakarta Pusat");
                lokasi.setTipeLokasi(Lokasi.TipeLokasi.lainnya);
                Lokasi savedLokasi = lokasiRepository.save(lokasi);
                System.out.println("Seeded Default Lokasi with ID: " + savedLokasi.getLokasiId());
            }

            if (statusDonasiRepository.count() == 0) {
                List<String> statuses = Arrays.asList("Available", "Pending", "Dikirim", "Diterima");
                for (String statusName : statuses) {
                    StatusDonasi status = new StatusDonasi();
                    status.setStatus(statusName);
                    status.setStatusVerifikasi(true); // Default verified for simplicity
                    statusDonasiRepository.save(status);
                }
                System.out.println("Seeded Default Statuses");
            }
            
            System.out.println("Data Seeding Completed Successfully.");
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR IN DATA SEEDING:");
            e.printStackTrace();
        }
    }
}
