package Donasiku.spring.core.repository; // Sesuaikan package

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import Donasiku.spring.core.entity.Donasi;
import java.util.List;

@Repository
public interface DonasiRepository extends JpaRepository<Donasi, Integer> {
    // Untuk melihat donasi milik user tertentu (History)
    List<Donasi> findByDonatur_UserId(Integer userId);
    
    // Untuk melihat donasi yang diterima user tertentu
    List<Donasi> findByPenerima_UserId(Integer userId);
}