package Donasiku.spring.core.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Penerima")
@Data
@NoArgsConstructor
public class Penerima {

    @Id 
    @Column(name = "user_id")
    private Integer userId; 

    @Column(name = "status_verifikasi")
    private Boolean statusVerifikasi;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToOne
    @MapsId 
    @JoinColumn(name = "user_id") 
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dokumen_verifikasi_id")
    private DokumenVerifikasi dokumenVerifikasi;
}