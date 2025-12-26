package Donasiku.spring.core.constants;

/**
 * Application-wide constants for Donasiku Backend
 * Contains validation limits, error messages, and status values
 */
public class AppConstants {

    // === Validation Constants ===
    public static final int USERNAME_MIN_LENGTH = 3;
    public static final int USERNAME_MAX_LENGTH = 50;
    public static final int PHONE_MIN_DIGITS = 10;
    public static final int ADDRESS_MAX_LENGTH = 500;
    public static final int MESSAGE_MAX_LENGTH = 1000;
    public static final int DESCRIPTION_MAX_LENGTH = 1000;
    public static final int KATEGORI_MAX_LENGTH = 100;

    // === Status Values ===
    public static final String STATUS_TERSEDIA = "Tersedia";
    public static final String STATUS_PENDING = "Pending";
    public static final String STATUS_DIKIRIM = "Dikirim";
    public static final String STATUS_DITERIMA = "Diterima";
    public static final String STATUS_OPEN = "Open";
    public static final String STATUS_URGENT = "Urgent";

    // === Error Messages - Validation ===
    public static final String ERROR_INVALID_ID = "Error: ID tidak valid";
    public static final String ERROR_INVALID_USER_ID = "Error: User ID tidak valid";
    public static final String ERROR_INVALID_DONASI_ID = "Error: Donasi ID tidak valid";
    public static final String ERROR_INVALID_CHAT_ID = "Error: Chat ID tidak valid";
    public static final String ERROR_INVALID_REQUEST_ID = "Error: Permintaan ID tidak valid";

    public static final String ERROR_EMPTY_USERNAME = "Error: Username tidak boleh kosong";
    public static final String ERROR_USERNAME_TOO_SHORT = "Error: Username minimal " + USERNAME_MIN_LENGTH
            + " karakter";
    public static final String ERROR_USERNAME_TOO_LONG = "Error: Username maksimal " + USERNAME_MAX_LENGTH
            + " karakter";

    public static final String ERROR_EMPTY_MESSAGE = "Error: Pesan tidak boleh kosong";
    public static final String ERROR_MESSAGE_TOO_LONG = "Error: Pesan maksimal " + MESSAGE_MAX_LENGTH + " karakter";
    public static final String ERROR_SELF_MESSAGE = "Error: Tidak bisa mengirim pesan ke diri sendiri";

    public static final String ERROR_PHONE_TOO_SHORT = "Error: Nomor telepon minimal " + PHONE_MIN_DIGITS + " digit";
    public static final String ERROR_PHONE_INVALID_FORMAT = "Error: Format nomor telepon tidak valid";

    public static final String ERROR_ADDRESS_TOO_LONG = "Error: Alamat maksimal " + ADDRESS_MAX_LENGTH + " karakter";

    public static final String ERROR_DESCRIPTION_EMPTY = "Error: Deskripsi tidak boleh kosong";
    public static final String ERROR_DESCRIPTION_TOO_LONG = "Error: Deskripsi maksimal " + DESCRIPTION_MAX_LENGTH
            + " karakter";

    public static final String ERROR_KATEGORI_EMPTY = "Error: Kategori tidak boleh kosong";
    public static final String ERROR_KATEGORI_TOO_LONG = "Error: Kategori maksimal " + KATEGORI_MAX_LENGTH
            + " karakter";

    public static final String ERROR_QUANTITY_INVALID = "Error: Jumlah harus lebih dari 0";

    // === Error Messages - Authorization ===
    public static final String ERROR_NO_ACCESS_DELETE = "Error: Anda tidak memiliki akses untuk menghapus donasi ini";
    public static final String ERROR_NO_ACCESS_EDIT = "Error: Anda tidak memiliki akses untuk mengedit donasi ini";
    public static final String ERROR_NO_ACCESS_CANCEL = "Error: Anda tidak memiliki akses untuk membatalkan permintaan ini";

    // === Error Messages - Not Found ===
    public static final String ERROR_USER_NOT_FOUND = "Error: User tidak ditemukan";
    public static final String ERROR_DONASI_NOT_FOUND = "Error: Donasi tidak ditemukan";
    public static final String ERROR_REQUEST_NOT_FOUND = "Error: Permintaan tidak ditemukan";
    public static final String ERROR_CHAT_NOT_FOUND = "Error: Chat tidak ditemukan";

    // === Error Messages - Server ===
    public static final String ERROR_SERVER_CHAT_SEND = "Error: Gagal mengirim pesan";
    public static final String ERROR_SERVER_CHAT_HISTORY = "Error: Gagal memuat riwayat chat";
    public static final String ERROR_SERVER_PROFILE_GET = "Error: Gagal mengambil data profil";
    public static final String ERROR_SERVER_PROFILE_UPDATE = "Error: Gagal memperbarui profil";
    public static final String ERROR_SERVER_DONASI_DELETE = "Error: Gagal menghapus donasi";
    public static final String ERROR_SERVER_DONASI_UPDATE = "Error: Gagal memperbarui donasi";
    public static final String ERROR_SERVER_REQUEST_CANCEL = "Error: Gagal membatalkan permintaan";
    public static final String ERROR_SERVER_HISTORY = "Error: Gagal mengambil riwayat donasi";

    // === Success Messages ===
    public static final String SUCCESS_PROFILE_UPDATED = "Profil berhasil diperbarui.";
    public static final String SUCCESS_DONASI_DELETED = "Donasi berhasil dihapus.";
    public static final String SUCCESS_DONASI_UPDATED = "Donasi berhasil diperbarui.";
    public static final String SUCCESS_REQUEST_CANCELLED = "Permintaan berhasil dibatalkan.";

    private AppConstants() {
        // Private constructor to prevent instantiation
    }
}
