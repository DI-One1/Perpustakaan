# Workflow Warga (Pemustaka)

Pengalaman utama BILIK untuk siswa, guru, staf sekolah, serta Admin saat beralih ke **Mode Warga**.

---

## 1. Eksplorasi Katalog & Detail Buku
1. Warga membuka beranda atau katalog (`/katalog`), mencari buku berdasarkan judul, penulis, ISBN, atau filter kategori.
2. Pada halaman detail buku (`/buku/[id]`):
   - Melihat ketersediaan eksemplar fisik (`tersedia`, `direservasi`, `dipinjam`), rating, dan ulasan.
   - Tombol aksi tersedia dengan posisi standar:
     - **Kiri (Outline):** `Antre Buku`
     - **Kanan (Solid Primary):** `Ajukan Peminjaman`
   - Warga juga dapat menyimpan buku ke **Favorit** atau menulis rating & ulasan.

---

## 2. Pengajuan Peminjaman Online (Stok Tersedia)
1. Warga klik **Ajukan Peminjaman**.
2. Backend memvalidasi kelayakan akun:
   - Tidak sedang diblokir (sementara/permanen).
   - Tidak memiliki denda berstatus `belum_lunas` (> Rp0).
   - Tidak sedang memiliki pinjaman aktif maupun pengajuan/antrean lain (*Single-Item Rule*).
3. Jika lolos, sistem secara atomik memilih 1 eksemplar fisik `tersedia` (misal `BK-0004`), mengubah statusnya menjadi `direservasi`, dan membuat pengajuan berstatus `siap_diambil` dengan batas waktu **24 jam**.
4. Di halaman `/antrean`, warga melihat:
   - Badge status **Siap Dipinjam**.
   - **Countdown real-time** dengan format ringkas: `Batas Pengambilan: HH:MM:SS`.
   - Kode referensi `kode_reservasi`.
5. Warga menerima notifikasi *in-app* dan *email* (sesuai preferensi & email terverifikasi).

---

## 3. Antre Buku FIFO (Stok Habis)
1. Jika seluruh eksemplar sedang dipinjam atau direservasi, warga klik **Antre Buku**.
2. Backend memeriksa kapasitas antrean (maksimal 3 untuk 1–5 eksemplar, 5 untuk 6+ eksemplar).
3. Warga masuk antrean dengan status `menunggu` dan melihat posisi urutannya (misal `#1`).
4. Begitu ada eksemplar layak kembali, warga urutan `#1` otomatis dipromosikan menjadi `siap_diambil` (countdown 24 jam dimulai) dan mendapat notifikasi *in-app* + *email*.

---

## 4. Pembatalan oleh Warga
- Sebelum buku diserahkan oleh petugas, warga dapat membatalkan pengajuan atau antreannya sendiri melalui tombol **Batalkan Pengajuan** / **Batalkan Antrean**.
- Dialog konfirmasi bersifat ringkas (*to the point*).
- Eksemplar yang dilepaskan langsung dipromosikan ke antrean `#1` (jika ada) atau kembali `tersedia`.

---

## 5. Peminjaman Aktif & Perpanjangan Mandiri
1. Di halaman `/pinjaman`, warga memantau buku yang sedang dipinjam, tanggal jatuh tempo, dan status denda.
2. **Perpanjangan:** Warga yang **bebas denda** dapat mengajukan perpanjangan **kapan saja** (termasuk bila ada antrean pada buku tersebut) dengan mengisi **alasan wajib** dan jumlah hari yang diminta.
3. Sistem mengirim notifikasi ke petugas. Setelah petugas menyetujui (atau menyesuaikan jumlah hari), masa pinjam dan countdown warga langsung bertambah.
