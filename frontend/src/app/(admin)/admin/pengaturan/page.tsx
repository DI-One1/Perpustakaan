"use client";

import * as React from "react";
import Link from "next/link";
import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Clock,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Save,
  ShieldCheck,
  Building,
} from "lucide-react";

export default function PengaturanSistemPage() {
  const [bookingJam, setBookingJam] = React.useState(24);
  const [durasiHari, setDurasiHari] = React.useState(7);
  const [kuotaPinjam, setKuotaPinjam] = React.useState(1);
  const [tarifDenda, setTarifDenda] = React.useState(500);
  const [batasDendaBlokir, setBatasDendaBlokir] = React.useState(10000);
  const [notification, setNotification] = React.useState<{ type: "success"; message: string } | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification({
      type: "success",
      message:
        "Parameter aturan bisnis sirkulasi BILIK berhasil diperbarui dan tersinkronisasi ke seluruh meja pustakawan dan sistem pengajuan peminjaman.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <UtilityBar />
      <Header />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-auto w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)] space-y-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/admin" className="hover:text-foreground transition-colors">
              Dashboard Admin
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Pengaturan Sistem</span>
          </nav>

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <Settings className="h-7 w-7 text-primary" />
                <span>Pengaturan Kebijakan &amp; Aturan Sirkulasi</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Konfigurasi parameter operasional perpustakaan SMK TI Bazma: Batas pengajuan 24 jam, kuota 1 buku, durasi kalender, dan tarif denda.
              </p>
            </div>

            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs py-1 px-3">
              Mode: Administrator Master
            </Badge>
          </div>

          {/* Notifikasi Alert */}
          {notification && (
            <div className="flex items-start justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-900">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-xs hover:opacity-70 focus:outline-none"
                aria-label="Tutup notifikasi"
              >
                ✕
              </button>
            </div>
          )}

          {/* FORM PENGATURAN ATURAN BISNIS */}
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Parameter 1: Batas Waktu Pengajuan Peminjaman */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Batas Waktu Pengajuan Peminjaman</h3>
                    <p className="text-[11px] text-muted-foreground">Tenggat klaim eksemplar di meja pustakawan</p>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={6}
                      max={72}
                      value={bookingJam}
                      onChange={(e) => setBookingJam(Number(e.target.value))}
                      className="w-24 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <span className="text-xs font-semibold text-foreground">Jam Kalender</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Standar SMK TI Bazma: <strong>24 Jam</strong>. Jika lewat, eksemplar otomatis dibuka kembali untuk warga lain.
                  </p>
                </div>
              </div>

              {/* Parameter 2: Batas Kuota Peminjaman Aktif */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Batas Kuota Pinjam per Warga</h3>
                    <p className="text-[11px] text-muted-foreground">Maksimal buku aktif yang dapat dibawa pulang</p>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={3}
                      value={kuotaPinjam}
                      onChange={(e) => setKuotaPinjam(Number(e.target.value))}
                      className="w-24 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <span className="text-xs font-semibold text-foreground">Buku per Akun</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Ketentuan BAZMA: <strong>1 Buku per Siswa</strong> (Menjamin keadilan rotasi buku berasrama).
                  </p>
                </div>
              </div>

              {/* Parameter 3: Durasi Peminjaman Standar */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Durasi Peminjaman Standar</h3>
                    <p className="text-[11px] text-muted-foreground">Masa pinjam awal sebelum perpanjangan</p>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={3}
                      max={14}
                      value={durasiHari}
                      onChange={(e) => setDurasiHari(Number(e.target.value))}
                      className="w-24 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <span className="text-xs font-semibold text-foreground">Hari Kalender</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Standar default: <strong>7 Hari</strong>. Pustakawan dapat menyesuaikan 3–14 hari di meja sirkulasi.
                  </p>
                </div>
              </div>

              {/* Parameter 4: Tarif Denda Keterlambatan */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Tarif Denda Keterlambatan</h3>
                    <p className="text-[11px] text-muted-foreground">Kalkulasi per hari kalender per buku</p>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground">Rp</span>
                    <input
                      type="number"
                      step={100}
                      value={tarifDenda}
                      onChange={(e) => setTarifDenda(Number(e.target.value))}
                      className="w-28 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <span className="text-xs text-muted-foreground">/ hari</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Standar BAZMA: <strong>Rp 500 / hari</strong> (termasuk hari libur sekolah kalender penuh).
                  </p>
                </div>
              </div>

              {/* Parameter 5: Ambang Batas Denda Blokir Akun */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs md:col-span-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">Ambang Batas Denda Sebelum Blokir Sirkulasi</h3>
                    <p className="text-[11px] text-muted-foreground">Batas akumulasi denda yang memicu pemblokiran peminjaman berikutnya</p>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground">Rp</span>
                    <input
                      type="number"
                      step={1000}
                      value={batasDendaBlokir}
                      onChange={(e) => setBatasDendaBlokir(Number(e.target.value))}
                      className="w-32 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Warga yang memiliki tunggakan denda melampaui batas ini otomatis diblokir dari mengajukan peminjaman baru.
                  </p>
                </div>
              </div>
            </div>

            {/* Identitas Instansi Sekolah */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Identitas Pengelola Perpustakaan</h3>
                  <p className="text-[11px] text-muted-foreground">Metadata sistem perpustakaan digital</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Nama Instansi:</span>
                  <span className="font-semibold text-foreground">SMK TI BAZMA (Yayasan BAZMA Pertamina)</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Nama Aplikasi:</span>
                  <span className="font-semibold text-foreground">BILIK (Bilik Literasi Digital)</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Tahun Operasional:</span>
                  <span className="font-semibold text-foreground">Tahun Ajaran 2026/2027</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="text-xs font-bold gap-2 h-10 px-6">
                <Save className="h-4 w-4" />
                <span>Simpan Seluruh Pengaturan Sistem</span>
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
