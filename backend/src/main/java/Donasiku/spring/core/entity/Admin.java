package Donasiku.spring.core.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Admin")
@Data
@NoArgsConstructor
public class Admin {

    @Id
    @Column(name = "user_id")
    private Integer userId; // PK-as-FK ke Users.user_id

    @Column(name = "note", length = 99)
    private String note; // Catatan admin / hak khusus

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Relasi One-to-One dengan Users
    @OneToOne
    @MapsId // Menggunakan userId sebagai Primary Key dan Foreign Key ke Users
    @JoinColumn(name = "user_id") // Nama kolom FK di tabel Admin
    private User user;
}
