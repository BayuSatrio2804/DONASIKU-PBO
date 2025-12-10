package Donasiku.spring.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Donasiku.spring.core.entity.Donatur;

@Repository
public interface DonaturRepository extends JpaRepository<Donatur, Integer> {
}