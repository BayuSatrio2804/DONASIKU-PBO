package Donasiku.spring.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import Donasiku.spring.core.entity.Lokasi;
import java.util.Optional;

public interface LokasiRepository extends JpaRepository<Lokasi, Integer> {
    Optional<Lokasi> findByAlamatLengkap(String alamatLengkap);
}