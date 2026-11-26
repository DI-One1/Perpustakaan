import Link from "next/link";
import Image from "next/image";
import { Clock, BookCheck, ShieldCheck, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-foreground pb-20 md:pb-8 pt-10 sm:pt-12">
      {/* Menggunakan Standar Wide Container min(calc(100% - 48px), 1280px) */}
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Kolom 1: Identitas Sekolah & Perpustakaan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative h-9 w-9 overflow-hidden rounded-md flex items-center justify-center bg-card">
                <Image
                  src="/logo-named-BILIK.png"
                  alt="Logo BILIK"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg text-foreground">
                BILIK BAZMA
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Perpustakaan digital SMK TI Bazma di bawah naungan Yayasan BAZMA Pertamina. Pusat literasi teknologi dan keislaman berbasis sekolah berasrama.
            </p>
            <div className="flex items-start gap-2 text-[13px] text-muted-foreground pt-1">
              <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <span>Jl. Cikampak Cicadas, Ciampea, Kab. Bogor, Jawa Barat</span>
            </div>
          </div>

          {/* Kolom 2: Jam Layanan Meja Sirkulasi */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Layanan Meja Sirkulasi
            </h4>
            <ul className="space-y-2 text-[13px] text-muted-foreground">
              <li className="flex justify-between border-b border-border/50 pb-1">
                <span>Senin – Kamis</span>
                <span className="font-medium text-foreground">08.00 – 16.30 WIB</span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-1">
                <span>Jumat</span>
                <span className="font-medium text-foreground">08.00 – 16.00 WIB</span>
              </li>
              <li className="flex justify-between text-warning-fg pt-1">
                <span>Istirahat Shalat</span>
                <span>Dhuhur &amp; Ashar</span>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Aturan & Ketentuan Peminjaman */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <BookCheck className="h-4 w-4 text-primary" />
              Ketentuan Peminjaman
            </h4>
            <ul className="space-y-1.5 text-[13px] text-muted-foreground">
              <li>Maksimal 1 pinjaman/booking aktif per warga</li>
              <li>Durasi pinjam standar 7 hari kalender</li>
              <li>Batas pengambilan booking online 24 jam</li>
              <li>Denda keterlambatan Rp500 / hari keterlambatan</li>
            </ul>
          </div>

          {/* Kolom 4: Tautan Penting & Pintu Koleksi Digital */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Informasi &amp; Tautan
            </h4>
            <div className="flex flex-col space-y-2 text-[13px]">
              <Link
                href="/tentang"
                className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
              >
                Tentang Perpustakaan BILIK
              </Link>
              <Link
                href="/tentang-pengembang"
                className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
              >
                Tentang Pengembang (TEFA SMK TI Bazma)
              </Link>

              {/* Pintu Nonaktif Koleksi Digital (Aturan Prompt) */}
              <div
                className="inline-flex items-center justify-between rounded-md border border-border/60 bg-muted/40 px-2.5 py-1.5 text-[13px] text-muted-foreground opacity-60 cursor-not-allowed"
                title="Koleksi E-book & Karya Siswa sedang dalam tahap kurasi"
              >
                <span>Koleksi Digital</span>
                <span className="text-[13px] font-medium bg-muted px-1.5 py-0.5 rounded">
                  Segera hadir
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Baris Hak Cipta Bawah */}
        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-muted-foreground">
          <p>© 2026 BILIK | Perpustakaan Digital SMK TI BAZMA. Hak cipta dilindungi.</p>
          <p className="flex items-center gap-1">
            <span>Dikelola oleh Tim Staf &amp; Siswa TEFA SIJA</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
