# Admin Verification API Guide

## Overview
Admin dapat memverifikasi dokumen yang di-upload oleh Penerima Donasi. Backend sudah siap dengan semua endpoint yang dibutuhkan.

---

## Database Schema

### Admin Role
```sql
-- Users table sudah include admin role
role ENUM('donatur', 'penerima', 'admin') NOT NULL
```

### Dokumen_Verifikasi Table
```sql
dokumen_verifikasi_id INT PRIMARY KEY
penerima_user_id INT (FK)
nama_file VARCHAR(99)
file_path VARCHAR(99)
uploaded_at TIMESTAMP
status_verifikasi VARCHAR(50) -- 'menunggu_verifikasi', 'terverifikasi', 'ditolak'
verified_at TIMESTAMP -- Waktu verifikasi oleh admin
```

---

## Admin Credentials (Default)
```
Username: admin
Password: admin123
Role: admin
```

> ⚠️ **Setup required**: Buka `http://localhost:8090/api/setup/init-admin` untuk create admin user pertama kali

---

## API Endpoints Ready for Frontend

### 1️⃣ Admin Login
```
POST http://localhost:8090/api/auth/login

Request Body:
{
  "usernameOrEmail": "admin",
  "password": "admin123"
}

Response (200 OK):
{
  "success": true,
  "message": "Login berhasil! Selamat datang, admin.",
  "username": "admin",
  "userId": 1,
  "email": "admin@donasiku.com",
  "role": "admin"
}
```

### 2️⃣ Get All Pending Verifications (Admin Dashboard)
```
GET http://localhost:8090/api/verifikasi/admin/pending

Response (200 OK):
[
  {
    "dokumenVerifikasiId": 1,
    "penerimaUserId": 2,
    "namaFile": "KTP_12345.jpg",
    "filePath": "/uploads/verification/1702775940000_KTP_12345.jpg",
    "uploadedAt": "2025-12-17T10:45:30",
    "status": "menunggu_verifikasi",
    "message": "Dokumen menunggu verifikasi"
  },
  {
    "dokumenVerifikasiId": 3,
    "penerimaUserId": 5,
    "namaFile": "Surat_Domisili.pdf",
    "filePath": "/uploads/verification/1702776100000_Surat_Domisili.pdf",
    "uploadedAt": "2025-12-17T11:15:00",
    "status": "menunggu_verifikasi",
    "message": "Dokumen menunggu verifikasi"
  }
]
```

### 3️⃣ Approve Document (Admin)
```
PUT http://localhost:8090/api/verifikasi/admin/1/verify

Request Body:
{
  "status": "terverifikasi"
}

Response (200 OK):
{
  "dokumenVerifikasiId": 1,
  "penerimaUserId": 2,
  "namaFile": "KTP_12345.jpg",
  "filePath": "/uploads/verification/1702775940000_KTP_12345.jpg",
  "uploadedAt": "2025-12-17T10:45:30",
  "status": "terverifikasi",
  "message": "Status dokumen diupdate menjadi: terverifikasi"
}
```

### 4️⃣ Reject Document (Admin)
```
PUT http://localhost:8090/api/verifikasi/admin/1/verify

Request Body:
{
  "status": "ditolak"
}

Response (200 OK):
{
  "dokumenVerifikasiId": 1,
  "penerimaUserId": 2,
  "namaFile": "KTP_12345.jpg",
  "filePath": "/uploads/verification/1702775940000_KTP_12345.jpg",
  "uploadedAt": "2025-12-17T10:45:30",
  "status": "ditolak",
  "message": "Status dokumen diupdate menjadi: ditolak"
}
```

### 5️⃣ Check Document Status (Penerima/Admin)
```
GET http://localhost:8090/api/verifikasi/2/status

Response (200 OK):
{
  "penerimaUserId": 2,
  "dokumenVerifikasiId": 1,
  "namaFile": "KTP_12345.jpg",
  "filePath": "/uploads/verification/1702775940000_KTP_12345.jpg",
  "uploadedAt": "2025-12-17T10:45:30",
  "status": "terverifikasi",
  "message": "Status verifikasi: terverifikasi"
}
```

