package Donasiku.spring.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "Status_Donasi")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class StatusDonasi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "status_id")
    private Integer statusId;

    @Column(name = "status", length = 99, nullable = false)
    private String status;

    @Column(name = "status_verifikasi")
    private Boolean statusVerifikasi;

    public StatusDonasi() {
    }

    public StatusDonasi(Integer statusId, String status, Boolean statusVerifikasi) {
        this.statusId = statusId;
        this.status = status;
        this.statusVerifikasi = statusVerifikasi;
    }

    public Integer getStatusId() {
        return statusId;
    }

    public void setStatusId(Integer statusId) {
        this.statusId = statusId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getStatusVerifikasi() {
        return statusVerifikasi;
    }

    public void setStatusVerifikasi(Boolean statusVerifikasi) {
        this.statusVerifikasi = statusVerifikasi;
    }

    @Override
    public String toString() {
        return "StatusDonasi{" +
                "statusId=" + statusId +
                ", status='" + status + '\'' +
                ", statusVerifikasi=" + statusVerifikasi +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StatusDonasi that = (StatusDonasi) o;
        return java.util.Objects.equals(statusId, that.statusId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(statusId);
    }
}