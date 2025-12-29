# Fitur Lokasi & Filter Donasi - Dokumentasi

## 📋 Ringkasan Fitur

Telah berhasil mengimplementasikan fitur pemilihan lokasi dan filter donasi berdasarkan kategori dan lokasi sesuai dengan requirement FR-04, FR-05, dan FR-06.

---

## 🎯 Requirements yang Diimplementasikan

### FR-04: Pemilihan Lokasi untuk Donatur
- **Deskripsi**: Sistem menyediakan fitur pemilihan lokasi donasi agar pengguna dapat memilih sesuai lokasi mereka
- **Implementasi**: 
  - FormDonasi.jsx memiliki dropdown untuk memilih lokasi dari database
  - Opsi untuk menambah lokasi baru jika tidak tersedia
  - Lokasi diambil dari API `/api/lokasi`

### FR-05: Pemilihan Lokasi untuk Penerima
- **Deskripsi**: Sistem menyediakan fitur pemilihan lokasi donasi agar penerima dapat meminimalkan jarak pengiriman
- **Implementasi**:
  - DashboardPenerima memiliki FilterComponent dengan pemilihan lokasi
  - Fitur geolocation untuk menampilkan lokasi terdekat
  - Filter donasi berdasarkan lokasi yang dipilih

### FR-06: Filter Kategori & Lokasi
- **Deskripsi**: Sistem memungkinkan filter barang berdasarkan kategori dan lokasi
- **Implementasi**:
  - FilterComponent yang reusable di berbagai halaman
  - Filter donasi berdasarkan kategori (Pakaian, Buku, Elektronik, dll)
  - Filter donasi berdasarkan lokasi
  - Filter permintaan donasi juga tersedia

---

## 🏗️ Struktur Implementasi

### Backend (Java Spring Boot)

#### 1. **Lokasi Entity** (`Lokasi.java`)
- Sudah ada dengan field: `lokasiId`, `garisLintang`, `garisBujur`, `alamatLengkap`, `tipeLokasi`
- Method `hitungJarak()` untuk menghitung jarak antar lokasi

#### 2. **REST API Endpoints**

**Lokasi Controller** (`/api/lokasi`):
```
GET /api/lokasi              - Get all locations
GET /api/lokasi/{id}         - Get location by ID
GET /api/lokasi?address=...  - Search location by address
GET /api/lokasi/nearby?lat=&lng=&radius=  - Get nearby locations
```

**Donasi Controller** (`/api/donasi`):
```
GET /api/donasi              - List all donations (supports filters)
GET /api/donasi/search/filtered?kategori=&lokasi=&availableOnly=true
POST /api/donasi             - Create new donation with lokasi parameter
```

**Permintaan Controller** (`/api/permintaan`):
```
GET /api/permintaan/search/filtered?kategori=&lokasi=&pendingOnly=true
POST /api/permintaan         - Create new request with lokasi parameter
```

#### 3. **Entity Relationships**
- **Donasi** → ManyToOne → **Lokasi** (setiap donasi memiliki lokasi)
- **PermintaanDonasi** → ManyToOne → **Lokasi** (setiap permintaan memiliki lokasi)

---

### Frontend (React)

#### 1. **Services**

**lokasiService.js**:
```javascript
- getAllLokasi()              - Get all available locations
- getLokasiById(id)          - Get location details
- searchLokasiByAddress()    - Search by address
- getNearbyLokasi()          - Get locations within radius
```

**filterService.js**:
```javascript
- filterDonasi(kategori, lokasi, availableOnly)        - Filter donations
- filterPermintaan(kategori, lokasi, pendingOnly)      - Filter requests
```

#### 2. **Components**

**FilterComponent.jsx** (Reusable):
```jsx
Props:
  - onFilterChange: callback ketika filter berubah
  - showLocationMap: toggle untuk menampilkan peta

Features:
  - Category filter (Pakaian, Buku, Elektronik, dll)
  - Location dropdown (dari database)
  - Geolocation button (📍 Lokasi Saya)
  - Reset button
```

#### 3. **Updated Components**

**FormDonasi.jsx**:
- Lokasi dropdown dengan opsi "Tambah Lokasi Baru"
- Integrasi dengan lokasiService untuk list lokasi
- Input text manual jika lokasi baru tidak ada di list

**DashboardPenerima.jsx**:
- Import FilterComponent
- Handler `handleFilterChange()` untuk apply filter
- Fallback ke client-side filtering jika API error
- State untuk filter parameters

**DashboardDonatur.jsx**:
- Import FilterComponent 
- Handler untuk filter donasi milik donatur
- Stats yang update berdasarkan filter

---

## 📱 User Flows

### Flow Donatur - Membuat Donasi (FR-04):
1. Klik "Buat Donasi Baru"
2. Isi form (nama, kategori, jumlah, deskripsi, foto)
3. **Di field "Lokasi Barang"**:
   - Pilih dari dropdown lokasi yang tersedia, ATAU
   - Pilih "+ Tambah Lokasi Baru" dan input manual alamat
4. Submit form → donasi dibuat dengan lokasi

