# 🧪 QUICK TESTING CHECKLIST - VERIFIKASI INTEGRATION

## Prerequisites ✅
- [ ] MySQL running di `localhost:3307`
- [ ] Backend running di `http://localhost:8080`
- [ ] Frontend running di `http://localhost:3000`
- [ ] Database `donasikuu` sudah created dan populated

---

## 📋 USER ACCOUNTS FOR TESTING

Gunakan akun berikut untuk testing (pastikan ada di database):

### Penerima Account
```
Username: penerima_test
Password: password123
Role: penerima
```

### Admin Account
```
Username: admin_test
Password: password123
Role: admin
```

Jika belum ada, jalankan:
```bash
# From backend folder
./mvnw spring-boot:run
# Database akan auto-create via DataSeeder.java
```

---

## 🧪 TEST SCENARIOS

### ✅ TEST 1: UPLOAD DOKUMEN SEBAGAI PENERIMA

**Langkah:**
1. Buka `http://localhost:3000`
2. Login dengan akun penerima
3. Navigasi ke "Detail Akun" (sidebar atau profile menu)
4. Lihat status: harus "Belum Terverifikasi" + tombol "Unggah Dokumen"
5. Klik tombol "Unggah Dokumen"
6. Upload file gambar KTP (JPG/PNG, max 5MB)
7. Klik "Kirim"

**Expected Result:**
- ✓ Alert: "Dokumen berhasil diunggah! Menunggu verifikasi dari admin."
- ✓ Modal tertutup
- ✓ Status tetap "Belum Terverifikasi" (BUKAN berubah jadi "Terverifikasi")
- ✓ Refresh page, status masih "Belum Terverifikasi"

**Backend Check:**
```bash
# Cek di database
SELECT * FROM Dokumen_Verifikasi WHERE penerima_user_id = {userId};
# status_verifikasi harus: "menunggu_verifikasi"
```

---

### ✅ TEST 2: ADMIN LIHAT DASHBOARD

**Langkah:**
1. Logout dari penerima account
2. Login dengan admin account
3. Navigasi ke Admin Dashboard (`/admin/dashboard`)

**Expected Result:**
- ✓ Tampil header "Selamat Datang, {admin_username}!"
- ✓ Card "Menunggu Verifikasi" menampilkan count: 1 (atau lebih jika ada dokumen lain)
- ✓ Button "Verifikasi Penerima" menampilkan subtitle: "1 dokumen menunggu verifikasi"

---

### ✅ TEST 3: ADMIN LIHAT LIST VERIFIKASI

**Langkah:**
1. Dari Admin Dashboard, klik button "Verifikasi Penerima"
2. Atau langsung ke `http://localhost:3000/admin/verifikasi`

**Expected Result:**
- ✓ Halaman load dengan list dokumen yang menunggu
- ✓ Status count: menunjukkan jumlah yang menunggu
- ✓ Setiap item card menampilkan:
  - Username penerima
  - Email
  - No. Telepon
  - Nama file
  - Tanggal upload
  - Badge status: "⏳ Menunggu"

---

### ✅ TEST 4: ADMIN LIHAT DETAIL DOKUMEN

**Langkah:**
1. Dari list verifikasi, klik salah satu item
2. Modal detail terbuka

**Expected Result:**
- ✓ Modal menampilkan 3 section:
  1. **Informasi Penerima:** username, email, telpon, alamat
  2. **Informasi Dokumen:** nama file, tanggal upload, status "⏳ Menunggu Verifikasi"
  3. **Pratinjau Dokumen:** 
     - Jika file JPG/PNG: tampil preview image
     - Jika file lain: tampil icon file + link "Buka File"
- ✓ Bottom buttons: "Tutup", "Tolak" (merah), "Setujui" (hijau)

---

### ✅ TEST 5: ADMIN APPROVE DOKUMEN

**Langkah:**
1. Dari modal detail, klik button "Setujui"
2. Tunggu processing

**Expected Result:**
- ✓ Alert: "Dokumen berhasil disetujui!"
- ✓ Modal tertutup
- ✓ Item hilang dari list verifikasi (karena sudah approved)
- ✓ Count di top page berkurang: contoh dari 1 menjadi 0

**Backend Check:**
```bash
# Cek di database
SELECT * FROM Dokumen_Verifikasi WHERE dokumen_verifikasi_id = {dokumenId};
# status_verifikasi harus berubah jadi: "terverifikasi"
# verified_at harus terisi dengan timestamp
```

