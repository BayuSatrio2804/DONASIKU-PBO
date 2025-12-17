-- SKRIP SQL MySQL TERBARU (TANPA ADMIN)
-- Pastikan Anda sudah membuat database kosong bernama 'donasiku'

-- =================================================================================
-- 1. TABEL PENGGUNA (USERS)
-- =================================================================================

CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK, AUTO INCREMENT',
    username VARCHAR(99) UNIQUE NOT NULL COMMENT 'Nama login unik',
    email VARCHAR(99) UNIQUE NOT NULL COMMENT 'Email, UNIQUE',
    password VARCHAR(319) NOT NULL COMMENT 'Password hash',
    nama VARCHAR(99) NOT NULL COMMENT 'Nama lengkap',
    alamat TEXT COMMENT 'Alamat pengguna',
    no_telepon VARCHAR(99) COMMENT 'Nomor telepon',
    foto_profil VARCHAR(99) COMMENT 'Path/URL foto profil',
    -- Role: Donatur, Penerima, dan Admin
    role ENUM('donatur', 'penerima', 'admin') NOT NULL COMMENT 'Peran pengguna',
    status ENUM('active', 'deleted', 'suspended') DEFAULT 'active' COMMENT 'Status akun',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu pendaftaran',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Waktu update terakhir'
);

-- =================================================================================
-- 2. TABEL TURUNAN USER (PK-as-FK)
-- =================================================================================

