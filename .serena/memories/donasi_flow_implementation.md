# Flow Donasi Donatur - Implementasi Lengkap

## Deskripsi
Flow ini memungkinkan Donatur untuk membuat donasi barang di halaman "Donasi Barang", dan donasi tersebut akan otomatis muncul di dashboard Donatur di bagian "Donasi Saya".

## Architecture

### 1. Frontend - Halaman Donasi (/app/donasi/page.tsx)
**File**: `frontend/app/donasi/page.tsx`

#### Form Input:
- Nama Produk (kategori)
- Deskripsi Produk
- Lokasi Pengambilan
- Upload Foto/File

#### Proses Submit:
```
User klik tombol "Kirim Donasi"
  ↓
Validasi form (kategori, deskripsi)
  ↓
Validasi user adalah Donatur
  ↓
Persiapan data sesuai DonasiRequest:
{
  "kategori": "Nama Barang",
  "deskripsi": "Deskripsi lengkap",
  "foto": "nama_file.jpg",
  "lokasiId": 1,
  "donaturId": userData.userId
}
  ↓
POST ke http://localhost:8080/api/donasi
  ↓
Jika sukses: Toast success + redirect ke dashboard
Jika error: Toast error + tampilkan pesan
```

### 2. Backend - DonasiController
**File**: `backend/src/main/java/Donasiku/spring/core/controller/DonasiController.java`

#### Endpoint:
- `POST /api/donasi` → createDonasi(DonasiRequest request)
- `GET /api/donasi` → listDonasi()

#### DonasiRequest DTO:
```java
{
  deskripsi: String,
  kategori: String,
  foto: String,
  lokasiId: Integer,
  donaturId: Integer
}
```

### 3. Backend - DonasiService
**File**: `backend/src/main/java/Donasiku/spring/core/service/DonasiService.java`

#### createDonasi Method:
1. Validasi Donatur (User dengan donaturId)
2. Validasi Lokasi (dengan lokasiId)
3. Set Status Awal = "Available"
4. Create Donasi entity dengan relasi:
   - donatur ← User (Donatur yang membuat)
   - lokasi ← Lokasi (Tempat ambil barang)
   - statusDonasi ← StatusDonasi (Status barang)
5. Save ke database

### 4. Backend - Donasi Entity
**File**: `backend/src/main/java/Donasiku/spring/core/entity/Donasi.java`

**Struktur**:
```java
{
  donasiId: Integer (PK),
  deskripsi: String,
  kategori: String,
  foto: String,
  lokasi: Lokasi (FK),
  donatur: User (FK),
  penerima: User (FK - nullable),
  statusDonasi: StatusDonasi (FK),
  createdAt: LocalDateTime,
  updatedAt: LocalDateTime
}
```

### 5. Frontend - Dashboard Donatur (/app/dashboard/page.tsx)
**File**: `frontend/app/dashboard/page.tsx`

#### Section: "Donasi Saya"
**Proses Load Data**:
```
Component Mount
  ↓
Ambil userId dari localStorage (userSession)
  ↓
Call fetchDonasiSaya(userId)
  ↓
GET http://localhost:8080/api/donasi
  ↓
Terima array Donasi dari backend
  ↓
Filter: donasiSaya = data.filter(d => d.donatur.userId === userId)
  ↓
Tampilkan 3 donasi terbaru di dashboard
```

#### Tampilan Data:
- Kategori (judul)
- Lokasi: item.lokasi.alamatLengkap
- Deskripsi: item.deskripsi
- Status: item.statusDonasi.status
- Penerima: item.penerima ? "✓ Ada Penerima" : "Menunggu"

## Status Implementasi
✅ Frontend form untuk input donasi
✅ Frontend mengirim POST ke backend
✅ Backend menerima dan simpan ke database
✅ Backend endpoint GET untuk list donasi
✅ Dashboard fetch data dari API
✅ Dashboard filter donasi by userId
✅ Dashboard tampilkan data donasi

## Catatan Penting
1. Lokasi harus sudah ada di database (lokasiId harus valid)
2. User yang login harus memiliki role "donatur"
3. Status awal donasi di-set ke "Available"
4. Data Lokasi memiliki struktur:
   - lokasiId
   - alamatLengkap
   - garisLintang
   - garisBujur
   - tipeLokasi

## UI Update
- Button "Kirim Donasi" (Primary - Green) - Mengirim donasi ke backend
- Button "Simpan Draft" (Secondary - Blue outline) - Simpan ke localStorage
- Button "Preview" (Tertiary - Blue) - Lihat preview

## Cara Test
1. Pastikan user sudah login sebagai Donatur
2. Buka halaman /donasi
3. Isi form:
   - Tambah minimal 1 barang di search box
   - Isi "Nama Produk"
   - Isi "Deskripsi Produk"
   - Isi "Lokasi Pengambilan"
   - (Optional) Upload foto
4. Klik button "🚀 Kirim Donasi"
5. Konfirmasi di popup
6. Tunggu toast success
7. Akan auto redirect ke dashboard
8. Lihat donasi baru muncul di section "Donasi Saya"

## Important: Database Setup
Sebelum testing, pastikan Lokasi dengan ID 1 sudah ada di database:
```sql
SELECT * FROM Lokasi WHERE lokasi_id = 1;
```
Jika tidak ada, insert:
```sql
INSERT INTO Lokasi (garis_lintang, garis_bujur, alamat_lengkap, tipe_lokasi)
VALUES (-6.1751, 106.8270, 'Jakarta Pusat', 'donatur');
```
