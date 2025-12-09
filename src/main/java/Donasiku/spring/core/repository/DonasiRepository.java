package Donasiku.spring.core.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Donasiku.spring.core.entity.Donasi;

@Repository
public interface DonasiRepository extends JpaRepository<Donasi, Integer> {
    List<Donasi> findByDonatur_UserId(Integer donaturId);
    List<Donasi> findByPenerima_UserId(Integer penerimaId);
}