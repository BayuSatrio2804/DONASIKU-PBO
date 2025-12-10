package Donasiku.spring.core.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Donasiku.spring.core.entity.PermintaanDonasi;
import Donasiku.spring.core.entity.PermintaanKonfirmasi;
import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.repository.PermintaanDonasiRepository;
import Donasiku.spring.core.repository.PermintaanKonfirmasiRepository;
import Donasiku.spring.core.repository.UserRepository;

@Service
public class PermintaanService {

    private final PermintaanDonasiRepository permintaanRepo;
    private final PermintaanKonfirmasiRepository konfirmasiRepo;
    private final UserRepository userRepo;

    @Autowired
    public PermintaanService(PermintaanDonasiRepository permintaanRepo,
                             PermintaanKonfirmasiRepository konfirmasiRepo,
                             UserRepository userRepo) {
        this.permintaanRepo = permintaanRepo;
        this.konfirmasiRepo = konfirmasiRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public PermintaanDonasi createPermintaan(PermintaanDonasi p) {
        p.setStatus("open");
        p.setCreatedAt(LocalDateTime.now());
        return permintaanRepo.save(p);
    }

    public List<PermintaanDonasi> listAll() {
        return permintaanRepo.findAll();
    }

    public Optional<PermintaanDonasi> findById(Integer id) {
        return permintaanRepo.findById(id);
    }

    @Transactional
    public PermintaanKonfirmasi offerToFulfill(Integer permintaanId, Integer donaturId) {
        PermintaanDonasi permintaan = permintaanRepo.findById(permintaanId)
                .orElseThrow(() -> new RuntimeException("Permintaan tidak ditemukan"));
        User donatur = userRepo.findById(donaturId).orElseThrow(() -> new RuntimeException("Donatur tidak ditemukan"));

        PermintaanKonfirmasi k = new PermintaanKonfirmasi();
        k.setPermintaan(permintaan);
        k.setDonatur(donatur);
        k.setStatus("offered");
        k.setCreatedAt(LocalDateTime.now());
        return konfirmasiRepo.save(k);
    }

    @Transactional
    public PermintaanKonfirmasi confirmOffer(Integer permintaanId, Integer konfirmasiId, Integer penerimaId) {
        PermintaanDonasi permintaan = permintaanRepo.findById(permintaanId)
                .orElseThrow(() -> new RuntimeException("Permintaan tidak ditemukan"));

        // pastikan penerima adalah pemilik permintaan
        if (permintaan.getPenerima() == null || !permintaan.getPenerima().getUserId().equals(penerimaId)) {
            throw new RuntimeException("Hanya penerima yang membuat permintaan ini yang dapat mengkonfirmasi.");
        }

        PermintaanKonfirmasi chosen = konfirmasiRepo.findById(konfirmasiId)
                .orElseThrow(() -> new RuntimeException("Konfirmasi tidak ditemukan"));

        if (!chosen.getPermintaan().getPermintaanId().equals(permintaanId)) {
            throw new RuntimeException("Konfirmasi tidak cocok dengan permintaan.");
        }

        // Set chosen as confirmed
        chosen.setStatus("confirmed");
        chosen.setUpdatedAt(LocalDateTime.now());
        konfirmasiRepo.save(chosen);

        // mark other offers as rejected
        konfirmasiRepo.findByPermintaan_PermintaanId(permintaanId).stream()
                .filter(c -> !c.getKonfirmasiId().equals(chosen.getKonfirmasiId()))
                .forEach(c -> {
                    c.setStatus("rejected");
                    c.setUpdatedAt(LocalDateTime.now());
                    konfirmasiRepo.save(c);
                });

        // update permintaan status
        permintaan.setStatus("fulfilled");
        permintaanRepo.save(permintaan);

        return chosen;
    }
}
