# Aturan Bisnis Final Sistem Perpustakaan Digital (BILIK)

**Status:** P1 — Sumber Kebenaran Mutlak (Acuan Baku Logika Bisnis, API, Database, & UI)  
**Terakhir diperbarui:** 25 November 2026

---

## 1. Aturan Kuota, Durasi, & Kelayakan Dasar

1. **Aturan Satu Buku per Warga (*Single-Item Rule*):**
   Setiap anggota (siswa, guru, staf, maupun petugas saat menggunakan mode Warga) maksimal hanya boleh memiliki **1 buku aktif** pada satu waktu, baik dalam bentuk:
   - 1 pinjaman fisik aktif (`aktif` atau `terlambat`), ATAU
   - 1 pengajuan peminjaman siap diambil (`siap_diambil`), ATAU
   - 1 posisi antrean FIFO (`menunggu`).
2. **Durasi Peminjaman Standar:**
   - Default **7 hari kalender**.
   - Dapat disesuaikan secara manual oleh Pustakawan/Admin saat konfirmasi di meja sirkulasi.
3. **Tarif Denda Keterlambatan Pengembalian:**
   - **Rp500 / hari / buku**, bersifat akumulatif berdasarkan selisih hari kalender (zona waktu `Asia/Jakarta`, hari libur tetap terhitung).
   - Terlambat mengambil pengajuan (*no-show* melewati 24 jam) **TIDAK dikenakan denda uang**, melainkan dikenakan mekanisme poin pelanggaran dan pemblokiran.
4. **Prasyarat Mutlak Bebas Denda:**
   - Warga yang memiliki denda berstatus `belum_lunas` (**nominal > Rp0**, termasuk keterlambatan 1 hari sebesar Rp500) **dilarang** mengajukan peminjaman baru, meminjam langsung di meja, atau masuk antrean FIFO sampai denda dikonfirmasi lunas oleh petugas.
   - Warga yang memiliki denda atau sedang diblokir **tetap dapat** melihat katalog dan mengelola **Favorit**.

---

## 2. Alokasi Eksemplar Fisik & Meja Sirkulasi

1. **Identitas Eksemplar Fisik Tunggal:**
   - Setiap unit fisik buku memiliki label barcode unik (`BK-xxxx`).
   - Pengajuan peminjaman online **selalu mengunci 1 eksemplar fisik spesifik**, bukan sekadar judul abstrak.
   - Status eksemplar: `tersedia`, `direservasi`, `dipinjam`, `rusak`, `hilang`.
2. **Dua Jalur Peminjaman di Meja Sirkulasi:**
   - **Jalur Klaim Pengajuan Online (`reservasi_online`):** Warga datang dalam batas 24 jam. Petugas melakukan **2 validasi wajib**: scan/identifikasi kartu anggota dan scan barcode buku fisik `BK-xxxx` yang dialokasikan.
   - **Jalur Peminjaman Langsung (`langsung_offline`):** Warga mengambil buku langsung di rak dan membawanya ke meja petugas. Petugas memindai kartu anggota + barcode buku. Jika warga layak dan buku berstatus `tersedia`, transaksi langsung disahkan tanpa syarat berbelit.
3. **Proteksi Tabrakan Eksemplar:**
   - Jika petugas memindai barcode eksemplar yang berstatus `direservasi` milik warga A untuk transaksi warga B, sistem **wajib menolak mutlak** transaksi tersebut dengan pesan:
     *"Eksemplar buku tidak dapat dipinjam. Buku ini sedang dialokasikan untuk pengajuan peminjaman warga lain. Silakan pilih eksemplar buku lain yang tersedia."*
   - Input kolom buku wajib tetap kosong dan alokasi milik warga A tetap aman.

---

## 3. Sistem Antrean Online (FIFO) & Promosi Otomatis

1. **Syarat Antrean:** Hanya terbuka jika seluruh eksemplar dari suatu judul tidak ada yang `tersedia` (semua `dipinjam`, `direservasi`, atau `rusak`).
2. **Kapasitas Antrean per Judul:**
   - Koleksi 1–5 eksemplar: maksimal **3 antrean**.
   - Koleksi 6–10+ eksemplar: maksimal **5 antrean**.
   - Jika penuh, aksi antrean dinonaktifkan dengan status **"Antrean Penuh"**.
