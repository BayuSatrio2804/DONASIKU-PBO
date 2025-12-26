package Donasiku.spring.core.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatDTO {
    private ChatPeerDTO peer;
    private MessageDTO last_message;
}
