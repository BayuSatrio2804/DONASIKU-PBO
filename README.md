# 📦 Donasiku - Platform Donasi Barang Layak Pakai

![Donasiku Banner](https://via.placeholder.com/1200x400?text=Donasiku+Platform+Berbagi+Kebaikan)

**Donasiku** adalah platform inovatif yang menghubungkan **Donatur** dengan **Penerima Manfaat** secara langsung, transparan, dan efisien. Aplikasi ini dirancang untuk memfasilitasi distribusi barang bekas layak pakai agar dapat segera dimanfaatkan oleh mereka yang membutuhkan, mengurangi limbah, dan mempererat solidaritas sosial.

> *"Satu barang tak terpakai bagimu, bisa jadi harta tak ternilai bagi orang lain."*

---

## 🌟 Mengapa Donasiku?

### Masalah
*   Banyak barang layak pakai menumpuk di gudang donatur tanpa tujuan.
*   Penerima bantuan sulit menemukan donatur yang memiliki barang spesifik yang mereka butuhkan.
*   Proses donasi manual seringkali tidak transparan dan sulit dilacak.

### Solusi Kami
Donasiku menyediakan sistem terintegrasi dimana:
1.  **Donatur** dapat memajang barang "preloved" mereka layaknya marketplace.
2.  **Penerima** dapat melihat etalase, mengajukan permintaan, atau memposting kebutuhan mendesak.
3.  **Sistem** memfasilitasi validasi, "matching", chat, hingga pelacakan pengiriman.

---

## 🚀 Fitur Unggulan

### 🤝 Untuk Donatur (Pemberi)
*   **Manajemen Donasi**: Upload foto, deskripsi, dan kategori barang dengan mudah.
*   **Fulfillment System (Pemenuhan Permintaan)**:
    *   **Direct Request**: Menerima pengajuan langsung dari penerima.
    *   **Open Request**: Mencari penerima yang memposting kebutuhan (misal: "Butuh laptop untuk sekolah").
    *   **Partial Fulfillment**: Kemampuan mengirim sebagian dari total permintaan (Contoh: Permintaan 5 pcs, Donatur kirim 2 pcs). *Fitur Baru!*
*   **Tracking Transparan**: Status real-time (Disiapkan -> Dikirim -> Diterima).
*   **Chat Terintegrasi**: Komunikasi aman tanpa bertukar nomor pribadi.

### 🤲 Untuk Penerima (Pencari)
*   **Etalase Donasi**: Browsing barang tersedia berdasarkan kategori dan lokasi.
*   **Ajukan Permintaan**: Posting kebutuhan spesifik agar dilihat oleh para donatur.
*   **Manajemen Permintaan**: Edit atau batalkan permintaan yang belum diproses.
*   **Konfirmasi Penerimaan**: Validasi akhir untuk menutup siklus donasi.

### 🛡️ Keamanan & Admin
*   **Verifikasi User**: Validasi data pengguna.
*   **Moderasi Konten**: Admin memantau barang dilarang/ilegal.
*   **Audit Log**: Riwayat transaksi tercatat rapi.

---

## � Tech Stack (Teknologi)

Aplikasi ini dibangun dengan standar industri terkini untuk performa dan skalabilitas.

### Frontend
*   **Framework**: React.js (Vite)
*   **Styling**: Tailwind CSS (Modern UI/UX)
*   **Library Utama**:
    *   `Axios`: Koneksi API
    *   `React Router`: Navigasi SPA
    *   `SweetAlert2`: Notifikasi interaktif
    *   `React Icons`: Ikonografi

### Backend
*   **Framework**: Spring Boot 3 (Java)
*   **Database**: MySQL
*   **ORM**: Hibernate (Spring Data JPA)
*   **Security**: Spring Security & JWT (JSON Web Token)
*   **Build Tool**: Maven

---

## � Struktur Proyek

```
DONASIKU-PBO/
├── backend/                # Source Code Spring Boot
│   ├── src/main/java       # Controllers, Services, Entities
│   └── src/main/resources  # Config (application.properties)
├── frontend2/              # Source Code React Vite
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, Cards)
│   │   ├── features/       # Halaman Utama (Donatur, Penerima)
│   │   └── services/       # API Integration
├── nauval.md               # Dokumentasi Fitur Nauval
└── README.md               # Dokumentasi Utama
```

---

## 🛠️ Cara Menjalankan (Installation)

### Prasyarat
*   Java JDK 17+
*   Node.js 18+
*   MySQL Server

### 1. Setup Database
Buat database kosong bernama `donasikuu`.
```sql
CREATE DATABASE donasikuu;
```

### 2. Jalankan Backend
```bash
cd backend
./mvnw spring-boot:run
```
*Server akan berjalan di `http://localhost:8080`*

### 3. Jalankan Frontend
```bash
cd frontend2
npm install
npm run dev
```
*Aplikasi web dapat diakses di `http://localhost:5173`*

---

## 👥 Kontributor
Proyek ini dikembangkan dengan dedikasi tinggi oleh:
*   **Nauval** - *Fullstack Developer (Feature: Partial Fulfillment & Request Management)*
*   [Nama Anggota Lain]
*   [Nama Anggota Lain]

---

## 📄 Lisensi
Hak Cipta © 2025 Donasiku Team. Seluruh hak cipta dilindungi undang-undang.
