# Standar & Kontrak API BILIK

Dokumentasi ini menjadi acuan kontrak REST API antara Frontend dan Backend BILIK.

## 1. Sumber Kontrak & Standar Format

- **Spesifikasi OpenAPI:** Lihat [`openapi.yaml`](openapi.yaml).
- **Bahasa Payload & Enum:** Wajib menggunakan **100% Bahasa Indonesia (`snake_case`)** sesuai [Standar Penamaan & Bahasa](../01-arsitektur/penamaan-dan-bahasa.md) (contoh: `status: "direservasi"`, `kode_reservasi`, `pesan_commit`).
- **Format Error Standar (RFC 7807 / RFC 9457):**
  Seluruh respons error (`4xx` / `5xx`) wajib mengembalikan `application/problem+json`:
  ```json
  {
    "type": "https://bilik.smktibazma.sch.id/problems/eksemplar-direservasi",
    "title": "Eksemplar Tidak Dapat Dipinjam",
    "status": 409,
    "code": "EKSEMPLAR_DIRESERVASI_ORANG_LAIN",
    "detail": "Eksemplar buku tidak dapat dipinjam. Buku ini sedang dialokasikan untuk pengajuan peminjaman warga lain. Silakan pilih eksemplar buku lain yang tersedia.",
    "instance": "/api/v1/staf/sirkulasi/konfirmasi-pinjam"
  }
  ```

## 2. Aturan Keamanan & Otorisasi

1. Seluruh endpoint warga dan staf wajib memverifikasi **sesi terautentikasi** dari cookie `httpOnly` (bukan header `x-user-id` bebas di produksi).
2. Backend wajib memeriksa izin (*permission*) berdasarkan peran aktif (`warga`, `admin`, `admin_master`) sesuai matriks di [Spesifikasi Teknis Backend](../01-arsitektur/spesifikasi-backend.md) dan [Workflow Peran Backend](../01-arsitektur/workflow-peran-backend.md).
3. Seluruh mutasi sensitif oleh staf (pembatalan petugas, koreksi denda, perpanjangan, pencabutan role, commit opname) wajib menerima field `pesan_commit` dan mencatatnya ke `log_audit`.
