# FR-16 Implementation: Verifikasi Pengguna

## 📋 Requirement
"Sistem harus menyediakan fitur untuk verifikasi pengguna sebagai Penerima Donasi yang valid dengan menyertakan dokumen resmi."

## ✅ Implementasi Selesai

### 1. **Entity (Sudah Ada)**
📁 `DokumenVerifikasi.java`
- dokumen_verifikasi_id (PK)
- penerima_user_id (FK ke Users)
- nama_file
- file_path
- uploaded_at

### 2. **DTO - Request**
📁 `VerifikasiRequest.java`
```java
{
  "userId": 2,           // User ID penerima
  "namaFile": "KTP_2025.pdf",  // Nama dokumen
  "filePath": "/uploads/KTP_2025.pdf"  // Path dokumen
}
```

### 3. **DTO - Response**
📁 `VerifikasiResponse.java`
```java
{
  "dokumenVerifikasiId": 1,
  "penerimaUserId": 2,
  "namaFile": "KTP_2025.pdf",
  "filePath": "/uploads/KTP_2025.pdf",
  "uploadedAt": "2025-12-16T23:42:17",
  "status": "Dokumen diterima",
  "message": "Dokumen verifikasi berhasil diupload"
}
```

### 4. **Repository**
📁 `DokumenVerifikasiRepository.java`
- Extends `JpaRepository<DokumenVerifikasi, Integer>`
- Method: `findByPenerimaUserId(Integer penerimaUserId)`

### 5. **Service**
📁 `VerifikasiService.java`

**Methods:**
1. `uploadDokumenVerifikasi(VerifikasiRequest)` - Upload/update dokumen
   - Validasi user ada & adalah Penerima
   - Cek dokumen existing, update atau buat baru
   - Set uploadedAt timestamp

2. `getDokumenVerifikasi(Integer userId)` - Get dokumen by user
   - Return dokumen lengkap dengan file info

3. `getStatusVerifikasi(Integer userId)` - Check status verifikasi
   - Return status dokumen & user status

4. `deleteDokumenVerifikasi(Integer userId)` - Delete dokumen

### 6. **Controller**
📁 `VerifikasiController.java`

#### Endpoint 1: Upload Dokumen
```
POST /api/verifikasi/upload
Content-Type: application/json

{
  "userId": 2,
  "namaFile": "KTP_2025.pdf",
  "filePath": "/uploads/KTP_2025.pdf"
}

Response: 201 CREATED
{
  "dokumenVerifikasiId": 1,
  "penerimaUserId": 2,
  "namaFile": "KTP_2025.pdf",
  "filePath": "/uploads/KTP_2025.pdf",
  "uploadedAt": "2025-12-16T23:42:17",
  "status": "Dokumen diterima",
  "message": "Dokumen verifikasi berhasil diupload"
}
```

#### Endpoint 2: Get Dokumen
```
GET /api/verifikasi/{userId}/dokumen

Response: 200 OK
{
  "dokumenVerifikasiId": 1,
  "penerimaUserId": 2,
  "namaFile": "KTP_2025.pdf",
  "filePath": "/uploads/KTP_2025.pdf",
  "uploadedAt": "2025-12-16T23:42:17",
  "status": "Dokumen ditemukan",
  "message": "Dokumen verifikasi sudah diupload"
}
```

#### Endpoint 3: Check Status Verifikasi
```
GET /api/verifikasi/{userId}/status

Response: 200 OK
{
  "penerimaUserId": 2,
  "status": "Dokumen sudah diupload, menunggu verifikasi",
  "message": "Status: Terverifikasi = active"
}
```

#### Endpoint 4: Delete Dokumen
```
DELETE /api/verifikasi/{userId}/dokumen

Response: 200 OK
{
  "penerimaUserId": 2,
  "status": "DELETED",
  "message": "Dokumen verifikasi berhasil dihapus"
}
```

## 🔐 Business Logic

### Validasi
1. ✅ User harus exist di database
2. ✅ User harus memiliki role = "penerima"
3. ✅ Hanya satu dokumen per user (update jika sudah ada)
4. ✅ Timestamp diatur otomatis saat upload

### Error Handling
- **User tidak ditemukan**: 400 BAD_REQUEST
- **User bukan Penerima**: 400 BAD_REQUEST
- **Dokumen tidak ditemukan**: 404 NOT_FOUND

## 📊 Database Interaction
```sql
INSERT INTO Dokumen_Verifikasi (penerima_user_id, nama_file, file_path, uploaded_at)
VALUES (2, 'KTP_2025.pdf', '/uploads/KTP_2025.pdf', NOW());

SELECT * FROM Dokumen_Verifikasi WHERE penerima_user_id = 2;
```

## ✨ File yang Dibuat
- ✅ `VerifikasiRequest.java` - Request DTO
- ✅ `VerifikasiResponse.java` - Response DTO
- ✅ `VerifikasiService.java` - Business logic
- ✅ `VerifikasiController.java` - REST endpoints
- ✅ Updated `DokumenVerifikasiRepository.java` - Added query method

## 🚀 Testing
```bash
# Upload dokumen
curl -X POST http://localhost:8080/api/verifikasi/upload \
  -H "Content-Type: application/json" \
  -d '{"userId":2,"namaFile":"KTP.pdf","filePath":"/uploads/KTP.pdf"}'

# Get dokumen
curl -X GET http://localhost:8080/api/verifikasi/2/dokumen

# Check status
curl -X GET http://localhost:8080/api/verifikasi/2/status

# Delete dokumen
curl -X DELETE http://localhost:8080/api/verifikasi/2/dokumen
```

## 📝 Notes
- FR-16 implementation **COMPLETE** ✅
- All 3 jobdesk requirements fulfilled:
  - ✅ FR-01: Login
  - ✅ FR-02: Register
  - ✅ FR-16: Verifikasi Pengguna

---
Generated: December 16, 2025
Status: Ready for Testing