CREATE TABLE Donatur (
    user_id INT PRIMARY KEY COMMENT 'PK dan FK → Users.user_id',
    daftar_donasi_count INT DEFAULT 0 COMMENT 'Jumlah donasi yang pernah dibuat',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu pembuatan profil donatur',
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Dokumen Verifikasi dengan status verifikasi oleh Admin
CREATE TABLE Dokumen_Verifikasi (
    dokumen_verifikasi_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK, AUTO INCREMENT',
    penerima_user_id INT NOT NULL COMMENT 'FK → Users.user_id',
    nama_file VARCHAR(99) COMMENT 'Nama file/tipe dokumen',
    file_path VARCHAR(99) COMMENT 'Path/URL file',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu upload',
    status_verifikasi VARCHAR(50) DEFAULT 'menunggu_verifikasi' COMMENT 'Status verifikasi: menunggu_verifikasi, terverifikasi, ditolak',
    verified_at TIMESTAMP NULL COMMENT 'Waktu verifikasi oleh admin',
    FOREIGN KEY (penerima_user_id) REFERENCES Users(user_id)
);

CREATE TABLE Penerima (
    user_id INT PRIMARY KEY COMMENT 'PK dan FK → Users.user_id',
    -- Status verifikasi diatur manual atau otomatis oleh sistem
    status_verifikasi BOOLEAN DEFAULT FALSE COMMENT 'Status verifikasi penerima (tanpa Admin)',
    dokumen_verifikasi_id INT COMMENT 'FK → Dokumen_Verifikasi.dokumen_verifikasi_id (nullable)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu pembuatan profil penerima',
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (dokumen_verifikasi_id) REFERENCES Dokumen_Verifikasi(dokumen_verifikasi_id)
);

-- =================================================================================
-- 3. TABEL UTAMA SISTEM (Lokasi, Status_Donasi, Permintaan_Donasi, Donasi, Chat)
-- (Tidak ada perubahan di sini)
-- =================================================================================

CREATE TABLE Lokasi (
    lokasi_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK, AUTO INCREMENT',
    garis_lintang DECIMAL(10,7) NOT NULL COMMENT 'Latitude',
    garis_bujur DECIMAL(10,7) NOT NULL COMMENT 'Longitude',
    alamat_lengkap TEXT NOT NULL COMMENT 'Alamat lengkap',
    tipe_lokasi ENUM('donatur', 'penerima', 'event', 'lainnya') COMMENT 'Tipe lokasi (opsional)'
);

CREATE TABLE Status_Donasi (
    status_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK, AUTO INCREMENT',
    status VARCHAR(99) NOT NULL COMMENT 'Nama status (pending, approved, delivered, dsb)',
    status_verifikasi BOOLEAN COMMENT 'Flag verifikasi (opsional)'
);

CREATE TABLE Permintaan_Donasi (
    permintaan_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK, AUTO INCREMENT',
    jenis_barang VARCHAR(99) NOT NULL COMMENT 'Jenis barang yang diminta',
    jumlah INT NOT NULL COMMENT 'Jumlah yang diminta',
    deskripsi_kebutuhan TEXT COMMENT 'Detail kebutuhan',
    penerima_user_id INT NOT NULL COMMENT 'FK → Users.user_id (penerima yang meminta)',
    lokasi_id INT NOT NULL COMMENT 'FK → Lokasi.lokasi_id',
    status VARCHAR(99) DEFAULT 'open' COMMENT 'Status permintaan (open/fulfilled/closed)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu pembuatan',
    FOREIGN KEY (penerima_user_id) REFERENCES Users(user_id),
    FOREIGN KEY (lokasi_id) REFERENCES Lokasi(lokasi_id)
);

CREATE TABLE Donasi (
    donasi_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK, AUTO INCREMENT',
    deskripsi TEXT COMMENT 'Deskripsi donasi',
    kategori VARCHAR(99) COMMENT 'Kategori barang',
    foto VARCHAR(99) COMMENT 'Foto barang donasi',
    lokasi_id INT NOT NULL COMMENT 'FK → Lokasi.lokasi_id (lokasi penjemputan/asal)',
    status_id INT NOT NULL COMMENT 'FK → status_donasi.status_id',
    donatur_user_id INT NOT NULL COMMENT 'FK → Users.user_id (donatur)',
    penerima_user_id INT COMMENT 'FK → Users.user_id (nullable jika belum ditetapkan)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu pembuatan',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Waktu update terakhir',
    FOREIGN KEY (lokasi_id) REFERENCES Lokasi(lokasi_id),
    FOREIGN KEY (status_id) REFERENCES Status_Donasi(status_id),
    FOREIGN KEY (donatur_user_id) REFERENCES Users(user_id),
    FOREIGN KEY (penerima_user_id) REFERENCES Users(user_id)
);

CREATE TABLE Chat (
    chat_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK, AUTO INCREMENT',
    donatur_user_id INT NOT NULL COMMENT 'FK → Users.user_id',
    penerima_user_id INT NOT NULL COMMENT 'FK → Users.user_id',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu mulai percakapan',
    UNIQUE KEY (donatur_user_id, penerima_user_id),
    FOREIGN KEY (donatur_user_id) REFERENCES Users(user_id),
    FOREIGN KEY (penerima_user_id) REFERENCES Users(user_id)
);

CREATE TABLE Chat_Message (
    chat_message_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'PK, AUTO INCREMENT',
    chat_id INT NOT NULL COMMENT 'FK → Chat.chat_id',
    sender_user_id INT NOT NULL COMMENT 'FK → Users.user_id',
    message TEXT NOT NULL COMMENT 'Isi pesan',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu pengiriman',
    FOREIGN KEY (chat_id) REFERENCES Chat(chat_id),
    FOREIGN KEY (sender_user_id) REFERENCES Users(user_id)
);

-- =================================================================================
-- 4. DATA AWAL (SEEDING)
-- =================================================================================

-- Insert user admin default
-- Username: admin
-- Password: admin123 (hashed dengan bcrypt)
INSERT INTO Users (username, email, password, nama, role, status, created_at, updated_at) 
VALUES ('admin', 'admin@donasiku.com', '$2a$10$slYQmyNdGzin7olVnY8FOe4soDHVxvCkPvyjNiQh5tCy.AY6r4UZS', 'Administrator', 'admin', 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();