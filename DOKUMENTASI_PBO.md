# 📚 Dokumentasi Implementasi PBO - Donasiku

Dokumentasi ini menjelaskan bagaimana prinsip Pemrograman Berorientasi Objek (PBO) dan arsitektur aplikasi diterapkan dalam proyek **Donasiku**.

---

## 1. Spesifikasi Proyek
- **Nama Proyek**: Donasiku
- **Deskripsi**: Platform penghubung donatur dan penerima bantuan barang layak pakai.
- **Teknologi (Backend)**: Java 17/21, Spring Boot 3, Spring Data JPA, Spring Security, MySQL.
- **Tujuan Utama**: Memfasilitasi distribusi barang donasi secara efisien dan transparan.

---

## 2. CRUD (Create, Read, Update, Delete)
Operasi dasar pengelolaan data (CRUD) diimplementasikan melalui koordinasi antara **Controller**, **Service**, dan **Repository**.

- **Create**: Menambahkan data baru.
  - *Contoh*: Membuat donasi baru.
  - *Lokasi*: `DonasiService.java` method `createDonasi`.
- **Read**: Mengambil data dari database.
  - *Contoh*: Melihat profil user.
  - *Lokasi*: `UserController.java` method `getProfil` (Line 43).
- **Update**: Memperbarui data yang sudah ada.
  - *Contoh*: Mengedit profil user.
  - *Lokasi*: `UserController.java` method `editProfil` (Line 109).
- **Delete**: Menghapus data atau menandai sebagai tidak aktif.
  - *Contoh*: Penanganan user yang ditolak (suspensi).
  - *Lokasi*: `UserController.java` method `rejectUser` (Line 243).

---

## 3. Inheritance (Pewarisan)
Pewarisan digunakan untuk memperluas fungsionalitas kelas yang sudah ada.

- **Implementasi**: Custom Exception yang mewarisi `RuntimeException`.
- **Konsep**: `ResourceNotFoundException` mewarisi sifat-sifat dari `RuntimeException`, memungkinkan penanganan error yang lebih spesifik di tingkat Spring Boot.
- **Lokasi Coding**: 
  - `backend/src/main/java/Donasiku/spring/core/exception/ResourceNotFoundException.java`
  ```java
  public class ResourceNotFoundException extends RuntimeException { ... }
  ```

---

## 4. Role Access (Hak Akses)
Pengaturan hak akses dilakukan untuk membatasi aksi berdasarkan peran user (Donatur, Penerima, Admin).

- **Implementasi**: Validasi manual di level Controller.
- **Contoh**: Hanya Admin yang boleh melihat daftar semua user atau melakukan verifikasi.
- **Lokasi Coding**:
  - `UserController.java` method `getAllUsers` (Line 29) dan `verifyUser` (Line 200).
  ```java
  if (admin.getRole() != User.UserRole.admin) {
      return ResponseEntity.status(403).body("Akses ditolak...");
  }
  ```

---

## 5. Exception (Penanganan Error)
Mekanisme untuk menangani kesalahan saat aplikasi berjalan agar tidak crash.

- **Implementasi**: `GlobalExceptionHandler` menggunakan `@ControllerAdvice`.
- **Konsep**: Mengalihkan semua error ke satu tempat pusat untuk mengembalikan respon yang rapi kepada user/frontend.
- **Lokasi Coding**:
  - `backend/src/main/java/Donasiku/spring/core/exception/GlobalExceptionHandler.java`

---

## 6. MVC (Model-View-Controller)
Arsitektur yang memisahkan logika data, tampilan, dan kontrol.

- **Model (Entity)**: Representasi tabel database sebagai objek Java.
  - *Lokasi*: `backend/src/main/java/Donasiku/spring/core/entity/` (contoh: `User.java`, `Donasi.java`).
- **View**: Dalam arsitektur REST, "View" direpresentasikan oleh format JSON yang dikirim ke Frontend (React).
- **Controller**: Menangani request masuk dan memberikan respon.
  - *Lokasi*: `backend/src/main/java/Donasiku/spring/core/controller/` (contoh: `AuthController.java`, `DonasiController.java`).

---

## 7. Interface
Interface digunakan sebagai kontrak untuk interaksi antar komponen, meningkatkan fleksibilitas dan abstraksi.

- **Implementasi**: Repository yang mengekstensi `JpaRepository`.
- **Konsep**: `UserRepository` mendefinisikan "kontrak" apa saja yang bisa dilakukan terhadap data User tanpa harus menulis query SQL secara manual.
- **Lokasi Coding**:
  - `backend/src/main/java/Donasiku/spring/core/repository/UserRepository.java`
  ```java
  public interface UserRepository extends JpaRepository<User, Integer> { ... }
  ```

---

*Dokumentasi ini disusun untuk memenuhi kebutuhan review struktur kode dan prinsip PBO.*
