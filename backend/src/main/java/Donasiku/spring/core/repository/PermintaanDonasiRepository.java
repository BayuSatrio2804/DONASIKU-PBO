package Donasiku.spring.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import Donasiku.spring.core.entity.PermintaanDonasi;

public interface PermintaanDonasiRepository extends JpaRepository<PermintaanDonasi, Integer> {
    // Bisa tambah method findByStatus(String status);
}