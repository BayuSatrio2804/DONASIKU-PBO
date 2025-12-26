# 📄 Laporan Pengembangan Sistem Donasiku (Branch: `nauval-v1`)

**Pengembang:** Nauval  
**Tanggal Update:** 26 Desember 2025  
**Status Branch:** `nauval-v1` (Active & Tested)

---

## 🌟 Ringkasan Eksekutif
Dokumen ini merangkum implementasi fitur-fitur kunci dalam sistem **Donasiku**, khususnya yang berkaitan dengan manajemen donasi, permintaan bantuan, dan alur pemenuhan kebutuhan (fulfillment) antara Donatur dan Penerima. Fokus utama pengembangan ini adalah menciptakan siklus donasi yang transparan, fleksibel (mendukung donasi sebagian), dan mudah dikelola.

---

## 🛠️ Detail Implementasi Fitur (Functional Requirements)

### 1. FR-03: Donasi & Partial Fulfillment (Pemenuhan Sebagian)
**Tujuan:** Memberikan fleksibilitas kepada donatur untuk memenuhi permintaan bantuan baik secara penuh maupun sebagian.

*   **Masalah Sebelumnya:** Permintaan akan hilang (terhapus/tertutup) jika dipenuhi, meskipun jumlah donasi kurang dari permintaan.
*   **Solusi:** Implementasi logika **"Split Request"**.
*   **Alur Teknis:**
    1.  Jika Donatur memberikan `jumlah < permintaan`:
        *   Sistem membuat **Permintaan Baru** (Status: `Approved`) dengan jumlah sesuai donasi.
        *   Sistem memperbarui **Permintaan Lama** (Status: `Open/Pending`) dengan sisa jumlah (`original - donation`).
    2.  Jika Donatur memberikan `jumlah == permintaan`:
        *   Permintaan langsung diubah statusnya menjadi `Approved`.
*   **Komponen Terupdate:**
    *   **Backend:** `PermintaanService.java` (Logic split), `PermintaanController.java` (API Endpoint support Multipart).
    *   **Frontend:** `FulfillmentModal.jsx` (Form Donasi dengan bukti & jumlah), `permintaanService.js` (FormData handling).

### 2. FR-08: Manajemen Permintaan (CRUD Penerima)
**Tujuan:** Memberikan kontrol penuh kepada penerima atas permohonan bantuan yang mereka ajukan.

*   **Fitur Baru:**
    *   **Edit Permintaan:** Penerima bisa mengubah Judul, Deskripsi, Jumlah, dan Foto Bukti selama status masih `Pending`.
    *   **Batalkan Permintaan (Soft Delete):** Penerima bisa membatalkan permintaan. Data tidak dihapus permanen tetapi status berubah menjadi `Cancelled` demi integritas data riwayat.
*   **Komponen Terupdate:**
    *   **Frontend:** `PermintaanSaya.jsx` (UI List & Edit Modal yang responsif).
    *   **Validasi:** Mencegah edit pada permintaan yang sudah disetujui/diproses.

### 3. FR-14: Update Status "Dikirim" (Donatur)
**Tujuan:** Memberikan transparansi kepada penerima bahwa barang sedang dalam perjalanan.

*   **Alur:**
    1.  Donatur membuka Dashboard / Riwayat.
    2.  Pada item status `Approved` (Disiapkan), klik tombol **"Konfirmasi Barang Dikirim"**.
    3.  Status berubah menjadi `Sent` (Dikirim 🚚).
*   **Dampak:** Penerima mendapatkan notifikasi visual di dashboard mereka.

### 4. FR-15: Konfirmasi "Diterima" (Penerima)
**Tujuan:** Menutup siklus transaksi donasi dengan konfirmasi penerimaan fisik barang.

*   **Alur:**
    1.  Penerima menerima barang fisik.
    2.  Login ke Dashboard Penerima -> Riwayat / Permintaan Saya.
    3.  Klik tombol **"Konfirmasi Barang Diterima"**.
    4.  Status berubah menjadi `Received` (Diterima ✅).
*   **Validasi Database:** Data pada tabel `permintaan_donasi` kolom `status` bernilai `received`.

---

## 📊 Arsitektur & Alur Data (ERD Flow)

Sistem ini didukung oleh relasi entitas yang kuat untuk memastikan integritas data.

### Entitas Utama
1.  **Users**: Tabel induk untuk semua aktor (Role: `donatur`, `penerima`).
2.  **Donasi**: Barang yang ditawarkan oleh donatur (Stok awal).
3.  **PermintaanDonasi**: Tabel transaksi utama yang menghubungkan Penerima dan Donatur.

### Skenario Alur Data
**Kasus: Penerima Meminta Bantuan (Open Request)**

1.  **Initiation (Penerima)**
    *   Input: "Butuh Selimut 5 Pcs"
    *   DB: Insert ke `PermintaanDonasi` (Status: `Pending`, Penerima: `ID_Penerima`).

2.  **Discovery (Donatur)**
    *   Donatur melihat list di `DashboardDonatur`.
    *   Action: Klik "Penuhi", input "2 Pcs".

3.  **Processing (Sistem Backend)**
    *   **Langkah A:** Update Permintaan Asli -> Jumlah jadi 3 (5-2). Status tetap `Pending`.
    *   **Langkah B:** Insert Permintaan Baru -> Jumlah 2. Status `Approved`. Donatur: `ID_Donatur`.

4.  **Completion (Flow FR-14 & FR-15)**
    *   Donatur update status -> `Sent`.
    *   Penerima konfirmasi -> `Received`.
    *   **Final State:** 1 Record `Pending` (Sisa 3), 1 Record `Received` (Selesai 2).

---

## 🧪 Panduan Pengujian (Testing Guide)

Untuk memverifikasi fitur-fitur ini berjalan dengan baik, silakan ikuti langkah berikut:

### Skenario Uji: Donasi Sebagian
1.  **Login Penerima**: Buat permintaan baru (Misal: "Beras", Jumlah: 10 Kg).
2.  **Login Donatur**:
    *   Buka Dashboard -> "Permintaan Penerima".
    *   Pilih permintaan "Beras" tadi.
    *   Masukkan jumlah donasi: **4 Kg**.
    *   Upload foto bukti -> Kirim.
3.  **Verifikasi (Penerima)**:
    *   Cek "Permintaan Saya".
    *   Harus ada 2 item:
        *   Satu item dengan sisa **6 Kg** (Status: Menunggu).
        *   Satu item baru **4 Kg** (Status: Disiapkan).
4.  **Penyelesaian**:
    *   (Donatur) Klik "Barang Dikirim".
    *   (Penerima) Klik "Diterima".
    *   Pastikan status akhir item 4 Kg adalah "Diterima ✅".

---

## � Stack Teknologi
*   **Backend**: Java Spring Boot 3 + JPA (Hibernate)
*   **Database**: MySQL
*   **Frontend**: React.js + Tailwind CSS
*   **Testing**: Manual Testing & JUnit (Backend)

---
*Dokumen ini dibuat otomatis sebagai bagian dari dokumentasi pengembangan fitur branch `nauval-v1`.*
