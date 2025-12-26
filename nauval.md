# 📄 Laporan Fungsional & Teknis Sistem Donasiku

**Branch:** `nauval-v1`  
**Developer:** Nauval  
**Tanggal:** 26 Desember 2025

---

## 1. Pendahuluan
Dokumen ini menjabarkan detail implementasi fungsional dan teknis (OOP) untuk setiap fitur yang dikembangkan dalam branch `nauval-v1`.

---

## 2. Detail Implementasi Per-FR (Functional Requirement)

### A. FR-03: Donasi & Partial Fulfillment (Pemenuhan Sebagian)
**Deskripsi Fitur:**
Fitur ini memungkinkan donatur untuk memberikan donasi, baik secara penuh maupun sebagian. Sistem akan secara cerdas menangani selisih antara jumlah donasi dan target kebutuhan.

**Ilustrasi Kasus (Satuan Pcs/Baju):**
*   **Kondisi Awal:** Penerima membutuhkan **10 Pcs Baju Bekas**.
*   **Aksi Donatur:** Donatur A memiliki **4 Pcs** dan mendonasikannya.
*   **Masalah Tradisional:** Jika sistem biasa, permintaan akan tertutup atau donasi 4 pcs tersebut "menggantung" tanpa status jelas terhadap sisa kebutuhan.
*   **Solusi Sistem (Split Logic):**
    1.  Request Asli (Induk) **dikurangi** targetnya menjadi **6 Pcs** (Tetap status *Pending*/Open).
    2.  Dibuat Request Baru (Anak) sebesar **4 Pcs** dengan status **Approved**.

**Analisis OOP & Kode:**
*   **Metode:** `fulfillPermintaan` di `PermintaanService.java`.
*   **Konsep OOP:**
    *   **Instantiation:** Membuat objek baru (`new PermintaanDonasi()`) untuk merepresentasikan bagian yang terpenuhi.
    *   **Encapsulation:** Logika pemecahan ini dibungkus rapat dalam service, Controller hanya menerima input `jumlah` dan `file`.
    *   **Polymorphism:** Menggunakan objek yang sama (`PermintaanDonasi`) untuk dua perilaku berbeda (Parent vs Child).

---

### B. FR-08: Manajemen Permintaan (CRUD Penerima)
**Deskripsi Fitur:**
Penerima donasi memiliki kontrol penuh atas permintaan yang mereka buat. Mereka dapat mengubah detail jika ada kesalahan, atau membatalkan permintaan jika kebutuhan sudah terpenuhi dari luar sistem.

**Fitur Detail:**
1.  **Update (Edit):** Mengubah Judul, Deskripsi, Jumlah, atau Lokasi.
    *   *Constraint:* Hanya bisa dilakukan jika status masih `Pending` atau `Open`.
2.  **Soft Delete (Batal):** Membatalkan permintaan tanpa menghilangkan jejak audit.

**Analisis OOP & Kode:**
*   **Metode:** `updatePermintaan` dan `batalkan` di `PermintaanService.java`.
*   **Konsep OOP:**
    *   **State Management:** Menggunakan teknik **Soft Delete** dimana kita memanipulasi atribut `status` menjadi `'Cancelled'` alih-alih menghapus row database secara fisik. Ini menjaga integritas data (History).
    *   **Access Control:** Memvalidasi `userId` pemilik sebelum mengizinkan edit.

---

### C. FR-14: Update Status "Dikirim" (Donatur)
**Deskripsi Fitur:**
Memberikan transparansi kepada penerima bahwa barang sedang dalam perjalanan.

**Alur Kerja:**
`Status: Approved` -> *Donatur klik "Kirim Barang"* -> `Status: Sent`

**Analisis OOP & Kode:**
*   **Metode:** `markAsSent` di `PermintaanService.java`.
*   **Konsep OOP:**
    *   **Guard Clause (Validasi State):** Kode secara eksplisit mengecek `if (!status.equals("approved"))` sebelum mengizinkan perubahan. Ini mencegah loncat status ilegal.

