"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Bell, LogOut, Shield, User, ArrowLeftRight } from "lucide-react";

export interface SesiPengguna {
  id: string;
  nomor_induk: string;
  nama_lengkap: string;
  email: string;
  kelas_atau_jabatan: string;
  peran: ("warga" | "admin" | "admin_master")[];
  is_admin_master: boolean;
  konteks_peran_aktif: "warga" | "admin" | "admin_master";
}

export function Navbar({ onSesiChange }: { onSesiChange?: (p: SesiPengguna | null) => void }) {
  const router = useRouter();
  const [pengguna, setPengguna] = useState<SesiPengguna | null>(null);
  const [notifCount, setNotifCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/v1/auth/sesi")
      .then((r) => r.json())
      .then((d) => {
        setPengguna(d.pengguna);
        onSesiChange?.(d.pengguna);
        if (d.pengguna) {
          fetch("/api/v1/pinjaman/saya")
            .then((r2) => (r2.ok ? r2.json() : null))
            .then((d2) => {
              if (d2?.notifikasi) {
                setNotifCount(d2.notifikasi.filter((n: { sudah_dibaca: boolean }) => !n.sudah_dibaca).length);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, [onSesiChange]);

  const isAdmin = pengguna?.peran.includes("admin") || pengguna?.peran.includes("admin_master");

  async function handleSwitchMode() {
    if (!pengguna) return;
    const target =
      pengguna.konteks_peran_aktif === "warga"
        ? pengguna.is_admin_master
          ? "admin_master"
          : "admin"
        : "warga";

    await fetch("/api/v1/auth/sesi", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ konteks_peran_aktif: target }),
    });

    setMenuOpen(false);
    if (target === "warga") {
      router.push("/");
    } else {
      router.push("/admin");
    }
    router.refresh();
  }

  async function handleLogout() {
    await fetch("/api/v1/auth/keluar", { method: "POST" });
    setPengguna(null);
    setMenuOpen(false);
    router.push("/masuk");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-base font-extrabold tracking-tight text-primary">BILIK</span>
            <span className="block text-[11px] font-medium text-muted-foreground">SMK TI BAZMA</span>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Katalog
          </Link>

          {pengguna ? (
            <>
              <Link
                href="/saya"
                className="relative rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Aktivitas Saya
                {notifCount > 0 && (
                  <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-bold text-white">
                    {notifCount}
                  </span>
                )}
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden items-center gap-1.5 rounded-lg bg-primary-soft px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/15 sm:inline-flex"
                >
                  <Shield className="h-4 w-4" />
                  Workspace Admin
                </Link>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold hover:bg-muted"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {pengguna.nama_lengkap
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <span className="hidden max-w-[140px] truncate sm:inline">{pengguna.nama_lengkap}</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-lg">
                    <div className="border-b border-border px-3 py-2">
                      <p className="text-sm font-bold text-foreground">{pengguna.nama_lengkap}</p>
                      <p className="text-xs text-muted-foreground">
                        {pengguna.nomor_induk} ({pengguna.kelas_atau_jabatan})
                      </p>
                    </div>

                    <div className="mt-1 space-y-1">
                      <Link
                        href="/saya"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        Pinjaman, Antrean &amp; Favorit
                      </Link>
                      <Link
                        href="/saya?tab=notifikasi"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        <span className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          Notifikasi
                        </span>
                        {notifCount > 0 && (
                          <span className="rounded-full bg-destructive px-2 py-0.5 text-[11px] font-bold text-white">
                            {notifCount}
                          </span>
                        )}
                      </Link>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={handleSwitchMode}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-primary hover:bg-primary-soft"
                        >
                          <ArrowLeftRight className="h-4 w-4" />
                          {pengguna.konteks_peran_aktif === "warga"
                            ? "Beralih ke Workspace Admin"
                            : "Beralih ke Mode Warga"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-destructive hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/masuk"
              className="inline-flex min-h-[44px] items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Masuk
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
