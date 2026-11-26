"use client";

import * as React from "react";
import Link from "next/link";
import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BookCover } from "@/components/media/book-cover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";
import { MOCK_USER_LOANS, type MockLoanItem } from "@/mocks";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  BookOpen,
  ArrowRight,
  Info,
  RefreshCw,
  RotateCcw,
  ChevronRight,
} from "lucide-react";

export default function PinjamanPage() {
  const { user } = useAuth();
  const [loans, setLoans] = React.useState<MockLoanItem[]>(MOCK_USER_LOANS);
  const [selectedLoan, setSelectedLoan] = React.useState<MockLoanItem | null>(null);
  const [perpanjangReason, setPerpanjangReason] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [dialogError, setDialogError] = React.useState<string | null>(null);

  const activeLoans = loans.filter((l) => l.status === "aktif" || l.status === "perpanjangan_diajukan");
  const pastLoans = loans.filter((l) => l.status === "kembali");

  const handleOpenPerpanjang = (loan: MockLoanItem) => {
    setSelectedLoan(loan);
    setPerpanjangReason("");
    setDialogError(null);
    setSubmitSuccess(false);
  };

  const handleSubmitPerpanjangan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (perpanjangReason.trim().length < 10) {
      setDialogError("Alasan perpanjangan wajib diisi minimal 10 karakter.");
      return;
    }

    setIsSubmitting(true);
    setDialogError(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      if (selectedLoan) {
        setLoans((prev) =>
          prev.map((item) =>
            item.id === selectedLoan.id
              ? {
                  ...item,
                  status: "perpanjangan_diajukan",
                  bisa_diperpanjang: false,
                  alasan_perpanjangan: perpanjangReason.trim(),
                }
              : item
          )
        );
      }
    }, 700);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <UtilityBar />
      <Header />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-auto w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)] space-y-6">
          {/* Breadcrumb Navigasi */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors font-medium">
              Beranda
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span className="font-semibold text-heading">Pinjaman Buku Saya</span>
          </nav>

          {/* Heading Halaman */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading">
                Pinjaman Buku Saya
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Pantau eksemplar aktif yang sedang Anda pinjam, tenggat pengembalian, dan riwayat sirkulasi.
              </p>
            </div>

            {user && (
              <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-[8px] border border-border shrink-0 text-xs shadow-xs">
                <span className="text-muted-foreground">Peminjam:</span>
                <span className="font-bold text-heading">{user.nama}</span>
                <span className="bg-primary-soft text-primary font-bold px-2 py-0.5 rounded-full text-[11px]">
                  Maks. 1 Buku
                </span>
              </div>
            )}
          </div>

          {/* Peringatan Jatuh Tempo Dekat (Jika ada pinjaman yang sisa <= 2 hari) */}
          {activeLoans.some((l) => l.sisa_hari <= 2) && (
            <div className="flex items-start gap-3 rounded-[10px] border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-bold">Perhatian: Jatuh Tempo Segera Tiba!</p>
                <p className="text-xs leading-relaxed text-amber-800">
                  Buku <strong>{activeLoans[0]?.judul_buku}</strong> jatuh tempo pada{" "}
                  <strong>{activeLoans[0]?.tanggal_jatuh_tempo}</strong>. Segera kembalikan ke meja sirkulasi
                  sebelum pukul 16.30 WIB atau ajukan perpanjangan online untuk menghindari denda harian.
                </p>
              </div>
            </div>
          )}

          {/* Tabs Navigasi: Pinjaman Aktif vs Riwayat */}
          <Tabs defaultValue="aktif" className="w-full space-y-6">
            <TabsList className="grid w-full sm:w-[360px] grid-cols-2 bg-white border border-border p-1 rounded-[10px]">
              <TabsTrigger value="aktif" className="gap-2 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-white rounded-[7px]">
                <BookOpen className="h-4 w-4" />
                <span>Pinjaman Aktif ({activeLoans.length})</span>
              </TabsTrigger>
              <TabsTrigger value="riwayat" className="gap-2 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-white rounded-[7px]">
                <RotateCcw className="h-4 w-4" />
                <span>Riwayat ({pastLoans.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: PINJAMAN AKTIF */}
            <TabsContent value="aktif" className="space-y-4">
              {activeLoans.length === 0 ? (
                <div className="rounded-[14px] border border-dashed border-border bg-white p-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary mb-4">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-heading">Tidak Ada Pinjaman Aktif</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                    Saat ini Anda tidak sedang meminjam buku. Anda memiliki kuota untuk meminjam 1 buku di perpustakaan.
                  </p>
                  <Button asChild className="mt-5 text-xs font-semibold gap-1.5 bg-primary hover:bg-primary-hover text-white rounded-[8px]">
                    <Link href="/katalog">
                      <span>Jelajahi Katalog Buku</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                activeLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex flex-col md:flex-row gap-5 rounded-[14px] border border-border bg-white p-5 sm:p-6 shadow-xs transition-shadow hover:shadow-md"
                  >
                    {/* Cover Buku */}
                    <div className="w-[110px] shrink-0 mx-auto md:mx-0">
                      <BookCover
                        src={loan.cover_url}
                        judul={loan.judul_buku}
                        kategoriSlug={loan.kategori.toLowerCase().replace(/\s+/g, "-")}
                        className="rounded-md shadow-xs"
                      />
                    </div>

                    {/* Rincian Buku & Sirkulasi */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs font-semibold border-border bg-background text-primary">
                          {loan.kategori}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          No. Transaksi: <strong className="text-heading">{loan.nomor_transaksi}</strong>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Eksemplar: <strong className="text-heading font-mono">{loan.nomor_induk_eksemplar}</strong>
                        </span>
                      </div>

                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-heading">
                          <Link href={`/buku/${loan.buku_id}`} className="hover:text-primary transition-colors">
                            {loan.judul_buku}
                          </Link>
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Penulis: {loan.penulis_buku}</p>
                      </div>

                      {/* Timeline Peminjaman Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-background p-3.5 rounded-[10px] border border-border text-xs">
                        <div>
                          <span className="text-muted-foreground block">Tanggal Pinjam</span>
                          <span className="font-semibold text-heading flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {loan.tanggal_pinjam}
                          </span>
                        </div>

                        <div>
                          <span className="text-muted-foreground block">Jatuh Tempo</span>
                          <span className="font-semibold text-heading flex items-center gap-1 mt-0.5">
                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                            {loan.tanggal_jatuh_tempo}
                          </span>
                        </div>

                        <div>
                          <span className="text-muted-foreground block">Sisa Waktu</span>
                          <span className="font-bold text-amber-700 block mt-0.5">
                            {loan.sisa_hari} Hari Lagi
                          </span>
                        </div>

                        <div>
                          <span className="text-muted-foreground block">Denda Berjalan</span>
                          <span className="font-bold text-emerald-700 block mt-0.5">
                            Rp {loan.denda.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>

                      {/* Status Perpanjangan Notifikasi */}
                      {loan.status === "perpanjangan_diajukan" && (
                        <div className="flex items-center gap-2 rounded-[8px] bg-blue-50 border border-blue-200 p-2.5 text-xs text-blue-800">
                          <Info className="h-4 w-4 shrink-0 text-primary" />
                          <span>
                            Pengajuan perpanjangan telah dikirim ke Pustakawan. Alasan: &quot;{loan.alasan_perpanjangan}&quot;
                          </span>
                        </div>
                      )}

                      {/* Tombol Aksi */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {loan.bisa_diperpanjang && (
                          <Button
                            onClick={() => handleOpenPerpanjang(loan)}
                            variant="outline"
                            className="text-xs h-9 gap-1.5 font-semibold border-border hover:bg-primary-soft text-primary"
                          >
                            <RefreshCw className="h-3.5 w-3.5 text-primary" />
                            <span>Ajukan Perpanjangan (+7 Hari)</span>
                          </Button>
                        )}

                        <Button asChild variant="ghost" className="text-xs h-9 text-muted-foreground hover:text-heading">
                          <Link href={`/buku/${loan.buku_id}`}>Lihat Detail Buku</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {/* TAB 2: RIWAYAT PEMINJAMAN SELESAI */}
            <TabsContent value="riwayat" className="space-y-4">
              <div
                tabIndex={0}
                role="region"
                aria-label="Tabel Riwayat Peminjaman"
                className="overflow-x-auto rounded-[14px] border border-border bg-white shadow-xs"
              >
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-background text-xs text-muted-foreground border-b border-border sticky top-0">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Judul Buku & Eksemplar</th>
                      <th className="py-3 px-4 font-semibold">Tgl Pinjam</th>
                      <th className="py-3 px-4 font-semibold">Tgl Kembali</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Denda</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs">
                    {pastLoans.map((p) => (
                      <tr key={p.id} className="hover:bg-background transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-heading text-sm">{p.judul_buku}</div>
                          <div className="text-muted-foreground text-xs mt-0.5">
                            {p.penulis_buku} • <span className="font-mono text-primary">{p.nomor_induk_eksemplar}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">{p.tanggal_pinjam}</td>
                        <td className="py-3.5 px-4 text-heading font-medium">{p.tanggal_kembali || "-"}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Dikembalikan
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-heading">
                          Rp {p.denda.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* DIALOG PENGAJUAN PERPANJANGAN MANDIRI */}
      <Dialog open={Boolean(selectedLoan)} onOpenChange={(open) => !open && setSelectedLoan(null)}>
        <DialogContent className="sm:max-w-[480px] bg-white border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-heading">Ajukan Perpanjangan Pinjam</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Perpanjangan menambah durasi pinjam selama <strong>7 hari kalender</strong>. Pengajuan wajib disertai alasan
              akademik yang jelas dan disetujui pustakawan.
            </DialogDescription>
          </DialogHeader>

          {submitSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-heading text-base">Pengajuan Berhasil Dikirim!</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Pengajuan perpanjangan untuk buku <strong>{selectedLoan?.judul_buku}</strong> telah diterima sistem dan
                menunggu konfirmasi pustakawan.
              </p>
              <div className="pt-2">
                <Button onClick={() => setSelectedLoan(null)} className="text-xs font-semibold px-6 bg-primary text-white">
                  Tutup
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitPerpanjangan} className="space-y-4 pt-2">
              {/* Ringkasan Buku */}
              <div className="bg-background p-3 rounded-[8px] border border-border text-xs space-y-1">
                <div className="font-semibold text-heading">{selectedLoan?.judul_buku}</div>
                <div className="text-muted-foreground">
                  Jatuh tempo saat ini: <strong>{selectedLoan?.tanggal_jatuh_tempo}</strong> ➔ Usulan baru:{" "}
                  <strong className="text-primary">28 Nov 2026</strong>
                </div>
              </div>

              {/* Form Alasan */}
              <div className="space-y-1.5">
                <label htmlFor="alasan-perpanjang" className="text-xs font-semibold text-heading flex justify-between">
                  <span>Alasan Perpanjangan (Wajib)</span>
                  <span className="text-muted-foreground text-[11px]">Min. 10 karakter</span>
                </label>
                <textarea
                  id="alasan-perpanjang"
                  rows={3}
                  value={perpanjangReason}
                  onChange={(e) => setPerpanjangReason(e.target.value)}
                  placeholder="Contoh: Masih menyelesaikan tugas proyek akhir rekayasa perangkat lunak..."
                  className="w-full rounded-[8px] border border-input bg-white p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {dialogError && <p className="text-xs text-red-500 font-medium">{dialogError}</p>}
              </div>

              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedLoan(null)}
                  className="text-xs border-border"
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting} className="text-xs font-semibold gap-1.5 bg-primary hover:bg-primary-hover text-white">
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <span>Kirim Pengajuan</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
      <MobileNav />
    </div>
  );
}
