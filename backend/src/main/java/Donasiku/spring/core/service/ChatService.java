package Donasiku.spring.core.service;

import Donasiku.spring.core.entity.Chat;
import Donasiku.spring.core.entity.ChatMessage;
import Donasiku.spring.core.entity.User;
import Donasiku.spring.core.repository.ChatMessageRepository;
import Donasiku.spring.core.repository.ChatRepository;
import Donasiku.spring.core.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;
    @Autowired
    private ChatMessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void kirimPesan(String pesan, Integer senderId, Integer receiverId) {
        // 1. Validasi User
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Pengirim tidak ditemukan"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Penerima tidak ditemukan"));

        // 2. Cari atau Buat Chat Room
        Chat chat = getOrCreateChat(sender, receiver);

        // 3. Simpan Pesan
        ChatMessage message = new ChatMessage();
        message.setChat(chat);
        message.setSender(sender);
        message.setMessage(pesan);
        message.setSentAt(LocalDateTime.now());
        message.setIsRead(false);

        messageRepository.save(message);
    }

    public List<ChatMessage> lihatRiwayat(Integer chatId) {
        return messageRepository.findByChat_ChatIdOrderBySentAtAsc(chatId);
    }

    public List<Chat> getChatListByUser(Integer userId) {
        return chatRepository.findByDonatur_UserIdOrPenerima_UserId(userId, userId);
    }

    @Transactional
    private Chat getOrCreateChat(User sender, User receiver) {
        // Tentukan siapa donatur siapa penerima (untuk konsistensi foreign key)
        // Jika keduanya sama role (e.g. admin-admin), urutkan by ID
        User donatur = null;
        User penerima = null;

        if (sender.getRole() == User.UserRole.donatur) {
            donatur = sender;
            penerima = receiver;
        } else if (receiver.getRole() == User.UserRole.donatur) {
            donatur = receiver;
            penerima = sender;
        } else {
            // Fallback logic
            if (sender.getUserId() < receiver.getUserId()) {
                donatur = sender;
                penerima = receiver;
            } else {
                donatur = receiver;
                penerima = sender;
            }
        }

        Integer dId = donatur.getUserId();
        Integer pId = penerima.getUserId();

        Optional<Chat> existingChat = chatRepository.findByDonatur_UserIdAndPenerima_UserId(dId, pId);

        if (existingChat.isPresent()) {
            return existingChat.get();
        } else {
            Chat newChat = new Chat();
            newChat.setDonatur(donatur);
            newChat.setPenerima(penerima);
            newChat.setStartedAt(LocalDateTime.now());
            return chatRepository.save(newChat);
        }
    }
}
