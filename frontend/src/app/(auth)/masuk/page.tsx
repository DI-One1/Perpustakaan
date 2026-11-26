"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, PRESET_ACCOUNTS } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogIn,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  BookOpen,
  AlertCircle,
  Sparkles,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const { login } = useAuth();

  const [nomorInduk, setNomorInduk] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const ok = await login(nomorInduk);
      if (ok) {
        router.push(nextUrl);
        router.refresh();
      } else {
        setErrorMsg("Nomor Induk atau kata sandi tidak ditemukan. Gunakan tombol demo di bawah.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (role: "warga" | "pustakawan" | "admin") => {
    setIsSubmitting(true);
    try {
      const ok = await login("", role);
      if (ok) {
        router.push(nextUrl);
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header Minimalis Sederhana */}
      <header className="border-b border-border bg-card py-3.5 px-4 sm:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-md flex items-center justify-center">
            <Image
              src="/logo-named-BILIK.png"
              alt="Logo BILIK"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-heading">
            BILIK
          </span>
        </Link>

        <Link
          href="/"
          className="text-[13px] font-semibold text-primary hover:underline transition-colors"
        >
          Kembali ke Beranda →
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Card Form Login */}
          <div className="rounded-[16px] border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-1.5 text-center">
              <Badge variant="outline" className="text-xs mb-1 bg-primary-soft text-primary border-sky-blue font-semibold">
                Portal Masuk
              </Badge>
              <h1 className="text-2xl font-bold tracking-tight text-heading">
                Masuk ke BILIK
              </h1>
              <p className="text-xs text-muted-foreground">
                Gunakan NISN/NIP terdaftar untuk sirkulasi perpustakaan
              </p>
            </div>

            {errorMsg && (
              <div className="rounded-[8px] bg-red-50 p-3 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form Manual */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="login-identitas" className="text-xs font-semibold text-heading">
                  Nomor Induk (NISN / NIP)
                </label>
                <input
                  id="login-identitas"
                  type="text"
                  required
                  value={nomorInduk}
                  onChange={(e) => setNomorInduk(e.target.value)}
                  placeholder="Contoh: 0061234567 atau PUST-001"
                  className="w-full rounded-[8px] border border-input bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="login-password" className="font-semibold text-heading">Kata Sandi</label>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    Default: Bilik2026!
                  </span>
                </div>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-[8px] border border-input bg-card px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-xs sm:text-sm font-semibold h-10 gap-2 shadow-xs bg-primary hover:bg-primary-hover text-white rounded-[8px]"
              >
                <LogIn className="h-4 w-4 text-white" />
                <span>{isSubmitting ? "Memverifikasi..." : "Masuk ke Akun"}</span>
              </Button>
            </form>

            {/* Quick Login Demo Cards */}
            <div className="border-t border-border pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-heading flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Pilih Akun Demo (1-Click Test):</span>
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {/* 1. Akun Warga */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("warga")}
                  className="flex items-center justify-between p-3 rounded-[10px] border border-border bg-background hover:bg-primary-soft hover:border-primary/40 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-primary-soft flex items-center justify-center text-primary font-bold text-xs">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-heading leading-tight">
                        {PRESET_ACCOUNTS.warga.nama}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                        Peran: Warga Siswa ({PRESET_ACCOUNTS.warga.kelas_atau_unit})
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* 2. Akun Pustakawan */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("pustakawan")}
                  className="flex items-center justify-between p-3 rounded-[10px] border border-border bg-background hover:bg-emerald-50 hover:border-emerald-300 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-heading leading-tight">
                        {PRESET_ACCOUNTS.pustakawan.nama}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                        Peran: Staf Pustakawan (Meja Sirkulasi)
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* 3. Akun Admin */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("admin")}
                  className="flex items-center justify-between p-3 rounded-[10px] border border-border bg-background hover:bg-amber-50 hover:border-amber-300 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-heading leading-tight">
                        {PRESET_ACCOUNTS.admin.nama}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                        Peran: Administrator Sistem
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-700 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-primary">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
