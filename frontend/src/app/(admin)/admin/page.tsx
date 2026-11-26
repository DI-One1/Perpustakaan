"use client";

import * as React from "react";
import Link from "next/link";
import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Badge } from "@/components/ui/badge";
import {
  MOCK_AUDIT_LOGS,
  MOCK_MEMBERS,
  MOCK_BOOK_COPIES,
  MOCK_CIRCULATION_ITEMS,
} from "@/mocks";
import {
  ShieldCheck,
  Users,
  Settings,
  Layers,
  History,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  QrCode,
  ScanLine,
  Flame,
} from "lucide-react";

export default function AdminDashboardPage() {
  const totalWarga = MOCK_MEMBERS.length;
  const totalCopies = MOCK_BOOK_COPIES.length;
  const totalAvailable = MOCK_BOOK_COPIES.filter((c) => c.status === "tersedia").length;
  const totalActiveLoans = MOCK_CIRCULATION_ITEMS.filter((c) => c.status === "aktif").length;
  const totalFines = MOCK_CIRCULATION_ITEMS.reduce((sum, item) => sum + item.denda, 0);

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
            <span className="text-foreground font-medium">Dashboard Administrator</span>
          </nav>

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <ShieldCheck className="h-7 w-7 text-primary" />
                <span>Panel Administrator BILIK</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Pusat kendali master: Manajemen akun pengguna, pencatatan eksemplar fisik barcode, aturan sirkulasi, dan log audit sistem.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs py-1 px-3">
                Peran: Administrator Utama (Pak Ridwan)
              </Badge>
            </div>
          </div>

          {/* KARTU METRIK STATISTIK UTAMA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Pengguna</span>
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{totalWarga + 3} Akun</div>
              <p className="text-[11px] text-muted-foreground">
                {totalWarga} Warga Siswa • 2 Pustakawan • 1 Admin
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Inventaris Eksemplar</span>
                <Layers className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-foreground">{totalCopies} Unit Fisik</div>
              <p className="text-[11px] text-emerald-600 font-medium">
                {totalAvailable} unit siap di rak ({totalCopies - totalAvailable} teralokasi)
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Sirkulasi Berjalan</span>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-foreground">{totalActiveLoans} Peminjaman</div>
              <p className="text-[11px] text-muted-foreground">
                Terkontrol di Meja Sirkulasi
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Denda Tertunggak</span>
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-600">
                Rp {totalFines.toLocaleString("id-ID")}
              </div>
              <p className="text-[11px] text-muted-foreground">
                1 Siswa (Ananda Pratama) terlambat
              </p>
            </div>
          </div>

          {/* MENU NAVIGASI PINTAS MODUL ADMINISTRATOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <Link
              href="/admin/pengguna"
              className="group rounded-xl border border-border bg-card p-5 shadow-xs hover:border-primary/50 hover:bg-primary/5 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Kelola Pengguna & Akses</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Tambah akun warga, reset kata sandi ke default, dan kelola pemblokiran sirkulasi.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/buku"
              className="group rounded-xl border border-border bg-card p-5 shadow-xs hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:scale-105 transition-transform">
                  <QrCode className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Eksemplar & Barcode Fisik</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Katalog master buku, penomoran barcode unik (BK-xxxx), dan status per unit fisik.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/literasi"
              className="group rounded-xl border border-border bg-card p-5 shadow-xs hover:border-amber-500/50 hover:bg-amber-500/5 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 group-hover:scale-105 transition-transform">
                  <Flame className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Dashboard & Tren Literasi</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Monitoring jam baca siswa, kepatuhan jurnal mingguan, dan leaderboard literasi.
                </p>
              </div>
            </Link>

            <Link
              href="/pustakawan/sirkulasi"
              className="group rounded-xl border border-border bg-card p-5 shadow-xs hover:border-blue-500/50 hover:bg-blue-500/5 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 group-hover:scale-105 transition-transform">
                  <ScanLine className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Meja Sirkulasi Terpadu</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Buka meja pelayanan sirkulasi untuk serah terima pengajuan peminjaman dan peminjaman langsung.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/pengaturan"
              className="group rounded-xl border border-border bg-card p-5 shadow-xs hover:border-purple-500/50 hover:bg-purple-500/5 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 group-hover:scale-105 transition-transform">
                  <Settings className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Aturan Kebijakan Sistem</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Konfirmasi batas pengajuan (24 jam), durasi pinjam (7 hari), denda (Rp 500), kuota (1 buku).
                </p>
              </div>
            </Link>
          </div>

          {/* TABEL LOG AUDIT AKTIVITAS SISTEM */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  <span>Log Audit & Integritas Transaksi</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Catatan historis seluruh aktivitas sirkulasi, status eksemplar, dan perubahan parameter sistem.
                </p>
              </div>

              <Badge variant="outline" className="text-xs font-mono">
                Audit Trail Aktif (RFC 9457)
              </Badge>
            </div>

            {/* Tabel Audit Responsif */}
            <div
              tabIndex={0}
              role="region"
              aria-label="Tabel Log Audit"
              className="overflow-x-auto rounded-lg border border-border focus:ring-2 focus:ring-ring focus:outline-none"
            >
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/70 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3.5 font-semibold">Waktu Transaksi</th>
                    <th className="py-2.5 px-3.5 font-semibold">Aktor / Pengguna</th>
                    <th className="py-2.5 px-3.5 font-semibold">Aktivitas / Operasi</th>
                    <th className="py-2.5 px-3.5 font-semibold">Entitas Target</th>
                    <th className="py-2.5 px-3.5 font-semibold">Tipe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_AUDIT_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-3.5 font-mono text-muted-foreground whitespace-nowrap">
                        {log.waktu}
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-foreground">
                        {log.aktor}
                      </td>
                      <td className="py-3 px-3.5 text-foreground">
                        {log.aksi}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-primary font-medium">
                        {log.target}
                      </td>
                      <td className="py-3 px-3.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase ${
                            log.tipe === "sirkulasi"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                              : log.tipe === "eksemplar"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                              : log.tipe === "sistem"
                              ? "bg-purple-500/10 text-purple-600 border-purple-500/30"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {log.tipe}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
