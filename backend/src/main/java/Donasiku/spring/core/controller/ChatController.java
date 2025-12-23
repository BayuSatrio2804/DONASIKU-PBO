package Donasiku.spring.core.controller;

import Donasiku.spring.core.entity.Chat;
import Donasiku.spring.core.entity.ChatMessage;
import Donasiku.spring.core.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    // Kirim Pesan dengan Error Handling
    @PostMapping("/send")
    public ResponseEntity<?> kirimPesan(
            @RequestParam("senderId") Integer senderId,
            @RequestParam("receiverId") Integer receiverId,
            @RequestParam("message") String message) {
        try {
            // Validasi input
            if (senderId == null || senderId <= 0) {
                return ResponseEntity.badRequest().body("Error: Sender ID tidak valid");
            }

            if (receiverId == null || receiverId <= 0) {
                return ResponseEntity.badRequest().body("Error: Receiver ID tidak valid");
            }

            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Pesan tidak boleh kosong");
            }

            if (message.length() > 1000) {
                return ResponseEntity.badRequest().body("Error: Pesan terlalu panjang (maksimal 1000 karakter)");
            }

            if (senderId.equals(receiverId)) {
                return ResponseEntity.badRequest().body("Error: Tidak bisa mengirim pesan ke diri sendiri");
            }

            chatService.kirimPesan(message.trim(), senderId, receiverId);
            return ResponseEntity.ok("Pesan berhasil dikirim.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body("Error: Gagal mengirim pesan - " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: Terjadi kesalahan sistem");
        }
    }

    // Lihat Riwayat Chat dengan Error Handling
    @GetMapping("/{chatId}/history")
    public ResponseEntity<?> getChatHistory(@PathVariable("chatId") Integer chatId) {
        try {
            if (chatId == null || chatId <= 0) {
                return ResponseEntity.badRequest().body("Error: Chat ID tidak valid");
            }

            List<ChatMessage> history = chatService.lihatRiwayat(chatId);

            if (history == null || history.isEmpty()) {
                return ResponseEntity.ok(List.of()); // Return empty list instead of error
            }

            return ResponseEntity.ok(history);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Error: Chat tidak ditemukan - " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: Gagal mengambil riwayat chat");
        }
    }

    // List Chat Room dengan Error Handling
    @GetMapping("/list/{userId}")
    public ResponseEntity<?> getUserChats(@PathVariable("userId") Integer userId) {
        try {
            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest().body("Error: User ID tidak valid");
            }

            List<Chat> chats = chatService.getChatListByUser(userId);

            if (chats == null) {
                return ResponseEntity.ok(List.of()); // Return empty list
            }

            return ResponseEntity.ok(chats);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Error: User tidak ditemukan - " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: Gagal mengambil daftar chat");
        }
    }
}