3. **Promosi Otomatis Atomik:**
   - Ketika eksemplar dikembalikan dalam kondisi baik (`tersedia`) atau pengajuan sebelumnya dibatalkan/kedaluwarsa (bukan karena rusak), sistem secara atomik di dalam transaksi database menaikkan antrean urutan `#1` menjadi pengajuan `siap_diambil` (countdown 24 jam dimulai) dan mengirim notifikasi *in-app* + email.
   - Jika eksemplar dikembalikan atau dibatalkan dalam kondisi **`rusak`** atau **`hilang`**, status eksemplar langsung dikunci menjadi `rusak`/`hilang` dan **tidak memicu promosi antrean** pada unit tersebut. Sistem hanya mencari unit lain yang benar-benar `tersedia`; jika tidak ada, antrean tetap menunggu.

---

## 4. Pembatalan & Penolakan Pengajuan

1. **Pembatalan Dua Pihak (`batal`):**
   - **Oleh Warga (Pengaju):** Warga boleh membatalkan pengajuan atau antrean miliknya sendiri sebelum diproses petugas.
   - **Oleh Petugas (Pustakawan/Admin):** Petugas dapat membatalkan pengajuan sebelum serah terima dengan memilih alasan wajib (`rusak` atau `lainnya` + keterangan wajib).
2. **Penolakan oleh Petugas (`ditolak`):**
   - Petugas dapat menolak pengajuan peminjaman atau perpanjangan dengan menyertakan alasan penolakan yang ringkas dan tampil pada riwayat warga.

---

## 5. Perpanjangan Pinjaman Mandiri

1. **Kapan & Siapa:** Warga yang sedang memiliki pinjaman aktif dan **bebas denda** dapat mengajukan perpanjangan **kapan saja** melalui sistem dengan menyertakan **alasan wajib** dan jumlah hari yang diminta (misalnya karena jadwal kembali bertepatan dengan hari libur sekolah).
2. **Boleh Diajukan Walau Ada Antrean:** Warga tetap diperbolehkan mengajukan permohonan perpanjangan meski terdapat antrean pada buku tersebut, karena sifatnya pengajuan yang diputuskan manual oleh petugas.
3. **Alur Persetujuan Petugas:**
   - Pengajuan mengirim notifikasi ke petugas (termasuk tautan langsung/deep-link dari email petugas menuju halaman konfirmasi).
   - Pustakawan/Admin dapat **menyetujui sesuai ajuan**, **mengubah jumlah hari** melalui stepper (`-`/`+`), atau **menolak** dengan alasan.
   - Setelah dikonfirmasi, tanggal jatuh tempo dan *countdown* pinjaman warga langsung bertambah secara real-time.

---

## 6. Kedaluwarsa 24 Jam (No-Show) & Pemblokiran

1. **Batas Pengambilan:** Pengajuan berstatus `siap_diambil` berlaku selama **24 jam**.
2. **Mekanisme Otomatis:** Jika melewati 24 jam dan tidak diambil:
   - Status pengajuan otomatis berubah menjadi `kedaluwarsa`.
   - Eksemplar dilepaskan dan otomatis dipromosikan ke antrean `#1` (jika ada) atau kembali `tersedia`.
   - Tidak ada denda uang, tetapi warga mendapat catatan pelanggaran *no-show*.
3. **Sanksi Blokir:**
   - **3 kali *no-show* dalam 1 bulan** $\rightarrow$ Akun dikenakan **Blokir Sementara selama 7 hari**.
   - **3 kali terkena Blokir Sementara** $\rightarrow$ Akun dikenakan **Blokir Permanen**, yang hanya dapat dibuka oleh **Admin / Admin Master**.

---

## 7. Denda, Pelunasan, & Koreksi

1. **Pelunasan Penuh (V1):** Pembayaran denda dilakukan secara tunai/manual di meja petugas dan dikonfirmasi lunas penuh per transaksi denda (`belum_lunas` $\rightarrow$ `lunas`). Pembayaran cicilan sebagian belum didukung di V1.
2. **Pembukaan Blokir Otomatis:** Begitu seluruh denda warga berstatus `lunas` atau `dibebaskan`, hambatan pinjam karena denda seketika terbuka.
3. **CRUD & Koreksi Massal:** Admin dan Pustakawan berwenang melakukan koreksi nominal atau pembebasan denda (termasuk memilih beberapa warga sekaligus / *batch*), dan setiap konfirmasi wajib menyertakan **catatan commit** ke dalam `log_audit`.
