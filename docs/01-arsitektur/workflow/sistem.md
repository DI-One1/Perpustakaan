# Workflow Sistem Otomatis (Background Cron & Event)

Workflow ini dijalankan secara otomatis oleh server backend di latar belakang tanpa intervensi manual petugas.

---

## 1. Kedaluwarsa Pengajuan 24 Jam & No-Show (Setiap 5 Menit)
1. Server mencari seluruh `reservasi` berstatus `siap_diambil` dengan `waktu_tenggat < NOW()`.
2. Di dalam satu transaksi database atomik:
   - Ubah status pengajuan menjadi `kedaluwarsa`.
   - Tambahkan 1 hitungan pelanggaran *no-show* pada warga terkait.
   - Jika *no-show* mencapai **3 kali dalam 30 hari terakhir**: aktifkan **Blokir Sementara 7 hari** (`is_blocked = true`, `blocked_until = NOW() + 7 days`, `blocked_count += 1`). Jika `blocked_count >= 3`, blokir bersifat **Permanen** (`blocked_until = NULL`).
   - Lepaskan eksemplar terkait (`eksemplar_id`):
     - Jika ada antrean `menunggu` pada judul buku tersebut $\rightarrow$ **Promosikan antrean `#1`** menjadi `siap_diambil` (mulai countdown 24 jam baru, pertahankan status eksemplar `direservasi`).
     - Jika tidak ada antrean $\rightarrow$ kembalikan status eksemplar menjadi `tersedia`.
   - Catat ke `log_audit` dengan `konteks_peran = 'sistem_cron'`.
3. Kirim notifikasi *in-app* + *email* kepada warga yang kedaluwarsa dan (jika ada) kepada warga antrean `#1` yang baru dipromosikan.

---

## 2. Deteksi Keterlambatan Pinjaman Harian (Setiap Hari Pukul 00:05 WIB)
1. Server mencari seluruh `pinjaman` berstatus `aktif` dengan `tanggal_jatuh_tempo < CURRENT_DATE` (zona `Asia/Jakarta`).
2. Ubah status pinjaman menjadi `terlambat`.
3. Kirim notifikasi *in-app* dan *email* pemberitahuan keterlambatan (hanya 1x saat pertama kali status berubah menjadi `terlambat` agar tidak spam).

---

## 3. Pengingat Batas Waktu (Setiap 1 Jam)
1. **Pengingat Pengambilan (H-6 Jam):** Kirim notifikasi *in-app* + *email* untuk pengajuan `siap_diambil` yang tersisa $\le 6$ jam (menggunakan `kunci_idempoten` agar hanya terkirim sekali).
2. **Pengingat Jatuh Tempo (H-1 Hari):** Kirim notifikasi *in-app* + *email* untuk pinjaman `aktif` yang jatuh tempo besok.

---

## 4. Pemulihan Otomatis Blokir Sementara (Setiap 1 Jam / Saat Cek Kelayakan)
- Jika warga memiliki `is_blocked = true`, `blocked_count < 3`, dan `NOW() > blocked_until`, sistem otomatis mencabut status blokir sementara warga tersebut.