### Flow Penerima - Cari Donasi dengan Filter (FR-05 & FR-06):
1. Ke Dashboard Penerima
2. **Lihat FilterComponent** dengan opsi:
   - **Kategori**: Pilih kategori barang
   - **Lokasi**: Pilih lokasi yang diinginkan
   - **Lokasi Saya**: Klik untuk gunakan lokasi saat ini
3. Donasi ditampilkan berdasarkan filter
4. Klik donasi untuk lihat detail atau ajukan permintaan

### Flow Donatur - View Permintaan dengan Filter:
1. Ke Dashboard Donatur
2. Lihat FilterComponent untuk filter permintaan donasi
3. Filter berdasarkan kategori atau lokasi
4. Lihat dan respond permintaan yang masuk

---

## 🔌 API Usage Examples

### Get All Locations
```bash
GET http://localhost:8081/api/lokasi
```

### Filter Donations by Category and Location
```bash
GET http://localhost:8081/api/donasi/search/filtered?kategori=Pakaian&lokasi=Bandung&availableOnly=true
```

### Get Nearby Locations (Geolocation)
```bash
GET http://localhost:8081/api/lokasi/nearby?lat=-6.2088&lng=106.8456&radius=10
```

### Create Donation with Location
```bash
POST http://localhost:8081/api/donasi
Content-Type: multipart/form-data

namaBarang: "Baju Bekas"
kategori: "pakaian"
jumlah: 5
deskripsi: "Baju layak pakai, warna bersih"
lokasi: "Jl. Gatot Subroto No. 123, Bandung"
userId: 1
file: [image.jpg]
```

---

## ✨ Features yang Sudah Terintegrasi

✅ **Location Selection**:
- Dropdown list lokasi dari database
- Opsi menambah lokasi baru
- Support geolocation (latitude/longitude)

✅ **Filter Component**:
- Reusable di berbagai halaman
- Category filter
- Location filter
- Geolocation support
- Reset filter button

✅ **Backend APIs**:
- Get all locations
- Search location by address
- Get nearby locations (geo-based)
- Filter donations by category & location
- Filter requests by category & location

✅ **Frontend Integration**:
- FormDonasi dengan location selection
- DashboardPenerima dengan filter
- DashboardDonatur dengan filter
- Responsive design dengan Tailwind CSS

---

## 🚀 Cara Testing

### 1. Backend
```bash
cd backend
./mvnw spring-boot:run
```

### 2. Frontend
```bash
cd frontend2
npm install
npm run dev
```

### 3. Test Filter
1. Buka http://localhost:3000
2. Login sebagai Penerima
3. Go to Dashboard
4. Coba filter by kategori atau lokasi
5. Hasil donasi akan terfilter

### 4. Test Location Selection
1. Login sebagai Donatur
2. Create Donasi Baru
3. Di field lokasi, pilih dari dropdown atau tambah baru
4. Submit dan cek apakah lokasi tersimpan

---

## 📝 Database Notes

Pastikan tabel `Lokasi` sudah terisi dengan data:
```sql
INSERT INTO Lokasi (garis_lintang, garis_bujur, alamat_lengkap, tipe_lokasi) VALUES
(-6.2088, 106.8456, 'Jl. Gatot Subroto, Bandung', 'donatur'),
(-6.1751, 106.8650, 'Jl. Dipati Ukur, Bandung', 'penerima'),
... (tambah sesuai kebutuhan)
```

---

## 🔧 Troubleshooting

### Filter tidak bekerja
- Check API endpoint: `GET /api/donasi/search/filtered`
- Verify kategori dan lokasi spelling
- Check browser console untuk error messages

### Lokasi dropdown kosong
- Pastikan tabel Lokasi di database ada data
- Check endpoint `GET /api/lokasi` return data

### Geolocation tidak bekerja
- Pastikan browser support geolocation
- User harus allow lokasi access
- HTTPS required untuk production

---

## 📄 Files yang Telah Dibuat/Updated

### Backend
- ✅ DonasiController.java - Tambah endpoint `/search/filtered`
- ✅ PermintaanController.java - Tambah endpoint `/search/filtered`
- ✅ Lokasi.java - Sudah ada, no changes needed
- ✅ DonasiService.java - Sudah ada, support filter

### Frontend
- ✅ FilterComponent.jsx - **NEW** - Komponen filter reusable
- ✅ lokasiService.js - **NEW** - Service untuk lokasi
- ✅ filterService.js - **NEW** - Service untuk filter
- ✅ FormDonasi.jsx - **UPDATED** - Lokasi dropdown
- ✅ DashboardPenerima.jsx - **UPDATED** - FilterComponent integration
- ✅ DashboardDonatur.jsx - **UPDATED** - FilterComponent integration

---

## ✅ Checklist Selesai

- [x] Lokasi entity dan relationship sudah ada
- [x] Backend API endpoints untuk lokasi
- [x] Backend API endpoints untuk filter donasi
- [x] Backend API endpoints untuk filter permintaan
- [x] Frontend lokasiService
- [x] Frontend filterService
- [x] Frontend FilterComponent (reusable)
- [x] FormDonasi dengan location selection
- [x] DashboardPenerima dengan filter
- [x] DashboardDonatur dengan filter
- [x] Geolocation support
- [x] Category filter support
- [x] Location filter support

---

Semua fitur FR-04, FR-05, dan FR-06 telah berhasil diimplementasikan! 🎉
