"use client";

import * as React from "react";
import { BookCover } from "@/components/media/book-cover";
import { cn } from "@/lib/utils";
import { CheckCircle2, BookOpen, Clock, Calendar } from "lucide-react";

type FilterOption = "semua" | "dipinjam" | "dikembalikan" | "selesai";

interface ReadingHistoryItem {
  id: string;
  bukuId: string;
  judul: string;
  penulis: string;
  kategori: string;
  coverUrl: string;
  tanggalPinjam: string;
  statusPeminjaman: "Sedang Dipinjam" | "Sudah Dikembalikan";
  statusMembaca: "Selesai Dibaca" | "Sedang Dibaca";
  halamanTerakhir?: number;
  totalHalaman: number;
}

const INITIAL_READING_HISTORY: ReadingHistoryItem[] = [
  {
    id: "hist-1",
    bukuId: "buku-gadis-kretek",
    judul: "Gadis Kretek",
    penulis: "Ratih Kumala",
    kategori: "Sastra & Bahasa",
    coverUrl: "/images/covers/gadis-kretek.png",
    tanggalPinjam: "14 Nov 2026",
    statusPeminjaman: "Sedang Dipinjam",
    statusMembaca: "Sedang Dibaca",
    halamanTerakhir: 184,
    totalHalaman: 274,
  },
  {
    id: "hist-2",
    bukuId: "buku-laut-bercerita",
    judul: "Laut Bercerita",
    penulis: "Leila S. Chudori",
    kategori: "Sastra & Bahasa",
    coverUrl: "/images/covers/laut-bercerita.png",
    tanggalPinjam: "20 Okt 2026",
    statusPeminjaman: "Sudah Dikembalikan",
    statusMembaca: "Selesai Dibaca",
    halamanTerakhir: 379,
    totalHalaman: 379,
  },
  {
    id: "hist-3",
    bukuId: "buku-janji",
    judul: "Janji",
    penulis: "Tere Liye",
    kategori: "Keislaman & Akhlak",
    coverUrl: "/images/covers/janji.png",
    tanggalPinjam: "01 Okt 2026",
    statusPeminjaman: "Sudah Dikembalikan",
    statusMembaca: "Selesai Dibaca",
    halamanTerakhir: 488,
    totalHalaman: 488,
  },
  {
    id: "hist-4",
    bukuId: "buku-psychology-of-money",
    judul: "The Psychology of Money",
    penulis: "Morgan Housel",
    kategori: "Pengembangan Diri",
    coverUrl: "/images/covers/the-psychology-of-money.png",
    tanggalPinjam: "10 Sep 2026",
    statusPeminjaman: "Sudah Dikembalikan",
    statusMembaca: "Selesai Dibaca",
    halamanTerakhir: 268,
    totalHalaman: 268,
  },
  {
    id: "hist-5",
    bukuId: "buku-bumi",
    judul: "Bumi",
    penulis: "Tere Liye",
    kategori: "Sastra & Bahasa",
    coverUrl: "/images/covers/bumi.png",
    tanggalPinjam: "15 Agu 2026",
    statusPeminjaman: "Sudah Dikembalikan",
    statusMembaca: "Selesai Dibaca",
    halamanTerakhir: 440,
    totalHalaman: 440,
  },
];

export function TabRiwayatMembaca() {
  const [filter, setFilter] = React.useState<FilterOption>("semua");

  // Filter logika terpisah yang jelas antara status pinjam dan status membaca
  const filteredList = INITIAL_READING_HISTORY.filter((item) => {
    if (filter === "dipinjam") return item.statusPeminjaman === "Sedang Dipinjam";
    if (filter === "dikembalikan") return item.statusPeminjaman === "Sudah Dikembalikan";
    if (filter === "selesai") return item.statusMembaca === "Selesai Dibaca";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Halaman (Clean tanpa filler subtitle) */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-heading">
          Riwayat Membaca
        </h2>
      </div>

      {/* Filter Chips Berbasis Token */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("semua")}
          className={cn(
            "px-3.5 py-1.5 min-h-[38px] rounded-lg text-xs font-semibold transition-colors",
            filter === "semua"
              ? "bg-primary text-primary-foreground shadow-2xs"
              : "bg-card text-secondary-text hover:text-heading border border-border"
          )}
        >
          Semua ({INITIAL_READING_HISTORY.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("dipinjam")}
          className={cn(
            "px-3.5 py-1.5 min-h-[38px] rounded-lg text-xs font-semibold transition-colors",
            filter === "dipinjam"
              ? "bg-primary text-primary-foreground shadow-2xs"
              : "bg-card text-secondary-text hover:text-heading border border-border"
          )}
        >
          Sedang Dipinjam
        </button>
        <button
          type="button"
          onClick={() => setFilter("dikembalikan")}
          className={cn(
            "px-3.5 py-1.5 min-h-[38px] rounded-lg text-xs font-semibold transition-colors",
            filter === "dikembalikan"
              ? "bg-primary text-primary-foreground shadow-2xs"
              : "bg-card text-secondary-text hover:text-heading border border-border"
          )}
        >
          Sudah Dikembalikan
        </button>
        <button
          type="button"
          onClick={() => setFilter("selesai")}
          className={cn(
            "px-3.5 py-1.5 min-h-[38px] rounded-lg text-xs font-semibold transition-colors",
            filter === "selesai"
              ? "bg-primary text-primary-foreground shadow-2xs"
              : "bg-card text-secondary-text hover:text-heading border border-border"
          )}
        >
          Selesai Dibaca
        </button>
      </div>

      {/* Daftar Item Buku */}
      <div className="bg-card rounded-xl border border-border p-5 sm:p-6 shadow-xs">
        {filteredList.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            Tidak ada riwayat buku yang sesuai dengan filter yang dipilih.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredList.map((item) => (
              <div
                key={item.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                {/* Cover & Info Buku */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 sm:w-16 shrink-0 shadow-2xs rounded overflow-hidden">
                    <BookCover
                      src={item.coverUrl}
                      judul={item.judul}
                      kategoriSlug={item.kategori.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}
                      className="rounded-xs"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {item.kategori}
                    </span>
                    <h3 className="text-sm font-bold text-heading leading-snug line-clamp-1">
                      {item.judul}
                    </h3>
                    <p className="text-xs text-muted-foreground">{item.penulis}</p>
                    <div className="flex items-center gap-1 text-xs text-secondary-text pt-0.5">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>Dipinjam: {item.tanggalPinjam}</span>
                    </div>
                  </div>
                </div>

                {/* Status Peminjaman & Status Membaca Terpisah Jelas */}
                <div className="w-full sm:w-auto shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                  {/* Status Sirkulasi Fisik */}
                  <div>
                    {item.statusPeminjaman === "Sedang Dipinjam" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-soft text-primary border border-primary/20">
                        <Clock className="h-3 w-3" />
                        <span>Sedang Dipinjam</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Sudah Dikembalikan</span>
                      </span>
                    )}
                  </div>

                  {/* Status Membaca */}
                  <div>
                    {item.statusMembaca === "Selesai Dibaca" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>Selesai Dibaca (100%)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                        <BookOpen className="h-3 w-3 text-amber-600" />
                        <span>Sedang Dibaca ({Math.round(((item.halamanTerakhir || 0) / item.totalHalaman) * 100)}%)</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
