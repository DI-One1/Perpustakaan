-- migrate:up
-- Skema Database Awal Perpustakaan Digital SMK TI Bazma ("BILIK")
-- Pemilik Skema Tunggal: dbmate

-- Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tipe Data ENUM
CREATE TYPE peran_pengguna AS ENUM ('admin', 'pustakawan', 'warga');
CREATE TYPE jenis_warga AS ENUM ('siswa', 'guru', 'staf');
CREATE TYPE status_eksemplar AS ENUM ('tersedia', 'dibooking', 'dipinjam', 'rusak', 'hilang');
CREATE TYPE jenis_reservasi AS ENUM ('booking', 'antre');
CREATE TYPE status_reservasi AS ENUM ('menunggu', 'siap_diambil', 'selesai', 'batal', 'kedaluwarsa');
CREATE TYPE jalur_pinjaman AS ENUM ('booking_online', 'langsung_offline');
CREATE TYPE status_pinjaman AS ENUM ('aktif', 'selesai', 'terlambat');
CREATE TYPE status_denda AS ENUM ('belum_lunas', 'lunas', 'dibebaskan');
CREATE TYPE status_ajuan_perpanjangan AS ENUM ('menunggu', 'disetujui', 'ditolak');
CREATE TYPE status_literasi AS ENUM ('draft', 'disetujui', 'ditolak');
CREATE TYPE tipe_notifikasi AS ENUM ('info', 'peringatan', 'darurat');

