package Donasiku.spring.core.dto;



public class StatusUpdateRequest {
    private String statusBaru; // Contoh: "Dikirim", "Diterima"
    private Integer userId;    // Siapa yang mengubah (untuk validasi keamanan)

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(String statusBaru, Integer userId) {
        this.statusBaru = statusBaru;
        this.userId = userId;
    }

    public String getStatusBaru() {
        return statusBaru;
    }

    public void setStatusBaru(String statusBaru) {
        this.statusBaru = statusBaru;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}