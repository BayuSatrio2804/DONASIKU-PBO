# 📄 Laporan Teknis Pengembangan Sistem Donasiku

**Branch:** `nauval-v1`  
**Developer:** Nauval  
**Tanggal:** 26 Desember 2025

---

## 1. Spesifikasi Fungsional & Logika Bisnis
Fitur utama yang dikembangkan adalah **Siklus Hidup Donasi (Donation Lifecycle)** dengan fokus pada fleksibilitas pemenuhan kebutuhan.

### 🧩 Fitur Unggulan: Partial Fulfillment (Donasi Sebagian)
Secara tradisional, sistem donasi bersifat "All-or-Nothing". Fitur ini memungkinkan donasi bersifat cair.
*   **Masalah:** Penerima butuh 10kg beras, Donatur A hanya punya 4kg. Jika Donatur A memberi, permintaan tersisa 6kg seringkali hilang atau tertutup otomatis.
*   **Solusi Algoritmik:**
    1.  Sistem menerima input jumlah donasi.
    2.  Jika `Input < Target`, sistem memicu logic **Split Object**.
    3.  Terbentuk dua entitas:
        *   **Entitas A (Parent):** Tetap hidup dengan sisa target (6kg). Status: *Pending*.
        *   **Entitas B (Child):** Terbentuk baru dengan jumlah donasi (4kg). Status: *Approved*.
*   **Dampak:** Fleksibilitas maksimal bagi donatur dan kepastian bagi penerima.

---

## 2. Implementasi CRUD & State Management
Pengelolaan data dilakukan dengan pendekatan yang menjaga integritas referensi (Referential Integrity).

### 📝 Read & Update
*   **Mekanisme:** Menggunakan `PermintaanService` untuk memanipulasi atribut objek.
*   **Validasi:** Setiap operasi Update diverifikasi terhadap Status saat ini. Permintaan yang sudah *Approved* dikunci (Locked) dari perubahan untuk mencegah inkonsistensi data transaksi.

### 🗑️ Soft Delete (Pembatalan Aman)
*   **Konsep:** Menghapus data secara fisik (`DELETE FROM...`) sangat berbahaya dalam sistem yang mencatat riwayat kebaikan.
*   **Implementasi:** Kami menggunakan teknik **Soft Delete**.
*   **Teknis:** Method `cancelPermintaan` tidak memanggil fungsi delete repository, melainkan mengubah atribut `status` menjadi `'Cancelled'`. Data tetap ada untuk audit log, namun tidak muncul di feed aktif.

---

## 3. Penerapan OOP: Inheritance (Pewarisan)
Pewarisan digunakan untuk efisiensi kode dan standarisasi akses data.

### 🧬 Repository Pattern
*   **Implementasi:** Interface `PermintaanDonasiRepository` mewarisi (`extends`) `JpaRepository`.
*   **Keuntungan Teknis:**
    *   Kami tidak perlu menulis manual query SQL dasar (`INSERT`, `UPDATE`, `SELECT`).
    *   Mewarisi kemampuan Pagination dan Sorting otomatis dari *Spring Data Commons*.
    *   Menciptakan standarisasi naming convention (contoh: `findByStatus(...)` otomatis diterjemahkan menjadi query SQL yang valid).

---

## 4. Keamanan Akses (Role Access & Encapsulation)
Keamanan data diterapkan menggunakan prinsip Enkapsulasi OOP.

### 🛡️ Role Validation
*   **Logic:** Service layer bertindak sebagai "Gatekeeper". Sebelum operasi tulis dilakukan, sistem memvalidasi kepemilikan.
*   **Code Flow:**
    `Request masuk -> Cek ID User di Session -> Bandingkan dengan ID Pemilik Data -> Jika beda, Lempar Exception.`
*   **Encapsulation:** Atribut kritis seperti `userId` atau `status` diset `private` dalam Entity dan hanya bisa dimutasi melalui method Service yang tervalidasi, bukan diakses langsung dari Controller.

---

## 5. Exception Handling (Manajemen Error)
Aplikasi dibangun agar *Fault Tolerant* dan memberikan feedback yang jelas.

### ⚠️ Runtime Exception
*   **Strategi:** Kami menggunakan `RuntimeException` untuk menangkap kesalahan logika bisnis (Logical Error), bukan hanya kesalahan teknis.
*   **Skenario:**
    *   *Input Negatif:* Donasi jumlah < 0.
    *   *Over-donation:* Donasi > Sisa Kebutuhan.
    *   *Invalid State Transition:* Mencoba mengirim barang yang statsunya belum disetujui.
*   **Output:** Exception ini ditangkap oleh Global Error Handler dan dikembalikan ke Frontend sebagai pesan error yang manusiawi (User Friendly).

---

## 6. Arsitektur MVC (Model-View-Controller)
Sistem ini memisahkan tanggung jawab (Separation of Concerns) secara tegas.

1.  **Model (Entity):**
    *   Class `PermintaanDonasi.java`. Merepresentasikan struktur tabel database. Tidak mengandung logic bisnis, hanya struktur data.
2.  **View (Frontend):**
    *   Aplikasi React.js. Hanya bertugas menampilkan data JSON. Tidak tahu menahu soal query database.
3.  **Controller (API Layer):**
    *   Class `PermintaanController.java`. Pintu gerbang HTTP. Menerima Request, memanggil Service, dan mengembalikan Response.
4.  **Service (Business Layer):**
    *   Class `PermintaanService.java`. "Otak" aplikasi. Semua logic CRUD, validasi, dan transaksi terjadi di sini.

---

## 7. Interface & Polymorphism
Sistem dirancang untuk *Loose Coupling* (ketergantungan rendah).

### 🎭 Interface Driven Development
*   **Implementasi:** Seluruh komunikasi ke database dilakukan melalui **Interface** (`PermintaanDonasiRepository`), bukan Class Konkret.
*   **Polimorfisme:**
    *   Spring Boot menyuntikkan (Dependency Injection) implementasi konkret (Proxy) saat runtime.
    *   Ini memungkinkan kita mengganti implementasi database di masa depan tanpa harus merombak kode logika di Service.

---
*Dokumen ini disusun sebagai dokumentasi teknis mendalam untuk pengembangan fitur branch `nauval-v1`.*
