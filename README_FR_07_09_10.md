# Dokumentasi Teknis Lengkap: FR-07, FR-09, FR-10

Dokumen ini menjelaskan secara rinci implementasi fitur untuk Functional Requirements (FR) 07, 09, dan 10 pada aplikasi Donasiku. Fitur-fitur ini mencakup alur pembuatan permintaan bantuan oleh Penerima, penawaran bantuan oleh Donatur, dan konfirmasi penerimaan.

---

## 1. FR-07: Membuat Permintaan Barang (Penerima)
**Deskripsi:** Sistem menyediakan formulir bagi pengguna (Penerima) untuk membuat permintaan barang yang dibutuhkan agar dapat dilihat oleh Donatur.

### Lokasi Kode
*   **Frontend (Tampilan UI):** 
    *   `d:\DONASIKU-PBO\frontend\app\pengajuanBarang\page.tsx`
    *   Berisi formulir input: Judul Barang, Kategori, Jumlah Target, Alamat Lokasi, Deskripsi, dan Upload Foto.
*   **Backend (Logika Bisnis & API):** 
    *   `d:\DONASIKU-PBO\backend\src\main\java\Donasiku\spring\core\controller\PermintaanController.java`
    *   Method: `createPermintaan`
    *   Endpoint: `POST /api/permintaan`
*   **Database Entity:** 
    *   `d:\DONASIKU-PBO\backend\src\main\java\Donasiku\spring\core\entity\PermintaanDonasi.java`

### Alur Kerja (Flow)
1.  **User Action:** Penerima login dan menavigasi ke halaman "Ajukan Permintaan".
2.  **Input:** Penerima mengisi detail kebutuhan dan mengupload foto pendukung.
3.  **Process:** Frontend mengirim data sebagai `Multipart/Form-Data` ke server. Backend memvalidasi data, menyimpan file gambar ke penyimpanan lokal, dan membuat record baru di database dengan status "Pending".
4.  **Output:** Permintaan berhasil dibuat dan muncul di daftar permintaan.

---

## 2. FR-09: Mengajukan Penawaran / Memenuhi Permintaan (Donatur)
**Deskripsi:** Sistem memungkinkan Donatur untuk melihat daftar permintaan yang ada dan menawarkan bantuan untuk memenuhinya.

### Lokasi Kode
*   **Frontend (Tampilan UI):** 
    *   `d:\DONASIKU-PBO\frontend\app\permintaanBarang\page.tsx`: Halaman list semua permintaan.
    *   `d:\DONASIKU-PBO\frontend\app\detailPenerima\page.tsx`: Halaman detail untuk melihat spesifikasi permintaan sebelum donasi.
*   **Backend (Logika Bisnis & API):** 
    *   `d:\DONASIKU-PBO\backend\src\main\java\Donasiku\spring\core\controller\PermintaanController.java`
    *   Method: `offerToFulfill` (untuk sekadar menawarkan) atau `fulfillPermintaan` (untuk langsung mengirim donasi).
    *   Endpoint: `POST /api/permintaan/{id}/offer` atau `/fulfill`
*   **Database Entity:** 
    *   `d:\DONASIKU-PBO\backend\src\main\java\Donasiku\spring\core\entity\PermintaanKonfirmasi.java`: Menyimpan relasi antara Permintaan dan Donatur yang menawarkan.

### Alur Kerja (Flow)
1.  **User Action:** Donatur mencari permintaan yang ingin dibantu di halaman "Permintaan Barang".
2.  **Process:** Donatur mengklik tombol "Bantu" atau "Donasi".
3.  **Process:** Frontend memanggil API backend. 
4.  **Output:** Status permintaan diperbarui (misal: "Offered") atau dibuatkan tiket konfirmasi baru, menunggu persetujuan atau pengiriman barang.

---

## 3. FR-10: Konfirmasi Pengambilan / Penerimaan (Penerima)
**Deskripsi:** Penerima mengonfirmasi bahwa barang yang ditawarkan atau dikirim oleh Donatur telah diterima dengan baik.

### Lokasi Kode
*   **Frontend (Tampilan UI):** 
    *   `d:\DONASIKU-PBO\frontend\app\konfirmasi-donasi\[id]\page.tsx`
    *   Formulir untuk memverifikasi kondisi barang yang diterima (Baik/Rusak/Kurang), memberi rating/catatan, dan mengupload foto bukti penerimaan.
*   **Backend (Logika Bisnis & API):** 
    *   `d:\DONASIKU-PBO\backend\src\main\java\Donasiku\spring\core\controller\DonasiController.java`: Menggunakan method `updateStatus` atau `confirm` untuk mengubah status donasi menjadi selesai.
    *   Endpoint: `PATCH /api/donasi/{id}/status` atau `POST /api/donasi/konfirmasi` (tergantung implementasi spesifik).
*   **Database Entity:** 
    *   `d:\DONASIKU-PBO\backend\src\main\java\Donasiku\spring\core\entity\PermintaanKonfirmasi.java` (jika dari permintaan) atau `Donasi.java`.

### Alur Kerja (Flow)
1.  **User Action:** Penerima menerima barang fisik. Penerima membuka aplikasi dan masuk ke menu "Riwayat Donasi Masuk".
2.  **Input:** Penerima memilih transaksi yang berstatus "Dikirim", lalu mengisi form konfirmasi (Kondisi barang & Foto bukti).
3.  **Process:** Backend memverifikasi input dan mengupdate status akhir menjadi "Diterima" atau "Selesai".
4.  **Output:** Transaksi ditutup, stok/history terupdate.

---

## Cara Menjalankan Project
Untuk menguji ketiga fitur di atas secara berurutan:
1.  **Backend:** Pastikan server Spring Boot berjalan (`mvn spring-boot:run` di folder `backend`).
2.  **Frontend:** Pastikan server Next.js berjalan (`npm run dev` di folder `frontend` atau `frontend2`).
3.  **Browser:** Buka `http://localhost:3000`.
4.  **Skenario Test:**
    *   Login sebagai **Penerima** -> Buat Permintaan (FR-07).
    *   Login sebagai **Donatur** -> Cari Permintaan tersebut -> Lakukan Donasi (FR-09).
    *   Login kembali sebagai **Penerima** -> Cek Donasi Masuk -> Lakukan Konfirmasi (FR-10).
