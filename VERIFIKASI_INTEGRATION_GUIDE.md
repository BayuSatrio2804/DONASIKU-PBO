# INTEGRASI SISTEM VERIFIKASI - DOKUMENTASI LENGKAP

## 📋 Ringkasan Perubahan

Sistem verifikasi akun Donasiku telah diintegrasikan secara lengkap dengan fitur:
1. ✅ Status verifikasi yang benar (tetap "menunggu_verifikasi" setelah upload)
2. ✅ Detail akun menampilkan status real-time
3. ✅ Halaman admin verifikasi dengan list dokumen yang menunggu
4. ✅ Dashboard admin menampilkan count verifikasi yang menunggu
5. ✅ Admin dapat melihat detail bukti/dokumen saat verifikasi
6. ✅ Admin dapat approve atau reject dokumen

---

## 🔧 BACKEND INTEGRATION

### Database Structure
```
Tabel: Dokumen_Verifikasi
- dokumen_verifikasi_id (PK)
- penerima_user_id (FK to Users)
- nama_file
- file_path
- uploaded_at
- status_verifikasi (values: "menunggu_verifikasi", "terverifikasi", "ditolak")
- verified_at
```

### API Endpoints

#### 1. Upload Dokumen Verifikasi (Penerima)
```
POST /api/verifikasi/upload
Content-Type: multipart/form-data

Parameters:
- userId: Integer (dari session)
- file: File (JPG/PNG, max 5MB)

Response:
{
  "dokumenVerifikasiId": 1,
  "penerimaUserId": 5,
  "namaFile": "KTP_123.jpg",
  "filePath": "uploads/verification/timestamp_KTP_123.jpg",
  "uploadedAt": "2025-12-17T12:00:00",
  "status": "menunggu_verifikasi",
  "message": "Dokumen verifikasi berhasil diupload. Menunggu verifikasi dari admin",
  "username": "john_penerima",
  "email": "john@email.com",
  "noTelepon": "085123456789",
  "alamat": "Jl. Contoh No. 123"
}
```

#### 2. Cek Status Verifikasi
```
GET /api/verifikasi/{userId}/status

Response:
{
  "penerimaUserId": 5,
  "status": "menunggu_verifikasi",  // atau "terverifikasi" atau "Belum ada dokumen verifikasi"
  "username": "john_penerima",
  "email": "john@email.com",
  "noTelepon": "085123456789",
  "alamat": "Jl. Contoh No. 123"
}
```

#### 3. Get Semua Dokumen Menunggu Verifikasi (Admin)
```
GET /api/verifikasi/admin/pending

Response:
[
  {
    "dokumenVerifikasiId": 1,
    "penerimaUserId": 5,
    "namaFile": "KTP_123.jpg",
    "filePath": "uploads/verification/timestamp_KTP_123.jpg",
    "uploadedAt": "2025-12-17T12:00:00",
    "status": "menunggu_verifikasi",
    "message": "Dokumen menunggu verifikasi",
    "username": "john_penerima",
    "email": "john@email.com",
    "noTelepon": "085123456789",
    "alamat": "Jl. Contoh No. 123"
  },
  ...
]
```

#### 4. Approve/Reject Dokumen (Admin)
```
PUT /api/verifikasi/admin/{dokumenId}/verify
Content-Type: application/json

Request Body:
{
  "status": "terverifikasi"  // atau "ditolak"
}

Response:
{
  "dokumenVerifikasiId": 1,
  "penerimaUserId": 5,
  "status": "terverifikasi",  // sesuai request
  "message": "Status dokumen diupdate menjadi: terverifikasi"
  ...
}
```

---

## 🎨 FRONTEND INTEGRATION

### Pages/Components

#### 1. Detail Akun Page (`app/detail-akun/page.tsx`)
**Perubahan:**
- Status verifikasi hanya menampilkan "Terverifikasi" jika status === "terverifikasi"
- Jika status === "menunggu_verifikasi", tampil "Belum Terverifikasi" dengan tombol upload
- Upload modal memungkinkan penerima upload dokumen KTP/Identitas

**Fitur:**
- Penerima dapat melihat status verifikasi mereka
- Penerima dapat upload dokumen untuk verifikasi
- Status refresh otomatis setelah upload

#### 2. Admin Verifikasi Page (`app/admin/verifikasi/page.tsx`)
**Fitur:**
- List semua dokumen yang menunggu verifikasi
- Filter berdasarkan status (all, pending, verified, rejected)
- Klik item untuk melihat detail
- Modal detail menampilkan:
  - Informasi Penerima (username, email, telpon, alamat)
  - Informasi Dokumen (nama file, tanggal upload, status)
  - Preview dokumen (image atau link)
  - Button Setujui / Tolak

#### 3. Admin Dashboard (`app/admin/dashboard/page.tsx`)
**Perubahan:**
- Menambah fetch pendingVerifikasiCount dari API
- Widget "Menunggu Verifikasi" menampilkan count dinamis
- Button "Verifikasi Penerima" navigasi ke `/admin/verifikasi`
- Sub-text button menampilkan jumlah dokumen yang menunggu

