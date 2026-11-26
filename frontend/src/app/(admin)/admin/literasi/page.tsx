"use client";

import * as React from "react";
import Link from "next/link";
import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserAvatar } from "@/components/media/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  Flame,
  GraduationCap,
  Sparkles,
  Trophy,
  Users,
  Clock,
  Search,
} from "lucide-react";

interface SiswaLiterasi {
  id: string;
  nama: string;
  identitas: string;
  kelas: string;
  avatar: string;
  total_jam: number;
  total_buku: number;
  buku_terakhir: string;
  skor_review: number;
  badge: string;
}

const MOCK_TOP_READERS: SiswaLiterasi[] = [
  {
    id: "sis-1",
    nama: "Muhammad Fadhil",
    identitas: "0061234567",
    kelas: "XI SIJA A",
    avatar: "/images/avatars/user-1.png",
    total_jam: 48,
    total_buku: 14,
    buku_terakhir: "Rekayasa Perangkat Lunak Berorientasi Objek",
    skor_review: 95,
    badge: "Bintang Literasi",
  },
  {
    id: "sis-2",
    nama: "Ahmad Rizky Pratama",
    identitas: "0061234568",
    kelas: "XI SIJA B",
    avatar: "/images/avatars/user-2.png",
    total_jam: 42,
    total_buku: 12,
    buku_terakhir: "Keamanan Jaringan Komputer & Ethical Hacking",
    skor_review: 92,
    badge: "Khatam SIJA",
  },
  {
    id: "sis-3",
    nama: "Fauzan Akbar",
    identitas: "0061234569",
    kelas: "X SIJA A",
    avatar: "/images/avatars/user-3.png",
    total_jam: 36,
    total_buku: 10,
    buku_terakhir: "Dasar Pemrograman Python untuk AI",
    skor_review: 90,
    badge: "Pena Emas",
  },
  {
    id: "sis-4",
    nama: "Ananda Pratama",
    identitas: "0061234570",
    kelas: "XII SIJA",
    avatar: "/images/defaults/avatar.png",
    total_jam: 31,
    total_buku: 9,
    buku_terakhir: "Cloud Computing & DevOps Architecture",
    skor_review: 88,
    badge: "Pejuang Literasi",
  },
  {
    id: "sis-5",
    nama: "Rizka Aulia",
    identitas: "0061234571",
    kelas: "X SIJA B",
    avatar: "/images/defaults/avatar.png",
    total_jam: 29,
    total_buku: 8,
    buku_terakhir: "Adab dan Karakter Pelajar Muslim",
    skor_review: 89,
    badge: "Pembaca Teladan",
  },
];

const WEEKLY_TREND = [
  { pekan: "Pekan 1", tema: "Sastra & Wawasan", sesi: 142, persentase: 72 },
  { pekan: "Pekan 2", tema: "English Literacy", sesi: 158, persentase: 80 },
  { pekan: "Pekan 3", tema: "Teknologi SIJA", sesi: 176, persentase: 90 },
  { pekan: "Pekan 4", tema: "Adab & Karakter", sesi: 196, persentase: 100 },
];

const CATEGORY_DISTRIBUTION = [
  { nama: "Teknologi & Jaringan (SIJA)", porsi: 42, color: "bg-primary" },
  { nama: "Islam Terpadu & Akhlak", porsi: 28, color: "bg-emerald-600" },
  { nama: "Sains & Rekayasa Terapan", porsi: 18, color: "bg-blue-600" },
  { nama: "Fiksi & Sastra Inspiratif", porsi: 12, color: "bg-amber-600" },
];

