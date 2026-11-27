"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BookCard } from "@/components/book/book-card";
import { MOCK_BOOKS, MOCK_CATEGORIES } from "@/mocks";
import {
  ChevronRight,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  BookOpen,
} from "lucide-react";

function CatalogContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("kategori") || "";
  const filterParam = searchParams.get("filter") || "";

  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = React.useState(queryParam);
  const [selectedCategory, setSelectedCategory] = React.useState(categoryParam || "Semua");
  const [availabilityFilter, setAvailabilityFilter] = React.useState<"semua" | "tersedia" | "antre">("semua");
  const [sortBy, setSortBy] = React.useState<"terbaru" | "populer" | "rating" | "az">(
    filterParam === "populer" ? "populer" : "terbaru"
  );
  const [viewMode, setViewMode] = React.useState<"horizontal" | "vertical">("horizontal");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Filter Koleksi Buku
  const filteredBooks = React.useMemo(() => {
    return MOCK_BOOKS.filter((book) => {
      // 1. Filter Kata Kunci (Judul, Penulis, ISBN)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = book.judul.toLowerCase().includes(q);
        const matchAuthor = book.penulis.toLowerCase().includes(q);
        const matchIsbn = book.isbn.toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchIsbn) return false;
      }

      // 2. Filter Kategori
      if (selectedCategory && selectedCategory !== "Semua") {
        const catNorm = selectedCategory.toLowerCase();
        const bookCatNorm = book.kategori_nama.toLowerCase();
        const bookSubNorm = (book.subkategori || "").toLowerCase();
        if (!bookCatNorm.includes(catNorm) && !bookSubNorm.includes(catNorm)) {
          return false;
        }
      }

      // 3. Filter Ketersediaan
      if (availabilityFilter === "tersedia") {
        if (book.eksemplar_tersedia <= 0) return false;
      } else if (availabilityFilter === "antre") {
        if (book.eksemplar_tersedia > 0) return false;
      }

      return true;
    }).sort((a, b) => {
      // 4. Pengurutan (Sorting)
      if (sortBy === "populer") {
        return (b.is_populer ? 1 : 0) - (a.is_populer ? 1 : 0);
      }
      if (sortBy === "az") {
        return a.judul.localeCompare(b.judul);
      }
      if (sortBy === "rating") {
        return (b.is_populer ? 1 : 0) - (a.is_populer ? 1 : 0);
      }
      // Default: Terbaru
      return (b.is_baru ? 1 : 0) - (a.is_baru ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, availabilityFilter, sortBy]);

  // Paginasi
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;
  const paginatedBooks = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
    setAvailabilityFilter("semua");
    setSortBy("terbaru");
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* 1. Top Information Bar (Navy Blue) */}
      <UtilityBar />

      {/* 2. Main Navigation Header */}
      <Header />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-auto w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)] space-y-6">
          {/* =========================================================================
              1. BREADCRUMB NAVIGATION
             ========================================================================= */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors font-medium">
              Beranda
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span className="font-semibold text-heading">Katalog Buku</span>
            {selectedCategory !== "Semua" && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                <span className="text-primary font-medium">{selectedCategory}</span>
              </>
            )}
          </nav>

          {/* =========================================================================
              2. PAGE HEADING
             ========================================================================= */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading">
                Katalog Koleksi Buku
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Jelajahi dan temukan seluruh koleksi buku fisik perpustakaan SMK TI BAZMA.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft border border-sky-blue px-3.5 py-1 text-xs font-semibold text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{filteredBooks.length} Buku Ditemukan</span>
              </span>
            </div>
          </div>

          {/* =========================================================================
              3. SEARCH, FILTER & SORTING BAR (Segmented Container)
             ========================================================================= */}
          <div className="rounded-[12px] border border-border bg-white p-4 shadow-xs space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Kolom Cari Cepat di Dalam Katalog */}
              <div className="md:col-span-6 relative flex items-center">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  id="catalog-search" aria-label="Pencarian judul, penulis, atau ISBN buku" placeholder="Cari judul, penulis, atau ISBN..."
                  className="w-full h-10 rounded-[8px] border border-input bg-white pl-9 pr-3.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              </div>

              {/* Filter Ketersediaan */}
              <div className="md:col-span-3">
                <select
                  value={availabilityFilter}
                  onChange={(e) => {
                    setAvailabilityFilter(e.target.value as "semua" | "tersedia" | "antre");
                    setCurrentPage(1);
                  }}
                  className="w-full h-10 rounded-[8px] border border-input bg-white px-3 text-[13px] font-medium text-foreground focus:border-primary focus:outline-none"
                  aria-label="Filter status ketersediaan"
                >
                  <option value="semua">Semua Ketersediaan</option>
                  <option value="tersedia">● Hanya yang Tersedia</option>
                  <option value="antre">● Sedang Dipinjam / Antre</option>
                </select>
              </div>

              {/* Sorting Dropdown & View Mode Toggle */}
              <div className="md:col-span-3 flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as "terbaru" | "populer" | "rating" | "az");
                    setCurrentPage(1);
                  }}
                  className="flex-1 h-10 rounded-[8px] border border-input bg-white px-3 text-[13px] font-medium text-foreground focus:border-primary focus:outline-none"
                  aria-label="Urutkan koleksi"
                >
                  <option value="terbaru">Terbaru Ditambahkan</option>
                  <option value="populer">Paling Banyak Dipinjam</option>
                  <option value="rating">Rating Tertinggi</option>
                  <option value="az">Judul (A - Z)</option>
                </select>

                {/* Tombol Toggle Tampilan (Horizontal Card vs Vertikal) */}
                <div className="flex items-center rounded-[8px] border border-input p-0.5 bg-background shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode("horizontal")}
                    className={`h-8 w-8 rounded-[6px] flex items-center justify-center transition-colors ${
                      viewMode === "horizontal"
                        ? "bg-white text-primary shadow-2xs font-bold"
                        : "text-muted-foreground hover:text-heading"
                    }`}
                    aria-label="Tampilan horizontal card"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("vertical")}
                    className={`h-8 w-8 rounded-[6px] flex items-center justify-center transition-colors ${
                      viewMode === "vertical"
                        ? "bg-white text-primary shadow-2xs font-bold"
                        : "text-muted-foreground hover:text-heading"
                    }`}
                    aria-label="Tampilan grid cover vertikal"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* =========================================================================
                4. CATEGORY NAVIGATION CHIPS (Horizontal Scrollable)
               ========================================================================= */}
            <div className="pt-2 border-t border-border flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-[12px] font-bold text-heading shrink-0 flex items-center gap-1.5 mr-1">
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                Kategori:
              </span>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("Semua");
                  setCurrentPage(1);
                }}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold shrink-0 transition-all border ${
                  selectedCategory === "Semua"
                    ? "bg-primary text-white border-primary shadow-2xs"
                    : "bg-background text-foreground border-border hover:bg-primary-soft"
                }`}
              >
                Semua Koleksi ({MOCK_BOOKS.length})
              </button>

              {MOCK_CATEGORIES.filter((c) => c.slug !== "semua").map((cat) => {
                const isSelected = selectedCategory === cat.nama || selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(isSelected ? "Semua" : cat.nama);
                      setCurrentPage(1);
                    }}
                    className={`rounded-full px-3.5 py-1 text-xs font-semibold shrink-0 transition-all border ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-2xs"
                        : "bg-background text-foreground border-border hover:bg-primary-soft"
                    }`}
                  >
                    {cat.nama}
                  </button>
                );
              })}
            </div>
          </div>

          {/* =========================================================================
              5. BOOK LISTING (Responsive Horizontal Cards or Vertical Grid)
             ========================================================================= */}
          {paginatedBooks.length > 0 ? (
            <div className="space-y-6">
              {viewMode === "horizontal" ? (
                // Tampilan Cover-Dominant Cards (5-6 kolom desktop)
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
                  {paginatedBooks.map((book) => (
                    <BookCard key={book.id} book={book} layout="horizontal" className="w-full" />
                  ))}
                </div>
              ) : (
                // Tampilan Grid Vertikal Alternatif (lebih rapat)
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
                  {paginatedBooks.map((book) => (
                    <BookCard key={book.id} book={book} layout="vertical" />
                  ))}
                </div>
              )}

              {/* =========================================================================
                  6. PAGINATION & RESULT SUMMARY
                 ========================================================================= */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-5 text-xs text-muted-foreground">
                <div>
                  Menampilkan{" "}
                  <strong className="text-heading">
                    {Math.min(filteredBooks.length, (currentPage - 1) * itemsPerPage + 1)}
                  </strong>{" "}
                  –{" "}
                  <strong className="text-heading">
                    {Math.min(filteredBooks.length, currentPage * itemsPerPage)}
                  </strong>{" "}
                  dari <strong className="text-heading">{filteredBooks.length}</strong> buku
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-[6px] border border-border bg-white font-medium hover:bg-background disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      Sebelumnya
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`h-8 w-8 rounded-[6px] text-xs font-semibold transition-colors ${
                          currentPage === page
                            ? "bg-primary text-white shadow-2xs"
                            : "border border-border bg-white text-foreground hover:bg-background"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3 py-1.5 rounded-[6px] border border-border bg-white font-medium hover:bg-background disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      Berikutnya
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Empty State yang Menarik & Memandu
            <div className="rounded-[14px] border border-dashed border-border bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Search className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-heading">Buku Tidak Ditemukan</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Tidak ada koleksi buku yang cocok dengan kata kunci &quot;{searchQuery}&quot; atau kombinasi filter saat ini.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Atur Ulang Semua Filter</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-primary">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <CatalogContent />
    </React.Suspense>
  );
}
