package Donasiku.spring.core.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Donasiku.spring.core.entity.Chat;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Integer> {
    Optional<Chat> findByDonatur_UserIdAndPenerima_UserId(Integer donaturId, Integer penerimaId);

    java.util.List<Chat> findByDonatur_UserIdOrPenerima_UserId(Integer donaturId, Integer penerimaId);
}