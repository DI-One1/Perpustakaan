"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Laptop,
  Code,
  Server,
  Landmark,
  Atom,
  User,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CategoryItem {
  id: string;
  nama: string;
  slug: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryItem[] = [
  { id: "cat-2", nama: "Teknologi & SIJA", slug: "Teknologi", icon: Laptop },
  { id: "cat-3", nama: "Pemrograman Web", slug: "Pemrograman Web", icon: Code },
  { id: "cat-4", nama: "Jaringan Komputer", slug: "Jaringan Komputer", icon: Server },
  { id: "cat-5", nama: "Keislaman & Akhlak", slug: "Keislaman", icon: Landmark },
  { id: "cat-6", nama: "Sains & Matematika", slug: "Sains", icon: Atom },
  { id: "cat-7", nama: "Pengembangan Diri", slug: "Pengembangan Diri", icon: User },
  { id: "cat-8", nama: "Sastra & Bahasa", slug: "Sastra", icon: BookOpen },
];

export function CategoryChips() {
  const router = useRouter();
  const rowRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScrollState = React.useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const hasOverflow = scrollWidth > clientWidth + 2;

    // Chevron kiri hanya muncul jika daftar sudah digeser ke kanan
    setCanScrollLeft(hasOverflow && scrollLeft > 10);
    // Chevron kanan hanya muncul jika masih ada konten yang belum terlihat di sebelah kanan
    setCanScrollRight(hasOverflow && scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  React.useEffect(() => {
    checkScrollState();
    const el = rowRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => {
      checkScrollState();
    });
    resizeObserver.observe(el);

    window.addEventListener("resize", checkScrollState);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkScrollState);
    };
  }, [checkScrollState]);

  const scrollBy = (offset: number) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="category-nav-heading" className="w-full space-y-3.5">
      {/* Header Kategori: Judul Navy di Kiri & "Lihat Semua →" di Kanan */}
      <div className="flex items-center justify-between">
        <h2 id="category-nav-heading" className="text-xl sm:text-[22px] font-bold text-heading tracking-tight">
          Jelajahi Kategori
        </h2>
        <Link
          href="/katalog"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Row Chip Kategori Horizontal dengan Deteksi Scroll & Navigasi Chevron */}
      <div className="relative w-full">
        {/* Tombol Chevron Kiri (Hanya muncul jika sudah digeser ke kanan) */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center justify-start pr-8 pl-0.5 bg-gradient-to-r from-background via-background/95 to-transparent pointer-events-none">
            <button
              type="button"
              onClick={() => scrollBy(-260)}
              aria-label="Geser kategori ke kiri"
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-heading shadow-md hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Track Chip Kategori: Padding py-3 px-1.5 memastikan border dan efek hover tetap tampil utuh tanpa terpotong */}
        <div
          ref={rowRef}
          onScroll={checkScrollState}
          className="flex items-center gap-3 overflow-x-auto no-scrollbar py-3 px-1.5 scroll-smooth [scroll-snap-type:x_mandatory] [overscroll-behavior-x:contain]"
          style={{ scrollbarWidth: "none" }}
        >
          {CATEGORIES.map((cat) => {
            const IconComp = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => router.push(`/katalog?kategori=${encodeURIComponent(cat.slug)}`)}
                className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-white px-5 py-2.5 text-[13px] font-semibold text-heading shadow-xs hover:border-primary hover:bg-primary-soft hover:text-primary hover:shadow-sm active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer select-none [scroll-snap-align:start]"
              >
                <IconComp className="h-4 w-4 text-primary shrink-0" />
                <span>{cat.nama}</span>
              </button>
            );
          })}
        </div>

        {/* Tombol Chevron Kanan (Hanya muncul jika melebihi lebar layar & belum mencapai ujung kanan) */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-end pl-8 pr-0.5 bg-gradient-to-l from-background via-background/95 to-transparent pointer-events-none">
            <button
              type="button"
              onClick={() => scrollBy(260)}
              aria-label="Geser kategori ke kanan"
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-heading shadow-md hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
