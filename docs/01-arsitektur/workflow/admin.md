# Workflow Admin & Admin Master

Admin bekerja di **Workspace Admin** (`/admin`) dengan pola antarmuka mirip Pustakawan tetapi memiliki jangkauan kontrol sistem dan manajemen penuh.

---

## 1. Perbedaan Kewenangan: Admin vs Admin Master

| Aspek | Admin Biasa (`admin`) | Admin Master (`admin_master`) |
|---|---|---|
| Operasional Pustakawan (Sirkulasi, Opname, CRUD Buku, Denda) | ✅ Penuh | ✅ Penuh |
| CRUD Akun Warga & Buka Blokir Sanksi | ✅ Penuh | ✅ Penuh |
| Pengaturan Kebijakan Sistem (Tarif, Durasi, Kuota) | ✅ Penuh | ✅ Penuh |
| Melihat Seluruh `log_audit` & Riwayat Commit | ✅ Penuh | ✅ Penuh |
| CRUD & Pencabutan Hak Akun `admin` Lain | ❌ Dilarang | ✅ **Eksklusif (Halaman Khusus)** |
| Kebal Dihapus / Diturunkan oleh Admin Lain | — | ✅ **Kebal Mutlak** |
| Mengedit / Menghapus `log_audit` dan `commit` | ❌ **Dilarang Mutlak** | ❌ **Dilarang Mutlak** |

---

## 2. Pengelolaan Akun Pengguna (*Hybrid Delete* & Pemberian Peran)
1. **CRUD Akun Warga:**
   - Menambah anggota baru, memperbarui data, mereset kata sandi ke default, dan membuka blokir permanen warga (akibat 3x blokir sementara).
2. **Penghapusan Akun:**
   - **Soft Delete (`deleted_at`):** Untuk warga yang sudah lulus/pindah atau sudah memiliki histori transaksi pinjaman/denda agar integritas data riwayat tetap terjaga.
   - **Hard Delete (Permanen):** Hanya untuk akun yang salah buat dan belum memiliki histori transaksi apa pun.
3. **Manajemen Peran (*Role Assignment*):**
   - Admin / Admin Master dapat memberikan atau mencabut role `pustakawan` pada akun warga tanpa membuat akun kedua.
   - Pemberian dan pencabutan role `admin` hanya dilakukan di halaman khusus **Admin Master**.
   - Setiap perubahan role wajib mencatat pesan commit di `log_audit`.

---

## 3. Pengaturan Kebijakan Sistem (`/admin/pengaturan`)
Admin dapat mengonfigurasi parameter operasional perpustakaan:
- Batas waktu pengambilan pengajuan online (default: 24 jam).
- Durasi pinjaman standar (default: 7 hari kalender).
- Kuota maksimal buku aktif per warga (default: 1 buku).
- Tarif denda keterlambatan per hari (default: Rp500).
- Kapasitas antrean FIFO per rentang jumlah eksemplar.
Setiap perubahan kebijakan wajib disertai **pesan commit** di `log_audit`.

---

## 4. Pengawasan Audit Log & Commit History
- Admin dapat meninjau kronologi seluruh transaksi, koreksi denda, pembatalan petugas, hasil Stock Opname, dan perubahan role lengkap dengan `kode_commit`, aktor, konteks peran, pesan commit, dan selisih `data_lama` $\rightarrow$ `data_baru`.
- Seluruh catatan log bersifat **append-only / immutable** dan tidak dapat dihapus maupun dimanipulasi dari antarmuka mana pun.
