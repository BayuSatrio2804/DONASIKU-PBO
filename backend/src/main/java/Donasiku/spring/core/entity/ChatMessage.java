package Donasiku.spring.core.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "Chat_Message")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_message_id")
    private Integer chatMessageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_user_id", nullable = false)
    private User sender;

    @Column(name = "message", columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "sent_at", updatable = false)
    private LocalDateTime sentAt;

    @Column(name = "is_read")
    private Boolean isRead;

    public ChatMessage() {
    }

    public ChatMessage(Integer chatMessageId, Chat chat, User sender, String message, LocalDateTime sentAt, Boolean isRead) {
        this.chatMessageId = chatMessageId;
        this.chat = chat;
        this.sender = sender;
        this.message = message;
        this.sentAt = sentAt;
        this.isRead = isRead;
    }

    public Integer getChatMessageId() {
        return chatMessageId;
    }

    public void setChatMessageId(Integer chatMessageId) {
        this.chatMessageId = chatMessageId;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "chatMessageId=" + chatMessageId +
                ", message='" + message + '\'' +
                ", sentAt=" + sentAt +
                ", isRead=" + isRead +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatMessage that = (ChatMessage) o;
        return java.util.Objects.equals(chatMessageId, that.chatMessageId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(chatMessageId);
    }
}