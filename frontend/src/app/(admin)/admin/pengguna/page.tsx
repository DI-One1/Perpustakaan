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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MOCK_MEMBERS, type MockMemberPersona } from "@/mocks";
import {
  Users,
  Search,
  Plus,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
} from "lucide-react";

interface AdminUserItem extends MockMemberPersona {
  peran: "warga" | "pustakawan" | "admin";
  is_blocked: boolean;
}

const INITIAL_ADMIN_USERS: AdminUserItem[] = [
  ...MOCK_MEMBERS.map((m) => ({
    ...m,
    peran: "warga" as const,
    is_blocked: false,
  })),
  {
    id: "usr-pust-01",
    nama: "Ibu Nurul Hidayah, S.I.Pust",
    identitas: "PUST-001",
    kelas_atau_unit: "Unit Perpustakaan",
    status_kelayakan: "memenuhi_syarat",
    denda: 0,
    pinjaman_aktif_count: 0,
    booking_aktif: null,
    foto_url: "/images/avatars/.png",
    peran: "pustakawan",
    is_blocked: false,
  },
  {
    id: "usr-admin-01",
    nama: "Pak Ridwan Santoso, M.Kom",
    identitas: "ADMIN-001",
    kelas_atau_unit: "Laboratorium & IT Bazma",
    status_kelayakan: "memenuhi_syarat",
    denda: 0,
    pinjaman_aktif_count: 0,
    booking_aktif: null,
    foto_url: "/images/avatars/.png",
    peran: "admin",
    is_blocked: false,
  },
];

