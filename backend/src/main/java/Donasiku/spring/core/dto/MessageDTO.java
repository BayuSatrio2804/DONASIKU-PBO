package Donasiku.spring.core.dto;


import java.time.LocalDateTime;

public class MessageDTO {
    private Integer id;
    private Integer sender_id;
    private String message;
    private LocalDateTime created_at;

    public MessageDTO() {
    }

    public MessageDTO(Integer id, Integer sender_id, String message, LocalDateTime created_at) {
        this.id = id;
        this.sender_id = sender_id;
        this.message = message;
        this.created_at = created_at;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getSender_id() {
        return sender_id;
    }

    public void setSender_id(Integer sender_id) {
        this.sender_id = sender_id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Integer id;
        private Integer sender_id;
        private String message;
        private LocalDateTime created_at;

        public Builder id(Integer id) {
            this.id = id;
            return this;
        }

        public Builder sender_id(Integer sender_id) {
            this.sender_id = sender_id;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder created_at(LocalDateTime created_at) {
            this.created_at = created_at;
            return this;
        }

        public MessageDTO build() {
            return new MessageDTO(id, sender_id, message, created_at);
        }
    }
}
