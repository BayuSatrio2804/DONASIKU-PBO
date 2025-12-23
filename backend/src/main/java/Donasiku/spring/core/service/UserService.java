package Donasiku.spring.core.service;

import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.entity.Donasi;
import Donasiku.spring.core.repository.UserRepository;
import Donasiku.spring.core.repository.DonasiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private DonasiRepository donasiRepository;

    @Transactional
    public void editProfil(Integer userId, User updatedData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        if (updatedData.getNama() != null)
            user.setNama(updatedData.getNama());
        if (updatedData.getAlamat() != null)
            user.setAlamat(updatedData.getAlamat());
        if (updatedData.getNoTelepon() != null)
            user.setNoTelepon(updatedData.getNoTelepon());
        if (updatedData.getFotoProfil() != null)
            user.setFotoProfil(updatedData.getFotoProfil());

        // Handle Password Change if needed
        if (updatedData.getPassword() != null && !updatedData.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(updatedData.getPassword()));
        }

        userRepository.save(user);
    }

    public User getProfil(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
    }

    // --- Class Diagram: lihatRiwayat() ---
    public List<Donasi> getRiwayatDonasi(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        // Return donations where user is penerima (received items)
        return donasiRepository.findAll().stream()
                .filter(d -> d.getPenerima() != null &&
                        d.getPenerima().getUserId().equals(userId))
                .collect(Collectors.toList());
    }
}
