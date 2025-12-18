package Donasiku.spring.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import Donasiku.spring.core.entity.PermintaanDonasi;
import java.util.List;

public interface PermintaanDonasiRepository extends JpaRepository<PermintaanDonasi, Integer> {
    List<PermintaanDonasi> findByPenerima_UserId(Integer userId);
}