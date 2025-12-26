package Donasiku.spring.core.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import Donasiku.spring.core.entity.Lokasi;
import java.util.List;
import java.util.Optional;

public interface LokasiRepository extends JpaRepository<Lokasi, Integer> {
    // Changed to findFirst to handle duplicate addresses (returns first match)
    Optional<Lokasi> findFirstByAlamatLengkap(String alamatLengkap);

    // FR-05: Search by address (partial match, case-insensitive)
    List<Lokasi> findByAlamatLengkapContainingIgnoreCase(String alamat);
}
