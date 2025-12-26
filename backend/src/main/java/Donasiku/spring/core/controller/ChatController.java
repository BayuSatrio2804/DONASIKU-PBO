package Donasiku.spring.core.controller;

import Donasiku.spring.core.dto.*;
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
            return ResponseEntity.ok(WebResponse.builder().success(true).message("Pesan berhasil dikirim.").build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(WebResponse.builder().success(false).message(e.getMessage()).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(
                    WebResponse.builder().success(false).message("Gagal mengirim pesan - " + e.getMessage()).build());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(WebResponse.builder().success(false).message("Terjadi kesalahan sistem").build());
        }
    }

    // Hapus Pesan
    @DeleteMapping("/message/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable("messageId") Integer messageId) {
        try {
            chatService.deleteMessage(messageId);
            return ResponseEntity.ok(WebResponse.builder().success(true).message("Pesan berhasil dihapus").build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(WebResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    // Lihat Riwayat Chat dengan Error Handling
    @GetMapping("/{peerId}/history")
    public ResponseEntity<?> getChatHistory(
            @PathVariable("peerId") Integer peerId,
            @RequestParam("currentUserId") Integer currentUserId) {
        try {
            if (peerId == null || peerId <= 0) {
                return ResponseEntity.badRequest()
                        .body(WebResponse.builder().success(false).message("Error: Peer ID tidak valid").build());
            }

            List<MessageDTO> history = chatService.lihatRiwayatByPeers(currentUserId, peerId);

            return ResponseEntity.ok(WebResponse.<List<MessageDTO>>builder()
                    .success(true)
                    .data(history)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(WebResponse.builder().success(false).message(e.getMessage()).build());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(WebResponse.builder().success(false).message("Gagal mengambil riwayat chat").build());
        }
    }

    // List Chat Room dengan Error Handling
    @GetMapping("/list/{userId}")
    public ResponseEntity<?> getUserChats(@PathVariable("userId") Integer userId) {
        try {
            if (userId == null || userId <= 0) {
                return ResponseEntity.badRequest()
                        .body(WebResponse.builder().success(false).message("Error: User ID tidak valid").build());
            }

            List<ChatDTO> chats = chatService.getChatListByUser(userId);

            return ResponseEntity.ok(WebResponse.<List<ChatDTO>>builder()
                    .success(true)
                    .data(chats)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(WebResponse.builder().success(false).message(e.getMessage()).build());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(WebResponse.builder().success(false).message("Gagal mengambil daftar chat").build());
        }
    }
}
