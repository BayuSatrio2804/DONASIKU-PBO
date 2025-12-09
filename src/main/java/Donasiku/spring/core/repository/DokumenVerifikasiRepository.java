package Donasiku.spring.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Donasiku.spring.core.entity.DokumenVerifikasi;

@Repository
public interface DokumenVerifikasiRepository extends JpaRepository<DokumenVerifikasi, Integer> {
}