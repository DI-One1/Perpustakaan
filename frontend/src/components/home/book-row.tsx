"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { BookCard } from "@/components/book/book-card";
import type { MockBook } from "@/mocks";

interface BookRowProps {
  title: string;
  description?: string;
  books: MockBook[];
  viewAllHref: string;
}

export function BookRow({
  title,
  description,
  books,
  viewAllHref,
}: BookRowProps) {
  const rowRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScrollState = () => {
    const el = rowRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  React.useEffect(() => {
    checkScrollState();
    window.addEventListener("resize", checkScrollState);
    return () => window.removeEventListener("resize", checkScrollState);
  }, [books]);

  const scrollBy = (offset: number) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="relative w-full space-y-3.5">
      {/* Header Baris Buku Sesuai Screenshot Referensi */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl sm:text-[22px] font-bold text-heading tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-xs sm:text-[13px] text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs py-1"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Kontrol Tombol Navigasi Panah Lingkaran Minimalis [<] [>] */}
          <div className="hidden sm:flex items-center gap-1.5 ml-1">
            <button
              type="button"
              disabled={!canScrollLeft}
              onClick={() => scrollBy(-260)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-heading shadow-2xs hover:bg-background hover:border-primary/40 disabled:opacity-30 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              aria-label={`Geser ${title} ke kiri`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={!canScrollRight}
              onClick={() => scrollBy(260)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-heading shadow-2xs hover:bg-background hover:border-primary/40 disabled:opacity-30 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              aria-label={`Geser ${title} ke kanan`}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Track Horizontal Carousel Buku: Menampilkan 5 Kartu Horizontal Presisi Desktop */}
      <div
        ref={rowRef}
        onScroll={checkScrollState}
        className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth [scroll-snap-type:x_mandatory] [overscroll-behavior-x:contain]"
        style={{ scrollbarWidth: "none" }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            className="shrink-0 [scroll-snap-align:start]"
          >
            <BookCard book={book} layout="horizontal" />
          </div>
        ))}
      </div>
    </section>
  );
}
