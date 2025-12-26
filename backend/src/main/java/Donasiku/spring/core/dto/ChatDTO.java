package Donasiku.spring.core.dto;



public class ChatDTO {
    private ChatPeerDTO peer;
    private MessageDTO last_message;

    public ChatDTO() {
    }

    public ChatDTO(ChatPeerDTO peer, MessageDTO last_message) {
        this.peer = peer;
        this.last_message = last_message;
    }

    public ChatPeerDTO getPeer() {
        return peer;
    }

    public void setPeer(ChatPeerDTO peer) {
        this.peer = peer;
    }

    public MessageDTO getLast_message() {
        return last_message;
    }

    public void setLast_message(MessageDTO last_message) {
        this.last_message = last_message;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private ChatPeerDTO peer;
        private MessageDTO last_message;

        public Builder peer(ChatPeerDTO peer) {
            this.peer = peer;
            return this;
        }

        public Builder last_message(MessageDTO last_message) {
            this.last_message = last_message;
            return this;
        }

        public ChatDTO build() {
            return new ChatDTO(peer, last_message);
        }
    }
}
