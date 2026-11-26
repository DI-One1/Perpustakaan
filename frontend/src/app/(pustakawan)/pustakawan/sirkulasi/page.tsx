"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BookCover } from "@/components/media/book-cover";
import { UserAvatar } from "@/components/media/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  MOCK_CIRCULATION_ITEMS,
  MOCK_BOOK_COPIES,
  MOCK_MEMBERS,
  type MockCirculationItem,
  type MockBookCopy,
  type MockMemberPersona,
} from "@/mocks";
import {
  ScanLine,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Plus,
  Minus,
  QrCode,
  Check,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

function MejaSirkulasiContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "peminjaman";
  const [activeTab, setActiveTab] = React.useState(initialTab);

  // Database State (Mock Real-time)
  const [circulationList, setCirculationList] = React.useState<MockCirculationItem[]>(MOCK_CIRCULATION_ITEMS);
  const [bookCopies, setBookCopies] = React.useState<MockBookCopy[]>(MOCK_BOOK_COPIES);
  const [notification, setNotification] = React.useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  // TAB 1: IDENTIFIKASI WARGA (2 METODE) & SCAN EKSEMPLAR
  // 1. Identifikasi Warga
  const [wargaInput, setWargaInput] = React.useState("");
  const [selectedWarga, setSelectedWarga] = React.useState<MockMemberPersona | null>(MOCK_MEMBERS[0]); // Default to Fadhil
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Filter suggestion warga berdasarkan nama atau NISN
  const suggestionList = React.useMemo(() => {
    if (!wargaInput.trim()) return [];
    const query = wargaInput.toLowerCase().trim();
    return MOCK_MEMBERS.filter(
      (m) =>
        m.nama.toLowerCase().includes(query) ||
        m.identitas.includes(query) ||
        m.kelas_atau_unit.toLowerCase().includes(query)
    );
  }, [wargaInput]);

  // 2. Scan Eksemplar Buku Fisik
  const [eksemplarBarcodeInput, setEksemplarBarcodeInput] = React.useState("");
  const [selectedCopy, setSelectedCopy] = React.useState<MockBookCopy | null>(null);
  const [durasiHari, setDurasiHari] = React.useState(7);

  // TAB 2: PENGEMBALIAN BUKU & DENDA
  const [returnEksemplar, setReturnEksemplar] = React.useState("EXM-0071-01");
  const [foundReturn, setFoundReturn] = React.useState<MockCirculationItem | null>(null);
  const [kondisiBuku, setKondisiBuku] = React.useState<"baik" | "rusak_ringan" | "rusak_berat">("baik");

  // TAB 3: FILTER SIRKULASI
  const [tableFilter, setTableFilter] = React.useState<"semua" | "aktif" | "terlambat" | "menunggu_booking">("semua");

  // Handler: Pilih Warga dari Dropdown / Scan Barcode Kartu
  const handleSelectWarga = (warga: MockMemberPersona) => {
    setSelectedWarga(warga);
    setWargaInput(warga.identitas);
    setShowSuggestions(false);
    setSelectedCopy(null);
    setEksemplarBarcodeInput("");
    setNotification(null);
  };

  // Handler: Scan Barcode / Input Manual Warga (Submit)
  const handleWargaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = wargaInput.trim().toLowerCase();
    const found = MOCK_MEMBERS.find(
      (m) => m.identitas.toLowerCase() === query || m.nama.toLowerCase().includes(query)
    );
    if (found) {
      handleSelectWarga(found);
    } else {
      setNotification({
        type: "error",
        message: `Warga dengan identitas "${wargaInput}" tidak ditemukan di database.`,
      });
    }
  };

  // Handler: Scan / Cek Barcode Eksemplar Buku Fisik
  const handleVerifyEksemplarBarcode = (barcodeToVerify?: string) => {
    const barcode = (barcodeToVerify || eksemplarBarcodeInput).trim().toUpperCase();
    if (!barcode) return;

    if (!selectedWarga) {
      setNotification({
        type: "error",
        message: "Silakan identifikasi warga peminjam terlebih dahulu sebelum memindai eksemplar buku.",
      });
      return;
    }

    // 1. Cari eksemplar di database
    const copy = bookCopies.find((c) => c.barcode.toUpperCase() === barcode);

    if (!copy) {
      setNotification({
        type: "error",
        message: `Eksemplar dengan barcode "${barcode}" tidak terdaftar dalam database perpustakaan.`,
      });
      setSelectedCopy(null);
      return;
    }

    // 2. Cek apakah eksemplar berstatus DIBOOKING
    if (copy.status === "dibooking") {
      // Periksa apakah eksemplar ini dibooking oleh warga yang sedang dipilih
      const isBookedByCurrentWarga =
        copy.dialokasikan_ke?.identitas === selectedWarga.identitas ||
        selectedWarga.booking_aktif?.barcode_eksemplar === copy.barcode;

      if (!isBookedByCurrentWarga) {
        // PENOLAKAN MUTLAK SESUAI INSTRUKSI:
        // Input buku ditolak, formulir tetap kosong, data booking tetap aman
        setSelectedCopy(null);
        setEksemplarBarcodeInput("");
        setNotification({
          type: "error",
          message:
            "Eksemplar buku tidak dapat dipinjam. Buku ini sedang dialokasikan untuk pengajuan peminjaman warga lain. Silakan pilih eksemplar buku lain yang tersedia.",
        });
        return;
      }
    }

    // 3. Cek status lain (dipinjam, perbaikan, hilang)
    if (copy.status === "dipinjam") {
      setSelectedCopy(null);
      setEksemplarBarcodeInput("");
      setNotification({
        type: "error",
        message: `Eksemplar ${copy.barcode} saat ini sedang dalam masa peminjaman aktif oleh warga lain.`,
      });
      return;
    }

    if (copy.status === "perbaikan") {
      setSelectedCopy(null);
      setEksemplarBarcodeInput("");
      setNotification({
        type: "error",
        message: `Eksemplar ${copy.barcode} sedang dalam status perbaikan fisik dan tidak dapat dipinjam.`,
      });
      return;
    }

    if (copy.status === "hilang") {
      setSelectedCopy(null);
      setEksemplarBarcodeInput("");
      setNotification({
        type: "error",
        message: `Eksemplar ${copy.barcode} telah dilaporkan hilang dari rak inventaris.`,
      });
      return;
    }

    // 4. Eksemplar lolos validasi (tersedia atau booking milik warga sendiri)
    setSelectedCopy(copy);
    setEksemplarBarcodeInput(copy.barcode);
    setNotification(null);
  };

  // Handler: Konfirmasi Transaksi Peminjaman (Offline / Klaim Booking)
  const handleConfirmPeminjaman = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedWarga) {
      setNotification({ type: "error", message: "Warga belum diidentifikasi." });
      return;
    }

    if (!selectedCopy) {
      setNotification({ type: "error", message: "Silakan scan eksemplar buku terlebih dahulu." });
      return;
    }

    // Cek kelayakan warga
    if (selectedWarga.status_kelayakan !== "memenuhi_syarat") {
      setNotification({
        type: "error",
        message: `Peminjaman ditolak! ${selectedWarga.alasan_kelayakan || "Warga tidak memenuhi syarat sirkulasi."}`,
      });
      return;
    }

    const isClaimBooking = selectedCopy.status === "dibooking";
    const nomorTransaksi = `TRX-202611-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + durasiHari);

    const formatTgl = (d: Date) =>
      `${d.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][d.getMonth()]} 2026`;

    // 1. Tambah transaksi baru ke sirkulasi
    const newTransaction: MockCirculationItem = {
      id: `circ-${Date.now()}`,
      nomor_transaksi: nomorTransaksi,
      nama_peminjam: selectedWarga.nama,
      identitas_peminjam: selectedWarga.identitas,
      peran_peminjam: "warga",
      kelas_atau_unit: selectedWarga.kelas_atau_unit,
      buku_id: selectedCopy.buku_id,
      judul_buku: selectedCopy.buku_judul,
      nomor_induk_eksemplar: selectedCopy.barcode,
      tanggal_pinjam: formatTgl(today),
      tanggal_jatuh_tempo: formatTgl(dueDate),
      status: "aktif",
      denda: 0,
      keterlambatan_hari: 0,
    };

    setCirculationList((prev) => [newTransaction, ...prev]);

    // 2. Update status eksemplar menjadi 'dipinjam'
    setBookCopies((prev) =>
      prev.map((c) =>
        c.barcode === selectedCopy.barcode
          ? {
              ...c,
              status: "dipinjam",
              dialokasikan_ke: {
                pengguna_id: selectedWarga.id,
                nama: selectedWarga.nama,
                identitas: selectedWarga.identitas,
                jenis: "pinjaman",
                tenggat: formatTgl(dueDate),
              },
            }
          : c
      )
    );

    // 3. Jika berasal dari booking warga bersangkutan, bersihkan booking_aktif warga
    if (isClaimBooking && selectedWarga.booking_aktif) {
      setSelectedWarga({
        ...selectedWarga,
        booking_aktif: null,
        pinjaman_aktif_count: selectedWarga.pinjaman_aktif_count + 1,
      });
    }

    setNotification({
      type: "success",
      message: `Peminjaman eksemplar [${selectedCopy.barcode}] berhasil dikonfirmasi! No. Transaksi: ${nomorTransaksi}. Jatuh tempo: ${formatTgl(dueDate)} (${durasiHari} hari).`,
    });

    // Reset formulir buku
    setSelectedCopy(null);
    setEksemplarBarcodeInput("");
  };

  // Handler: Cari Buku untuk Dikembalikan
  const handleSearchReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const barcode = returnEksemplar.trim().toLowerCase();
    const item = circulationList.find(
      (c) => c.nomor_induk_eksemplar.toLowerCase() === barcode
    );
    if (item) {
      setFoundReturn(item);
      setNotification(null);
    } else {
      setFoundReturn(null);
      setNotification({
        type: "error",
        message: `Eksemplar "${returnEksemplar}" tidak ditemukan dalam daftar sirkulasi aktif.`,
      });
    }
  };

  // Handler: Konfirmasi Pengembalian Buku
  const handleConfirmReturnBook = () => {
    if (!foundReturn) return;

    // Hapus dari sirkulasi aktif
    setCirculationList((prev) => prev.filter((c) => c.id !== foundReturn.id));

    // Kembalikan status eksemplar menjadi 'tersedia' (atau 'perbaikan' jika rusak)
    const newStatus =
      kondisiBuku === "baik"
        ? "tersedia"
        : kondisiBuku === "rusak_ringan"
        ? "perbaikan"
        : "hilang";

    setBookCopies((prev) =>
      prev.map((c) =>
        c.barcode === foundReturn.nomor_induk_eksemplar
          ? { ...c, status: newStatus, dialokasikan_ke: null }
          : c
      )
    );

    setNotification({
      type: "success",
      message: `Buku "${foundReturn.judul_buku}" (${foundReturn.nomor_induk_eksemplar}) berhasil dikembalikan. Status eksemplar kini: '${newStatus}'.`,
    });
    setFoundReturn(null);
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
            <Link href="/pustakawan" className="hover:text-foreground transition-colors">
              Meja Pustakawan
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Sirkulasi & Peminjaman Eksemplar</span>
          </nav>

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <ScanLine className="h-7 w-7 text-primary" />
                <span>Meja Sirkulasi Pustakawan</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Layanan sirkulasi terpadu: Identifikasi warga via kartu/pencarian, scan barcode eksemplar fisik, dan integrasi peminjaman online & offline.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs py-1 px-3">
                Sistem Barcode Online
              </Badge>
            </div>
          </div>

          {/* Notifikasi Alert Global */}
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

          {/* Tabs Sirkulasi */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto p-1 bg-muted/80 gap-1 rounded-xl">
              <TabsTrigger value="peminjaman" className="py-2.5 gap-2 text-xs sm:text-sm font-semibold">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>1. Layanan Peminjaman (Offline & Klaim Pengajuan)</span>
              </TabsTrigger>
              <TabsTrigger value="kembali" className="py-2.5 gap-2 text-xs sm:text-sm font-semibold">
                <RotateCcw className="h-4 w-4 text-amber-600" />
                <span>2. Pengembalian & Denda</span>
              </TabsTrigger>
              <TabsTrigger value="eksemplar" className="py-2.5 gap-2 text-xs sm:text-sm font-semibold">
                <Layers className="h-4 w-4 text-blue-600" />
                <span>3. Status Eksemplar & Sirkulasi Aktif ({circulationList.length})</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: INTEGRASI PEMINJAMAN OFFLINE & KLAIM BOOKING ONLINE */}
            <TabsContent value="peminjaman" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* BAGIAN KIRI: LANGKAH 1 - IDENTIFIKASI WARGA */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                    <div className="border-b border-border pb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Langkah 1</span>
                      <h3 className="text-base font-bold text-foreground">Identifikasi Warga</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Scan barcode kartu anggota atau ketik nama/NISN dengan dropdown suggestion.
                      </p>
                    </div>

                    {/* Input Identitas Warga (Scan / Cari Manual) */}
                    <form onSubmit={handleWargaSubmit} className="relative space-y-2">
                      <label htmlFor="scan-warga-input" className="text-xs font-semibold text-foreground flex items-center justify-between">
                        <span>Scan Kartu / Cari Nama Warga</span>
                        <span className="text-[10px] text-muted-foreground font-normal">Tekan Enter atau klik pilihan</span>
                      </label>
                      <div className="relative">
                        <input
                          id="scan-warga-input"
                          type="text"
                          value={wargaInput}
                          onChange={(e) => {
                            setWargaInput(e.target.value);
                            setShowSuggestions(true);
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          placeholder="Scan kartu atau ketik NISN / Nama..."
                          className="w-full rounded-lg border border-border bg-background pl-9 pr-20 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                        />
                        <QrCode className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Button
                          type="submit"
                          size="sm"
                          className="absolute right-1 top-1 h-7 text-[11px] px-2.5 gap-1"
                        >
                          <Search className="h-3 w-3" />
                          <span>Cari</span>
                        </Button>
                      </div>

                      {/* Dropdown Live Suggestions Berdasarkan Relevansi */}
                      {showSuggestions && suggestionList.length > 0 && (
                        <div className="absolute z-30 left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg max-h-56 overflow-y-auto divide-y divide-border">
                          {suggestionList.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleSelectWarga(item)}
                              className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-muted/60 transition-colors focus:outline-none"
                            >
                              <UserAvatar src={item.foto_url} nama={item.nama} size={32} />
                              <div className="flex-1 min-w-0 text-xs">
                                <div className="font-semibold text-foreground truncate">{item.nama}</div>
                                <div className="text-[11px] text-muted-foreground font-mono">
                                  {item.identitas} • {item.kelas_atau_unit}
                                </div>
                              </div>
                              {item.booking_aktif && (
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] shrink-0">
                                  Ada Pengajuan
                                </Badge>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </form>

                    {/* Quick Demo Personas (QC Helper) */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                        Pilihan Cepat Warga (Simulasi):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {MOCK_MEMBERS.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleSelectWarga(m)}
                            className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                              selectedWarga?.id === m.id
                                ? "bg-primary text-primary-foreground border-primary font-semibold"
                                : "bg-muted/40 hover:bg-muted text-foreground border-border"
                            }`}
                          >
                            {m.nama.split(" ")[0]} ({m.booking_aktif ? "Ada Pengajuan" : m.status_kelayakan === "memenuhi_syarat" ? "Siap" : "Ditolak"})
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ringkasan Profil Warga yang Ditemukan */}
                    {selectedWarga && (
                      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 space-y-3.5">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            src={selectedWarga.foto_url}
                            nama={selectedWarga.nama}
                            size={40}
                            className="rounded-lg border border-border"
                          />
                          <div className="flex-1 min-w-0 text-xs">
                            <h4 className="font-bold text-sm text-foreground truncate">{selectedWarga.nama}</h4>
                            <div className="text-muted-foreground font-mono">
                              NISN: <strong>{selectedWarga.identitas}</strong> ({selectedWarga.kelas_atau_unit})
                            </div>
                          </div>
                        </div>

                        {/* Status Kelayakan Peminjaman */}
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-primary/15">
                          <span className="text-muted-foreground">Status Hak Pinjam:</span>
                          {selectedWarga.status_kelayakan === "memenuhi_syarat" ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Memenuhi Syarat
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-semibold text-red-600">
                              <ShieldAlert className="h-3.5 w-3.5" />
                              {selectedWarga.status_kelayakan === "ada_denda"
                                ? "Denda Belum Lunas"
                                : "Batas Kuota Pinjam Terlampaui"}
                            </span>
                          )}
                        </div>

                        {/* Pengajuan Booking Online yang Menunggu Konfirmasi (Bila Ada) */}
                        {selectedWarga.booking_aktif && (
                          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 space-y-2 text-xs">
                            <div className="flex items-center justify-between font-bold text-amber-900">
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-amber-600" />
                                Pengajuan Peminjaman Menunggu Konfirmasi:
                              </span>
                              <span className="font-mono text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">
                                {selectedWarga.booking_aktif.kode_booking}
                              </span>
                            </div>
                            <div className="text-foreground">
                              <p className="font-semibold">{selectedWarga.booking_aktif.buku_judul}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                Alokasi Eksemplar:{" "}
                                <strong className="font-mono text-primary">
                                  {selectedWarga.booking_aktif.barcode_eksemplar}
                                </strong>{" "}
                                • Sisa tenggat: {selectedWarga.booking_aktif.sisa_waktu_teks}
                              </p>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                setEksemplarBarcodeInput(selectedWarga.booking_aktif!.barcode_eksemplar);
                                handleVerifyEksemplarBarcode(selectedWarga.booking_aktif!.barcode_eksemplar);
                              }}
                              className="w-full text-xs font-semibold gap-1.5 h-8 bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              <ArrowRight className="h-3.5 w-3.5" />
                              <span>Muat Eksemplar Pengajuan Ini ke Form</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* BAGIAN KANAN: LANGKAH 2 & 3 - SCAN EKSEMPLAR & KONFIRMASI */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
                    <div className="border-b border-border pb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Langkah 2 & 3</span>
                      <h3 className="text-base font-bold text-foreground">Scan Barcode Eksemplar Fisik & Konfirmasi</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Scan barcode buku fisik yang akan diserahkan. Sistem akan memvalidasi ketersediaan dan mencegah konflik booking.
                      </p>
                    </div>

                    {/* Input Scan Barcode Eksemplar */}
                    <div className="space-y-3">
                      <label htmlFor="scan-eksemplar-input" className="text-xs font-semibold text-foreground flex items-center justify-between">
                        <span>Scan Barcode / Label Eksemplar Fisik</span>
                        <span className="text-[10px] text-muted-foreground">Format: BK-0001, BK-0002, EXM-...</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            id="scan-eksemplar-input"
                            type="text"
                            value={eksemplarBarcodeInput}
                            onChange={(e) => setEksemplarBarcodeInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleVerifyEksemplarBarcode();
                              }
                            }}
                            placeholder="Scan barcode buku (Contoh: BK-0001)..."
                            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-mono uppercase text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleVerifyEksemplarBarcode()}
                          className="text-xs font-semibold gap-1.5 h-10 px-4"
                        >
                          <ScanLine className="h-4 w-4" />
                          <span>Verifikasi</span>
                        </Button>
                      </div>

                      {/* Barcode Quick Test Chips (Sangat Berguna untuk Pengujian QC!) */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Simulasi Scan Barcode Buku Fisik:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEksemplarBarcodeInput("BK-0001");
                              handleVerifyEksemplarBarcode("BK-0001");
                            }}
                            className="text-[11px] px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                          >
                            BK-0001 (Tersedia)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEksemplarBarcodeInput("BK-0002");
                              handleVerifyEksemplarBarcode("BK-0002");
                            }}
                            className="text-[11px] px-2.5 py-1 rounded bg-amber-500/10 text-amber-700 border border-amber-500/20 hover:bg-amber-500/20 transition-colors font-medium"
                          >
                            BK-0002 (Diajukan Warga Lain - Uji Tolak!)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEksemplarBarcodeInput("BK-0004");
                              handleVerifyEksemplarBarcode("BK-0004");
                            }}
                            className="text-[11px] px-2.5 py-1 rounded bg-blue-500/10 text-blue-700 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                          >
                            BK-0004 (Pengajuan Fadhil)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEksemplarBarcodeInput("BK-0006");
                              handleVerifyEksemplarBarcode("BK-0006");
                            }}
                            className="text-[11px] px-2.5 py-1 rounded bg-muted text-foreground border border-border hover:bg-muted/80 transition-colors"
                          >
                            BK-0006 (Tersedia)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEksemplarBarcodeInput("BK-0007");
                              handleVerifyEksemplarBarcode("BK-0007");
                            }}
                            className="text-[11px] px-2.5 py-1 rounded bg-purple-500/10 text-purple-700 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                          >
                            BK-0007 (Perbaikan)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* FORMULIR PEMINJAMAN EKSEMPLAR TERPILIH */}
                    {selectedCopy ? (
                      <form onSubmit={handleConfirmPeminjaman} className="rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5 p-5 space-y-5">
                        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            <span className="font-bold text-sm text-foreground">
                              Eksemplar Lolos Validasi & Siap Dipinjamkan
                            </span>
                          </div>
                          <Badge
                            className={`text-xs ${
                              selectedCopy.status === "dibooking"
                                ? "bg-amber-500/20 text-amber-700 border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-700 border-emerald-500/30"
                            }`}
                          >
                            {selectedCopy.status === "dibooking" ? "Klaim Pengajuan Peminjaman" : "Peminjaman Offline Langsung"}
                          </Badge>
                        </div>

                        {/* Detail Buku Terpilih */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
                          <div className="w-[80px] shrink-0">
                            <BookCover
                              src={selectedCopy.cover_url}
                              judul={selectedCopy.buku_judul}
                              kategoriSlug="sastra"
                              className="rounded shadow-xs"
                            />
                          </div>
                          <div className="space-y-1 text-xs flex-1">
                            <h4 className="font-bold text-base text-foreground">{selectedCopy.buku_judul}</h4>
                            <p className="text-muted-foreground">Penulis: {selectedCopy.buku_penulis}</p>
                            <div className="pt-1 flex flex-wrap gap-4 text-muted-foreground font-mono">
                              <span>No. Panggil: {selectedCopy.nomor_panggil}</span>
                              <span>
                                Label Barcode: <strong className="text-primary">{selectedCopy.barcode}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stepper Durasi Pinjam (3 - 14 Hari) */}
                        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">Durasi Peminjaman (Hari)</span>
                            <span className="text-xs text-muted-foreground">Standar: 7 hari (Rentang: 3–14 hari)</span>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
                              <button
                                type="button"
                                onClick={() => setDurasiHari((d) => Math.max(3, d - 1))}
                                className="px-3 py-1.5 text-muted-foreground hover:bg-muted transition-colors focus:outline-none"
                                aria-label="Kurangi durasi"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="px-4 py-1.5 font-bold text-sm text-foreground font-mono min-w-[70px] text-center">
                                {durasiHari} Hari
                              </span>
                              <button
                                type="button"
                                onClick={() => setDurasiHari((d) => Math.min(14, d + 1))}
                                className="px-3 py-1.5 text-muted-foreground hover:bg-muted transition-colors focus:outline-none"
                                aria-label="Tambah durasi"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="text-xs text-muted-foreground">
                              Jatuh Tempo:{" "}
                              <strong className="text-foreground">
                                {20 + durasiHari} November 2026
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* Tombol Konfirmasi Transaksi */}
                        <div className="pt-2 flex items-center justify-between">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCopy(null);
                              setEksemplarBarcodeInput("");
                            }}
                            className="text-xs text-muted-foreground"
                          >
                            Batalkan Pilihan Buku
                          </Button>
                          <Button type="submit" className="text-xs font-bold gap-1.5 h-10 px-6">
                            <Check className="h-4 w-4" />
                            <span>Konfirmasi Transaksi Peminjaman</span>
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground space-y-1">
                        <BookOpen className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="font-semibold text-foreground">Formulir Buku Masih Kosong</p>
                        <p>Scan barcode atau masukkan ID eksemplar di atas untuk memuat buku ke formulir peminjaman.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: PENGEMBALIAN BUKU & KALKULASI DENDA */}
            <TabsContent value="kembali" className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-bold text-foreground">Pengembalian Eksemplar & Kalkulasi Denda</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Scan barcode eksemplar buku yang dikembalikan siswa. Sistem otomatis menghitung hari keterlambatan (Rp 500/hari).
                  </p>
                </div>

                <form onSubmit={handleSearchReturn} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      id="return-barcode-input"
                      aria-label="Scan atau masukkan barcode eksemplar buku yang dikembalikan"
                      type="text"
                      value={returnEksemplar}
                      onChange={(e) => setReturnEksemplar(e.target.value)}
                      placeholder="Masukkan Barcode Eksemplar (Contoh: EXM-0071-01 atau BK-0003)..."
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-mono uppercase text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <Button type="submit" className="text-xs font-semibold gap-1.5 shrink-0 h-10 px-5">
                    <Search className="h-3.5 w-3.5" />
                    <span>Cari Eksemplar</span>
                  </Button>
                </form>

                {/* Ringkasan Pengembalian Ditemukan */}
                {foundReturn && (
                  <div className="rounded-xl border-2 border-amber-500/30 bg-card p-5 space-y-5">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="font-bold text-sm text-foreground">Rincian Pengembalian Eksemplar</span>
                      <Badge
                        variant={foundReturn.status === "terlambat" ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {foundReturn.status === "terlambat" ? "Keterlambatan Terdeteksi" : "Tepat Waktu"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground block">Peminjam</span>
                        <span className="font-bold text-foreground text-sm mt-0.5 block">{foundReturn.nama_peminjam}</span>
                        <span className="text-muted-foreground font-mono">{foundReturn.identitas_peminjam}</span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block">Buku</span>
                        <span className="font-bold text-foreground text-sm mt-0.5 block">{foundReturn.judul_buku}</span>
                        <span className="text-muted-foreground font-mono">{foundReturn.nomor_induk_eksemplar}</span>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-lg border border-border/70">
                        <span className="text-muted-foreground block">Kalkulasi Denda</span>
                        {foundReturn.keterlambatan_hari > 0 ? (
                          <div className="mt-1">
                            <span className="text-base font-extrabold text-red-600 block">
                              Rp {foundReturn.denda.toLocaleString("id-ID")}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              Terlambat {foundReturn.keterlambatan_hari} hari × Rp 500
                            </span>
                          </div>
                        ) : (
                          <div className="mt-1">
                            <span className="text-base font-extrabold text-emerald-600 block">Rp 0</span>
                            <span className="text-[11px] text-muted-foreground">Tepat waktu</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Radio Kondisi Buku */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <label className="text-xs font-semibold text-foreground block">
                        Verifikasi Fisik Kondisi Buku:
                      </label>
                      <div className="flex flex-wrap gap-4 text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="kondisi"
                            checked={kondisiBuku === "baik"}
                            onChange={() => setKondisiBuku("baik")}
                            className="text-primary"
                          />
                          <span>Baik & Lengkap</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="kondisi"
                            checked={kondisiBuku === "rusak_ringan"}
                            onChange={() => setKondisiBuku("rusak_ringan")}
                            className="text-primary"
                          />
                          <span>Rusak Ringan (Catatan Perbaikan)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="kondisi"
                            checked={kondisiBuku === "rusak_berat"}
                            onChange={() => setKondisiBuku("rusak_berat")}
                            className="text-primary"
                          />
                          <span>Rusak Berat / Hilang (Ganti Eksemplar)</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button onClick={handleConfirmReturnBook} className="text-xs font-bold gap-1.5 h-10 px-6">
                        <RotateCcw className="h-4 w-4" />
                        <span>Konfirmasi Terima Pengembalian & Perbarui Stok</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 3: STATUS EKSEMPLAR & DAFTAR SIRKULASI AKTIF */}
            <TabsContent value="eksemplar" className="space-y-6">
              {/* Monitoring Inventaris Eksemplar Fisik */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
                <div>
                  <h3 className="text-base font-bold text-foreground">Monitoring Inventaris Eksemplar Fisik</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Status fisik per unit barcode eksemplar di rak sirkulasi perpustakaan.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {bookCopies.map((copy) => (
                    <div
                      key={copy.barcode}
                      className="rounded-lg border border-border bg-background p-3.5 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-primary">{copy.barcode}</span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-semibold ${
                            copy.status === "tersedia"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                              : copy.status === "dibooking"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                              : copy.status === "dipinjam"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                              : "bg-red-500/10 text-red-600 border-red-500/30"
                          }`}
                        >
                          {copy.status}
                        </Badge>
                      </div>
                      <div className="font-semibold text-foreground line-clamp-1">{copy.buku_judul}</div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {copy.dialokasikan_ke
                          ? `Dialokasikan: ${copy.dialokasikan_ke.nama} (${copy.dialokasikan_ke.jenis})`
                          : "Siap di Rak Sirkulasi"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabel Transaksi Sirkulasi Berjalan */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-foreground">Transaksi Sirkulasi Berjalan</h3>
                  <div className="flex items-center gap-2 overflow-x-auto">
                    <Button
                      size="sm"
                      variant={tableFilter === "semua" ? "default" : "outline"}
                      onClick={() => setTableFilter("semua")}
                      className="text-xs h-7"
                    >
                      Semua ({circulationList.length})
                    </Button>
                    <Button
                      size="sm"
                      variant={tableFilter === "aktif" ? "default" : "outline"}
                      onClick={() => setTableFilter("aktif")}
                      className="text-xs h-7"
                    >
                      Aktif
                    </Button>
                    <Button
                      size="sm"
                      variant={tableFilter === "terlambat" ? "default" : "outline"}
                      onClick={() => setTableFilter("terlambat")}
                      className="text-xs h-7 text-red-600 hover:text-red-700"
                    >
                      Terlambat
                    </Button>
                  </div>
                </div>

                <div
                  tabIndex={0}
                  role="region"
                  aria-label="Tabel Sirkulasi Perpustakaan"
                  className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs focus:ring-2 focus:ring-ring focus:outline-none"
                >
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-muted/70 text-muted-foreground border-b border-border sticky top-0 z-10">
                      <tr>
                        <th className="py-3 px-4 font-semibold">No. Transaksi</th>
                        <th className="py-3 px-4 font-semibold">Peminjam</th>
                        <th className="py-3 px-4 font-semibold">Judul Buku & Barcode</th>
                        <th className="py-3 px-4 font-semibold">Pinjam</th>
                        <th className="py-3 px-4 font-semibold">Jatuh Tempo</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {circulationList
                        .filter((item) => (tableFilter === "semua" ? true : item.status === tableFilter))
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                            <td className="py-3 px-4 font-mono font-medium text-foreground">
                              {item.nomor_transaksi}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-foreground">{item.nama_peminjam}</div>
                              <div className="text-muted-foreground text-[11px]">
                                {item.identitas_peminjam} • {item.kelas_atau_unit}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-foreground">{item.judul_buku}</div>
                              <div className="text-muted-foreground font-mono text-[11px] mt-0.5">
                                {item.nomor_induk_eksemplar}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{item.tanggal_pinjam}</td>
                            <td className="py-3 px-4 font-medium text-foreground">{item.tanggal_jatuh_tempo}</td>
                            <td className="py-3 px-4">
                              {item.status === "aktif" && (
                                <Badge variant="outline" className="text-[11px] text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                                  Aktif
                                </Badge>
                              )}
                              {item.status === "terlambat" && (
                                <Badge variant="destructive" className="text-[11px]">
                                  Terlambat ({item.keterlambatan_hari}h)
                                </Badge>
                              )}
                              {item.status === "menunggu_booking" && (
                                <Badge className="text-[11px] bg-blue-500/10 text-blue-600 border-blue-500/20">
                                  Pengajuan
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function MejaSirkulasiPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <MejaSirkulasiContent />
    </React.Suspense>
  );
}
