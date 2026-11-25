# Workflow Pustakawan (Workspace Operasional)

Pustakawan bekerja di **Workspace Pustakawan** (`/pustakawan`) dan dapat beralih kapan saja ke **Mode Warga** menggunakan identitas akun yang sama (*One Identity, Multiple Workspaces*). Seluruh Pustakawan memiliki hak operasional yang sama rata.

---

## 1. Meja Sirkulasi: Penyerahan Buku (Online & Langsung)
1. **Validasi 1 — Identitas Warga:** Pustakawan memindai kartu anggota digital (NISN/NIP) atau mencari nama warga.
   - Jika warga memiliki pengajuan berstatus `siap_diambil`, detail eksemplar yang sudah dialokasikan (`BK-xxxx`) otomatis tampil dan dapat dimuat ke formulir dengan 1 klik.
2. **Validasi 2 — Barcode Eksemplar Fisik:** Pustakawan memindai barcode pada buku fisik.
   - **Proteksi Tabrakan:** Jika barcode berstatus `direservasi` milik warga lain, sistem **menolak mutlak** dengan pesan jelas dan mengosongkan kolom input buku.
3. **Konfirmasi Serah Terima:** Pustakawan menyesuaikan durasi pinjam (default 7 hari) dan mengonfirmasi. Status eksemplar berubah menjadi `dipinjam` dan pengajuan berubah menjadi `selesai`.
4. **Peminjaman Langsung (*Offline*):** Jika warga datang langsung membawa buku berstatus `tersedia` dan akun warga layak, petugas cukup scan anggota + scan buku + klik konfirmasi tanpa syarat berbelit.

---

## 2. Pembatalan atau Penolakan Pengajuan oleh Petugas
- Sebelum buku diserahkan, petugas dapat **membatalkan** pengajuan dengan alasan wajib (`rusak` atau `lainnya` + keterangan) atau **menolak** pengajuan (`ditolak` + alasan).
- Jika alasan pembatalan adalah `rusak`, status eksemplar langsung dikunci menjadi `rusak` dan **tidak boleh dipromosikan ke antrean**; sistem mencari unit lain yang benar-benar `tersedia`.
- Seluruh aksi ini wajib menyertakan **pesan commit** yang tercatat di `log_audit`.

---

## 3. Pengembalian, Kondisi Fisik, & Denda
1. Pustakawan memindai barcode buku yang dikembalikan.
2. Petugas memeriksa fisik buku (`tersedia`/baik, `rusak`, atau `hilang`).
3. Jika melewati tanggal jatuh tempo, sistem otomatis menghitung denda `Rp500 × selisih hari kalender`.
4. **Pelunasan & Koreksi Denda:**
   - Pelunasan dilakukan penuh secara manual di meja petugas (`belum_lunas` $\rightarrow$ `lunas`).
   - Petugas dapat melakukan koreksi/pembebasan denda (termasuk aksi massal beberapa warga) disertai **pesan commit** wajib.
   - Begitu denda lunas/dibebaskan, blokir pinjam karena denda otomatis terbuka.
5. Jika buku kembali dalam kondisi baik, sistem otomatis mempromosikan antrean `#1` (jika ada).

---

## 4. Pemrosesan Ajuan Perpanjangan
- Pustakawan menerima notifikasi *in-app* (dan dapat membuka tautan konfirmasi langsung).
- Petugas meninjau alasan warga, lalu dapat **menyetujui sesuai ajuan**, **mengubah jumlah hari** lewat stepper (`-`/`+`), atau **menolak** dengan catatan commit.

---

## 5. Pengelolaan Koleksi & Stock Opname (*Fast-Scan*)
- **CRUD Koleksi:** Pustakawan berwenang penuh menambah, mengubah, dan mengelola master buku, kategori, serta mencetak barcode eksemplar fisik.
- **Stock Opname:**
  1. Buka sesi opname (semua koleksi atau per kategori).
  2. Lakukan **Fast-Scan Barcode** secara beruntun dengan tombol cepat status fisik (`Baik` / `Rusak`).
  3. Tinjau layar perbandingan selisih (*Diff*: Cocok, Rusak, Hilang).
  4. Tuliskan **pesan commit** dan sahkan sesi untuk memperbarui status inventaris ke database.
