"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Star, BookOpen } from "lucide-react";
import { Navbar } from "@/components/Navbar";

interface BukuItem {
  id: string;
  judul: string;
  penulis: string;
  cover_url: string;
  kategori: { id: string; nama: string; slug: string };
  stok_tersedia: number;
  stok_direservasi: number;
  stok_dipinjam: number;
  total_eksemplar: number;
  rating_rata_rata: number;
  jumlah_ulasan: number;
}

interface KategoriItem {
  id: string;
  nama: string;
  slug: string;
}

export default function HomePage() {
  const [buku, setBuku] = useState<BukuItem[]>([]);
  const [kategori, setKategori] = useState<KategoriItem[]>([]);
  const [q, setQ] = useState("");
  const [katAktif, setKatAktif] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (katAktif) params.set("kategori", katAktif);

    setLoading(true);
    fetch(`/api/v1/katalog?${params.toString()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        setBuku(d.buku ?? []);
        setKategori(d.kategori ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [q, katAktif]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Hero Banner */}
        <section className="rounded-2xl bg-primary px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
              PERPUSTAKAAN DIGITAL SMK TI BAZMA
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
              Temukan Referensi Belajar &amp; Literasi Terbaik
            </h1>
            <p className="mt-2 text-sm text-blue-100 sm:text-base">
              Ajukan peminjaman daring dengan alokasi eksemplar fisik ber-barcode, pantau antrean FIFO, dan kelola pinjaman dalam satu portal terpadu.
            </p>

            <div className="mt-6 flex items-center rounded-xl bg-white p-1.5 text-foreground shadow-sm">
              <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" />
              <label htmlFor="cari-buku" className="sr-only">
                Cari judul, penulis, atau ISBN
              </label>
              <input
                id="cari-buku"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari judul buku, penulis, atau ISBN..."
                className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </section>

        {/* Filter Kategori */}
        <section className="mt-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setKatAktif("")}
            className={`min-h-[40px] rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              katAktif === ""
                ? "bg-primary text-white"
                : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            Semua Kategori
          </button>
          {kategori.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setKatAktif(k.slug)}
              className={`min-h-[40px] rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                katAktif === k.slug
                  ? "bg-primary text-white"
                  : "border border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {k.nama}
            </button>
          ))}
        </section>

        {/* Grid Katalog */}
        <section className="mt-6">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-border p-3">
                  <div className="aspect-[2/3] w-full rounded-lg bg-muted" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : buku.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
              <h2 className="mt-3 text-base font-bold text-foreground">Buku Tidak Ditemukan</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Coba ubah kata kunci pencarian atau pilih kategori lain.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {buku.map((b) => (
                <Link
                  key={b.id}
                  href={`/buku/${b.id}`}
                  className="group flex flex-col rounded-xl border border-border bg-card p-3 transition hover:border-primary/40 hover:shadow-md"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-muted">
                    <img
                      src={b.cover_url}
                      alt={b.judul}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span
                      className={`absolute top-2 left-2 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                        b.stok_tersedia > 0
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {b.stok_tersedia > 0 ? `Tersedia (${b.stok_tersedia})` : "Stok Kosong"}
                    </span>
                  </div>

                  <span className="mt-2.5 text-[11px] font-semibold text-primary">
                    {b.kategori.nama}
                  </span>
                  <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-foreground group-hover:text-primary">
                    {b.judul}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{b.penulis}</p>

                  <div className="mt-auto flex items-center gap-1 pt-2 text-xs text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-foreground">
                      {b.rating_rata_rata > 0 ? b.rating_rata_rata : "-"}
                    </span>
                    <span>({b.jumlah_ulasan})</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
