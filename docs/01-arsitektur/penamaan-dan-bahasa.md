# Standar Mutlak Penamaan dan Bahasa di Kode (BILIK)

**Status:** P1 — Wajib Dipatuhi oleh Tim Frontend, Tim Backend, dan AI Agent.

## 1. Prinsip Bahasa Tunggal (100% Bahasa Indonesia Konsisten)

Untuk mencegah kebingungan antara lapisan UI, API, dan Database:

1. **Di Antarmuka Pengguna (UI):**
   - Gunakan Bahasa Indonesia yang formal, ringkas, dan jelas.
   - Istilah **"Booking" DILARANG KERAS**. Gunakan **"Pengajuan Peminjaman"**.
   - Istilah **"Dibooking" DILARANG KERAS**. Gunakan **"Direservasi"** atau **"Dialokasikan"**.
2. **Di Kode Sumber, Database, Enum, & Payload API:**
   - **WAJIB menggunakan Bahasa Indonesia penuh dengan gaya `snake_case`** untuk nama tabel, kolom, enum status, parameter JSON, dan kode error domain.
   - **DILARANG mencampuradukkan status Bahasa Inggris** (seperti `PENDING`, `ALLOCATED`, `QUEUED`, `UNPAID`, `PAID`, `CANCELLED`, `EXPIRED`) ke dalam skema database maupun kontrak API yang sudah berbahasa Indonesia.

---

## 2. Tabel Pemetaan Penyesuaian Istilah (Rombakan Terbaru)

Tim Backend dan Frontend wajib mengikuti standar penamaan berikut saat melakukan penyesuaian kode atau migrasi database berikutnya:

| Konteks | Istilah Lama (Harus Ditinggalkan) | Istilah Standar Baru (WAJIB) |
|---|---|---|
| **Status Eksemplar** | `dibooking` | **`direservasi`** |
| **Status Eksemplar (Rusak)** | `perbaikan` (di mock UI) | **`rusak`** (seragam DB & UI) |
| **Jenis Reservasi** | `booking` | **`pengajuan`** |
| **Jalur Peminjaman** | `booking_online` | **`reservasi_online`** |
| **Kode Unik Pengajuan** | `kode_booking` (`BKG-...`) | **`kode_reservasi`** (`RSV-...`) |
| **Status Pengajuan / Reservasi** | `PENDING`, `ALLOCATED`, `CANCELLED` | **`menunggu`**, **`siap_diambil`**, **`selesai`**, **`batal`**, **`ditolak`**, **`kedaluwarsa`** |
| **Status Pinjaman** | `ACTIVE`, `OVERDUE`, `RETURNED` | **`aktif`**, **`terlambat`**, **`selesai`** |
| **Status Denda** | `UNPAID`, `PAID`, `WAIVED` | **`belum_lunas`**, **`lunas`**, **`dibebaskan`** |
| **Status Perpanjangan** | `PENDING`, `APPROVED`, `REJECTED` | **`menunggu`**, **`disetujui`**, **`ditolak`** |
| **Status Opname** | — | **`draf`**, **`berjalan`**, **`selesai_commit`**, **`dibatalkan`** |
| **Status Pengiriman Email** | `QUEUED`, `SENT`, `FAILED` | **`antre_kirim`**, **`terkirim`**, **`gagal`**, **`coba_ulang`** |
| **Filter Status Sirkulasi** | `menunggu_booking` | **`menunggu_pengambilan`** |
| **Alasan Pembatalan** | — | **`rusak`**, **`batal_warga`**, **`lainnya`** |

---

## 3. Aturan Penamaan Teknis

- **Tabel & Kolom PostgreSQL:** `snake_case` Bahasa Indonesia (`pengguna`, `eksemplar`, `reservasi`, `pinjaman`, `ajuan_perpanjangan`, `opname_sesi`, `log_audit`).
- **Endpoint REST API:** Gunakan kata benda jamak/domain Bahasa Indonesia (`/api/v1/katalog`, `/api/v1/reservasi/pengajuan`, `/api/v1/reservasi/antre`, `/api/v1/staf/sirkulasi/konfirmasi-pinjam`, `/api/v1/staf/opname`).
- **Tipe & Interface TypeScript / Backend DTO:** Gunakan *PascalCase* untuk nama tipe (`StatusEksemplar`, `AjuanPerpanjangan`), dan `snake_case` Bahasa Indonesia untuk properti payload JSON agar selaras 1:1 dengan respons API dan kolom database.
- **Pesan Sistem & Error Code:** Gunakan kode error uppercase Bahasa Indonesia (`EKSEMPLAR_DIRESERVASI_ORANG_LAIN`, `DENDA_BELUM_LUNAS`, `ANTREAN_PENUH`, `KUOTA_PINJAM_PENUH`, `AKSES_DITOLAK`) dengan detail pesan ramah pengguna dalam Bahasa Indonesia baku.
