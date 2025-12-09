package Donasiku.spring.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Status_Donasi")
@Data
@NoArgsConstructor
public class StatusDonasi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "status_id")
    private Integer statusId;

    @Column(name = "status", length = 99, nullable = false)
    private String status;

    @Column(name = "status_verifikasi")
    private Boolean statusVerifikasi;
}