package Donasiku.spring.core.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Donasiku.spring.core.entity.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {

    // Find Admin by User ID
    Optional<Admin> findByUserId(Integer userId);

    // Check if Admin exists for a User
    boolean existsByUserId(Integer userId);
}
