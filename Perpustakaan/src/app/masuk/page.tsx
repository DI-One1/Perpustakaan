"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, LogIn } from "lucide-react";

const AKUN_DEMO = [
  { label: "Admin Master (Pak Ridwan)", nip: "ADMIN-001", ket: "Full Akses + Kelola Admin" },
  { label: "Admin (Ibu Nurul)", nip: "ADM-002", ket: "Sirkulasi, Koleksi, Opname, Denda" },
  { label: "Warga: Fadhil (Siap Ambil)", nip: "0061234567", ket: "Punya RSV-1001 (BK-0001)" },
  { label: "Warga: Ahmad (Bersih)", nip: "0061234568", ket: "Siap demo Ajukan / Antre" },
  { label: "Warga: Salma (Pinjam Aktif)", nip: "0061234569", ket: "Pinjam BK-0006 (Demo Perpanjang)" },
  { label: "Warga: Rian (Terlambat)", nip: "0061234570", ket: "Terlambat 3 hari BK-0007" },
];

export default function MasukPage() {
  const router = useRouter();
  const [nomorInduk, setNomorInduk] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/masuk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomor_induk: nomorInduk, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Gagal masuk.");
        return;
      }

      if (data.pengguna.konteks_peran_aktif === "warga") {
        router.push("/");
      } else {
        router.push("/admin");
      }
      router.refresh();
    } catch {
      setError("Terjadi gangguan jaringan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-lg font-extrabold text-primary">BILIK</span>
            <span className="block text-xs text-muted-foreground">SMK TI BAZMA</span>
          </div>
        </Link>

        <h1 className="mt-6 text-xl font-extrabold text-foreground">Masuk ke Akun Anda</h1>

        {error && (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-red-50 px-4 py-3 text-xs font-semibold text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="nomor_induk" className="block text-xs font-bold text-foreground">
              Nomor Induk (NIS / NIP / Kode Admin)
            </label>
            <input
              id="nomor_induk"
              type="text"
              required
              value={nomorInduk}
              onChange={(e) => setNomorInduk(e.target.value)}
              placeholder="Contoh: 0061234568 atau ADMIN-001"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-foreground">
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Memverifikasi..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 border-t border-border pt-5">
          <p className="text-xs font-bold text-muted-foreground">
            Akun Simulasi Presentasi (Password: <code className="text-primary">Bilik2026!</code>):
          </p>
          <div className="mt-2.5 grid gap-1.5">
            {AKUN_DEMO.map((a) => (
              <button
                key={a.nip}
                type="button"
                onClick={() => {
                  setNomorInduk(a.nip);
                  setPassword("Bilik2026!");
                }}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-xs hover:bg-primary-soft"
              >
                <span className="font-bold text-foreground">{a.label}</span>
                <span className="text-[11px] text-muted-foreground">{a.ket}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