---

### ✅ TEST 6: PENERIMA LIHAT STATUS TERVERIFIKASI

**Langkah:**
1. Logout dari admin
2. Login kembali dengan akun penerima
3. Buka Detail Akun

**Expected Result:**
- ✓ Status berubah menjadi "✓ Terverifikasi" (warna hijau)
- ✓ Tombol "Unggah Dokumen" tidak tampil lagi
- ✓ Refresh page, status tetap "✓ Terverifikasi"

---

### ✅ TEST 7: ADMIN REJECT DOKUMEN

**Langkah:**
1. (Setup: Upload dokumen baru dari penerima lain atau gunakan penerima account lain)
2. Login admin
3. Dari list verifikasi, klik item
4. Modal terbuka
5. Klik button "Tolak"

**Expected Result:**
- ✓ Alert: "Dokumen berhasil ditolak!"
- ✓ Modal tertutup
- ✓ Item hilang dari list

**Backend Check:**
```bash
# Cek di database
SELECT * FROM Dokumen_Verifikasi WHERE dokumen_verifikasi_id = {dokumenId};
# status_verifikasi harus: "ditolak"
```

---

### ✅ TEST 8: PENERIMA RE-UPLOAD SETELAH REJECT

**Langkah:**
1. Logout admin
2. Login dengan penerima account yang dokumennya ditolak
3. Buka Detail Akun

**Expected Result:**
- ✓ Status kembali "Belum Terverifikasi" + tombol "Unggah Dokumen"
- ✓ Penerima bisa upload ulang
- ✓ Status akan kembali "menunggu_verifikasi"

---

## 🔍 ERROR SCENARIOS

### ❌ TEST: Upload file yang terlalu besar
- **Setup:** Upload file > 5MB
- **Expected:** Alert: "Gagal mengunggah" atau error message

### ❌ TEST: Akses admin page sebagai penerima
- **Setup:** Login sebagai penerima, akses `/admin/dashboard`
- **Expected:** Redirect ke `/dashboard`

### ❌ TEST: Database connection failed
- **Setup:** Stop MySQL
- **Expected:** Backend error, endpoint return 500

---

## 📊 INTEGRATION SUMMARY

| Fitur | Status | Backend | Frontend | Tested |
|-------|--------|---------|----------|--------|
| Upload Dokumen | ✅ | ✓ | ✓ | [ ] |
| Status Verifikasi | ✅ | ✓ | ✓ | [ ] |
| Admin List Pending | ✅ | ✓ | ✓ | [ ] |
| Admin Detail Modal | ✅ | ✓ | ✓ | [ ] |
| Admin Approve | ✅ | ✓ | ✓ | [ ] |
| Admin Reject | ✅ | ✓ | ✓ | [ ] |
| Dashboard Count | ✅ | ✓ | ✓ | [ ] |
| Real-time Status | ✅ | ✓ | ✓ | [ ] |

---

## 🚀 POST-TESTING

Jika semua test ✅, sistem siap untuk:
- [ ] User Acceptance Testing (UAT)
- [ ] Production Deployment
- [ ] Live Monitoring

Jika ada ❌ test yang gagal:
1. Check console errors (F12)
2. Check backend logs
3. Check database connection
4. Report ke development team

---

## 📞 TROUBLESHOOTING

### "Cannot connect to database"
```bash
# Check MySQL
mysql -u root -p
USE donasikuu;
SHOW TABLES;
```

### "404 api not found"
```bash
# Check backend running
curl http://localhost:8080/api/verifikasi/admin/pending
```

### "Frontend page blank"
```bash
# Check console (F12 → Console tab)
# Check network requests
# Try hard refresh: Ctrl+Shift+R
```

### "File tidak bisa dipreview"
- Check file path di database
- Check folder `uploads/verification/` exist
- Check file permissions

---

## ✨ FINAL CHECKLIST

- [ ] Database connected
- [ ] Backend running without errors
- [ ] Frontend running without errors
- [ ] All 8 tests passed
- [ ] No critical errors in console
- [ ] Documentation reviewed
- [ ] Ready for production

---

**Last Updated:** 2025-12-17  
**Dokumentasi:** VERIFIKASI_INTEGRATION_GUIDE.md  
**Testing:** VERIFIKASI_TESTING_CHECKLIST.md (ini file)
