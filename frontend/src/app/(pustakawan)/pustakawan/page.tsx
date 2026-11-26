"use client";

import * as React from "react";
import Link from "next/link";
import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { MOCK_CIRCULATION_ITEMS } from "@/mocks";
import {
  ArrowRight,
  BookOpen,
  AlertTriangle,
  BookmarkCheck,
  ScanLine,
  RotateCcw,
} from "lucide-react";

export default function PustakawanDashboardPage() {
  const { user } = useAuth();

  const totalAktif = MOCK_CIRCULATION_ITEMS.filter((c) => c.status === "aktif").length;
  const totalTerlambat = MOCK_CIRCULATION_ITEMS.filter((c) => c.status === "terlambat").length;
  const totalBooking = MOCK_CIRCULATION_ITEMS.filter((c) => c.status === "menunggu_booking").length;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <UtilityBar />
      <Header />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-auto w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)] space-y-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Meja Pustakawan</span>
          </nav>

          {/* Heading Petugas */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
                  Panel Pustakawan & Sirkulasi
                </Badge>
                <span className="text-xs text-muted-foreground">SMK TI Bazma</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
                Selamat Bertugas, {user?.nama || "Ibu Nurul Hidayah"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Kelola transaksi peminjaman langsung, serah terima pengajuan peminjaman, dan pengembalian buku di Meja Sirkulasi.
              </p>
            </div>

            <Button asChild className="text-xs font-semibold gap-1.5 shadow-sm">
              <Link href="/pustakawan/sirkulasi">
                <ScanLine className="h-4 w-4" />
                <span>Buka Meja Sirkulasi Cepat</span>
              </Link>
            </Button>
          </div>

          {/* Grid Statistik Meja Sirkulasi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Pinjaman Sedang Berjalan</span>
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">{totalAktif}</div>
              <p className="text-[11px] text-muted-foreground">Eksemplar sedang dipinjam oleh siswa aktif</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Pengajuan Menunggu Diambil</span>
                <BookmarkCheck className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-3xl font-extrabold text-blue-600">{totalBooking}</div>
              <p className="text-[11px] text-muted-foreground">Siap diserahkan di rak sirkulasi (Batas 24 Jam)</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Keterlambatan Pengembalian</span>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              <div className="text-3xl font-extrabold text-red-600">{totalTerlambat}</div>
              <p className="text-[11px] text-muted-foreground">Dikenakan denda harian Rp 500/hari</p>
            </div>
          </div>

          {/* Quick Action Tiles */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground">Menu Layanan Cepat Pustakawan</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/pustakawan/sirkulasi?tab=pengajuan"
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all space-y-2 block"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <BookmarkCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  <span>1. Konfirmasi Pengajuan Peminjaman</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Scan atau input kode pengajuan (BKG-...) peminjam yang datang mengambil buku di meja sirkulasi.
                </p>
              </Link>

              <Link
                href="/pustakawan/sirkulasi?tab=pinjam"
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all space-y-2 block"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:scale-105 transition-transform">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  <span>2. Pinjam Langsung (Offline)</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Layanan peminjaman langsung di tempat dengan scan barcode eksemplar dan pemilihan durasi stepper.
                </p>
              </Link>

              <Link
                href="/pustakawan/sirkulasi?tab=kembali"
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all space-y-2 block"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 group-hover:scale-105 transition-transform">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  <span>3. Pengembalian & Denda</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Proses pengembalian buku, kalkulasi otomatis hari keterlambatan kalender, dan verifikasi kondisi buku.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
