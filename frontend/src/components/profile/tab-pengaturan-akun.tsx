"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Shield, Bell, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export function TabPengaturanAkun() {
  const [subTab, setSubTab] = React.useState<"keamanan" | "notifikasi">("keamanan");

  // State form ubah password
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showOld, setShowOld] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  // State notifikasi (5 checkbox)
  const [notifications, setNotifications] = React.useState({
    pengembalian: true,
    peminjaman: true,
    booking: true,
    pengumuman: false,
    koleksi: false,
  });

  // Toast feedback with proper cleanup
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);
  const toastTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showToast = React.useCallback((msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMsg(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg(null);
      toastTimerRef.current = null;
    }, 3500);
  }, []);

  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Handler ubah password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Kata sandi baru dan konfirmasi tidak cocok.");
      return;
    }
    if (newPassword.length < 8) {
      alert("Kata sandi baru minimal 8 karakter.");
      return;
    }
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Kata sandi berhasil diperbarui.");
  };

  // Handler simpan notifikasi
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("bilik_notification_prefs", JSON.stringify(notifications));
    } catch {
      // Ignored
    }
    showToast("Preferensi notifikasi berhasil disimpan.");
  };

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Toast (Accessible Live Region) */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-heading px-4 py-3 text-card shadow-lg border border-border/20 text-xs sm:text-sm animate-in fade-in duration-200"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header (Clean tanpa filler subtitle) */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-heading">
          Pengaturan Akun
        </h2>
      </div>

      {/* Card Utama */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        {/* Sub-tab Headers */}
        <div className="flex border-b border-border px-6 pt-2">
          <button
            type="button"
            onClick={() => setSubTab("keamanan")}
            className={cn(
              "px-4 py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2",
              subTab === "keamanan"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-heading"
            )}
          >
            <Shield className="h-4 w-4" />
            <span>Keamanan</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab("notifikasi")}
            className={cn(
              "px-4 py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2",
              subTab === "notifikasi"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-heading"
            )}
          >
            <Bell className="h-4 w-4" />
            <span>Notifikasi</span>
          </button>
        </div>

        {/* Tab Keamanan: Ubah Kata Sandi */}
        {subTab === "keamanan" && (
          <form onSubmit={handleChangePassword} className="p-6 sm:p-8 space-y-6 max-w-lg">
            <div>
              <h3 className="text-sm font-bold text-heading">Ubah Kata Sandi</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Minimal 8 karakter dan berbeda dari kata sandi sebelumnya.
              </p>
            </div>

            {/* Kata Sandi Lama */}
            <div className="space-y-1.5">
              <label htmlFor="pwd-old" className="text-xs font-semibold text-heading">
                Kata Sandi Lama
              </label>
              <div className="relative">
                <input
                  id="pwd-old"
                  type={showOld ? "text" : "password"}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-heading"
                  aria-label={showOld ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Kata Sandi Baru */}
            <div className="space-y-1.5">
              <label htmlFor="pwd-new" className="text-xs font-semibold text-heading">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  id="pwd-new"
                  type={showNew ? "text" : "password"}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-heading"
                  aria-label={showNew ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Kata Sandi Baru */}
            <div className="space-y-1.5">
              <label htmlFor="pwd-confirm" className="text-xs font-semibold text-heading">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  id="pwd-confirm"
                  type={showConfirm ? "text" : "password"}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-heading"
                  aria-label={showConfirm ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-primary-foreground text-xs sm:text-sm font-semibold rounded-lg px-6 min-h-[42px]"
              >
                Perbarui Kata Sandi
              </Button>
            </div>
          </form>
        )}

        {/* Tab Notifikasi: 5 Checkbox + Simpan */}
        {subTab === "notifikasi" && (
          <form onSubmit={handleSaveNotifications} className="p-6 sm:p-8 space-y-6 max-w-lg">
            <div>
              <h3 className="text-sm font-bold text-heading">Notifikasi Email</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Preferensi pemberitahuan akun melalui email terdaftar.
              </p>
            </div>

            <div className="space-y-4">
              {/* 1. Pengingat Pengembalian */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={notifications.pengembalian}
                  onChange={() => toggleNotif("pengembalian")}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                />
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-heading group-hover:text-primary transition-colors">
                    Pengingat Pengembalian Buku
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Kirimkan pengingat 1 hari sebelum batas pengembalian berakhir.
                  </p>
                </div>
              </label>

              {/* 2. Informasi Peminjaman */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={notifications.peminjaman}
                  onChange={() => toggleNotif("peminjaman")}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                />
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-heading group-hover:text-primary transition-colors">
                    Informasi Peminjaman
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Konfirmasi dan status peminjaman buku fisik secara real-time.
                  </p>
                </div>
              </label>

              {/* 3. Informasi Booking */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={notifications.booking}
                  onChange={() => toggleNotif("booking")}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                />
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-heading group-hover:text-primary transition-colors">
                    Informasi Booking
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Pemberitahuan saat booking siap diambil di Meja Sirkulasi.
                  </p>
                </div>
              </label>

              {/* 4. Pengumuman Perpustakaan */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={notifications.pengumuman}
                  onChange={() => toggleNotif("pengumuman")}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                />
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-heading group-hover:text-primary transition-colors">
                    Pengumuman Perpustakaan
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Jadwal operasional, kebijakan sirkulasi, dan info perpustakaan.
                  </p>
                </div>
              </label>

              {/* 5. Informasi Koleksi Terbaru */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={notifications.koleksi}
                  onChange={() => toggleNotif("koleksi")}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                />
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-heading group-hover:text-primary transition-colors">
                    Informasi Koleksi Terbaru
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Pemberitahuan ketika buku baru ditambahkan ke katalog.
                  </p>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-primary-foreground text-xs sm:text-sm font-semibold rounded-lg px-6 min-h-[42px]"
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
