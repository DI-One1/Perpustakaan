-- migrate:up
-- 18. Tabel ULASAN (Rating dan Ulasan Buku oleh Warga)
CREATE TABLE ulasan (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    pengguna_id VARCHAR(36) NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
    buku_id VARCHAR(36) NOT NULL REFERENCES buku(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    isi TEXT NOT NULL,
    berguna_count INT NOT NULL DEFAULT 0 CHECK (berguna_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_ulasan_pengguna_buku UNIQUE (pengguna_id, buku_id)
);
CREATE INDEX idx_ulasan_buku_rating ON ulasan(buku_id, rating);
CREATE INDEX idx_ulasan_pengguna ON ulasan(pengguna_id);

-- 19. Tabel ULASAN_VOTE (Pelacak Evaluasi "Apakah Ulasan Ini Berguna?")
CREATE TABLE ulasan_vote (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    ulasan_id VARCHAR(36) NOT NULL REFERENCES ulasan(id) ON DELETE CASCADE,
    pengguna_id VARCHAR(36) NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
    pilihan VARCHAR(10) NOT NULL CHECK (pilihan IN ('ya', 'tidak')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_ulasan_vote UNIQUE (ulasan_id, pengguna_id)
);
CREATE INDEX idx_ulasan_vote_lookup ON ulasan_vote(ulasan_id, pengguna_id);

-- Pengaktifan Row Level Security (RLS)
ALTER TABLE ulasan ENABLE ROW LEVEL SECURITY;
ALTER TABLE ulasan_vote ENABLE ROW LEVEL SECURITY;

-- migrate:down
DROP TABLE IF EXISTS ulasan_vote CASCADE;
DROP TABLE IF EXISTS ulasan CASCADE;
