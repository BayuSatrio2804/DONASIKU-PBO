package Donasiku.spring.core.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Chat", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "donatur_user_id", "penerima_user_id" })
})
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Integer chatId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donatur_user_id", nullable = false)
    private User donatur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "penerima_user_id", nullable = false)
    private User penerima;

    @Column(name = "started_at", updatable = false)
    private LocalDateTime startedAt;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> messages;

    public Chat() {
    }

    public Chat(Integer chatId, User donatur, User penerima, LocalDateTime startedAt, List<ChatMessage> messages) {
        this.chatId = chatId;
        this.donatur = donatur;
        this.penerima = penerima;
        this.startedAt = startedAt;
        this.messages = messages;
    }

    public Integer getChatId() {
        return chatId;
    }

    public void setChatId(Integer chatId) {
        this.chatId = chatId;
    }

    public User getDonatur() {
        return donatur;
    }

    public void setDonatur(User donatur) {
        this.donatur = donatur;
    }

    public User getPenerima() {
        return penerima;
    }

    public void setPenerima(User penerima) {
        this.penerima = penerima;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public List<ChatMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }

    @Override
    public String toString() {
        return "Chat{" +
                "chatId=" + chatId +
                ", startedAt=" + startedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Chat chat = (Chat) o;
        return java.util.Objects.equals(chatId, chat.chatId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(chatId);
    }
}