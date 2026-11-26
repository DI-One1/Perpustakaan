"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BannerSlide {
  id: string;
  image: string;
  link: string;
  alt: string;
}

const slides: BannerSlide[] = [
  {
    id: "slide-aldebaran",
    image: "/images/banners/default-banner1.png",
    link: "#",
    alt: "Buku Baru Rilis: Aldebaran 2",
  },
  {
    id: "slide-hari-buku",
    image: "/images/banners/default-banner6.png",
    link: "#",
    alt: "Selamat Hari Buku Sedunia",
  },
  {
    id: "slide-bacaan-pilihan",
    image: "/images/banners/default-banner7.png",
    link: "#",
    alt: "Temukan bacaan yang membuka wawasan perpustakaan SMK TI BAZMA",
  },
  {
    id: "slide-seminar",
    image: "/images/banners/default-banner8.png",
    link: "#",
    alt: "Seminar Nasional Borcelle",
  },
];

export function BannerCarousel() {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const totalSlides = slides.length;

  React.useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section
      aria-label="Banner Utama dan Promosi Perpustakaan"
      className="w-full"
    >
      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-12">
        {/* MAIN BANNER CAROUSEL (KOLOM KIRI: 9/12) */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsPaused(false);
            }
          }}
          className="group/banner relative min-h-[300px] sm:min-h-[326px] overflow-hidden rounded-[14px] bg-primary shadow-xs border border-border/50 lg:col-span-9 select-none"
        >
          {/* Carousel Images */}
          {slides.map((slide, index) => (
            <Link
              key={slide.id}
              href={slide.link}
              tabIndex={activeSlide === index ? 0 : -1}
              aria-label={`Buka banner ${index + 1}: ${slide.alt}`}
              aria-hidden={activeSlide !== index}
              className={cn(
                "absolute inset-0 block transition-opacity duration-700 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                activeSlide === index
                  ? "z-10 opacity-100"
                  : "z-0 pointer-events-none opacity-0"
              )}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 75vw"
                className="object-cover"
                priority={index === 0}
              />
            </Link>
          ))}

          {/* Area Klik Navigasi Kiri (Vertikal Penuh) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Slide sebelumnya"
            className="group/nav-left absolute inset-y-0 left-0 z-20 flex w-16 sm:w-20 md:w-24 items-center justify-start pl-3 sm:pl-4 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1"
          >
            {/* Latar Belakang Area Klik: Transparansi Tinggi Normal, Sedikit Meningkat Saat Di-Hover */}
            <span
              className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover/nav-left:opacity-100"
              aria-hidden="true"
            />

            {/* Ikon Panah Kiri: Tersembunyi Default, Muncul Saat Banner Di-Hover */}
            <span
              className="relative z-10 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs shadow-md opacity-0 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover/banner:opacity-100 group-focus-visible/nav-left:opacity-100 group-hover/nav-left:bg-black/60 group-hover/nav-left:scale-105 motion-reduce:transition-none"
              aria-hidden="true"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
          </button>

          {/* Area Klik Navigasi Kanan (Vertikal Penuh) */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Slide berikutnya"
            className="group/nav-right absolute inset-y-0 right-0 z-20 flex w-16 sm:w-20 md:w-24 items-center justify-end pr-3 sm:pr-4 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1"
          >
            {/* Latar Belakang Area Klik: Transparansi Tinggi Normal, Sedikit Meningkat Saat Di-Hover */}
            <span
              className="absolute inset-0 bg-gradient-to-l from-black/35 via-black/10 to-transparent opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover/nav-right:opacity-100"
              aria-hidden="true"
            />

            {/* Ikon Panah Kanan: Tersembunyi Default, Muncul Saat Banner Di-Hover */}
            <span
              className="relative z-10 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs shadow-md opacity-0 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover/banner:opacity-100 group-focus-visible/nav-right:opacity-100 group-hover/nav-right:bg-black/60 group-hover/nav-right:scale-105 motion-reduce:transition-none"
              aria-hidden="true"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
          </button>

          {/* Carousel Indicators dengan Tap Target 44px M3 */}
          <div className="absolute bottom-1 left-1/2 z-30 flex -translate-x-1/2 items-center gap-0.5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Buka slide ${index + 1}`}
                aria-current={activeSlide === index ? "true" : undefined}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
                    activeSlide === index
                      ? "w-5 bg-white shadow-2xs"
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* SECONDARY PROMOTIONAL BANNERS (KOLOM KANAN: 3/12) */}
        <div className="flex flex-col gap-3.5 lg:col-span-3">
          {/* Banner 1: Pekan Literasi / Koleksi Teknologi (Full Graphic Banner) */}
          <Link
            href="/katalog?kategori=Teknologi"
            className="group relative flex h-[155px] w-full overflow-hidden rounded-[14px] border border-border bg-card shadow-xs transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Pekan Literasi - Jelajahi Koleksi Teknologi"
          >
            <Image
              src="/images/banners/cs-e-book.png"
              alt="Pekan Literasi - Membaca adalah Jembatan Ilmu"
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-105"
              priority
            />

            {/* Tombol Panah Lingkaran Seragam dengan Banner Bawah */}
            <div className="absolute bottom-4 left-4 z-10 h-7 w-7 rounded-full bg-card/90 backdrop-blur-xs shadow-xs flex items-center justify-center text-heading group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          {/* Banner 2: Pilihan Literasi (Background Gambar Penuh Tanpa Blur & Tanpa Sampul Buku) */}
          <Link
            href="/katalog?kategori=Sastra"
            className="group relative flex h-[155px] w-full overflow-hidden rounded-[14px] border border-border shadow-xs transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Pilihan Literasi - Buku Inspiratif untuk Masa Depan"
          >
            {/* Background Gambar Seperti Pekan Literasi (100% Opasitas Penuh Tanpa Blur) */}
            <Image
              src="/images/banners/pekan-literasi1.png"
              alt="Pekan Literasi"
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-105"
            />

            {/* Konten Teks Sisi Kiri (Layout Tetap Seperti Sebelumnya) */}
            <div className="relative z-10 flex flex-col justify-between h-full max-w-[200px] p-4">
              <div>
                <h3 className="text-[17px] font-bold text-heading leading-tight group-hover:text-primary transition-colors">
                  Eksplorasi
                </h3>

                <p className="mt-1 text-[11px] text-muted-foreground font-medium leading-snug">
                  Baca bukumu<br />
                  di setiap minggu.
                </p>
              </div>

              {/* Tombol Panah Lingkaran dengan State Layer M3 */}
              <div className="h-7 w-7 rounded-full bg-card/90 backdrop-blur-xs shadow-xs flex items-center justify-center text-heading group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
