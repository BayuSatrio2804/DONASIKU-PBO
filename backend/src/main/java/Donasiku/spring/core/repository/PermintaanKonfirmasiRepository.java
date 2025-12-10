package Donasiku.spring.core.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Donasiku.spring.core.entity.PermintaanKonfirmasi;

@Repository
public interface PermintaanKonfirmasiRepository extends JpaRepository<PermintaanKonfirmasi, Integer> {
    List<PermintaanKonfirmasi> findByPermintaan_PermintaanId(Integer permintaanId);
    List<PermintaanKonfirmasi> findByDonatur_UserId(Integer donaturId);
}
