# Checklist Integrasi Frontend-Backend

## ✅ Completed Tasks

### Backend Configuration
- [x] CORS Configuration added di SecurityConfig.java
  - Allows: http://localhost:3000, http://localhost:3001
  - Methods: GET, POST, PUT, DELETE, OPTIONS
  
- [x] AuthController register endpoint
  - POST /api/auth/register
  - Accepts RegisterRequest DTO
  
- [x] AuthService implementation
  - Username & Email validation (duplicate check)
  - Password encryption (BCrypt)
  - Role conversion (String → Enum)
  - User entity save to database
  
- [x] User Entity
  - Maps to 'Users' table in database
  - Fields: username, email, password, nama, alamat, no_telepon, role, status
  
- [x] RegisterRequest DTO
  - Validation annotations (@NotBlank, @Email, @Size)
  - Fields: username, email, password, role, nama, alamat, noTelepon

### Frontend Configuration
- [x] Signup Form (/auth/signup)
  - Form fields: username, email, role, password, confirmPassword
  - Client-side validation
  
- [x] API Integration
  - POST to http://localhost:8080/api/auth/register
  - Error handling
  - Success redirect to /auth/login
  
- [x] Role selection fixed
  - Changed from "donor"/"recipient" to "donatur"/"penerima"

### Testing
- [x] Backend API test with cURL ✓
  - Successfully registered testuser123
  - Response: "User testuser123 berhasil didaftarkan."

---

## 🚀 How to Test Integration

### Step 1: Open Frontend
```
http://localhost:3000/auth/signup
```

### Step 2: Fill Form
- Username: `testuser456`
- Email: `test456@gmail.com`
- Role: `Donatur` (or `Penerima`)
- Password: `password123`
- Confirm Password: `password123`

### Step 3: Click Register Button
- Should show "Memproses..." button text
- If success: Redirected to `/auth/login`
- If error: Red error message displayed

### Step 4: Verify in Database
- User created with encrypted password
- Status: active
- created_at & updated_at timestamps set

---

## 📊 Data Flow

```
[Frontend Form]
    ↓
[Client Validation]
    ↓
[HTTP POST to Backend]
    ↓
[AuthController]
    ↓
[AuthService Business Logic]
    ↓
[Database (Users Table)]
    ↓
[HTTP Response]
    ↓
[Frontend Redirect or Error Display]
```

---

## 🔧 Configuration Details

### Backend Port: 8080
```properties
server.port=8080
```

### Frontend Port: 3000
```bash
npm run dev
```

### Database: MySQL
```
Host: localhost
Port: 3307
Database: donasikuu
```

---

## 📝 API Endpoint

### Register New User
```
POST /api/auth/register

Request Body:
{
  "username": "string (3-99 chars)",
  "email": "valid-email@domain.com",
  "password": "string (min 6 chars)",
  "role": "donatur" or "penerima",
  "nama": "string (optional)",
  "alamat": "string (optional)",
  "noTelepon": "string (optional)"
}

Response Success (201):
"User [username] berhasil didaftarkan."

Response Error (400):
"[Error message]"
```

---

## 🔐 Security Measures

1. **Password Encryption**
   - BCryptPasswordEncoder
   - Passwords stored as hashes

2. **CORS Protection**
   - Only allowed origins
   - Prevents unauthorized cross-origin requests

3. **Input Validation**
   - Server-side validation with Jakarta Validation
   - Email format validation
   - Required field checks

4. **Database Constraints**
   - UNIQUE username
   - UNIQUE email
   - NOT NULL fields

---

## 📱 Files Modified

### Backend
- `SecurityConfig.java` - CORS configuration
- `RegisterRequest.java` - Added optional fields
- `AuthService.java` - Updated to handle all fields

### Frontend
- `app/auth/signup/page.tsx` - API integration

---

## ⚠️ Important Notes

1. **Database Connection**
   - Ensure MySQL is running on port 3307
   - Database name: "donasikuu"
   - User: root (no password)

2. **Email Validation**
   - Must be unique in database
   - Must be valid email format

3. **Role Values**
   - Must be exactly: "donatur" or "penerima"
   - Case sensitive
   - Stored as ENUM in database

4. **Password Requirements**
   - Minimum 6 characters
   - Will be encrypted with BCrypt
   - Should be strong (recommended best practice)

---

## 🎯 Next Development Tasks

1. **Login Endpoint**
   - Implement POST /api/auth/login
   - Add JWT token generation
   - Return authentication token

2. **Frontend Login**
   - Form with username/email and password
   - Store token in localStorage
   - Redirect to dashboard

3. **Protected Routes**
   - Add authentication middleware
   - Check token validity
   - Refresh token logic

4. **User Profile**
   - GET /api/users/{id}
   - PUT /api/users/{id}
   - Update profile information

---

Generated: December 16, 2025
Status: Ready for Testing ✓
