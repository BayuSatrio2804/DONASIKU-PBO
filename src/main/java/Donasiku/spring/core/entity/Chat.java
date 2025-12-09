package Donasiku.spring.core.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Chat", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"donatur_user_id", "penerima_user_id"})
})
@Data
@NoArgsConstructor
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
    
    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> messages;
}