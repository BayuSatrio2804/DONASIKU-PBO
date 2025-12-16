package Donasiku.spring.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import Donasiku.spring.core.entity.StatusDonasi;
import java.util.Optional;

@Repository
public interface StatusDonasiRepository extends JpaRepository<StatusDonasi, Integer> {
    // Mencari status berdasarkan nama (misal: "Pending", "Dikirim", "Diterima")
    Optional<StatusDonasi> findByStatus(String status);
}