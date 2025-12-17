# 🏗️ ARSITEKTUR SISTEM VERIFIKASI DONASIKU

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DONASIKU VERIFICATION SYSTEM                │
└─────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │  BROWSER     │
                              │  (Frontend)  │
                              └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
          ┌─────────▼──────┐  ┌──────▼────────┐  ┌───▼───────────┐
          │ PENERIMA PAGE  │  │ ADMIN PAGE    │  │ OTHER PAGES   │
          │                │  │               │  │               │
          │ - Detail Akun  │  │ - Dashboard   │  │ - Donasi      │
          │ - Upload Modal │  │ - Verifikasi  │  │ - Permintaan  │
          │ - Status View  │  │ - List Items  │  │ - Riwayat     │
          └──┬──────────┬──┘  └───┬───────┬──┘  └───┬───────────┘
             │          │         │       │         │
             │ Upload   │ Check   │ Fetch │ Approve │
             │          │ Status  │ List  │ Reject  │
             │          │         │       │         │
             ▼          ▼         ▼       ▼         ▼
          ┌──────────────────────────────────────────────┐
          │  NEXT.JS FRONTEND                            │
          │  (http://localhost:3000)                     │
          └──────────────────────┬───────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼ fetch                   ▼ fetch
          ┌─────────────────────────────────────────────┐
          │  SPRING BOOT BACKEND                        │
          │  (http://localhost:8080)                    │
          │                                             │
          │  ┌───────────────────────────────────────┐ │
          │  │ VerifikasiController                  │ │
          │  ├─ POST   /api/verifikasi/upload       │ │
          │  ├─ GET    /api/verifikasi/{id}/status  │ │
          │  ├─ GET    /api/verifikasi/admin/pending│ │
          │  └─ PUT    /api/verifikasi/admin/{id}   │ │
          │  └───────────────────────────────────────┘ │
          │                    ▼                        │
          │  ┌───────────────────────────────────────┐ │
          │  │ VerifikasiService                     │ │
          │  ├─ uploadDokumenVerifikasi()            │ │
          │  ├─ getDokumenVerifikasi()               │ │
          │  ├─ getStatusVerifikasi()                │ │
          │  ├─ getAllPendingVerifikasi()            │ │
          │  └─ updateVerifikasiStatus()             │ │
          │  └───────────────────────────────────────┘ │
          │                    ▼                        │
          │  ┌───────────────────────────────────────┐ │
          │  │ JPA Repositories                      │ │
          │  ├─ DokumenVerifikasiRepository          │ │
          │  ├─ UserRepository                       │ │
          │  └───────────────────────────────────────┘ │
          └──────────────────────┬───────────────────────┘
                                 │
                                 ▼
          ┌──────────────────────────────────────────────┐
          │  MySQL DATABASE                              │
          │  (jdbc:mysql://localhost:3307/donasikuu)     │
          │                                              │
          │  ┌──────────────────────────────────────┐  │
          │  │ Users Table                          │  │
          │  ├─ user_id (PK)                       │  │
          │  ├─ username, email, role              │  │
          │  ├─ nama, alamat, no_telepon           │  │
          │  └──────────────────────────────────────┘  │
          │                                              │
          │  ┌──────────────────────────────────────┐  │
          │  │ Dokumen_Verifikasi Table             │  │
          │  ├─ dokumen_verifikasi_id (PK)         │  │
          │  ├─ penerima_user_id (FK)              │  │
          │  ├─ nama_file, file_path               │  │
          │  ├─ uploaded_at, verified_at           │  │
          │  ├─ status_verifikasi (pending/ok/no)  │  │
          │  └──────────────────────────────────────┘  │
          │                                              │
          │  ┌──────────────────────────────────────┐  │
          │  │ uploads/verification/                │  │
          │  │ (Dokumen files storage)              │  │
          │  └──────────────────────────────────────┘  │
          └──────────────────────────────────────────────┘
```

---

## Request/Response Flow

### 1️⃣ UPLOAD DOKUMEN (Penerima)

```
Penerima Browser
    │
    ├─ Login ──────────────────────────────────────────────►
    │
    ├─ Navigate to /detail-akun
    │
    ├─ Click "Unggah Dokumen"
    │
    ├─ Select file (JPG/PNG)
    │
    └─► POST /api/verifikasi/upload ─────────────────────►
        │ Form Data:
        │   - userId: 5
        │   - file: (binary)
        │
        Backend Processing:
        │
        ├─ Validate user role (penerima only)
        │
        ├─ Save file to uploads/verification/
        │
        ├─ Create DokumenVerifikasi record
        │   - status: "menunggu_verifikasi"
        │   - uploaded_at: now
        │
        └─ Return VerifikasiResponse
           │
           └──► Frontend receives
               │
               ├─ Show success alert
               ├─ Close modal
               └─ Status stays: "Belum Terverifikasi" ✓
```

### 2️⃣ ADMIN LIHAT LIST (Admin)

```
Admin Browser
    │
    ├─ Login as admin
    │
    ├─ Navigate to /admin/dashboard
    │
    ├─ Auto-fetch pending count
    │
    └─► GET /api/verifikasi/admin/pending ─────────────►
        │
        Backend Query:
        │
        ├─ SELECT * FROM Dokumen_Verifikasi
        │   WHERE status_verifikasi = "menunggu_verifikasi"
        │
        ├─ JOIN with Users table
        │
        └─ Return list of VerifikasiResponse
           │
           └──► Frontend displays
               │
               ├─ Show count in widget
               ├─ List items with user info
               └─ Ready for detail view
```

### 3️⃣ ADMIN VIEW DETAIL & PREVIEW

```
Admin clicks item in list
    │
    ├─ Modal opens
    │
    ├─ Display:
    │   ├─ User info (username, email, telpon, alamat)
    │   ├─ Document info (filename, upload date)
    │   └─ Preview document (image or link)
    │
    └─ Ready for Approve/Reject
```

### 4️⃣ ADMIN APPROVE

```
Admin clicks "Setujui"
    │
    └─► PUT /api/verifikasi/admin/1/verify ────────────►
        │ JSON Body:
        │   { "status": "terverifikasi" }
        │
        Backend Processing:
        │
        ├─ Find dokumen by ID
        │
        ├─ Update status to "terverifikasi"
        │
        ├─ Set verified_at = now
        │
        └─ Return updated VerifikasiResponse
           │
           └──► Frontend
               │
               ├─ Show success alert
               ├─ Close modal
               ├─ Remove item from list
               └─ Update count
```

### 5️⃣ PENERIMA LIHAT STATUS TERVERIFIKASI

```
Penerima navigates to /detail-akun
    │
    └─► GET /api/verifikasi/{userId}/status ──────────►
        │
        Backend Query:
        │
        ├─ SELECT * FROM Dokumen_Verifikasi
        │   WHERE penerima_user_id = 5
        │
        └─ Return status: "terverifikasi"
           │
           └──► Frontend updates UI
               │
               ├─ Status badge: "✓ Terverifikasi"
               └─ Hide "Unggah Dokumen" button
```

---

## Data Flow Components

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA MODELS                              │
└─────────────────────────────────────────────────────────────┘

User Entity:
├─ user_id (PK)
├─ username (unique)
├─ email (unique)
├─ password (hashed)
├─ nama
├─ alamat
├─ no_telepon
├─ foto_profil
├─ role: "admin" | "penerima" | "donatur"
├─ created_at
└─ updated_at

DokumenVerifikasi Entity:
├─ dokumen_verifikasi_id (PK)
├─ penerima_user_id (FK) ──────► User.user_id
├─ nama_file
├─ file_path
├─ uploaded_at
├─ status_verifikasi: "menunggu_verifikasi" | "terverifikasi" | "ditolak"
├─ verified_at (nullable)
└─ created_at

VerifikasiResponse DTO:
├─ dokumenVerifikasiId
├─ penerimaUserId
├─ namaFile
├─ filePath
├─ uploadedAt
├─ status
├─ message
├─ username
├─ email
├─ noTelepon
└─ alamat
```

---

## Status Lifecycle

```
START
  │
  └─► No Document
      │
      └─► First Upload
          │
          ├─► Status: "menunggu_verifikasi"
          │     │
          │     ├─► Penerima sees: "Belum Terverifikasi" ❌
          │     │
          │     └─► Admin can see in pending list ✓
          │           │
          │           ├─► Admin Approves
          │           │     │
          │           │     └─► Status: "terverifikasi"
          │           │           │
          │           │           └─► Penerima sees: "✓ Terverifikasi" ✓
          │           │
          │           └─► Admin Rejects
          │                 │
          │                 └─► Status: "ditolak"
          │                       │
          │                       └─► Can Re-upload
          │                             │
          │                             └─► Back to "menunggu_verifikasi"
          │
          └─► Update (Re-upload)
                │
                └─► Repeat cycle
```

---

## API Contract

```
┌─────────────────────────────────────────────────────────┐
│ ENDPOINT 1: UPLOAD DOKUMEN                              │
├─────────────────────────────────────────────────────────┤
│ POST /api/verifikasi/upload                             │
│ Content-Type: multipart/form-data                       │
│                                                          │
│ Request:                                                │
│   userId: Integer                                       │
│   file: File (JPG/PNG, max 5MB)                        │
│                                                          │
│ Response (201 Created):                                 │
│   VerifikasiResponse {                                  │
│     dokumenVerifikasiId: 1,                            │
│     penerimaUserId: 5,                                  │
│     status: "menunggu_verifikasi",                     │
│     message: "Dokumen berhasil diupload..."            │
│   }                                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ ENDPOINT 2: CHECK STATUS                                │
├─────────────────────────────────────────────────────────┤
│ GET /api/verifikasi/{userId}/status                     │
│                                                          │
│ Response (200 OK):                                      │
│   VerifikasiResponse {                                  │
│     penerimaUserId: 5,                                  │
│     status: "terverifikasi",                           │
│     username: "john_penerima",                         │
│     email: "john@email.com"                            │
│   }                                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ ENDPOINT 3: ADMIN GET PENDING LIST                       │
├─────────────────────────────────────────────────────────┤
│ GET /api/verifikasi/admin/pending                       │
│                                                          │
│ Response (200 OK):                                      │
│   [                                                      │
│     VerifikasiResponse { ... },                        │
│     VerifikasiResponse { ... }                         │
│   ]                                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ ENDPOINT 4: ADMIN APPROVE/REJECT                         │
├─────────────────────────────────────────────────────────┤
│ PUT /api/verifikasi/admin/{dokumenId}/verify             │
│ Content-Type: application/json                          │
│                                                          │
│ Request:                                                │
│   { "status": "terverifikasi" }  // or "ditolak"       │
│                                                          │
│ Response (200 OK):                                      │
│   VerifikasiResponse {                                  │
│     dokumenVerifikasiId: 1,                            │
│     status: "terverifikasi",                           │
│     message: "Status dokumen diupdate menjadi..."      │
│   }                                                      │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Component Hierarchy

```
┌─ App (Next.js)
│
├─ /detail-akun
│  └─ DetailAkunPage
│     ├─ State:
│     │  ├─ user
│     │  ├─ isVerified
│     │  ├─ loading
│     │  ├─ showUploadModal
│     │  └─ selectedFile
│     │
│     ├─ Effects:
│     │  └─ Load user & check status
│     │
│     ├─ Functions:
│     │  ├─ checkVerificationStatus()
│     │  ├─ handleUpload()
│     │  └─ handleFileSelect()
│     │
│     └─ Render:
│        ├─ Header
│        ├─ Account Info Section
│        │  └─ Status Badge (Belum/Terverifikasi)
│        ├─ Upload Button
│        └─ Upload Modal
│           ├─ File Input
│           └─ Confirm Buttons
│
├─ /admin/dashboard
│  └─ AdminDashboardPage
│     ├─ State:
│     │  ├─ user
│     │  ├─ loading
│     │  └─ pendingVerifikasiCount
│     │
│     ├─ Effects:
│     │  └─ Fetch pending count
│     │
│     └─ Render:
│        ├─ Header
│        ├─ Overview Cards
│        │  └─ Pending Count Widget (dynamic)
│        └─ Management Buttons
│           └─ "Verifikasi Penerima" (navigates to /admin/verifikasi)
│
└─ /admin/verifikasi
   └─ VerifikasiPenerimaPage
      ├─ State:
      │  ├─ user
      │  ├─ penerima (list)
      │  ├─ selectedPenerima
      │  ├─ loading
      │  └─ filterStatus
      │
      ├─ Effects:
      │  └─ Fetch pending list
      │
      ├─ Functions:
      │  ├─ fetchData()
      │  ├─ handleApprove()
      │  ├─ handleReject()
      │  └─ mapStatus()
      │
      └─ Render:
         ├─ Header
         ├─ Status Count Card
         ├─ List Items
         │  └─ Click to open modal
         └─ Detail Modal
            ├─ User Info Section
            ├─ Document Info Section
            ├─ Preview Section
            └─ Action Buttons (Close/Reject/Approve)
```

---

## Error Handling Flow

```
Error Scenarios:

1. Database Connection Error
   └─► Backend returns 500
       └─► Frontend shows alert

2. File Too Large
   └─► Frontend validation (5MB limit)
       └─► Show error message

3. Invalid Role (Penerima trying to approve)
   └─► Backend returns 403
       └─► Frontend redirects

4. Document Not Found
   └─► Backend returns 404
       └─► Frontend shows error

5. Invalid Status Update
   └─► Backend returns 400
       └─► Frontend shows alert
```

---

## Security Layers

```
┌─────────────────────────────────────────────┐
│ FRONTEND SECURITY                           │
├─────────────────────────────────────────────┤
│ ✓ Role-based page access control            │
│ ✓ File type validation (JPG/PNG)            │
│ ✓ File size validation (max 5MB)            │
│ ✓ Session storage check                     │
│ ✓ CSRF tokens (if needed)                   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ BACKEND SECURITY                            │
├─────────────────────────────────────────────┤
│ ✓ Role validation (only penerima/admin)     │
│ ✓ User ID verification                      │
│ ✓ File validation (virus scan ready)        │
│ ✓ SQL injection protection (JPA)            │
│ ✓ Input sanitization                        │
│ ✓ Exception handling                        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ DATABASE SECURITY                           │
├─────────────────────────────────────────────┤
│ ✓ Parameterized queries (JPA)               │
│ ✓ Foreign key constraints                   │
│ ✓ User authentication                       │
│ ✓ Encrypted passwords                       │
└─────────────────────────────────────────────┘
```

---

**Architecture Version:** 1.0  
**Last Updated:** 2025-12-17  
**Status:** Production Ready ✅
