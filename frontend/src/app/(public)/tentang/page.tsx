import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BookOpen } from "lucide-react";

export default function AboutLibraryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <UtilityBar />
      <Header />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-soft-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Profil Perpustakaan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Tentang BILIK: Perpustakaan Digital SMK TI Bazma
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              BILIK (Bilik Literasi SMK TI Bazma) adalah sistem perpustakaan modern
              yang dirancang untuk mendukung budaya membaca, penelitian, dan riset
              mandiri siswa di lingkungan sekolah berasrama (boarding school) SMK
              TI Bazma di bawah naungan Yayasan BAZMA Pertamina.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary font-bold">
                1
              </div>
              <h2 className="text-lg font-bold text-foreground">Terstandarisasi</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Pencatatan koleksi, nomor induk unik eksemplar, aturan denda Rp500/hari,
                serta batasan sirkulasi seragam sesuai standar perpustakaan nasional.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary font-bold">
                2
              </div>
              <h2 className="text-lg font-bold text-foreground">Terdigitalisasi</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Sirkulasi daring melalui antrean FIFO, pengajuan peminjaman 24 jam,
                notifikasi keterlambatan, dan pencatatan riwayat literasi secara
                transparan.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary font-bold">
                3
              </div>
              <h2 className="text-lg font-bold text-foreground">Terintegrasi</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Terhubung dengan sistem database warga sekolah (NISN siswa dan ID staf),
                menjadi fondasi penilaian akreditasi sekolah yang kokoh.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
