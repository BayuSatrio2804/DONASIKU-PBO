# Panduan Integrasi Frontend-Backend Donasiku

## Overview
Aplikasi Donasiku menggunakan arsitektur client-server dengan:
- **Frontend**: Next.js 16 (localhost:3000)
- **Backend**: Spring Boot 4.0 (localhost:8080)
- **Database**: MySQL (localhost:3307)

---

## Alur Signup (Pendaftaran)

### 1. User mengisi Form Signup
```
Frontend Form (/auth/signup):
- Username
- Email
- Role (Donatur / Penerima)
- Password
- Confirm Password
```

### 2. Frontend Validasi
```typescript
// File: frontend/app/auth/signup/page.tsx
- Cek semua field tidak kosong
- Cek password === confirmPassword
- Cek password minimal 6 karakter
```

### 3. Frontend Kirim ke Backend API
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "donatur"  // atau "penerima"
}
```

### 4. Backend Process
**File**: `backend/src/main/java/Donasiku/spring/core/controller/AuthController.java`

```java
@PostMapping("/register")
public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request)
```

**Langkah-langkah**:
1. DTO Validation (RegisterRequest)
2. AuthService.registerNewUser()
3. Cek username belum digunakan
4. Cek email belum terdaftar
5. Encode password dengan BCryptPasswordEncoder
6. Konversi role String → Enum
7. Simpan ke database (User entity)
8. Return respons sukses

### 5. Database Storage
**Tabel**: `Users`

```sql
CREATE TABLE Users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(99) UNIQUE NOT NULL,
  email VARCHAR(99) UNIQUE NOT NULL,
  password VARCHAR(319) NOT NULL,  -- Encrypted
  nama VARCHAR(99) NOT NULL,
  alamat TEXT,
  no_telepon VARCHAR(99),
  foto_profil VARCHAR(99),
  role ENUM('donatur', 'penerima') NOT NULL,
  status ENUM('active', 'deleted', 'suspended'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 6. Frontend Respons
- **Success**: Redirect ke /auth/login
- **Error**: Tampilkan error message

---

## Konfigurasi yang Sudah Dilakukan

### ✅ CORS Configuration
**File**: `backend/src/main/java/Donasiku/spring/core/config/SecurityConfig.java`

Mengizinkan request dari:
- http://localhost:3000
- http://localhost:3001

Methods: GET, POST, PUT, DELETE, OPTIONS

### ✅ Frontend API Call
**File**: `frontend/app/auth/signup/page.tsx`

```typescript
const response = await fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: formData.username,
    email: formData.email,
    password: formData.password,
    role: formData.role,
  }),
});
```

### ✅ Password Encryption
- BCryptPasswordEncoder di backend
- Password tidak disimpan plain text

---

## Testing Integration

### 1. Test dengan Frontend
```
1. Buka http://localhost:3000/auth/signup
2. Isi form:
   - Username: testuser
   - Email: test@example.com
   - Role: Donatur
   - Password: password123
   - Confirm: password123
3. Klik "Daftar"
4. Cek apakah redirect ke login page
```

### 2. Test dengan Postman/cURL
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "role": "donatur"
  }'
```

### 3. Verifikasi Database
```sql
SELECT * FROM Users WHERE username = 'testuser';
```

---

## Struktur File Penting

```
Backend:
├── controller/
│   └── AuthController.java           ← Endpoint POST /register
├── service/
│   └── AuthService.java              ← Business logic registerNewUser()
├── dto/
│   └── RegisterRequest.java          ← Validasi input
├── entity/
│   └── User.java                     ← Database schema
├── repository/
│   └── UserRepository.java           ← Database queries
└── config/
    └── SecurityConfig.java           ← CORS, Security

Frontend:
└── app/auth/signup/
    └── page.tsx                      ← Form & API call
```

---

## Error Handling

### Backend Errors
1. **Username sudah digunakan**: `409 Conflict`
2. **Email sudah terdaftar**: `409 Conflict`
3. **Invalid role**: `400 Bad Request`
4. **Validation failed**: `400 Bad Request`

### Frontend Display
Error messages ditampilkan di alert box merah.

---

## Next Steps (Untuk Fitur Selanjutnya)

### 1. Login Implementation
- POST /api/auth/login
- JWT Token generation
- Store token di localStorage/cookies

### 2. Authentication Guard
- Protect routes yang memerlukan login
- Redirect ke login jika tidak authenticated

### 3. User Profile
- GET /api/users/{id}
- PUT /api/users/{id} untuk update profil

### 4. Logout
- Clear token
- Redirect ke login

---

## Notes
- Password harus minimal 6 karakter
- Role: "donatur" atau "penerima"
- Pastikan MySQL running di port 3307
- Pastikan database "donasikuu" sudah dibuat