---

### D. FR-15: Update Status "Diterima" (Penerima)
**Deskripsi Fitur:**
Menandai akhir dari siklus hidup donasi. Penerima mengkonfirmasi barang fisik sudah sampai di tangan.

**Alur Kerja:**
`Status: Sent` -> *Penerima klik "Terima Barang"* -> `Status: Received` -> *Terbentuk Record Donasi Selesai*.

**Analisis OOP & Kode:**
*   **Metode:** `acceptOffer` di `PermintaanService.java`.
*   **Konsep OOP:**
    *   **Code Reusability:** Saat konfirmasi diterima, sistem otomatis (1) Mengupdate status permintaan, (2) Membuat/Mengupdate record tabel `Donasi`, (3) Mengupdate status verifikasi. Semua terjadi dalam satu trigger method.

---

## 3. Lampiran Kode Implementasi (Source Code)

### PermintaanService.java
```java
// --- IMPLEMENTASI FR-03 (PARTIAL FULFILLMENT) ---
@Transactional
public PermintaanDonasi fulfillPermintaan(Integer permintaanId, Integer donaturId, Integer jumlahDonasi, MultipartFile file) {
    PermintaanDonasi permintaan = permintaanRepository.findById(permintaanId)
            .orElseThrow(() -> new RuntimeException("Permintaan tidak ditemukan"));

    // Logic Pemecahan Objek (Split Request)
    if (jumlahDonasi < permintaan.getJumlah()) {
        // 1. Buat Objek Anak (Yang Terpenuhi)
        PermintaanDonasi child = new PermintaanDonasi();
        child.setJumlah(jumlahDonasi);
        child.setStatus("approved");
        // ... copy atribut lain ...
        permintaanRepository.save(child);

        // 2. Update Objek Induk (Sisa Kebutuhan)
        permintaan.setJumlah(permintaan.getJumlah() - jumlahDonasi);
        permintaanRepository.save(permintaan);
        
        return child;
    } else {
        // Full Fulfillment
        permintaan.setStatus("approved");
        return permintaanRepository.save(permintaan);
    }
}

// --- IMPLEMENTASI FR-14 (STATUS DIKIRIM) ---
public PermintaanDonasi markAsSent(Integer id) {
    PermintaanDonasi p = getById(id);
    if (!"approved".equalsIgnoreCase(p.getStatus())) throw new RuntimeException("Invalid State");
    p.setStatus("sent"); 
    return repository.save(p);
}

// --- IMPLEMENTASI FR-15 (STATUS DITERIMA) ---
public PermintaanDonasi acceptOffer(Integer id) {
    PermintaanDonasi p = getById(id);
    if (!"sent".equalsIgnoreCase(p.getStatus())) throw new RuntimeException("Invalid State");
    p.setStatus("received");
    
    // Finalisasi Donasi
    createDonasiRecord(p);
    
    return repository.save(p);
}

// --- IMPLEMENTASI FR-08 (SOFT DELETE) ---
public PermintaanDonasi batalkan(Integer id, Integer userId) {
    PermintaanDonasi p = getById(id);
    if (!p.getPenerima().getUserId().equals(userId)) throw new SecurityException("Akses Ditolak");
    p.setStatus("Cancelled"); // Manipulasi State
    return repository.save(p);
}
```

### PermintaanController.java
```java
@PostMapping("/{id}/fulfill")
public ResponseEntity<?> fulfill(...) {
    return ok(service.fulfillPermintaan(...));
}

@PostMapping("/{id}/sent")
public ResponseEntity<?> sent(...) {
    return ok(service.markAsSent(...));
}

@PostMapping("/{id}/accept-offer")
public ResponseEntity<?> accept(...) {
    return ok(service.acceptOffer(...));
}

@PostMapping("/{id}/cancel")
public ResponseEntity<?> cancel(...) {
    return ok(service.batalkan(...));
}
```
