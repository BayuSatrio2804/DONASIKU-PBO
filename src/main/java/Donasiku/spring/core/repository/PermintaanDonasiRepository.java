package Donasiku.spring.core.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Donasiku.spring.core.entity.PermintaanDonasi;

@Repository
public interface PermintaanDonasiRepository extends JpaRepository<PermintaanDonasi, Integer> {
    List<PermintaanDonasi> findByPenerima_UserId(Integer penerimaId);
    List<PermintaanDonasi> findByStatus(String status);
}