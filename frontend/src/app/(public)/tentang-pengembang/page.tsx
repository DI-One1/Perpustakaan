import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Code2, Users, GraduationCap } from "lucide-react";

export default function AboutDeveloperPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <UtilityBar />
      <Header />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-soft-foreground">
              <Code2 className="h-3.5 w-3.5" />
              <span>Teaching Factory (TEFA)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Tim Pengembang & Pengelola Sistem
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              Proyek ini dikembangkan secara mandiri oleh tim Teaching Factory (TEFA)
              SMK TI Bazma sebagai bentuk pembelajaran berbasis proyek nyata (Project-Based
              Learning) dan penerapan keahlian Rekayasa Perangkat Lunak & Jaringan (SIJA).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary font-bold">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Siswa Terpilih (TEFA)</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Bertindak sebagai perancang antarmuka (UI/UX), arsitek data, dan pengembang
                kode fullstack dengan standar web modern dan aksesibilitas WCAG 2.1 AA.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary font-bold">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Guru TI Pembimbing</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Membimbing perancangan arsitektur, kepatuhan aturan bisnis perpustakaan,
                code review, dan persiapan serah terima ke tim backend.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary font-bold">
                <Code2 className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Staf TI & Server</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Mengelola infrastruktur lokal sekolah, sinkronisasi database warga, backup
                berkala, serta audit keamanan sistem.
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