export default function ManajemenPenggunaPage() {
  const [users, setUsers] = React.useState<AdminUserItem[]>(INITIAL_ADMIN_USERS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<"semua" | "warga" | "pustakawan" | "admin">("semua");
  const [notification, setNotification] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  // Dialog Tambah Pengguna
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [newNama, setNewNama] = React.useState("");
  const [newIdentitas, setNewIdentitas] = React.useState("");
  const [newPeran, setNewPeran] = React.useState<"warga" | "pustakawan" | "admin">("warga");
  const [newKelas, setNewKelas] = React.useState("X SIJA 1");

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "semua" && u.peran !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return u.nama.toLowerCase().includes(q) || u.identitas.toLowerCase().includes(q);
    }
    return true;
  });

  // Handler Reset Password ke default "Bilik2026!"
  const handleResetPassword = (user: AdminUserItem) => {
    setNotification({
      type: "success",
      message: `Kata sandi untuk ${user.nama} (${user.identitas}) berhasil di-reset ke default 'Bilik2026!'.`,
    });
  };

  // Handler Toggle Blokir
  const handleToggleBlock = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextBlocked = !u.is_blocked;
          setNotification({
            type: "success",
            message: `Akun ${u.nama} berhasil di-${nextBlocked ? "blokir sementara dari sirkulasi" : "buka kembali pemblokirannya"}.`,
          });
          return { ...u, is_blocked: nextBlocked };
        }
        return u;
      })
    );
  };

  // Handler Tambah Pengguna
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama.trim() || !newIdentitas.trim()) return;

    const newUser: AdminUserItem = {
      id: `usr-${Date.now()}`,
      nama: newNama.trim(),
      identitas: newIdentitas.trim(),
      kelas_atau_unit: newKelas,
      peran: newPeran,
      status_kelayakan: "memenuhi_syarat",
      denda: 0,
      pinjaman_aktif_count: 0,
      booking_aktif: null,
      foto_url: "/images/avatars/.png",
      is_blocked: false,
    };

    setUsers((prev) => [newUser, ...prev]);
    setIsAddOpen(false);
    setNewNama("");
    setNewIdentitas("");
    setNotification({
      type: "success",
      message: `Pengguna baru "${newUser.nama}" (${newUser.identitas}) berhasil didaftarkan dengan password default 'Bilik2026!'.`,
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
            <span className="text-foreground font-medium">Manajemen Pengguna</span>
          </nav>

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <Users className="h-7 w-7 text-primary" />
                <span>Manajemen Pengguna &amp; Akses Sirkulasi</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Kelola identitas warga siswa, pustakawan, dan administrator. Reset kata sandi default dan kontrol hak peminjaman.
              </p>
            </div>

            <Button
              onClick={() => setIsAddOpen(true)}
              className="text-xs font-semibold gap-1.5 shrink-0 h-10 px-4"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Pengguna Baru</span>
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

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            {/* Filter Role */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <Button
                size="sm"
                variant={roleFilter === "semua" ? "default" : "outline"}
                onClick={() => setRoleFilter("semua")}
                className="text-xs h-8"
              >
                Semua ({users.length})
              </Button>
              <Button
                size="sm"
                variant={roleFilter === "warga" ? "default" : "outline"}
                onClick={() => setRoleFilter("warga")}
                className="text-xs h-8"
              >
                Warga Siswa
              </Button>
              <Button
                size="sm"
                variant={roleFilter === "pustakawan" ? "default" : "outline"}
                onClick={() => setRoleFilter("pustakawan")}
                className="text-xs h-8"
              >
                Pustakawan
              </Button>
              <Button
                size="sm"
                variant={roleFilter === "admin" ? "default" : "outline"}
                onClick={() => setRoleFilter("admin")}
                className="text-xs h-8"
              >
                Administrator
              </Button>
            </div>

            {/* Kolom Pencarian */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau NISN/NIP..."
                className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
              />
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>

          {/* TABEL PENGGUNA RESPONSIF */}
          <div
            tabIndex={0}
            role="region"
            aria-label="Tabel Manajemen Pengguna"
            className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs focus:ring-2 focus:ring-ring focus:outline-none"
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted/70 text-muted-foreground border-b border-border sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 font-semibold">Pengguna</th>
                  <th className="py-3 px-4 font-semibold">Identitas (NISN/NIP)</th>
                  <th className="py-3 px-4 font-semibold">Peran</th>
                  <th className="py-3 px-4 font-semibold">Unit / Kelas</th>
                  <th className="py-3 px-4 font-semibold">Hak Peminjaman</th>
                  <th className="py-3 px-4 font-semibold">Status Akun</th>
                  <th className="py-3 px-4 font-semibold text-right">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar src={item.foto_url} nama={item.nama} size={32} />
                        <span className="font-bold text-foreground">{item.nama}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                      {item.identitas}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-semibold ${
                          item.peran === "admin"
                            ? "bg-purple-500/10 text-purple-600 border-purple-500/30"
                            : item.peran === "pustakawan"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                        }`}
                      >
                        {item.peran}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{item.kelas_atau_unit}</td>
                    <td className="py-3.5 px-4">
                      {item.denda > 0 ? (
                        <span className="text-red-600 font-semibold flex items-center gap-1">
                          <ShieldAlert className="h-3.5 w-3.5" />
                          Denda Rp {item.denda.toLocaleString("id-ID")}
                        </span>
                      ) : item.status_kelayakan === "kuota_penuh" ? (
                        <span className="text-amber-600 font-medium">Pinjam 1 Buku (Penuh)</span>
                      ) : (
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Bebas Syarat
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.is_blocked ? (
                        <Badge variant="destructive" className="text-[10px]">
                          Diblokir
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">
                          Aktif
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResetPassword(item)}
                          className="h-7 text-[11px] gap-1 px-2"
                          title="Reset Password ke default Bilik2026!"
                        >
                          <KeyRound className="h-3 w-3 text-muted-foreground" />
                          <span>Reset PWD</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleBlock(item.id)}
                          className={`h-7 text-[11px] gap-1 px-2 ${
                            item.is_blocked
                              ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              : "text-red-600 hover:text-red-700 hover:bg-red-50"
                          }`}
                        >
                          {item.is_blocked ? (
                            <>
                              <Unlock className="h-3 w-3" />
                              <span>Buka</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3" />
                              <span>Blokir</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* DIALOG TAMBAH PENGGUNA */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pendaftaran Akun Pengguna Baru</DialogTitle>
            <DialogDescription>
              Buat akun warga siswa, pustakawan, atau staf. Kata sandi otomatis disetel ke default:{" "}
              <strong>Bilik2026!</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddUserSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Nama Lengkap</label>
              <input
                type="text"
                required
                value={newNama}
                onChange={(e) => setNewNama(e.target.value)}
                placeholder="Contoh: Rian Anggara"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nomor Induk / Identitas (NISN / NIP)
              </label>
              <input
                type="text"
                required
                value={newIdentitas}
                onChange={(e) => setNewIdentitas(e.target.value)}
                placeholder="Contoh: 0061234999 atau PUST-002"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Peran / Role</label>
                <select
                  value={newPeran}
                  onChange={(e) => setNewPeran(e.target.value as "warga" | "pustakawan" | "admin")}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="warga">Warga Siswa</option>
                  <option value="pustakawan">Pustakawan</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Kelas / Unit</label>
                <input
                  type="text"
                  required
                  value={newKelas}
                  onChange={(e) => setNewKelas(e.target.value)}
                  placeholder="Contoh: XII SIJA 2"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="font-semibold">
                Simpan &amp; Terbitkan Akun
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