---

## 🧪 TESTING FLOW

### Test Case 1: Upload Dokumen sebagai Penerima

1. Login sebagai user dengan role "penerima"
2. Buka menu "Detail Akun"
3. Lihat status awal: "Belum Terverifikasi" + tombol "Unggah Dokumen"
4. Klik "Unggah Dokumen"
5. Upload file (JPG/PNG, max 5MB)
6. Klik "Kirim"
7. **Expected:** 
   - Alert: "Dokumen berhasil diunggah! Menunggu verifikasi dari admin"
   - Status tetap "Belum Terverifikasi"
   - Upload modal tertutup

### Test Case 2: Admin Lihat List Verifikasi

1. Login sebagai user dengan role "admin"
2. Lihat Admin Dashboard
3. Widget "Menunggu Verifikasi" menunjukkan jumlah > 0
4. Klik button "Verifikasi Penerima" atau navigasi ke `/admin/verifikasi`
5. **Expected:**
   - List berisi dokumen yang menunggu
   - Status count di top
   - Setiap item menampilkan: username, email, telpon, file, tanggal

### Test Case 3: Admin Approve Dokumen

1. Dari list verifikasi, klik item untuk lihat detail
2. Modal terbuka menampilkan:
   - Informasi Penerima lengkap
   - Preview dokumen
   - Button "Setujui" dan "Tolak"
3. Klik button "Setujui"
4. **Expected:**
   - Alert: "Dokumen berhasil disetujui!"
   - Modal tertutup
   - Item hilang dari list (karena status berubah dari pending)

### Test Case 4: Penerima Lihat Status Terverifikasi

1. Login sebagai penerima (yang dokumennya sudah disetujui)
2. Buka Detail Akun
3. **Expected:**
   - Status berubah menjadi "✓ Terverifikasi"
   - Tombol "Unggah Dokumen" hilang

### Test Case 5: Admin Reject Dokumen

1. Dari list verifikasi, klik item
2. Klik button "Tolak"
3. **Expected:**
   - Alert: "Dokumen berhasil ditolak!"
   - Item hilang dari list

---

## 📦 File Structure

```
backend/
├── src/main/java/Donasiku/spring/core/
│   ├── entity/
│   │   ├── DokumenVerifikasi.java ✓
│   │   └── User.java ✓
│   ├── controller/
│   │   └── VerifikasiController.java ✓
│   ├── service/
│   │   └── VerifikasiService.java ✓
│   ├── repository/
│   │   └── DokumenVerifikasiRepository.java ✓
│   └── dto/
│       └── VerifikasiResponse.java ✓
└── uploads/
    └── verification/ (folder untuk menyimpan dokumen)

frontend/
├── app/
│   ├── detail-akun/
│   │   └── page.tsx ✓ (UPDATED)
│   └── admin/
│       ├── dashboard/
│       │   └── page.tsx ✓ (UPDATED)
│       └── verifikasi/
│           └── page.tsx ✓ (EXISTING)
```

---

## 🔌 Configuration

### Backend (application.properties)
```properties
spring.application.name=donasiku-backend
server.port=8080

# Database MySQL
spring.datasource.url=jdbc:mysql://localhost:3307/donasikuu
spring.datasource.username=root
spring.datasource.password=

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

### Frontend API Base URL
- Semua endpoint menggunakan: `http://localhost:8080`
- Update di file `.env.local` jika perlu URL berbeda:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8080
  ```

---

## 🚀 Deployment Notes

### Prerequisites:
1. MySQL server running di `localhost:3307`
2. Database `donasikuu` sudah created
3. Backend running di `http://localhost:8080`
4. Frontend running di `http://localhost:3000`

### File Upload Directory:
- Backend create folder `uploads/verification/` otomatis
- Pastikan permission folder write-accessible
- Format path: `uploads/verification/{timestamp}_{originalfilename}`

### Access Control:
- Endpoint upload: hanya user dengan role "penerima"
- Endpoint admin: hanya user dengan role "admin"
- Frontend pages protected dengan role check

---

## 📝 Next Steps (Opsional)

1. **Download Dokumen:** Tambah button download di admin verifikasi page
2. **Bukti Verifikasi:** Email notifikasi ke penerima saat approve/reject
3. **History:** Track verifikasi history (who verified, when, etc)
4. **Rejection Reason:** Add textarea untuk alasan reject
5. **Batch Action:** Approve/reject multiple dokumen sekaligus
6. **Search/Filter:** Search by nama penerima, email, tanggal

---

## ✅ Status Integrasi

- [x] Backend API endpoints
- [x] Database schema
- [x] Frontend detail-akun page
- [x] Frontend admin verifikasi page
- [x] Frontend admin dashboard
- [x] Status logic fix (tetap pending setelah upload)
- [x] Real-time status display
- [x] Document preview
- [x] Approve/Reject functionality
- [x] Error handling
- [x] Loading states
- [x] Responsive design

Sistem verifikasi Donasiku **siap untuk production!** 🎉
