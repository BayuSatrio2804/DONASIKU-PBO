package Donasiku.spring.core.dto;



public class ChatPeerDTO {
    private Integer id;
    private String name;
    private String photo;

    public ChatPeerDTO() {
    }

    public ChatPeerDTO(Integer id, String name, String photo) {
        this.id = id;
        this.name = name;
        this.photo = photo;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Integer id;
        private String name;
        private String photo;

        public Builder id(Integer id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder photo(String photo) {
            this.photo = photo;
            return this;
        }

        public ChatPeerDTO build() {
            return new ChatPeerDTO(id, name, photo);
        }
    }
}
