"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, Star, Users, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";

interface Eksemplar {
  id: string;
  kode_barcode: string;
  lokasi_rak: string;
  status: string;
}

interface Ulasan {
  id: string;
  rating: number;
  komentar: string;
  created_at: string;
  pengguna: { nama_lengkap: string; kelas_atau_jabatan: string };
}

interface BukuDetail {
  id: string;
  judul: string;
  penulis: string;
  penerbit: string;
  tahun_terbit: number;
  isbn: string;
  sinopsis: string;
  cover_url: string;
  kategori: { nama: string };
  eksemplar: Eksemplar[];
  ulasan: Ulasan[];
  stok_tersedia: number;
  jumlah_antrean: number;
  maks_antrean: number;
  is_favorit: boolean;
}

export default function BukuDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [buku, setBuku] = useState<BukuDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [pesan, setPesan] = useState<{ tipe: "sukses" | "error"; teks: string } | null>(null);
  const [ratingInput, setRatingInput] = useState(5);
  const [komentarInput, setKomentarInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(() => {
    fetch(`/api/v1/buku/${params.id}`)
      .then((r) => r.json())
      .then((d) => setBuku(d.buku ?? null))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleAjukanPinjam() {
    setPesan(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/reservasi/pengajuan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buku_id: params.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/masuk");
          return;
        }
        setPesan({ tipe: "error", teks: data.detail || "Gagal mengajukan peminjaman." });
        return;
      }
      setPesan({
        tipe: "sukses",
        teks: `Pengajuan berhasil (${data.reservasi.kode_reservasi}). Eksemplar ${data.reservasi.eksemplar?.kode_barcode} direservasi selama 24 jam.`,
      });
      loadData();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAntre() {
    setPesan(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/reservasi/antre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buku_id: params.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/masuk");
          return;
        }
        setPesan({ tipe: "error", teks: data.detail || "Gagal masuk antrean." });
        return;
      }
      setPesan({
        tipe: "sukses",
        teks: `Berhasil masuk antrean FIFO pada urutan #${data.urutan} (${data.reservasi.kode_reservasi}).`,
      });
      loadData();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleFavorit() {
    const res = await fetch("/api/v1/favorit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buku_id: params.id }),
    });
    if (res.status === 401) {
      router.push("/masuk");
      return;
    }
    loadData();
  }

  async function handleKirimUlasan(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/v1/ulasan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buku_id: params.id, rating: ratingInput, komentar: komentarInput }),
    });
    if (res.status === 401) {
      router.push("/masuk");
      return;
    }
    if (res.ok) {
      setKomentarInput("");
      loadData();
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Katalog
        </Link>

        {loading || !buku ? (
          <div className="mt-6 animate-pulse rounded-2xl border border-border p-8">Memuat detail buku...</div>
        ) : (
          <>
            <div className="mt-6 grid gap-8 md:grid-cols-[260px_1fr]">
              <div>
                <div className="aspect-[2/3] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
                  <img src={buku.cover_url} alt={buku.judul} className="h-full w-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={handleToggleFavorit}
                  className={`mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    buku.is_favorit
                      ? "border-destructive bg-red-50 text-destructive"
                      : "border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${buku.is_favorit ? "fill-destructive" : ""}`} />
                  {buku.is_favorit ? "Tersimpan di Favorit" : "Simpan ke Favorit"}
                </button>
              </div>

              <div>
                <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                  {buku.kategori.nama}
                </span>
                <h1 className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">{buku.judul}</h1>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {buku.penulis} &bull; {buku.penerbit} ({buku.tahun_terbit}) &bull; ISBN {buku.isbn}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-foreground">{buku.sinopsis}</p>

                {pesan && (
                  <div
                    className={`mt-5 rounded-xl border px-4 py-3 text-sm font-semibold ${
                      pesan.tipe === "sukses"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-destructive/30 bg-red-50 text-destructive"
                    }`}
                  >
                    {pesan.teks}
                  </div>
                )}

                {/* Tombol Aksi Standar: Kiri (Outline) Antre Buku, Kanan (Solid Primary) Ajukan Peminjaman */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={submitting || buku.stok_tersedia > 0 || buku.jumlah_antrean >= buku.maks_antrean}
                    onClick={handleAntre}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-primary bg-background px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <Users className="h-4 w-4" />
                    {buku.jumlah_antrean >= buku.maks_antrean
                      ? "Antrean Penuh"
                      : `Antre Buku (${buku.jumlah_antrean}/${buku.maks_antrean})`}
                  </button>

                  <button
                    type="button"
                    disabled={submitting || buku.stok_tersedia === 0}
                    onClick={handleAjukanPinjam}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <Clock className="h-4 w-4" />
                    Ajukan Peminjaman
                  </button>
                </div>

                {/* Daftar Eksemplar Fisik */}
                <div className="mt-8 rounded-2xl border border-border bg-card p-5">
                  <h2 className="text-sm font-extrabold text-foreground">
                    Ketersediaan Eksemplar Fisik ({buku.stok_tersedia} Tersedia)
                  </h2>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {buku.eksemplar.map((e) => (
                      <div
                        key={e.id}
                        className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-xs"
                      >
                        <div>
                          <span className="font-mono font-bold text-foreground">{e.kode_barcode}</span>
                          <span className="block text-[11px] text-muted-foreground">{e.lokasi_rak}</span>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            e.status === "tersedia"
                              ? "bg-emerald-100 text-emerald-800"
                              : e.status === "direservasi"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {e.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating & Ulasan */}
            <section className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
              <div>
                <h2 className="text-lg font-extrabold text-foreground">
                  Rating &amp; Ulasan ({buku.ulasan.length})
                </h2>
                <div className="mt-4 space-y-3">
                  {buku.ulasan.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Belum ada ulasan untuk buku ini.</p>
                  ) : (
                    buku.ulasan.map((u) => (
                      <div key={u.id} className="rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-foreground">{u.pengguna.nama_lengkap}</span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {u.rating}/5
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm text-foreground">{u.komentar}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <form onSubmit={handleKirimUlasan} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-base font-extrabold text-foreground">Tulis Ulasan Anda</h3>
                <div className="mt-3">
                  <label htmlFor="rating-select" className="block text-xs font-bold text-foreground">
                    Rating Bintang
                  </label>
                  <select
                    id="rating-select"
                    value={ratingInput}
                    onChange={(e) => setRatingInput(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Bintang
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-3">
                  <label htmlFor="komentar-input" className="block text-xs font-bold text-foreground">
                    Komentar
                  </label>
                  <textarea
                    id="komentar-input"
                    required
                    rows={3}
                    value={komentarInput}
                    onChange={(e) => setKomentarInput(e.target.value)}
                    placeholder="Bagikan pengalaman membaca buku ini..."
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 min-h-[44px] rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-hover"
                >
                  Kirim Ulasan
                </button>
              </form>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
