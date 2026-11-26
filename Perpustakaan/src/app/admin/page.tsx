"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Clock,
  CalendarPlus,
  Coins,
  BookOpen,
  ClipboardCheck,
  Users,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Barcode,
  Search,
  Plus,
  RefreshCw,
  Trash2,
  UserCheck,
  KeyRound,
} from "lucide-react";

type TabAdmin =
  | "ringkasan"
  | "sirkulasi"
  | "pengajuan"
  | "perpanjangan"
  | "denda"
  | "koleksi"
  | "opname"
  | "pengguna"
  | "audit";

interface AdminData {
  pengguna: {
    id: string;
    nomor_induk: string;
    nama_lengkap: string;
    peran: string[];
    is_admin_master: boolean;
  };
  kpi: {
    total_katalog: number;
    total_eksemplar: number;
    pinjaman_aktif: number;
    total_anggota: number;
  };
  pengajuan_aktif: any[];
  pinjaman_aktif_list: any[];
  perpanjangan_menunggu: any[];
  denda_belum_lunas: any[];
  buku_list: any[];
  pengguna_list: any[];
  audit_logs: any[];
  sesi_opname_aktif: any | null;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifSukses, setNotifSukses] = useState<string | null>(null);
  const [tabAktif, setTabAktif] = useState<TabAdmin>("ringkasan");

  // State Meja Sirkulasi
  const [pinjamNomorInduk, setPinjamNomorInduk] = useState("");
  const [pinjamBarcode, setPinjamBarcode] = useState("");
  const [pinjamDurasi, setPinjamDurasi] = useState(7);

  const [kembaliBarcode, setKembaliBarcode] = useState("");
  const [kembaliKondisi, setKembaliKondisi] = useState("baik");
  const [kembaliCatatan, setKembaliCatatan] = useState("");

  // State Stock Opname
  const [namaSesiOpname, setNamaSesiOpname] = useState("");
  const [scanBarcodeOpname, setScanBarcodeOpname] = useState("");
  const [scanKondisiOpname, setScanKondisiOpname] = useState("baik");
  const [commitOpnamePesan, setCommitOpnamePesan] = useState("");

  // State Tambah Buku
  const [bukuBaru, setBukuBaru] = useState({
    judul: "",
    penulis: "",
    penerbit: "",
    tahun_terbit: new Date().getFullYear(),
    isbn: "",
    deskripsi: "",
    jumlah_eksemplar: 2,
    kategori_id: "",
  });

  // State Tambah Pengguna
  const [penggunaBaru, setPenggunaBaru] = useState({
    nomor_induk: "",
    nama_lengkap: "",
    email: "",
    kelas_atau_jabatan: "",
    kata_sandi: "Bilik2026!",
  });

  const muatDataAdmin = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/v1/admin/dashboard");
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          window.location.href = "/masuk";
          return;
        }
        const json = await res.json();
        throw new Error(json.detail || "Gagal memuat dashboard admin");
      }
      const json = await res.json();
      const normalizedData: AdminData = {
        pengguna:
          json.pengguna && !Array.isArray(json.pengguna)
            ? json.pengguna
            : {
                id: "",
                nomor_induk: "",
                nama_lengkap: "Petugas Perpustakaan",
                peran: ["admin"],
                is_admin_master: false,
              },
        kpi: {
          total_katalog: json.kpi?.total_katalog ?? json.kpi?.total_buku ?? 0,
          total_eksemplar: json.kpi?.total_eksemplar ?? 0,
          pinjaman_aktif:
            json.kpi?.pinjaman_aktif ?? json.kpi?.pinjaman_berjalan ?? 0,
          total_anggota: json.kpi?.total_anggota ?? 0,
        },
        pengajuan_aktif: json.pengajuan_aktif ?? json.reservasi_aktif ?? [],
        pinjaman_aktif_list:
          json.pinjaman_aktif_list ?? json.pinjaman_aktif ?? [],
        perpanjangan_menunggu:
          json.perpanjangan_menunggu ?? json.ajuan_perpanjangan ?? [],
        denda_belum_lunas:
          json.denda_belum_lunas ??
          (json.denda
            ? json.denda.filter((d: any) => d.status === "belum_lunas")
            : []),
        buku_list: json.buku_list ?? [],
        pengguna_list:
          json.pengguna_list ??
          (Array.isArray(json.pengguna) ? json.pengguna : []),
        audit_logs: json.audit_logs ?? json.audit_log ?? [],
        sesi_opname_aktif:
          json.sesi_opname_aktif ??
          (json.opname_sesi
            ? json.opname_sesi.find((s: any) => s.status === "berjalan")
            : null),
      };
      setData(normalizedData);
      if (
        normalizedData.buku_list &&
        normalizedData.buku_list.length > 0 &&
        !bukuBaru.kategori_id
      ) {
        setBukuBaru((prev) => ({
          ...prev,
          kategori_id: normalizedData.buku_list[0].kategori_id,
        }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    muatDataAdmin();
  }, []);

  const tampilkanNotif = (pesan: string) => {
    setNotifSukses(pesan);
    setTimeout(() => setNotifSukses(null), 5000);
  };

  // 1. Konfirmasi Pinjam
  const handleKonfirmasiPinjam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinjamNomorInduk.trim() || !pinjamBarcode.trim()) {
      alert("Nomor Induk dan Kode Barcode wajib diisi.");
      return;
    }
    try {
      const res = await fetch("/api/v1/admin/sirkulasi/konfirmasi-pinjam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomor_induk: pinjamNomorInduk.trim(),
          kode_barcode: pinjamBarcode.trim(),
          durasi_hari: pinjamDurasi,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Gagal konfirmasi peminjaman");
      tampilkanNotif(
        `Berhasil! Peminjaman untuk barcode ${pinjamBarcode} telah aktif.`
      );
      setPinjamBarcode("");
      muatDataAdmin();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 2. Pengembalian Buku
  const handlePengembalian = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kembaliBarcode.trim()) {
      alert("Kode Barcode wajib diisi.");
      return;
    }
    try {
      const res = await fetch("/api/v1/admin/sirkulasi/pengembalian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kode_barcode: kembaliBarcode.trim(),
          kondisi_kembali: kembaliKondisi,
          catatan: kembaliCatatan.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Gagal memproses pengembalian");
      let msg = `Pengembalian berhasil. Status buku: ${kembaliKondisi}.`;
      if (json.denda) {
        msg += ` Warga terkena denda keterlambatan Rp ${json.denda.nominal.toLocaleString(
          "id-ID"
        )}.`;
      }
      if (json.promosi_fifo) {
        msg += ` Antrean FIFO teratas (${json.promosi_fifo.nomor_induk}) berhasil dialokasikan!`;
      }
      tampilkanNotif(msg);
      setKembaliBarcode("");
      setKembaliCatatan("");
      muatDataAdmin();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 3. Batalkan / Tolak Reservasi
  const handleBatalReservasi = async (id: string) => {
    const alasan = prompt(
      "Masukkan pesan commit/alasan pembatalan (wajib dicatat audit):",
      "Dibatalkan oleh Admin: Pemohon tidak mengambil buku melewati batas waktu"
    );
    if (!alasan) return;
    try {
      const res = await fetch(`/api/v1/admin/reservasi/${id}/batal-atau-tolak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pesan_commit: alasan }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Gagal membatalkan pengajuan");
      tampilkanNotif("Pengajuan berhasil dibatalkan. Eksemplar dikembalikan.");
      muatDataAdmin();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 4. Proses Ajuan Perpanjangan
  const handleProsesPerpanjangan = async (
    id: string,
    status: "disetujui" | "ditolak",
    hari?: number
  ) => {
    const catatan = prompt(
      `Catatan admin untuk perpanjangan (${status}):`,
      status === "disetujui"
        ? "Disetujui perpanjangan masa pinjam"
        : "Ditolak: buku sedang memiliki antrean warga lain"
    );
    if (catatan === null) return;
    try {
      const res = await fetch(`/api/v1/admin/perpanjangan/${id}/proses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          hari_tambahan: hari || 7,
          catatan_admin: catatan,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Gagal memproses perpanjangan");
      tampilkanNotif(`Ajuan perpanjangan berhasil diproses (${status}).`);
      muatDataAdmin();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 5. Pelunasan / Pembebasan Denda
  const handleAksiDenda = async (id: string, aksi: "lunas" | "dibebaskan") => {
    const pesan = prompt(
      `Pesan audit untuk ${aksi === "lunas" ? "Pelunasan" : "Pembebasan"} Denda:`,
      aksi === "lunas"
        ? "Pembayaran tunai diterima di meja sirkulasi"
        : "Pembebasan denda disetujui kepala perpustakaan"
    );
    if (!pesan) return;
    try {
      const res = await fetch(`/api/v1/admin/denda/${id}/lunas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aksi, pesan_commit: pesan }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Gagal memproses denda");
      tampilkanNotif(`Denda berhasil diperbarui (${aksi}).`);
      muatDataAdmin();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 6. Tambah Buku Baru
  const handleTambahBuku = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bukuBaru.judul.trim() || !bukuBaru.penulis.trim()) {
      alert("Judul dan Penulis buku wajib diisi.");
      return;
    }
    try {
      const res = await fetch("/api/v1/admin/buku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bukuBaru),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Gagal menambah buku");
      tampilkanNotif(
        `Buku "${json.buku.judul}" dan ${json.eksemplar.length} eksemplar berhasil dibuat.`
      );
      setBukuBaru({
        judul: "",
        penulis: "",
        penerbit: "",
        tahun_terbit: new Date().getFullYear(),
        isbn: "",
        deskripsi: "",
        jumlah_eksemplar: 2,
        kategori_id: data?.buku_list[0]?.kategori_id || "",
      });
      muatDataAdmin();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 7. Stock Opname
  const handleBuatSesiOpname = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSesiOpname.trim()) return;
    try {
      const res = await fetch("/api/v1/admin/opname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aksi: "buat_sesi",
          nama_sesi: namaSesiOpname.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Gagal membuat sesi opname");
      tampilkanNotif(`Sesi opname "${json.sesi.nama_sesi}" berhasil dibuka.`);
      setNamaSesiOpname("");
      muatDataAdmin();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleScanOpname = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.sesi_opname_aktif || !scanBarcodeOpname.trim()) return;
    try {
      const res = await fetch("/api/v1/admin/opname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aksi: "scan",
          sesi_id: data.sesi_opname_aktif.id,
          kode_barcode: scanBarcodeOpname.trim(),
          kondisi: scanKondisiOpname,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Gagal memindai eksemplar");
      tampilkanNotif(
        `Barcode ${scanBarcodeOpname} berhasil dicatat (${scanKondisiOpname}).`
      );
      setScanBarcodeOpname("");
      muatDataAdmin();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCommitOpname = async () => {
    if (!data?.sesi_opname_aktif) return;
    const pesan =
      commitOpnamePesan.trim() ||
      prompt(
        "Pesan commit untuk penutupan sesi stock opname:",
        "Commit Stock Opname Fisik Semester"
      );
    if (!pesan) return;
    try {
      const res = await fetch("/api/v1/admin/opname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aksi: "commit",
          sesi_id: data.sesi_opname_aktif.id,
          pesan_commit: pesan,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Gagal menutup sesi opname");
      tampilkanNotif("Sesi opname resmi diselesaikan dan dicatat pada audit log.");
      setCommitOpnamePesan("");
      muatDataAdmin();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 8. Kelola Pengguna
  const handleTambahPengguna = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!penggunaBaru.nomor_induk.trim() || !penggunaBaru.nama_lengkap.trim()) {
      alert("Nomor Induk dan Nama Lengkap wajib diisi.");
      return;
    }
    try {
      const res = await fetch("/api/v1/admin/pengguna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(penggunaBaru),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Gagal menambah anggota");
      tampilkanNotif(
        `Anggota ${json.pengguna.nama_lengkap} (${json.pengguna.nomor_induk}) berhasil ditambahkan.`
      );
      setPenggunaBaru({
        nomor_induk: "",
        nama_lengkap: "",
        email: "",
        kelas_atau_jabatan: "",
        kata_sandi: "Bilik2026!",
      });
      muatDataAdmin();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAksiPengguna = async (
    pengguna_id: string,
    aksi: "toggle_admin" | "buka_blokir"
  ) => {
    const konfirmasi = confirm(
      aksi === "toggle_admin"
        ? "Ubah status hak akses admin pengguna ini?"
        : "Buka blokir peminjaman untuk anggota ini?"
    );
    if (!konfirmasi) return;
    try {
      const res = await fetch("/api/v1/admin/pengguna", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pengguna_id, aksi }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Gagal mengubah pengguna");
      tampilkanNotif(
        aksi === "toggle_admin"
          ? "Hak akses pengguna berhasil diperbarui."
          : "Blokir anggota berhasil dibuka."
      );
      muatDataAdmin();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleHapusPengguna = async (pengguna_id: string, nama: string) => {
    const konfirmasi = confirm(
      `Apakah Anda yakin ingin menghapus akun ${nama}? (Sistem akan menerapkan hybrid delete)`
    );
    if (!konfirmasi) return;
    try {
      const res = await fetch("/api/v1/admin/pengguna", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pengguna_id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Gagal menghapus pengguna");
      tampilkanNotif(`Pengguna ${nama} berhasil dihapus.`);
      muatDataAdmin();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm font-medium text-muted-foreground">
              Memuat data backoffice admin BILIK...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-4xl mx-auto p-6 flex flex-col items-center justify-center text-center">
          <ShieldAlert className="h-12 w-12 text-destructive mb-3" />
          <h1 className="text-xl font-bold text-foreground mb-2">
            Akses Ditolak atau Terjadi Kesalahan
          </h1>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <a
            href="/masuk"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 min-h-[44px]"
          >
            Masuk Kembali
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner Notifikasi Sukses */}
        {notifSukses && (
          <div className="mb-6 p-4 rounded-xl bg-primary-soft border border-primary/20 flex items-center gap-3 text-sm text-primary font-medium animate-fadeIn">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
            <span>{notifSukses}</span>
          </div>
        )}

        {/* Header Admin */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Dashboard Backoffice Perpustakaan
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Petugas: {data.pengguna.nama_lengkap} ({data.pengguna.nomor_induk})
              {data.pengguna.is_admin_master && " - Admin Master"}
            </p>
          </div>
          <button
            type="button"
            onClick={muatDataAdmin}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-border shadow-xs text-foreground hover:bg-muted min-h-[44px]"
          >
            <RefreshCw className="h-4 w-4" />
            Sinkronkan Data
          </button>
        </div>

        {/* Tab Navigasi Admin */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2 border-b border-border">
          {[
            { id: "ringkasan", label: "Ringkasan", icon: LayoutDashboard },
            { id: "sirkulasi", label: "Meja Sirkulasi", icon: ArrowLeftRight },
            {
              id: "pengajuan",
              label: `Pengajuan & Antrean (${data.pengajuan_aktif?.length ?? 0})`,
              icon: Clock,
            },
            {
              id: "perpanjangan",
              label: `Perpanjangan (${data.perpanjangan_menunggu?.length ?? 0})`,
              icon: CalendarPlus,
            },
            {
              id: "denda",
              label: `Denda (${data.denda_belum_lunas?.length ?? 0})`,
              icon: Coins,
            },
            { id: "koleksi", label: "Katalog & Eksemplar", icon: BookOpen },
            {
              id: "opname",
              label: `Stock Opname ${
                data.sesi_opname_aktif ? "(Sesi Aktif)" : ""
              }`,
              icon: ClipboardCheck,
            },
            { id: "pengguna", label: "Keanggotaan", icon: Users },
            { id: "audit", label: "Log Audit", icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const aktif = tabAktif === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTabAktif(tab.id as TabAdmin)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors min-h-[44px] ${
                  aktif
                    ? "bg-primary text-white shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 1. TAB RINGKASAN */}
        {tabAktif === "ringkasan" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Katalog Buku
                </span>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {data.kpi.total_katalog}
                </p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  Judul buku terdaftar
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Eksemplar Fisik
                </span>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {data.kpi.total_eksemplar}
                </p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  Buku fisik ber-barcode
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Pinjaman Aktif
                </span>
                <p className="text-3xl font-bold text-primary mt-2">
                  {data.kpi.pinjaman_aktif}
                </p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  Buku di tangan warga
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Jumlah Anggota
                </span>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {data.kpi.total_anggota}
                </p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  Siswa, Guru, dan Staf
                </span>
              </div>
            </div>

            {/* Quick Actions & Pengajuan Siap Diambil */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
                <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Pengajuan Siap Diambil di Meja Sirkulasi
                </h2>
                {(data.pengajuan_aktif ?? []).filter((p) => p.status === "siap_diambil")
                  .length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    Tidak ada pengajuan buku yang sedang menunggu pengambilan.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {(data.pengajuan_aktif ?? [])
                      .filter((p) => p.status === "siap_diambil")
                      .map((p) => (
                        <div
                          key={p.id}
                          className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between gap-3"
                        >
                          <div>
                            <span className="text-xs font-bold text-foreground block">
                              {p.pengguna.nama_lengkap} ({p.pengguna.nomor_induk})
                            </span>
                            <span className="text-xs text-muted-foreground block">
                              {p.buku.judul}
                            </span>
                            <span className="text-[11px] font-mono text-primary font-semibold mt-1 inline-block">
                              Barcode Fisik: {p.eksemplar?.kode_barcode || "-"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setPinjamNomorInduk(p.pengguna.nomor_induk);
                              setPinjamBarcode(p.eksemplar?.kode_barcode || "");
                              setTabAktif("sirkulasi");
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary/90 shrink-0 min-h-[44px]"
                          >
                            Proses di Meja
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
                <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <Coins className="h-4 w-4 text-destructive" />
                  Denda Menunggu Pembayaran
                </h2>
                {(data.denda_belum_lunas ?? []).length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    Semua denda telah lunas atau belum ada keterlambatan.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {(data.denda_belum_lunas ?? []).slice(0, 4).map((d) => (
                      <div
                        key={d.id}
                        className="p-3 rounded-xl border border-border bg-destructive/5 flex items-center justify-between gap-3"
                      >
                        <div>
                          <span className="text-xs font-bold text-foreground block">
                            {d.pengguna.nama_lengkap} ({d.pengguna.nomor_induk})
                          </span>
                          <span className="text-xs text-muted-foreground block">
                            Rp {d.nominal.toLocaleString("id-ID")} - {d.alasan}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAksiDenda(d.id, "lunas")}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary/90 shrink-0 min-h-[44px]"
                        >
                          Bayar Lunas
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. TAB SIRKULASI */}
        {tabAktif === "sirkulasi" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Konfirmasi Pinjam */}
            <div className="p-6 rounded-2xl bg-white border border-border shadow-xs">
              <h2 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                <Barcode className="h-5 w-5 text-primary" />
                Konfirmasi Peminjaman Buku
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Warga datang ke meja sirkulasi. Scan kartu anggota dan barcode fisik buku.
              </p>

              <form onSubmit={handleKonfirmasiPinjam} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Nomor Induk Anggota (NIS / NIP)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0061234567"
                    value={pinjamNomorInduk}
                    onChange={(e) => setPinjamNomorInduk(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Kode Barcode Eksemplar Fisik
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BK-0001"
                    value={pinjamBarcode}
                    onChange={(e) => setPinjamBarcode(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Durasi Peminjaman (Hari)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPinjamDurasi(Math.max(1, pinjamDurasi - 1))}
                      className="px-3 py-2 rounded-lg border border-border text-sm font-bold min-h-[44px]"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={pinjamDurasi}
                      onChange={(e) => setPinjamDurasi(parseInt(e.target.value) || 7)}
                      className="w-20 text-center px-3 py-2 text-sm rounded-lg border border-border min-h-[44px]"
                    />
                    <button
                      type="button"
                      onClick={() => setPinjamDurasi(Math.min(30, pinjamDurasi + 1))}
                      className="px-3 py-2 rounded-lg border border-border text-sm font-bold min-h-[44px]"
                    >
                      +
                    </button>
                    <span className="text-xs text-muted-foreground">
                      Jatuh tempo: {pinjamDurasi} hari ke depan
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-colors min-h-[44px]"
                >
                  Konfirmasi & Serahkan Buku
                </button>
              </form>
            </div>

            {/* Form Pengembalian Buku */}
            <div className="p-6 rounded-2xl bg-white border border-border shadow-xs">
              <h2 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                Pengembalian Buku Fisik
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Scan barcode buku saat warga mengembalikan. Denda dihitung otomatis jika terlambat.
              </p>

              <form onSubmit={handlePengembalian} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Kode Barcode Eksemplar Fisik
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BK-0006 atau BK-0007"
                    value={kembaliBarcode}
                    onChange={(e) => setKembaliBarcode(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Kondisi Buku Saat Dikembalikan
                  </label>
                  <select
                    value={kembaliKondisi}
                    onChange={(e) => setKembaliKondisi(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary min-h-[44px]"
                  >
                    <option value="baik">Baik (Layak kembali ke rak)</option>
                    <option value="rusak">Rusak (Halaman robek / basah)</option>
                    <option value="hilang">Hilang (Wajib ganti rugi)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Catatan Kondisi (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Catatan fisik jika ada kerusakan"
                    value={kembaliCatatan}
                    onChange={(e) => setKembaliCatatan(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary min-h-[44px]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-foreground text-background hover:bg-foreground/90 transition-colors min-h-[44px]"
                >
                  Proses Pengembalian Buku
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 3. TAB PENGAJUAN & ANTREAN */}
        {tabAktif === "pengajuan" && (
          <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Daftar Pengajuan Online & Antrean FIFO
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Daftar warga yang mengajukan pinjaman online atau sedang antre pada buku kosong.
                </p>
              </div>
            </div>

            {(data.pengajuan_aktif ?? []).length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Tidak ada pengajuan aktif saat ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                    <tr>
                      <th className="p-3">Kode Reservasi</th>
                      <th className="p-3">Warga</th>
                      <th className="p-3">Buku & Barcode</th>
                      <th className="p-3">Jenis & Status</th>
                      <th className="p-3">Waktu Tenggat</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(data.pengajuan_aktif ?? []).map((r) => (
                      <tr key={r.id} className="hover:bg-muted/20">
                        <td className="p-3 font-mono font-bold text-foreground">
                          {r.kode_reservasi}
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-foreground block">
                            {r.pengguna.nama_lengkap}
                          </span>
                          <span className="text-muted-foreground text-[11px]">
                            {r.pengguna.nomor_induk}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-foreground block">
                            {r.buku.judul}
                          </span>
                          <span className="text-primary font-mono text-[11px]">
                            {r.eksemplar?.kode_barcode || "Menunggu Stok (FIFO)"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              r.status === "siap_diambil"
                                ? "bg-primary-soft text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {r.status === "siap_diambil"
                              ? "Siap Diambil"
                              : "Antrean FIFO"}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {r.waktu_tenggat
                            ? new Date(r.waktu_tenggat).toLocaleString("id-ID")
                            : "-"}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleBatalReservasi(r.id)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 min-h-[44px]"
                          >
                            Batalkan / Tolak
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 4. TAB PERPANJANGAN */}
        {tabAktif === "perpanjangan" && (
          <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="text-base font-bold text-foreground">
                Ajuan Perpanjangan Pinjaman
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verifikasi permohonan tambahan masa pinjam dari warga.
              </p>
            </div>

            {(data.perpanjangan_menunggu ?? []).length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Tidak ada ajuan perpanjangan yang menunggu konfirmasi.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {(data.perpanjangan_menunggu ?? []).map((p) => (
                  <div
                    key={p.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-sm font-bold text-foreground block">
                        {p.pinjaman.pengguna.nama_lengkap} (
                        {p.pinjaman.pengguna.nomor_induk})
                      </span>
                      <span className="text-xs text-muted-foreground block mt-0.5">
                        Buku: {p.pinjaman.eksemplar.buku.judul} (Barcode:{" "}
                        {p.pinjaman.eksemplar.kode_barcode})
                      </span>
                      <span className="text-xs text-primary font-medium block mt-1">
                        Alasan: "{p.alasan}"
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleProsesPerpanjangan(p.id, "disetujui", 7)}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary/90 min-h-[44px]"
                      >
                        Setujui (+7 Hari)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleProsesPerpanjangan(p.id, "ditolak")}
                        className="px-3 py-2 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 min-h-[44px]"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. TAB DENDA */}
        {tabAktif === "denda" && (
          <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="text-base font-bold text-foreground">
                Manajemen Denda Keterlambatan & Kerusakan
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daftar denda warga yang belum lunas. Pembayaran tunai dicatat ke audit log.
              </p>
            </div>

            {(data.denda_belum_lunas ?? []).length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Tidak ada denda yang belum dibayar saat ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                    <tr>
                      <th className="p-3">Anggota</th>
                      <th className="p-3">Buku Terkait</th>
                      <th className="p-3">Nominal</th>
                      <th className="p-3">Alasan</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(data.denda_belum_lunas ?? []).map((d) => (
                      <tr key={d.id} className="hover:bg-muted/20">
                        <td className="p-3">
                          <span className="font-semibold text-foreground block">
                            {d.pengguna.nama_lengkap}
                          </span>
                          <span className="text-muted-foreground text-[11px]">
                            {d.pengguna.nomor_induk}
                          </span>
                        </td>
                        <td className="p-3 text-foreground">
                          {d.pinjaman?.eksemplar?.buku?.judul || "-"}
                        </td>
                        <td className="p-3 font-bold text-destructive">
                          Rp {d.nominal.toLocaleString("id-ID")}
                        </td>
                        <td className="p-3 text-muted-foreground">{d.alasan}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleAksiDenda(d.id, "lunas")}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary/90 min-h-[44px]"
                          >
                            Bayar Lunas
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAksiDenda(d.id, "dibebaskan")}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted min-h-[44px]"
                          >
                            Bebaskan
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 6. TAB KOLEKSI & EKSEMPLAR */}
        {tabAktif === "koleksi" && (
          <div className="space-y-6">
            {/* Form Tambah Buku */}
            <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
              <h2 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Tambah Buku Baru & Auto-Generate Barcode
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Sistem akan otomatis membuat eksemplar fisik ber-barcode (BK-xxxx) sesuai jumlah yang diinputkan.
              </p>

              <form onSubmit={handleTambahBuku} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Judul Buku
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Belajar Next.js 15"
                    value={bukuBaru.judul}
                    onChange={(e) =>
                      setBukuBaru({ ...bukuBaru, judul: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Penulis
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Tim Pengembang"
                    value={bukuBaru.penulis}
                    onChange={(e) =>
                      setBukuBaru({ ...bukuBaru, penulis: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Jumlah Eksemplar Fisik
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={bukuBaru.jumlah_eksemplar}
                    onChange={(e) =>
                      setBukuBaru({
                        ...bukuBaru,
                        jumlah_eksemplar: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 978-602-999-001"
                    value={bukuBaru.isbn}
                    onChange={(e) =>
                      setBukuBaru({ ...bukuBaru, isbn: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Penerbit & Tahun
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Penerbit"
                      value={bukuBaru.penerbit}
                      onChange={(e) =>
                        setBukuBaru({ ...bukuBaru, penerbit: e.target.value })
                      }
                      className="w-2/3 px-3 py-2 text-sm rounded-lg border border-border min-h-[44px]"
                    />
                    <input
                      type="number"
                      placeholder="Tahun"
                      value={bukuBaru.tahun_terbit}
                      onChange={(e) =>
                        setBukuBaru({
                          ...bukuBaru,
                          tahun_terbit: parseInt(e.target.value) || 2026,
                        })
                      }
                      className="w-1/3 px-3 py-2 text-sm rounded-lg border border-border min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors min-h-[44px]"
                  >
                    Simpan Buku & Buat Barcode
                  </button>
                </div>
              </form>
            </div>

            {/* Tabel Koleksi Buku & Barcode */}
            <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="text-base font-bold text-foreground">
                  Daftar Katalog & Barcode Fisik
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                    <tr>
                      <th className="p-3">Judul Buku</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Penulis</th>
                      <th className="p-3">Total Eksemplar</th>
                      <th className="p-3">Daftar Barcode Fisik</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(data.buku_list ?? []).map((b) => (
                      <tr key={b.id} className="hover:bg-muted/20">
                        <td className="p-3 font-semibold text-foreground">
                          {b.judul}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {b.kategori?.nama || "-"}
                        </td>
                        <td className="p-3 text-muted-foreground">{b.penulis}</td>
                        <td className="p-3 font-bold text-foreground">
                          {b.eksemplar?.length || 0} buku
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1.5">
                            {b.eksemplar?.map((e: any) => (
                              <span
                                key={e.id}
                                className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold border ${
                                  e.status === "tersedia"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : e.status === "direservasi"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : e.status === "dipinjam"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }`}
                              >
                                {e.kode_barcode} ({e.status})
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. TAB STOCK OPNAME */}
        {tabAktif === "opname" && (
          <div className="space-y-6">
            {!data.sesi_opname_aktif ? (
              <div className="p-6 rounded-2xl bg-white border border-border shadow-xs text-center max-w-lg mx-auto">
                <ClipboardCheck className="h-12 w-12 text-primary mx-auto mb-3" />
                <h2 className="text-lg font-bold text-foreground mb-1">
                  Mulai Sesi Stock Opname Fisik
                </h2>
                <p className="text-xs text-muted-foreground mb-6">
                  Buka sesi opname untuk memverifikasi kondisi fisik buku dan scan barcode di rak secara cepat.
                </p>

                <form onSubmit={handleBuatSesiOpname} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Nama Sesi (Contoh: Opname Akhir Semester Gasal 2026)"
                    value={namaSesiOpname}
                    onChange={(e) => setNamaSesiOpname(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border min-h-[44px]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 min-h-[44px]"
                  >
                    Buka Sesi Opname Sekarang
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header Sesi Aktif */}
                <div className="p-5 rounded-2xl bg-white border border-primary/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary-soft text-primary">
                      Sesi Opname Berjalan
                    </span>
                    <h2 className="text-lg font-bold text-foreground mt-1">
                      {data.sesi_opname_aktif.nama_sesi}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Dimulai:{" "}
                      {new Date(
                        data.sesi_opname_aktif.tanggal_mulai
                      ).toLocaleString("id-ID")}{" "}
                      - Total Scan:{" "}
                      {data.sesi_opname_aktif.detail?.length || 0} buku
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCommitOpname}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-foreground text-background hover:bg-foreground/90 shrink-0 min-h-[44px]"
                  >
                    Commit & Selesaikan Opname
                  </button>
                </div>

                {/* Fast-Scan Input */}
                <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
                  <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                    <Barcode className="h-4 w-4 text-primary" />
                    Fast-Scan Barcode Eksemplar
                  </h3>

                  <form onSubmit={handleScanOpname} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Scan Barcode (BK-xxxx)..."
                      value={scanBarcodeOpname}
                      onChange={(e) => setScanBarcodeOpname(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-border min-h-[44px]"
                    />
                    <select
                      value={scanKondisiOpname}
                      onChange={(e) => setScanKondisiOpname(e.target.value)}
                      className="px-3 py-2 text-sm rounded-lg border border-border min-h-[44px]"
                    >
                      <option value="baik">Kondisi Baik</option>
                      <option value="rusak">Kondisi Rusak</option>
                      <option value="hilang">Dinyatakan Hilang</option>
                    </select>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 min-h-[44px]"
                    >
                      Catat Scan
                    </button>
                  </form>
                </div>

                {/* Daftar Buku yang Sudah Discan */}
                <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h4 className="text-xs font-bold text-foreground">
                      Riwayat Scan Sesi Ini ({data.sesi_opname_aktif.detail?.length || 0})
                    </h4>
                  </div>
                  <div className="divide-y divide-border text-xs">
                    {data.sesi_opname_aktif.detail?.map((d: any) => (
                      <div
                        key={d.id}
                        className="p-3 flex items-center justify-between"
                      >
                        <span className="font-mono font-bold text-foreground">
                          {d.eksemplar?.kode_barcode}
                        </span>
                        <span className="text-muted-foreground">
                          {d.eksemplar?.buku?.judul}
                        </span>
                        <span className="font-semibold text-primary capitalize">
                          {d.kondisi}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. TAB PENGGUNA */}
        {tabAktif === "pengguna" && (
          <div className="space-y-6">
            {/* Form Tambah Pengguna */}
            <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
              <h2 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Registrasi Anggota Baru
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Tambahkan siswa, guru, atau staf ke sistem BILIK (Kata sandi default: Bilik2026!).
              </p>

              <form onSubmit={handleTambahPengguna} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Nomor Induk (NIS/NIP)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0061234571"
                    value={penggunaBaru.nomor_induk}
                    onChange={(e) =>
                      setPenggunaBaru({
                        ...penggunaBaru,
                        nomor_induk: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bilal Ramadhan"
                    value={penggunaBaru.nama_lengkap}
                    onChange={(e) =>
                      setPenggunaBaru({
                        ...penggunaBaru,
                        nama_lengkap: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Email & Kelas / Jabatan
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Email"
                      value={penggunaBaru.email}
                      onChange={(e) =>
                        setPenggunaBaru({
                          ...penggunaBaru,
                          email: e.target.value,
                        })
                      }
                      className="w-1/2 px-3 py-2 text-sm rounded-lg border border-border min-h-[44px]"
                    />
                    <input
                      type="text"
                      placeholder="Kelas (X SIJA)"
                      value={penggunaBaru.kelas_atau_jabatan}
                      onChange={(e) =>
                        setPenggunaBaru({
                          ...penggunaBaru,
                          kelas_atau_jabatan: e.target.value,
                        })
                      }
                      className="w-1/2 px-3 py-2 text-sm rounded-lg border border-border min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 min-h-[44px]"
                  >
                    Tambah Anggota
                  </button>
                </div>
              </form>
            </div>

            {/* Tabel Daftar Pengguna */}
            <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="text-base font-bold text-foreground">
                  Daftar Anggota & Hak Akses
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                    <tr>
                      <th className="p-3">Nomor Induk</th>
                      <th className="p-3">Nama Lengkap</th>
                      <th className="p-3">Kelas / Jabatan</th>
                      <th className="p-3">Hak Peran</th>
                      <th className="p-3">Status Blokir</th>
                      <th className="p-3 text-right">Kelola</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(data.pengguna_list ?? []).map((u) => {
                      const isAdmin = u.peran.includes("admin");
                      const isAdminMaster = u.peran.includes("admin_master");
                      return (
                        <tr key={u.id} className="hover:bg-muted/20">
                          <td className="p-3 font-mono font-bold text-foreground">
                            {u.nomor_induk}
                          </td>
                          <td className="p-3 font-semibold text-foreground">
                            {u.nama_lengkap}
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {u.kelas_atau_jabatan || "-"}
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                isAdminMaster
                                  ? "bg-purple-50 text-purple-700"
                                  : isAdmin
                                  ? "bg-primary-soft text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {isAdminMaster
                                ? "Admin Master"
                                : isAdmin
                                ? "Admin"
                                : "Warga"}
                            </span>
                          </td>
                          <td className="p-3">
                            {u.is_terblokir ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleAksiPengguna(u.id, "buka_blokir")
                                }
                                className="px-2 py-1 rounded bg-red-100 text-destructive text-[11px] font-bold hover:bg-red-200 min-h-[32px]"
                              >
                                Terblokir (Klik Buka)
                              </button>
                            ) : (
                              <span className="text-green-600 font-medium">
                                Normal
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {data.pengguna.is_admin_master && !isAdminMaster && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleAksiPengguna(u.id, "toggle_admin")
                                }
                                className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted min-h-[44px]"
                              >
                                {isAdmin ? "Cabut Admin" : "Jadikan Admin"}
                              </button>
                            )}
                            {!isAdminMaster && u.id !== data.pengguna.id && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleHapusPengguna(u.id, u.nama_lengkap)
                                }
                                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 min-h-[44px]"
                              >
                                Hapus
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 9. TAB LOG AUDIT */}
        {tabAktif === "audit" && (
          <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                Catatan Log Audit Transaksi (Immutable)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Setiap mutasi inventaris, sirkulasi, opname, dan denda tersimpan dengan kode hash commit acak 8 karakter ala Git.
              </p>
            </div>

            {(data.audit_logs ?? []).length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Belum ada aktivitas audit yang tercatat.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                    <tr>
                      <th className="p-3">Commit Hash</th>
                      <th className="p-3">Waktu</th>
                      <th className="p-3">Aktor (Petugas)</th>
                      <th className="p-3">Aksi & Entitas</th>
                      <th className="p-3">Pesan Commit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono text-[11px]">
                    {(data.audit_logs ?? []).map((log) => (
                      <tr key={log.id} className="hover:bg-muted/20">
                        <td className="p-3 font-bold text-primary">
                          #{log.commit_hash}
                        </td>
                        <td className="p-3 text-muted-foreground font-sans">
                          {new Date(log.dibuat_pada).toLocaleString("id-ID")}
                        </td>
                        <td className="p-3 font-sans">
                          <span className="font-semibold text-foreground block">
                            {log.aktor?.nama_lengkap || "Sistem Otomatis"}
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            {log.aktor?.nomor_induk || "-"}
                          </span>
                        </td>
                        <td className="p-3 font-sans">
                          <span className="font-bold uppercase tracking-wider text-[10px] text-foreground block">
                            {log.aksi}
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            {log.entitas}
                          </span>
                        </td>
                        <td className="p-3 font-sans text-foreground">
                          {log.pesan_commit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
