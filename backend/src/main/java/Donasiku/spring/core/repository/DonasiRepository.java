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

    // FR-06: Filter by kategori
    List<Donasi> findByKategoriContainingIgnoreCase(String kategori);

    // FR-06: Filter by kategori and status available (penerima is null)
    List<Donasi> findByKategoriContainingIgnoreCaseAndPenerimaIsNull(String kategori);

    // FR-06: Get all available donations (penerima is null)
    List<Donasi> findByPenerimaIsNull();
}