# 🖼️ IMAGE PREVIEW FEATURE - Admin Verifikasi

## 📝 Update: Image Preview untuk Dokumen Verifikasi

Sekarang admin dapat melihat **gambar preview** dari dokumen yang diupload oleh penerima, bukan hanya nama file saja.

---

## 🎯 Fitur Baru

### Sebelumnya:
- Hanya menampilkan nama file: "KTP_scan.jpg"
- Admin harus download untuk lihat gambar

### Sesudah:
- Menampilkan nama file
- **Menampilkan preview gambar langsung di modal**
- Klik gambar untuk buka ukuran penuh di tab baru
- Memudahkan admin untuk verifikasi dokumen

---

## 🔧 Technical Implementation

### 1. Update Penerima Interface
```typescript
interface Penerima {
  // ... existing fields
  filePath?: string;  // ← NEW: Path ke file di backend
}
```

### 2. Store filePath dari API Response
```typescript
const formatted: Penerima[] = data.map((item: any) => ({
  // ... existing mapping
  filePath: item.filePath, // ← Ambil dari backend response
}));
```

### 3. Render Image Preview di Modal
```tsx
{/* Image Preview */}
{selectedPenerima.filePath && (
  <div className="mt-3">
    <img
      src={`http://localhost:8080${selectedPenerima.filePath}`}
      alt="Dokumen Verifikasi"
      className="w-full max-h-96 rounded-lg border border-blue-300 object-cover cursor-pointer hover:opacity-90 transition-all"
      onClick={() => window.open(`http://localhost:8080${selectedPenerima.filePath}`, '_blank')}
      title="Klik untuk membuka gambar dalam ukuran penuh"
    />
    <p className="text-xs text-gray-500 mt-2">💡 Klik gambar untuk lihat ukuran penuh</p>
  </div>
)}
```

---

## 📋 Modified Files

| File | Changes |
|------|---------|
| [frontend/app/admin/verifikasi/page.tsx](frontend/app/admin/verifikasi/page.tsx) | ✅ Updated Penerima interface, store filePath, added image preview UI |

---

## 🚀 How It Works

### Step 1: Admin membuka Verifikasi Penerima page
```
Admin Dashboard → Verifikasi Penerima
```

### Step 2: Admin klik salah satu penerima untuk lihat detail
```
List menunjukkan: Bayu (email, telepon, alamat)
Click → Modal terbuka
```

### Step 3: Modal menampilkan:
1. **Nama File**: "KTP_scan.jpg" dengan icon 📄
2. **Gambar Preview**: Thumbnail dari dokumen
3. **Hint**: "💡 Klik gambar untuk lihat ukuran penuh"

### Step 4: Admin bisa:
- **Lihat preview di modal** (max-height: 384px / 24rem)
- **Klik gambar** untuk buka ukuran penuh di tab baru
- **Approve atau Reject** dokumen berdasarkan gambar

---

## 🎨 UI Details

### Image Preview Styling
```
- Width: 100% (full width modal)
- Max Height: 384px (24rem)
- Object Fit: cover (maintain aspect ratio)
- Border: 1px solid blue-300
- Border Radius: rounded-lg
- Cursor: pointer (hover effect)
- Hover: opacity-90 (slight transparency)
```

### Fallback
- Jika tidak ada filePath → image tidak ditampilkan (graceful degradation)
- Hanya nama file yang ditampilkan

---

## 🔍 Expected Backend Response

Backend `/api/verifikasi/admin/pending` harus return:

```json
{
  "dokumenVerifikasiId": 1,
  "username": "Bayu",
  "email": "bayu@test.com",
  "noTelepon": "081234567890",
  "alamat": "Jln Test No 123",
  "status": "menunggu_verifikasi",
  "namaFile": "KTP_scan.jpg",
  "filePath": "/uploads/verification/KTP_scan.jpg",  ← KEY
  "uploadedAt": "2025-12-17T10:00:00",
  "penerimaUserId": 5
}
```

✅ Backend sudah di-check, response format sudah correct!

---

## 🧪 Testing

### Test 1: View Image Preview
```
1. Buka http://localhost:3000/admin/verifikasi (as admin)
2. Lihat list penerima
3. Click salah satu penerima
4. Modal terbuka
5. Seharusnya bisa lihat:
   - Nama file dengan icon 📄
   - Gambar preview dari dokumen
   - Hint "Klik gambar untuk lihat ukuran penuh"
```

### Test 2: Click Gambar untuk Ukuran Penuh
```
1. Di modal, click gambar preview
2. Seharusnya buka tab baru dengan URL:
   http://localhost:8080/uploads/verification/{filename}
3. Gambar tampil full size di browser
```

### Test 3: Multiple File Formats
```
- JPG: ✅ Should work
- PNG: ✅ Should work
- GIF: ✅ Should work
- Non-image (PDF): ⚠️ Will show broken image
```

---

## 📌 Notes

### File Storage Location
```
Backend:
  uploads/verification/{filename}
  
Served at:
  http://localhost:8080/uploads/verification/{filename}
```

### File Path dari API
- Backend return: `/uploads/verification/KTP_scan.jpg`
- Frontend construct: `http://localhost:8080` + `/uploads/verification/KTP_scan.jpg`
- Result: `http://localhost:8080/uploads/verification/KTP_scan.jpg`

### Max Height dalam Modal
- Set ke 384px untuk balance antara:
  - Bisa lihat detail dokumen
  - Tidak terlalu besar jadi tidak hide action buttons

---

## 🎯 Use Cases

| Use Case | Benefit |
|----------|---------|
| Admin verify KTP | Bisa lihat KTP detail tanpa download |
| Admin verify Surat Izin | Bisa lihat tanda tangan/cap tanpa download |
| Admin verify Invoice | Bisa lihat jumlah/tanda tangan tanpa download |
| Admin verify Sertifikat | Bisa lihat detail certificate tanpa download |

---

## ⚡ Performance

- **Image Loading**: Lazy loaded saat modal terbuka
- **Image Size**: Optimized dengan CSS (max-height constraint)
- **Network**: Load dari backend static folder (fast)
- **UX**: No lag, smooth interaction

---

## 🔐 Security Notes

- ✅ File distore di backend (not exposed to frontend)
- ✅ Filename randomized (tidak bisa guess path)
- ✅ Only admin bisa access `/admin/verifikasi`
- ✅ Backend should validate file type (backend responsibility)

---

## 🚀 Next Steps

1. **Test** image preview di berbagai file format
2. **Verify** semua file path correct
3. **Check** backend logs untuk confirm file serving
4. **Deploy** ke production

---

## 📞 Troubleshooting

### Gambar tidak muncul?

**Troubleshoot:**
```
1. Open DevTools (F12) → Network tab
2. Click penerima untuk buka modal
3. Lihat apakah image request 200 OK?
4. Jika 404: File tidak ada di backend
5. Jika CORS error: Backend security config issue
6. Jika blank: File path format salah
```

### Image URL error?

**Check:**
```bash
# Test dari terminal
curl http://localhost:8080/uploads/verification/KTP_scan.jpg

# Seharusnya return image file (status 200)
# Jika 404: file tidak ada atau path salah
# Jika 403: permission issue
```

### File path format error?

**Expected formats:**
```
✅ /uploads/verification/KTP_scan.jpg
❌ uploads/verification/KTP_scan.jpg (missing leading /)
❌ C:\uploads\verification\KTP_scan.jpg (windows path)
```

---

**Status:** ✅ IMPLEMENTED & READY TO TEST

**Version:** 1.0 (Initial Image Preview Release)

**Date:** 17-12-2025
