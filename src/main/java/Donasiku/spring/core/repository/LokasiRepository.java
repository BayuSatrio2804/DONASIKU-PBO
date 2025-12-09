package Donasiku.spring.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Donasiku.spring.core.entity.Lokasi;

@Repository
public interface LokasiRepository extends JpaRepository<Lokasi, Integer> {
}