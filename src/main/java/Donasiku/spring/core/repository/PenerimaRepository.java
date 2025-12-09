package Donasiku.spring.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Donasiku.spring.core.entity.Penerima;

@Repository
public interface PenerimaRepository extends JpaRepository<Penerima, Integer> {
}