---

## Frontend Implementation Guide

### Admin Dashboard Page Structure
```
/app/admin/
├── page.tsx (Main admin dashboard)
└── [action]/
    └── page.tsx (Admin actions)
```

### Key Components Needed

#### 1. Admin Login (Already Exists)
- Reuse existing `/app/auth/login` page
- Login with admin credentials
- Store admin role in localStorage

#### 2. Admin Dashboard - List Pending Documents
- **API Call**: `GET /api/verifikasi/admin/pending`
- **Display**: Table/List dengan dokumen yang menunggu
- **Columns**: 
  - Nomor
  - Nama Penerima (dari penerimaUserId)
  - File Name
  - Upload Date
  - Status
  - Actions (View, Approve, Reject)

#### 3. Admin - View Document Detail
- **API Call**: `GET /api/verifikasi/{userId}/dokumen`
- **Display**: 
  - Full document info
  - File preview (jika image)
  - Penerima details
  - Current verification status

#### 4. Admin - Approve/Reject
- **API Call**: `PUT /api/verifikasi/admin/{dokumenId}/verify`
- **Request Body**: `{ "status": "terverifikasi" | "ditolak" }`
- **Buttons**: Approve, Reject with confirmation modal

#### 5. Refresh After Action
- After approve/reject, refresh list
- Show success/error toast
- Update UI realtime

---

## Database Access Setup

Before running backend, ensure database is initialized:

### Option 1: Manual Setup (Recommended First Time)
```bash
# 1. Open MySQL Client or DBeaver
# 2. Drop old database
DROP DATABASE IF EXISTS donasikuu;

# 3. Create new database
CREATE DATABASE donasikuu;

# 4. Import backup.sql
# In MySQL: source /path/to/backup.sql
# Or in DBeaver: Run SQL Script
```

### Option 2: Automatic via Backend
- Backend with `ddl-auto=update` akan auto-create tables
- But ENUM might have issues with existing values
- Better to do manual setup first

### Option 3: One-Click Setup Endpoint
```
POST http://localhost:8090/api/setup/init-admin

Response:
{
  "success": true,
  "message": "Admin setup completed",
  "username": "admin",
  "role": "admin"
}
```

---

## Testing Workflow

### 1. Setup & Login
```
1. POST /api/setup/init-admin (setup admin user)
2. Login dengan admin/admin123
3. Store token/session
```

### 2. Create Test Data
```
1. Register as Penerima (penerima@test.com / 123456)
2. Login as Penerima
3. Upload dokumen di /detail-akun
```

### 3. Admin Verification
```
1. Login as admin
2. GET /api/verifikasi/admin/pending (see uploaded docs)
3. PUT /api/verifikasi/admin/{id}/verify (approve/reject)
4. Check penerima status updated
```

---

## Status Values

```
menunggu_verifikasi  → Dokumen baru diupload, waiting for admin
terverifikasi        → Admin approve, penerima verified
ditolak              → Admin reject, penerima need re-upload
```

---

## Error Handling

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | Dokumen tidak ada | Pastikan dokumenId benar |
| 400 Bad Request | Status invalid | Gunakan 'terverifikasi' atau 'ditolak' |
| 401 Unauthorized | Not admin | Login sebagai admin terlebih dahulu |
| 500 Internal Server | Database error | Check MySQL connection |

---

## Performance Notes

- `GET /api/verifikasi/admin/pending` returns ALL docs filtered by status
- For large dataset, consider pagination in future
- File uploads stored in `/uploads/verification/` directory
- Files not deleted when document rejected (for audit trail)

---

## Security Considerations

⚠️ **Not yet implemented:**
- JWT authentication for admin endpoints
- Admin role validation in controllers
- Request validation middleware

**TODO for Production:**
- Add @PreAuthorize annotation to admin endpoints
- Implement JWT token validation
- Log all admin actions
- Add audit trail

---

## Next Steps

1. ✅ Database schema ready (with admin role)
2. ✅ Backend API endpoints ready
3. ⏳ Create frontend Admin Dashboard page
4. ⏳ Integrate with frontend

