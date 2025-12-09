package Donasiku.spring.core.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Donasiku.spring.core.entity.StatusDonasi;

@Repository
public interface StatusDonasiRepository extends JpaRepository<StatusDonasi, Integer> {
    Optional<StatusDonasi> findByStatus(String statusName);
}