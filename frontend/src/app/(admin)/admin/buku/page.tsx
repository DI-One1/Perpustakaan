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
import {
  MOCK_BOOKS,
  MOCK_BOOK_COPIES,
  type MockBook,
  type MockBookCopy,
  type EksemplarStatus,
} from "@/mocks";
import {
  BookOpen,
  QrCode,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  RotateCcw,
  Printer,
} from "lucide-react";

export default function ManajemenBukuEksemplarPage() {
  const [copies, setCopies] = React.useState<MockBookCopy[]>(MOCK_BOOK_COPIES);
  const [books] = React.useState<MockBook[]>(MOCK_BOOKS);
  const [activeTab, setActiveTab] = React.useState("eksemplar");

  // Filters
  const [statusFilter, setStatusFilter] = React.useState<"semua" | EksemplarStatus>("semua");
  const [searchCopyQuery, setSearchCopyQuery] = React.useState("");
  const [searchBookQuery, setSearchBookQuery] = React.useState("");
  const [notification, setNotification] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  // Dialog Tambah Eksemplar Baru
  const [isAddCopyOpen, setIsAddCopyOpen] = React.useState(false);
  const [selectedBookForCopy, setSelectedBookForCopy] = React.useState(books[0]?.id || "buku-laskar");
  const [generatedBarcode, setGeneratedBarcode] = React.useState("BK-0009");

  // Filtered Copies
  const filteredCopies = copies.filter((c) => {
    if (statusFilter !== "semua" && c.status !== statusFilter) return false;
    if (searchCopyQuery.trim()) {
      const q = searchCopyQuery.toLowerCase().trim();
      return (
        c.barcode.toLowerCase().includes(q) ||
        c.buku_judul.toLowerCase().includes(q) ||
        c.buku_penulis.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Books
  const filteredBooks = books.filter((b) => {
    if (searchBookQuery.trim()) {
      const q = searchBookQuery.toLowerCase().trim();
      return (
        b.judul.toLowerCase().includes(q) ||
        b.penulis.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Ubah status eksemplar
  const handleUpdateStatus = (barcode: string, newStatus: EksemplarStatus) => {
    setCopies((prev) =>
      prev.map((c) =>
        c.barcode === barcode
          ? {
              ...c,
              status: newStatus,
              dialokasikan_ke: newStatus === "tersedia" ? null : c.dialokasikan_ke,
            }
          : c
      )
    );
    setNotification({
      type: "success",
      message: `Status eksemplar fisik ${barcode} berhasil diubah menjadi '${newStatus}'.`,
    });
  };

  // Submit Tambah Eksemplar Baru
  const handleAddCopySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBook = books.find((b) => b.id === selectedBookForCopy);
    if (!targetBook) return;

    const newCopy: MockBookCopy = {
      barcode: generatedBarcode,
      buku_id: targetBook.id,
      buku_judul: targetBook.judul,
      buku_penulis: targetBook.penulis,
      nomor_panggil: targetBook.nomor_panggil,
      status: "tersedia",
      cover_url: targetBook.cover_url || "/images/defaults/cover-teknologi.png",
      dialokasikan_ke: null,
    };

    setCopies((prev) => [newCopy, ...prev]);
    setIsAddCopyOpen(false);

    // Auto increment barcode untuk berikutnya
    const num = parseInt(generatedBarcode.replace(/\D/g, ""), 10) + 1;
    setGeneratedBarcode(`BK-${String(num).padStart(4, "0")}`);

    setNotification({
      type: "success",
      message: `Eksemplar fisik baru [${newCopy.barcode}] untuk buku "${newCopy.buku_judul}" berhasil diterbitkan dan siap dicetak labelnya!`,
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
            <span className="text-foreground font-medium">Buku &amp; Eksemplar Fisik</span>
          </nav>

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <QrCode className="h-7 w-7 text-primary" />
                <span>Inventaris Eksemplar Fisik &amp; Master Buku</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Setiap eksemplar fisik wajib ber-barcode unik (BK-xxxx) untuk membedakan tiap unit buku dan mencegah konflik peminjaman.
              </p>
            </div>

            <Button
              onClick={() => setIsAddCopyOpen(true)}
              className="text-xs font-semibold gap-1.5 shrink-0 h-10 px-4"
            >
              <Plus className="h-4 w-4" />
              <span>Cetak Barcode Eksemplar Baru</span>
            </Button>
          </div>

          {/* Notifikasi Alert */}
          {notification && (
            <div
              className={`flex items-start justify-between gap-3 rounded-lg border p-4 text-xs font-medium transition-all ${
                notification.type === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-900"
                  : "border-red-500/30 bg-red-500/10 text-red-900"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {notification.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                )}
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

          {/* Radix Tabs: Eksemplar vs Master Buku */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 h-auto p-1 bg-muted/80 gap-1 rounded-xl">
              <TabsTrigger value="eksemplar" className="py-2.5 px-5 gap-2 text-xs sm:text-sm font-semibold">
                <QrCode className="h-4 w-4 text-primary" />
                <span>1. Inventaris Eksemplar Fisik ({copies.length})</span>
              </TabsTrigger>
              <TabsTrigger value="katalog" className="py-2.5 px-5 gap-2 text-xs sm:text-sm font-semibold">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <span>2. Master Judul Buku ({books.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: EKSEMPLAR FISIK & STATUS LIFECYCLE */}
            <TabsContent value="eksemplar" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                {/* Filter Status Eksemplar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <Button
                    size="sm"
                    variant={statusFilter === "semua" ? "default" : "outline"}
                    onClick={() => setStatusFilter("semua")}
                    className="text-xs h-8"
                  >
                    Semua ({copies.length})
                  </Button>
                  <Button
                    size="sm"
                    variant={statusFilter === "tersedia" ? "default" : "outline"}
                    onClick={() => setStatusFilter("tersedia")}
                    className="text-xs h-8 text-emerald-600"
                  >
                    Tersedia
                  </Button>
                  <Button
                    size="sm"
                    variant={statusFilter === "dibooking" ? "default" : "outline"}
                    onClick={() => setStatusFilter("dibooking")}
                    className="text-xs h-8 text-amber-600"
                  >
                    Diajukan
                  </Button>
                  <Button
                    size="sm"
                    variant={statusFilter === "dipinjam" ? "default" : "outline"}
                    onClick={() => setStatusFilter("dipinjam")}
                    className="text-xs h-8 text-blue-600"
                  >
                    Dipinjam
                  </Button>
                  <Button
                    size="sm"
                    variant={statusFilter === "perbaikan" ? "default" : "outline"}
                    onClick={() => setStatusFilter("perbaikan")}
                    className="text-xs h-8 text-purple-600"
                  >
                    Perbaikan
                  </Button>
                  <Button
                    size="sm"
                    variant={statusFilter === "hilang" ? "default" : "outline"}
                    onClick={() => setStatusFilter("hilang")}
                    className="text-xs h-8 text-red-600"
                  >
                    Hilang
                  </Button>
                </div>

                {/* Kolom Cari Barcode */}
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={searchCopyQuery}
                    onChange={(e) => setSearchCopyQuery(e.target.value)}
                    placeholder="Cari barcode (BK-xxxx) atau judul..."
                    className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                  />
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>

              {/* Tabel Eksemplar Fisik */}
              <div
                tabIndex={0}
                role="region"
                aria-label="Tabel Inventaris Eksemplar Fisik"
                className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs focus:ring-2 focus:ring-ring focus:outline-none"
              >
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-muted/70 text-muted-foreground border-b border-border sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Label Barcode</th>
                      <th className="py-3 px-4 font-semibold">Judul Buku &amp; Penulis</th>
                      <th className="py-3 px-4 font-semibold">No. Panggil</th>
                      <th className="py-3 px-4 font-semibold">Status Fisik</th>
                      <th className="py-3 px-4 font-semibold">Alokasi Warga</th>
                      <th className="py-3 px-4 font-semibold text-right">Ubah Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredCopies.map((copy) => (
                      <tr key={copy.barcode} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-primary">
                          {copy.barcode}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-foreground">{copy.buku_judul}</div>
                          <div className="text-[11px] text-muted-foreground">{copy.buku_penulis}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-muted-foreground">
                          {copy.nomor_panggil}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant="outline"
                            className={`text-[10px] uppercase font-semibold ${
                              copy.status === "tersedia"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                : copy.status === "dibooking"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                                : copy.status === "dipinjam"
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                                : copy.status === "perbaikan"
                                ? "bg-purple-500/10 text-purple-600 border-purple-500/30"
                                : "bg-red-500/10 text-red-600 border-red-500/30"
                            }`}
                          >
                            {copy.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4">
                          {copy.dialokasikan_ke ? (
                            <div>
                              <span className="font-semibold text-foreground block">
                                {copy.dialokasikan_ke.nama}
                              </span>
                              <span className="text-[11px] text-muted-foreground font-mono">
                                ({copy.dialokasikan_ke.jenis.toUpperCase()}) • {copy.dialokasikan_ke.tenggat}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Siap di Rak</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {copy.status !== "tersedia" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(copy.barcode, "tersedia")}
                                className="h-7 text-[11px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1 px-2"
                              >
                                <RotateCcw className="h-3 w-3" />
                                <span>Tersedia</span>
                              </Button>
                            )}
                            {copy.status !== "perbaikan" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(copy.barcode, "perbaikan")}
                                className="h-7 text-[11px] text-purple-600 hover:text-purple-700 hover:bg-purple-50 gap-1 px-2"
                              >
                                <Wrench className="h-3 w-3" />
                                <span>Perbaikan</span>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* TAB 2: MASTER JUDUL BUKU */}
            <TabsContent value="katalog" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Daftar judul buku yang terdaftar di sistem sirkulasi BILIK SMK TI Bazma.
                </p>

                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={searchBookQuery}
                    onChange={(e) => setSearchBookQuery(e.target.value)}
                    placeholder="Cari judul, penulis, ISBN..."
                    className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>

              <div
                tabIndex={0}
                role="region"
                aria-label="Tabel Master Judul Buku"
                className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs focus:ring-2 focus:ring-ring focus:outline-none"
              >
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-muted/70 text-muted-foreground border-b border-border sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Judul Buku</th>
                      <th className="py-3 px-4 font-semibold">Kategori</th>
                      <th className="py-3 px-4 font-semibold">ISBN</th>
                      <th className="py-3 px-4 font-semibold">Total Eksemplar</th>
                      <th className="py-3 px-4 font-semibold">Tersedia</th>
                      <th className="py-3 px-4 font-semibold">Diajukan</th>
                      <th className="py-3 px-4 font-semibold">Dipinjam</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-[36px] shrink-0">
                              <BookCover
                                src={book.cover_url}
                                judul={book.judul}
                                kategoriSlug="teknologi"
                                className="rounded"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-foreground">{book.judul}</div>
                              <div className="text-[11px] text-muted-foreground">{book.penulis} ({book.tahun})</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="outline" className="text-[10px]">
                            {book.kategori_nama}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-muted-foreground">{book.isbn}</td>
                        <td className="py-3.5 px-4 font-bold text-foreground">{book.total_eksemplar} Unit</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600">{book.eksemplar_tersedia}</td>
                        <td className="py-3.5 px-4 font-bold text-amber-600">{book.eksemplar_dibooking}</td>
                        <td className="py-3.5 px-4 font-bold text-blue-600">{book.eksemplar_dipinjam}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* DIALOG CETAK / TAMBAH BARCODE EKSEMPLAR BARU */}
      <Dialog open={isAddCopyOpen} onOpenChange={setIsAddCopyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5 text-primary" />
              <span>Cetak Barcode Eksemplar Baru</span>
            </DialogTitle>
            <DialogDescription>
              Terbitkan label barcode unik untuk eksemplar fisik yang baru ditambahkan ke perpustakaan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCopySubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Pilih Judul Buku Master</label>
              <select
                value={selectedBookForCopy}
                onChange={(e) => setSelectedBookForCopy(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.judul} ({b.penulis})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Kode / Label Barcode Fisik (Otomatis)
              </label>
              <input
                type="text"
                required
                value={generatedBarcode}
                onChange={(e) => setGeneratedBarcode(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono font-bold text-primary focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Preview Label Barcode Cetak */}
            <div className="rounded-lg border-2 border-dashed border-border bg-muted/40 p-4 text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Preview Label Fisik Buku
              </span>
              <div className="inline-block bg-white text-slate-900 p-3 rounded border border-gray-300 shadow-sm">
                <div className="text-[10px] font-bold font-sans">SMK TI BAZMA • BILIK</div>
                {/* SVG Barcode Stripes */}
                <div className="flex items-center justify-center gap-0.5 h-8 w-44 mx-auto my-1" aria-hidden="true">
                  <div className="h-full w-1 bg-black" />
                  <div className="h-full w-0.5 bg-black" />
                  <div className="h-full w-1.5 bg-black" />
                  <div className="h-full w-0.5 bg-black" />
                  <div className="h-full w-2 bg-black" />
                  <div className="h-full w-0.5 bg-black" />
                  <div className="h-full w-1 bg-black" />
                  <div className="h-full w-0.5 bg-black" />
                  <div className="h-full w-1.5 bg-black" />
                  <div className="h-full w-2 bg-black" />
                  <div className="h-full w-0.5 bg-black" />
                  <div className="h-full w-1 bg-black" />
                  <div className="h-full w-2 bg-black" />
                  <div className="h-full w-0.5 bg-black" />
                  <div className="h-full w-1.5 bg-black" />
                </div>
                <div className="font-mono text-xs font-bold tracking-widest">*{generatedBarcode}*</div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddCopyOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="font-semibold">
                Simpan &amp; Tambahkan ke Rak
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
      <MobileNav />
    </div>
  );
}
