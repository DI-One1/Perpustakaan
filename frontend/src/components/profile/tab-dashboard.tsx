"use client";

import * as React from "react";
import { BookCover } from "@/components/media/book-cover";
import {
  BookOpen,
  BookMarked,
  Clock,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import type { MockLoanItem } from "@/mocks";

interface TabDashboardProps {
  loans: MockLoanItem[];
  onNavigateTab: (tab: "peminjaman" | "riwayat") => void;
}

export function TabDashboard({ loans, onNavigateTab }: TabDashboardProps) {
  // Hitung metrik statistik
  const activeLoans = loans.filter((l) => l.status === "aktif");
  const completedLoans = loans.filter((l) => l.status === "kembali");
  const urgentLoans = activeLoans.filter((l) => l.sisa_hari <= 2);
  const totalBukuDibaca = completedLoans.length + 10; // Baseline mock aktivitas membaca siswa

  // Aktivitas terakhir tanpa em dash (mengikuti anti-slop R-02)
  const recentActivities = [
    {
      id: "act-1",
      tipe: "pinjam" as const,
      judul: "Keamanan Sistem Jaringan Nirkabel & Mikrotik Praktis",
      penulis: "Tyler Hart",
      tanggal: "14 Nov 2026",
      status: "Dipinjam (Aktif)",
    },
    {
      id: "act-2",
      tipe: "booking" as const,
      judul: "Clean Architecture: Panduan Praktis Arsitektur Perangkat Lunak",
      penulis: "Robert C. Martin",
      tanggal: "20 Nov 2026",
      status: "Siap Diambil di Sirkulasi",
    },
    {
      id: "act-3",
      tipe: "kembali" as const,
      judul: "Pengembangan Fullstack Modern dengan TypeScript & Next.js",
      penulis: "Boris Cherny",
      tanggal: "26 Okt 2026",
      status: "Tepat Waktu",
    },
    {
      id: "act-4",
      tipe: "kembali" as const,
      judul: "Adab Penuntut Ilmu dan Keutamaan Mengajar",
      penulis: "Imam An-Nawawi",
      tanggal: "08 Okt 2026",
      status: "Tepat Waktu",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Judul Halaman (Clean tanpa filler subtitle) */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-heading">
          Dashboard
        </h2>
      </div>

      {/* 3 Kartu Statistik Terarah & Berbobot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Buku Dibaca */}
        <div className="bg-primary-soft/60 border border-primary/20 rounded-xl p-5 flex flex-col justify-between transition-shadow hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Buku Dibaca
            </span>
            <div className="h-9 w-9 rounded-full bg-card text-primary flex items-center justify-center shadow-2xs">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-heading">{totalBukuDibaca}</span>
            <p className="text-xs text-muted-foreground mt-0.5">Total judul selesai</p>
          </div>
        </div>

        {/* Stat 2: Sedang Dipinjam */}
        <div className="bg-indigo-50/70 border border-indigo-200/60 rounded-xl p-5 flex flex-col justify-between transition-shadow hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Sedang Dipinjam
            </span>
            <div className="h-9 w-9 rounded-full bg-card text-indigo-700 flex items-center justify-center shadow-2xs">
              <BookMarked className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-heading">
              {activeLoans.length}
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">Eksemplar fisik aktif</p>
          </div>
        </div>

        {/* Stat 3: Segera Dikembalikan */}
        <div className="bg-warning-bg border border-amber-200 rounded-xl p-5 flex flex-col justify-between transition-shadow hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-warning-fg">
              Segera Dikembalikan
            </span>
            <div className="h-9 w-9 rounded-full bg-card text-warning-fg flex items-center justify-center shadow-2xs">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-heading">
              {urgentLoans.length}
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">Jatuh tempo kurang dari 2 hari</p>
          </div>
        </div>
      </div>

      {/* Bagian: Peminjaman Berlangsung */}
      <section
        aria-label="Peminjaman Berlangsung"
        className="bg-card rounded-xl border border-border p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-bold text-heading">Peminjaman Berlangsung</h3>
          <button
            type="button"
            onClick={() => onNavigateTab("peminjaman")}
            className="text-xs font-semibold text-primary hover:text-heading flex items-center gap-1 transition-colors"
          >
            <span>Kelola Peminjaman</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {activeLoans.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Tidak ada buku yang sedang dipinjam saat ini.
          </div>
        ) : (
          <div className="space-y-3">
            {activeLoans.map((loan) => {
              const isDueTomorrow = loan.sisa_hari <= 1;

              return (
                <div
                  key={loan.id}
                  className="rounded-xl border border-border bg-background/50 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Cover Buku Proporsional 2:3 */}
                    <div className="w-14 sm:w-16 shrink-0 shadow-2xs rounded overflow-hidden">
                      <BookCover
                        src={loan.cover_url}
                        judul={loan.judul_buku}
                        kategoriSlug={loan.kategori.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}
                        className="rounded-xs"
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-sm font-bold text-heading leading-snug line-clamp-1">
                        {loan.judul_buku}
                      </h4>
                      <p className="text-xs text-muted-foreground">{loan.penulis_buku}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary-text pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>Pinjam: {loan.tanggal_pinjam}</span>
                        </span>
                        <span>Jatuh Tempo: <strong>{loan.tanggal_jatuh_tempo}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Sisa Waktu & Warning Aksen Oranye */}
                  <div className="w-full sm:w-auto shrink-0 flex flex-col items-start sm:items-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                    {isDueTomorrow ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning-bg border border-amber-300 text-warning-fg text-xs font-semibold">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <span>Sisa 1 hari lagi!</span>
                      </div>
                    ) : (
                      <div className="px-3 py-1 rounded-lg bg-primary-soft text-primary text-xs font-medium">
                        Sisa {loan.sisa_hari} hari lagi
                      </div>
                    )}
                    <span className="text-xs font-mono text-muted-foreground">
                      ID: {loan.nomor_induk_eksemplar}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bagian: Aktivitas Terakhir (Daftar Sederhana, Tanpa Carousel) */}
      <section
        aria-label="Aktivitas Terakhir"
        className="bg-card rounded-xl border border-border p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-bold text-heading">Aktivitas Terakhir</h3>
          <button
            type="button"
            onClick={() => onNavigateTab("riwayat")}
            className="text-xs font-semibold text-primary hover:text-heading flex items-center gap-1 transition-colors"
          >
            <span>Semua Riwayat</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="divide-y divide-border">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 space-y-0.5">
                <p className="text-xs sm:text-sm font-semibold text-heading truncate">
                  {act.judul}
                </p>
                <p className="text-xs text-muted-foreground">
                  {act.penulis} • {act.tanggal}
                </p>
              </div>

              <div className="shrink-0">
                {act.tipe === "kembali" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-success-bg text-success-fg border border-emerald-300">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Dikembalikan</span>
                  </span>
                )}
                {act.tipe === "pinjam" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-soft text-primary border border-primary/20">
                    <BookMarked className="h-3 w-3" />
                    <span>Dipinjam</span>
                  </span>
                )}
                {act.tipe === "booking" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-warning-bg text-warning-fg border border-amber-300">
                    <Clock className="h-3 w-3" />
                    <span>Booking</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
