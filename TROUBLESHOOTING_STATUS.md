# 🔧 TROUBLESHOOTING - Status Tidak Berubah di Detail Akun

## ⚠️ MASALAH: Status tetap "Belum Terverifikasi" setelah upload

---

## 🔍 DEBUGGING STEPS

### Step 1: Open Browser Console (F12)
```
1. Tekan F12 di keyboard
2. Pergi ke tab "Console"
3. Lihat logs yang dimulai dengan "[DEBUG]"
```

### Step 2: Upload dokumen dan lihat console output
```
Expected logs:
  [DEBUG] Fetching status for userId: 5
  [DEBUG] API Response: { status: "menunggu_verifikasi", username: "...", ... }
  [DEBUG] Status is menunggu_verifikasi - setting isVerified to false

Jika status berhasil diupload:
  [DEBUG] Uploading file for userId: 5
  [DEBUG] Upload successful: { ... }
```

### Step 3: Check Network Tab
```
1. Tekan F12 → Tab "Network"
2. Refresh page
3. Upload dokumen
4. Lihat requests:
   - POST /api/verifikasi/upload (status 201 = success)
   - GET /api/verifikasi/{userId}/status (status 200 = success)
```

---

## 🆘 COMMON ISSUES & SOLUTIONS

### Issue 1: "Cannot connect to localhost:8080"
```
Tanda: 
  - Console error: "Failed to fetch"
  - Network tab: Request ke 8080 failed

Solusi:
  1. Pastikan backend running: mvnw spring-boot:run
  2. Check backend URL: http://localhost:8080 (buka di browser)
  3. Check firewall/antivirus tidak block port 8080
```

### Issue 2: "404 Not Found pada /api/verifikasi/..."
```
Tanda:
  - Network tab: Status 404
  - Console: "Not found"

Solusi:
  1. Backend belum di-restart setelah code changes
  2. Endpoint mungkin salah ketik
  3. Try: curl http://localhost:8080/api/verifikasi/admin/pending
```

### Issue 3: "CORS Error"
```
Tanda:
  - Console: "Cross-Origin Request Blocked"

Solusi:
  1. Backend security config mungkin strict
  2. Try buka backend API di browser dulu: http://localhost:8080/api/verifikasi/1/status
  3. Check backend SecurityConfig.java - pastikan CORS enabled
```

### Issue 4: Status tidak update meski upload success
```
Tanda:
  - Upload alert berhasil, tapi status tetap "Belum Terverifikasi"
  - Console: [DEBUG] logs tampil normal

Solusi:
  1. Click tombol "🔄 Refresh" yang baru di header
  2. Tunggu 2-3 detik, kemudian refresh page (F5)
  3. Check database manual:
     SELECT * FROM Dokumen_Verifikasi WHERE penerima_user_id = {userId};
     // Cek apakah status_verifikasi = "menunggu_verifikasi"
```

### Issue 5: MySQL Connection Error
```
Tanda:
  - Backend logs: "Communications link failure"
  - Database tidak terkoneksi

Solusi:
  1. Pastikan MySQL running
  2. Cek config: application.properties
     spring.datasource.url=jdbc:mysql://localhost:3307/donasikuu
     spring.datasource.username=root
     spring.datasource.password=
  3. Test manual: mysql -u root -p donasikuu
```

---

## 🧪 MANUAL TESTING WITHOUT UI

Jika frontend bermasalah, test API langsung:

### Test 1: Upload File (via curl)
```bash
# Prepare test file
touch test_ktp.jpg

# Upload via curl
curl -X POST http://localhost:8080/api/verifikasi/upload \
  -F "userId=1" \
  -F "file=@test_ktp.jpg"

# Expected Response (201):
{
  "dokumenVerifikasiId": 1,
  "penerimaUserId": 1,
  "status": "menunggu_verifikasi",
  "message": "Dokumen verifikasi berhasil diupload. Menunggu verifikasi dari admin"
}
```

### Test 2: Check Status (via curl)
```bash
curl http://localhost:8080/api/verifikasi/1/status

# Expected Response (200):
{
  "penerimaUserId": 1,
  "status": "menunggu_verifikasi",
  "username": "penerima_test",
  "email": "penerima@test.com"
}
```

### Test 3: Check Database Manual
```sql
-- Connect to database
mysql -u root -p

-- Use database
USE donasikuu;

-- Check dokumen
SELECT * FROM Dokumen_Verifikasi WHERE penerima_user_id = 1;

-- Check status
SELECT status_verifikasi, uploaded_at FROM Dokumen_Verifikasi 
WHERE penerima_user_id = 1 ORDER BY uploaded_at DESC LIMIT 1;
```

---

## 📋 CHECKLIST: HAL YANG PERLU DICEK

- [ ] Backend running (check localhost:8080)
- [ ] Frontend running (check localhost:3000)
- [ ] MySQL running (check connection)
- [ ] Browser console clear of errors (F12)
- [ ] Network tab shows 200/201 responses
- [ ] Database table Dokumen_Verifikasi ada data
- [ ] Status di database = "menunggu_verifikasi"

---

## 🎯 IMPROVED FEATURES (Sudah ditambahkan)

Saya sudah improve detail-akun page dengan:

1. **Better Status Display** ✅
   - "✓ Terverifikasi" (hijau)
   - "⏳ Menunggu Verifikasi" (kuning)
   - "✗ Ditolak" (merah)
   - "Belum Terverifikasi" (abu-abu)

2. **Refresh Button** ✅
   - Click "🔄 Refresh" di header untuk manual refresh status
   - Tidak perlu refresh seluruh page

3. **Better Console Logging** ✅
   - [DEBUG] logs untuk tracking status
   - [ERROR] logs untuk error handling
   - Mudah di-track di F12 console

4. **Better Error Handling** ✅
   - Clear error messages
   - Try-catch di semua async functions
   - Timeout handler untuk API

---

## 📞 QUICK FIXES

### Jika status tidak berubah:

**Fix 1: Manual Refresh**
```
1. Click "🔄 Refresh" button di header
2. Tunggu response
3. Status harus update
```

**Fix 2: Full Page Refresh**
```
1. Tekan F5 (full refresh)
2. Akan re-fetch semua data dari API
3. Status harus updated
```

**Fix 3: Check Backend Logs**
```
1. Lihat terminal backend
2. Ada error message?
3. Cek database connection
4. Restart backend: Ctrl+C → mvnw spring-boot:run
```

---

## ✨ TIPS

- Selalu buka console (F12) saat testing
- Lihat [DEBUG] logs untuk understand flow
- Check network tab untuk see actual responses
- Backend logs juga penting untuk debugging
- Database query bisa confirm data ada

---

## 🚀 KALAU MASIH BERMASALAH

1. Buka file: DOKUMENTASI_INDEX.md
2. Baca: VERIFIKASI_TESTING_CHECKLIST.md
3. Follow troubleshooting guide di sana
4. Check backend logs untuk error details

---

**Semua improvements sudah di-implement!** ✅

**Next:** Test dengan langkah-langkah di atas dan lihat console logs untuk tracking.
