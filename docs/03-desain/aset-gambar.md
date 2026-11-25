# Kebijakan & Standar Aset Gambar BILIK

> **Status:** Single Source of Truth (P1) Kebijakan Aset Media BILIK  
> **Terakhir Diperbarui:** 2026-11-23  
> **Kepatuhan:** Anti-AI-Slop, Rasio Mutlak, Satu Pintu Komponen Media

---

## 1. Kebijakan Utama: Pemisahan Vektor (SVG) vs Gambar Raster

### A. SVG yang Dipensiunkan (DILARANG Digunakan sebagai Gambar)
Dilarang keras menggunakan file SVG atau kode inline SVG sebagai representasi fotografi, manusia, atau buku:
- ❌ **Dilarang**: SVG default foto profil pengguna (misal siluet orang atau avatar kartun generik buatan AI).
- ❌ **Dilarang**: SVG sampul buku ilustratif fiktif (buku tanpa cover nyata tidak boleh diganti dengan gambar vektor buku kartun).
- ❌ **Dilarang**: Banner ilustrasi abstrak buatan AI yang tidak ada sangkut pautnya dengan kegiatan sekolah.
- ❌ **Dilarang**: Lingkaran inisial huruf teks atau kotak warna polos sebagai pengganti foto.

### B. SVG yang Wajib Dipertahankan (Vektor UI Resmi)
Format SVG tetap digunakan secara eksklusif untuk elemen grafis antarmuka:
- ✅ Ikon fungsional UI (`lucide-react` seperti `Search`, `ArrowRight`, `ChevronRight`, `BookOpen`, `Clock`).
- ✅ Logo resmi aplikasi dan yayasan (`/logo-named-BILIK.png`, SVG resmi sekolah).
- ✅ Ikon interaktif (indikator carousel, toggle password, pagination).
- ✅ Motif grafis brand resmi yang telah disetujui.

---

## 2. Standar Gambar Raster Nyata (PNG, JPG/JPEG, WebP)

Seluruh foto dan sampul buku wajib menggunakan format raster berkualitas dengan sumber yang dapat diverifikasi:
1. **Sampul Buku Nyata**:
   - **Rasio Mutlak: 2:3** (misal 600×900 px, 400×600 px).
   - **Sumber Terverifikasi**: Gramedia, situs resmi penerbit (Mizan, Erlangga, Gramedia Pustaka Utama, O'Reilly), atau foto fisik buku perpustakaan.
   - **Kesesuaian Data**: Judul, penulis, dan edisi pada cover wajib identik 100% dengan metadata buku.
   - **Fallback Sampul**: Jika sampul buku belum ada di inventaris, gunakan fallback raster yang jelas sebagai placeholder netral bertiket kategori (`/images/defaults/cover-umum.png`), bukan gambar fiktif AI.
2. **Foto Profil Pengguna (Avatar)**:
   - **Rasio Mutlak: 1:1** (`rounded-full`, min 256×256 px).
   - **Sumber Terverifikasi**: Foto siswa/guru nyata atau placeholder raster netral berlisensi jelas (`/images/avatars/user-default.png` / WebP).
3. **Banner Promosi & Hero**:
   - **Rasio Mutlak: 2:1** untuk banner sekunder (`620×310 px` atau `800×400 px`) dan hero banner responsif.
   - **Format**: WebP / PNG berbobot ringan (< 250 KB) dengan teks informasi terpisah di layer HTML jika perlu aksesibilitas.

---

## 3. Komponen Satu Pintu (Single Portal Image Components)

Untuk menjamin ketaatan rasio dan penanganan error yang seragam, seluruh halaman **WAJIB** menggunakan komponen media terpusat:

| Jenis Media | Komponen Tunggal Wajib | Rasio Aspek | Fallback Otomatis |
|---|---|---|---|
| Sampul Buku | `<BookCover src="..." judul="..." />` | `aspect-[2/3]` | `/images/defaults/cover-umum.png` |
| Avatar Warga/Petugas | `<UserAvatar src="..." nama="..." size={40} />` | `1:1` (`rounded-full`) | `/images/avatars/user-default.png` |
| Banner Promosi | `<Image fill className="object-cover" />` | `2:1` / fill | Background color + border |

**Larangan Keras:**
Dilarang menulis tag `<img />` mentah atau tag `<Image />` lepasan untuk sampul buku di halaman mana pun. Semua wajib melalui `<BookCover />` agar rasio 2:3 tidak terdistorsi.