-- 2. Tabel PENGGUNA
CREATE TABLE pengguna (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    nomor_induk VARCHAR(32) NOT NULL UNIQUE, -- NISN untuk siswa, NIP/ID untuk guru/staf
    nama VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    peran peran_pengguna NOT NULL DEFAULT 'warga',
    jenis_warga jenis_warga NOT NULL DEFAULT 'siswa',
    kelas_atau_unit VARCHAR(50) NOT NULL, -- Contoh: "XII SIJA 1", "Guru Produktif SIJA", "Tata Usaha"
    password_hash VARCHAR(255) NOT NULL,
    wajib_ganti_password BOOLEAN NOT NULL DEFAULT FALSE,
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    blocked_until TIMESTAMPTZ,
    blocked_count INT NOT NULL DEFAULT 0,
    foto_path VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel SESI (Opaque Token Session + httpOnly)
CREATE TABLE sesi (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    pengguna_id VARCHAR(36) NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_sesi_token_hash ON sesi(token_hash);
CREATE INDEX idx_sesi_pengguna_id ON sesi(pengguna_id);

-- 4. Tabel KATEGORI
CREATE TABLE kategori (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    nama VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT,
    urutan INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel BUKU (Judul Master)
CREATE TABLE buku (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    judul VARCHAR(255) NOT NULL,
    penulis VARCHAR(200) NOT NULL,
    penerbit VARCHAR(150) NOT NULL,
    tahun INT NOT NULL CHECK (tahun >= 1900 AND tahun <= 2100),
    isbn VARCHAR(20) NOT NULL UNIQUE,
    kategori_id VARCHAR(36) NOT NULL REFERENCES kategori(id) ON DELETE RESTRICT,
    sinopsis TEXT NOT NULL,
    nomor_panggil VARCHAR(50) NOT NULL, -- Contoh: "005.1 MAR c"
    cover_path VARCHAR(255),
    total_eksemplar INT NOT NULL DEFAULT 0 CHECK (total_eksemplar >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_buku_kategori_id ON buku(kategori_id);
CREATE INDEX idx_buku_isbn ON buku(isbn);

-- 6. Tabel EKSEMPLAR (Buku Fisik Spesifik)
CREATE TABLE eksemplar (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    buku_id VARCHAR(36) NOT NULL REFERENCES buku(id) ON DELETE CASCADE,
    nomor_induk VARCHAR(50) NOT NULL UNIQUE, -- Barcode stiker fisik (misal: "EXM-0051-01")
    status status_eksemplar NOT NULL DEFAULT 'tersedia',
    posisi_rak VARCHAR(50) NOT NULL DEFAULT 'Rak Utama Lantai 1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_eksemplar_buku_id ON eksemplar(buku_id);
CREATE INDEX idx_eksemplar_status ON eksemplar(status);

-- 7. Tabel RESERVASI (Antrean FIFO & Booking Online)
CREATE TABLE reservasi (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pengguna_id VARCHAR(36) NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
    buku_id VARCHAR(36) NOT NULL REFERENCES buku(id) ON DELETE CASCADE,
    eksemplar_id VARCHAR(36) REFERENCES eksemplar(id) ON DELETE SET NULL, -- Terisi saat status siap_diambil
    jenis jenis_reservasi NOT NULL DEFAULT 'booking',
    status status_reservasi NOT NULL DEFAULT 'menunggu',
    posisi_antrean INT, -- Posisi antrean FIFO jika jenis antre
    kode_booking VARCHAR(30) UNIQUE, -- Contoh: "BKG-202611-0042"
    waktu_tenggat TIMESTAMPTZ, -- Batas waktu pengambilan fisik di meja pustakawan (default 24 jam)
    catatan TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Aturan Integritas: Maksimal 1 reservasi aktif (menunggu atau siap_diambil) per warga
CREATE UNIQUE INDEX idx_satu_reservasi_aktif_per_warga 
ON reservasi(pengguna_id) 
WHERE status IN ('menunggu', 'siap_diambil');

-- Aturan Integritas: 1 eksemplar hanya boleh di-booking oleh 1 reservasi berstatus siap_diambil
CREATE UNIQUE INDEX idx_satu_booking_aktif_per_eksemplar 
ON reservasi(eksemplar_id) 
WHERE status = 'siap_diambil' AND eksemplar_id IS NOT NULL;

CREATE INDEX idx_reservasi_buku_id ON reservasi(buku_id);

-- 8. Tabel PINJAMAN (Sirkulasi Fisik Meja Pustakawan)
CREATE TABLE pinjaman (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pengguna_id VARCHAR(36) NOT NULL REFERENCES pengguna(id) ON DELETE RESTRICT,
    eksemplar_id VARCHAR(36) NOT NULL REFERENCES eksemplar(id) ON DELETE RESTRICT,
    jalur jalur_pinjaman NOT NULL DEFAULT 'langsung_offline',
    tanggal_pinjam DATE NOT NULL DEFAULT CURRENT_DATE,
    durasi_hari INT NOT NULL DEFAULT 7 CHECK (durasi_hari > 0),
    tanggal_jatuh_tempo DATE NOT NULL,
    tanggal_kembali DATE,
    status status_pinjaman NOT NULL DEFAULT 'aktif',
    petugas_pinjam_id VARCHAR(36) NOT NULL REFERENCES pengguna(id) ON DELETE RESTRICT,
    petugas_kembali_id VARCHAR(36) REFERENCES pengguna(id) ON DELETE RESTRICT,
    catatan TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Aturan Integritas: Maksimal 1 pinjaman aktif (aktif atau terlambat) per warga
CREATE UNIQUE INDEX idx_satu_pinjaman_aktif_per_warga 
ON pinjaman(pengguna_id) 
WHERE status IN ('aktif', 'terlambat');

-- Aturan Integritas: 1 eksemplar fisik hanya boleh dipinjam 1 kali pada waktu bersamaan
CREATE UNIQUE INDEX idx_satu_peminjam_per_eksemplar 
ON pinjaman(eksemplar_id) 
WHERE status IN ('aktif', 'terlambat');

CREATE INDEX idx_pinjaman_status ON pinjaman(status);

-- 9. Tabel DENDA (Keterlambatan Pengembalian)
CREATE TABLE denda (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pinjaman_id VARCHAR(36) NOT NULL REFERENCES pinjaman(id) ON DELETE RESTRICT,
    pengguna_id VARCHAR(36) NOT NULL REFERENCES pengguna(id) ON DELETE RESTRICT,
    hari_terlambat INT NOT NULL CHECK (hari_terlambat > 0),
    tarif_per_hari INT NOT NULL DEFAULT 500 CHECK (tarif_per_hari >= 0),
    total_nominal INT NOT NULL CHECK (total_nominal >= 0),
    status status_denda NOT NULL DEFAULT 'belum_lunas',
    dibayar_pada TIMESTAMPTZ,
    petugas_id VARCHAR(36) REFERENCES pengguna(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_denda_pengguna_status ON denda(pengguna_id, status);

-- 10. Tabel AJUAN PERPANJANGAN (Online dengan Alasan Wajib)
CREATE TABLE ajuan_perpanjangan (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pinjaman_id VARCHAR(36) NOT NULL REFERENCES pinjaman(id) ON DELETE CASCADE,
    pengguna_id VARCHAR(36) NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
    alasan TEXT NOT NULL,
    durasi_hari_diminta INT NOT NULL DEFAULT 7 CHECK (durasi_hari_diminta > 0),
    durasi_hari_disetujui INT CHECK (durasi_hari_disetujui IS NULL OR durasi_hari_disetujui > 0),
    status status_ajuan_perpanjangan NOT NULL DEFAULT 'menunggu',
    catatan_petugas TEXT,
    diproses_oleh VARCHAR(36) REFERENCES pengguna(id) ON DELETE SET NULL,
    diproses_pada TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_ajuan_pinjaman ON ajuan_perpanjangan(pinjaman_id);

-- 11. Tabel LITERASI (Resume Bacaan Siswa - Gerbang Nonaktif Segera Hadir)
CREATE TABLE literasi (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pengguna_id VARCHAR(36) NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
    buku_id VARCHAR(36) NOT NULL REFERENCES buku(id) ON DELETE CASCADE,
    resume TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    status status_literasi NOT NULL DEFAULT 'draft',
    diproses_oleh VARCHAR(36) REFERENCES pengguna(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Tabel FAVORIT (Koleksi Tersimpan Warga)
CREATE TABLE favorit (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pengguna_id VARCHAR(36) NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
    buku_id VARCHAR(36) NOT NULL REFERENCES buku(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_favorit_pengguna_buku UNIQUE (pengguna_id, buku_id)
);

-- 13. Tabel NOTIFIKASI
CREATE TABLE notifikasi (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pengguna_id VARCHAR(36) NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
    judul VARCHAR(150) NOT NULL,
    pesan TEXT NOT NULL,
    tipe tipe_notifikasi NOT NULL DEFAULT 'info',
    tautan VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_notifikasi_pengguna_unread ON notifikasi(pengguna_id, is_read);

-- 14. Tabel PENGATURAN (Konfigurasi Fleksibel Parameter Bisnis)
CREATE TABLE pengaturan (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    kunci VARCHAR(100) NOT NULL UNIQUE,
    nilai TEXT NOT NULL,
    tipe_data VARCHAR(30) NOT NULL DEFAULT 'string', -- 'int', 'string', 'boolean', 'json'
    deskripsi TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 15. Tabel PENGUMUMAN & BANNER
CREATE TABLE pengumuman (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    judul VARCHAR(200) NOT NULL,
    ringkasan TEXT,
    isi TEXT NOT NULL,
    tag VARCHAR(50) NOT NULL DEFAULT 'Pengumuman',
    warna_tag VARCHAR(30) NOT NULL DEFAULT 'primary',
    gambar_path VARCHAR(255),
    gambar_alt VARCHAR(255),
    tautan VARCHAR(255),
    is_aktif BOOLEAN NOT NULL DEFAULT TRUE,
    urutan INT NOT NULL DEFAULT 0,
    tanggal_publikasi DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 16. Tabel AUDIT_LOG (Pencatatan Aktivitas Transaksi dan Sirkulasi)
CREATE TABLE audit_log (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pengguna_id VARCHAR(36) REFERENCES pengguna(id) ON DELETE SET NULL,
    aksi VARCHAR(100) NOT NULL, -- Contoh: "PINJAM_OFFLINE", "BOOKING_ONLINE", "PELUNASAN_DENDA"
    tabel VARCHAR(50) NOT NULL,
    entitas_id VARCHAR(36) NOT NULL,
    data_lama JSONB,
    data_baru JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_log_entitas ON audit_log(tabel, entitas_id);

-- 17. Pengaktifan Row Level Security (RLS) sebagai Technical Safety Net
ALTER TABLE pengguna ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kategori ENABLE ROW LEVEL SECURITY;
ALTER TABLE buku ENABLE ROW LEVEL SECURITY;
ALTER TABLE eksemplar ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE pinjaman ENABLE ROW LEVEL SECURITY;
ALTER TABLE denda ENABLE ROW LEVEL SECURITY;
ALTER TABLE ajuan_perpanjangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE literasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorit ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifikasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengaturan ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengumuman ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;


-- migrate:down
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS pengumuman CASCADE;
DROP TABLE IF EXISTS pengaturan CASCADE;
DROP TABLE IF EXISTS notifikasi CASCADE;
DROP TABLE IF EXISTS favorit CASCADE;
DROP TABLE IF EXISTS literasi CASCADE;
DROP TABLE IF EXISTS ajuan_perpanjangan CASCADE;
DROP TABLE IF EXISTS denda CASCADE;
DROP TABLE IF EXISTS pinjaman CASCADE;
DROP TABLE IF EXISTS reservasi CASCADE;
DROP TABLE IF EXISTS eksemplar CASCADE;
DROP TABLE IF EXISTS buku CASCADE;
DROP TABLE IF EXISTS kategori CASCADE;
DROP TABLE IF EXISTS sesi CASCADE;
DROP TABLE IF EXISTS pengguna CASCADE;

DROP TYPE IF EXISTS tipe_notifikasi;
DROP TYPE IF EXISTS status_literasi;
DROP TYPE IF EXISTS status_ajuan_perpanjangan;
DROP TYPE IF EXISTS status_denda;
DROP TYPE IF EXISTS status_pinjaman;
DROP TYPE IF EXISTS jalur_pinjaman;
DROP TYPE IF EXISTS status_reservasi;
DROP TYPE IF EXISTS jenis_reservasi;
DROP TYPE IF EXISTS status_eksemplar;
DROP TYPE IF EXISTS jenis_warga;
DROP TYPE IF EXISTS peran_pengguna;