export default function AdminLiterasiPage() {
  const [filterKelas, setFilterKelas] = React.useState<string>("semua");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const handleExport = (format: "pdf" | "excel") => {
    setToastMessage(`Laporan analitik literasi format ${format.toUpperCase()} berhasil diunduh.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredReaders = MOCK_TOP_READERS.filter((reader) => {
    if (filterKelas !== "semua" && !reader.kelas.toLowerCase().includes(filterKelas.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        reader.nama.toLowerCase().includes(q) ||
        reader.identitas.includes(q) ||
        reader.buku_terakhir.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
            <span className="text-foreground font-medium">Dashboard Literasi</span>
          </nav>

          {/* Heading Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-semibold text-primary border-sky-blue bg-primary-soft">
                  Program Unggulan Sekolah
                </Badge>
                <span className="text-xs text-muted-foreground">SMK TI BAZMA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading flex items-center gap-2.5">
                <Flame className="h-7 w-7 text-amber-500" />
                <span>Dashboard &amp; Analitik Literasi</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Monitoring kegiatan membaca mingguan (bergiliran Bahasa Indonesia &amp; Inggris), pencatatan stasiun literasi, dan rekap kepatuhan warga.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                onClick={() => handleExport("excel")}
                className="text-xs font-semibold gap-1.5 min-h-[44px] sm:min-h-[38px] border-border"
              >
                <Download className="h-4 w-4" />
                <span>Ekspor Rekap Excel</span>
              </Button>
              <Button
                onClick={() => handleExport("pdf")}
                className="text-xs font-semibold gap-1.5 min-h-[44px] sm:min-h-[38px] bg-primary text-white hover:bg-primary-hover shadow-xs"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Laporan Akreditasi PDF</span>
              </Button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-900 animate-in fade-in"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* 4 KARTU STATISTIK UTAMA LITERASI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Jam Membaca</span>
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-heading">1.286 Jam</div>
              <p className="text-[11px] text-muted-foreground">
                Tercatat otomatis dari stasiun literasi sekolah
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Kepatuhan Literasi</span>
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">96.4%</div>
              <p className="text-[11px] text-emerald-700 font-medium">
                482 dari 500 siswa aktif mengisi jurnal mingguan
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Kelas Paling Aktif</span>
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-heading">XI SIJA A</div>
              <p className="text-[11px] text-muted-foreground">
                Rata-rata 4.2 jam membaca per siswa per pekan
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Buku Selesai Dibaca</span>
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-heading">342 Eksemplar</div>
              <p className="text-[11px] text-muted-foreground">
                Tingkat pemahaman jurnal rata-rata 89.2%
              </p>
            </div>
          </div>

          {/* GRID TREN MINGGUAN & DISTRIBUSI KATEGORI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Tren Mingguan Pure CSS */}
            <div className="lg:col-span-7 rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-heading flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Tren Partisipasi Sesi Literasi Bulanan</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Data keikutsertaan siswa dalam agenda rutin literasi mingguan
                  </p>
                </div>
                <Badge variant="outline" className="text-xs font-semibold text-primary">
                  November 2026
                </Badge>
              </div>

              <div className="space-y-4 pt-2">
                {WEEKLY_TREND.map((item) => (
                  <div key={item.pekan} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-heading">
                        {item.pekan} <span className="font-normal text-muted-foreground">({item.tema})</span>
                      </span>
                      <span className="font-mono font-semibold text-primary">
                        {item.sesi} siswa ({item.persentase}%)
                      </span>
                    </div>
                    {/* Visual Bar Pure CSS */}
                    <div className="h-3 w-full rounded-full bg-background border border-border overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${item.persentase}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-background p-3.5 border border-border text-xs text-muted-foreground flex items-center justify-between">
                <span>Evaluasi Pustakawan: Agenda bahasa Inggris (Pekan 2) mengalami peningkatan +11% siswa aktif dibanding bulan lalu.</span>
              </div>
            </div>

            {/* Distribusi Kategori Buku Dibaca */}
            <div className="lg:col-span-5 rounded-xl border border-border bg-card p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-base font-bold text-heading flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Kategori Buku Terpopuler</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Distribusi minat baca siswa berasrama SMK TI BAZMA
                </p>
              </div>

              <div className="space-y-4 pt-1">
                {CATEGORY_DISTRIBUTION.map((cat) => (
                  <div key={cat.nama} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-heading truncate pr-2">{cat.nama}</span>
                      <span className="font-mono font-bold text-foreground shrink-0">{cat.porsi}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-background border border-border overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cat.color}`}
                        style={{ width: `${cat.porsi}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-border text-xs text-muted-foreground">
                <p>
                  Koleksi SIJA dan Islam Terpadu mendominasi 70% bahan bacaan, selaras dengan profil kurikulum kejuruan &amp; boarding school.
                </p>
              </div>
            </div>
          </div>

          {/* TABEL LEADERBOARD SISWA TERAKTIF */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h2 className="text-base font-bold text-heading flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <span>Peringkat Pembaca Siswa Teraktif (Leaderboard)</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Diberikan apresiasi bulanan berupa sertifikat dan piagam literasi sekolah
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                {/* Search Bar */}
                <div className="relative w-full sm:w-56">
                  <input
                    id="search-reader-input"
                    aria-label="Cari siswa atau buku terakhir"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari siswa / buku..."
                    className="w-full rounded-lg border border-input bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                </div>

                {/* Filter Kelas */}
                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none min-h-[36px]"
                  aria-label="Filter berdasarkan tingkat kelas"
                >
                  <option value="semua">Semua Tingkat</option>
                  <option value="X SIJA">Kelas X SIJA</option>
                  <option value="XI SIJA">Kelas XI SIJA</option>
                  <option value="XII SIJA">Kelas XII SIJA</option>
                </select>
              </div>
            </div>

            {/* Tabel Siswa */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 font-semibold">Peringkat &amp; Nama Siswa</th>
                    <th className="py-3 px-4 font-semibold">Kelas &amp; NISN</th>
                    <th className="py-3 px-4 font-semibold text-center">Buku Dibaca</th>
                    <th className="py-3 px-4 font-semibold text-center">Total Jam</th>
                    <th className="py-3 px-4 font-semibold">Buku Terakhir</th>
                    <th className="py-3 px-4 font-semibold text-center">Apresiasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredReaders.map((reader, index) => (
                    <tr key={reader.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold ${
                              index === 0
                                ? "bg-amber-100 text-amber-700"
                                : index === 1
                                ? "bg-slate-200 text-slate-700"
                                : index === 2
                                ? "bg-amber-50 text-amber-800"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <UserAvatar src={reader.avatar} nama={reader.nama} size={32} />
                          <div>
                            <span className="font-bold text-heading block">{reader.nama}</span>
                            <span className="text-[11px] text-muted-foreground">{reader.identitas}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-foreground font-semibold">{reader.kelas}</td>

                      <td className="py-3.5 px-4 text-center font-bold text-primary">
                        {reader.total_buku} Buku
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-heading">
                        {reader.total_jam} Jam
                      </td>

                      <td className="py-3.5 px-4 max-w-xs text-muted-foreground truncate" title={reader.buku_terakhir}>
                        {reader.buku_terakhir}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <Badge
                          variant="outline"
                          className="text-[11px] font-semibold border-sky-blue bg-primary-soft text-primary"
                        >
                          {reader.badge}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Menampilkan {filteredReaders.length} siswa pembaca aktif</span>
              <span className="font-medium">Sinkronisasi data absensi stasiun literasi otomatis</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
