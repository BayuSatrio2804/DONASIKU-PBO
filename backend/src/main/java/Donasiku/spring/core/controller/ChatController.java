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

    // Kirim Pesan
    @PostMapping("/send")
    public ResponseEntity<?> kirimPesan(
            @RequestParam("senderId") Integer senderId,
            @RequestParam("receiverId") Integer receiverId,
            @RequestParam("message") String message) {
        try {
            chatService.kirimPesan(message, senderId, receiverId);
            return ResponseEntity.ok("Pesan berhasil dikirim.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Lihat Riwayat Chat (List Pesan)
    @GetMapping("/{chatId}/history")
    public ResponseEntity<?> getChatHistory(@PathVariable("chatId") Integer chatId) {
        try {
            List<ChatMessage> history = chatService.lihatRiwayat(chatId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // List Chat Room user tertentu (Inbox)
    @GetMapping("/list/{userId}")
    public ResponseEntity<?> getUserChats(@PathVariable("userId") Integer userId) {
        try {
            List<Chat> chats = chatService.getChatListByUser(userId);
            return ResponseEntity.ok(chats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
