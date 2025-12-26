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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import Donasiku.spring.core.dto.*;

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

    @Transactional
    public void deleteMessage(Integer messageId) {
        if (!messageRepository.existsById(messageId)) {
            throw new RuntimeException("Pesan tidak ditemukan");
        }
        messageRepository.deleteById(messageId);
    }

    public List<MessageDTO> lihatRiwayat(Integer chatId) {
        return messageRepository.findByChat_ChatIdOrderBySentAtAsc(chatId)
                .stream()
                .map(this::mapToMessageDTO)
                .collect(Collectors.toList());
    }

    public List<MessageDTO> lihatRiwayatByPeers(Integer userId1, Integer userId2) {
        Optional<Chat> chat = chatRepository.findByDonatur_UserIdAndPenerima_UserId(userId1, userId2);
        if (chat.isEmpty()) {
            chat = chatRepository.findByDonatur_UserIdAndPenerima_UserId(userId2, userId1);
        }

        if (chat.isEmpty())
            return new ArrayList<>();

        return lihatRiwayat(chat.get().getChatId());
    }

    public List<ChatDTO> getChatListByUser(Integer userId) {
        List<Chat> chats = chatRepository.findByDonatur_UserIdOrPenerima_UserId(userId, userId);
        return chats.stream()
                .map(c -> mapToChatDTO(c, userId))
                .collect(Collectors.toList());
    }

    private ChatDTO mapToChatDTO(Chat chat, Integer currentUserId) {
        User peer = chat.getDonatur().getUserId().equals(currentUserId) ? chat.getPenerima() : chat.getDonatur();

        Optional<ChatMessage> lastMsg = messageRepository.findFirstByChat_ChatIdOrderBySentAtDesc(chat.getChatId());

        return ChatDTO.builder()
                .peer(ChatPeerDTO.builder()
                        .id(peer.getUserId())
                        .name(peer.getNama())
                        .photo(peer.getFotoProfil())
                        .build())
                .last_message(lastMsg.map(this::mapToMessageDTO).orElse(null))
                .build();
    }

    private MessageDTO mapToMessageDTO(ChatMessage m) {
        return MessageDTO.builder()
                .id(m.getChatMessageId())
                .sender_id(m.getSender().getUserId())
                .message(m.getMessage())
                .created_at(m.getSentAt())
                .build();
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
