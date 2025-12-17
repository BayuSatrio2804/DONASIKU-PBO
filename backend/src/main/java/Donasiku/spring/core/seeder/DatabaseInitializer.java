package Donasiku.spring.core.seeder;

import Donasiku.spring.core.entity.Lokasi;
import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.repository.LokasiRepository;
import Donasiku.spring.core.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LokasiRepository lokasiRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("Starting Data Seeding...");

            if (userRepository.count() == 0) {
                User user = new User();
                user.setUserId(1);
                user.setEmail("user@example.com");
                user.setPassword("password");
                user.setRole(User.UserRole.donatur);
                user.setUsername("TestUser");
                user.setNama("Test Nama");
                user.setAlamat("Jl. Test No. 1");
                user.setNoTelepon("08123456789");
                user.setStatus(User.UserStatus.active);
                userRepository.save(user);
                System.out.println("Seeded Default User");
            }

            if (lokasiRepository.count() == 0) {
                Lokasi lokasi = new Lokasi();
                lokasi.setLokasiId(1);
                lokasi.setGarisLintang(-6.2088);
                lokasi.setGarisBujur(106.8456);
                lokasi.setAlamatLengkap("Jakarta Pusat");
                lokasi.setTipeLokasi(Lokasi.TipeLokasi.lainnya);
                lokasiRepository.save(lokasi);
                System.out.println("Seeded Default Lokasi");
            }
            
            System.out.println("Data Seeding Completed.");
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR IN DATA SEEDING:");
            e.printStackTrace();
            // Do not rethrow, so app stays running even if seed fails (but we should know why)
        }
    }
}
