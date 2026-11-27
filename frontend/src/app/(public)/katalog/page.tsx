"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BookCard } from "@/components/book/book-card";
import { Button } from "@/components/ui/button";
import { MOCK_BOOKS, MOCK_CATEGORIES } from "@/mocks";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  X,
  Search,
  User,
  ArrowRight,
  BookOpen,
} from "lucide-react";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("kategori") || "Semua";
  const authorParam = searchParams.get("penulis") || "";

  // State Filter Pencarian Sesuai Format Gramedia (Gambar 2)
  const [selectedCategory, setSelectedCategory] = React.useState(categoryParam);
  const [selectedBahasa, setSelectedBahasa] = React.useState<"Semua" | "Indonesia" | "Inggris">("Semua");
  const [onlyAvailable, setOnlyAvailable] = React.useState(false);
  const [selectedAuthor, setSelectedAuthor] = React.useState(authorParam);
  const [activeTab, setActiveTab] = React.useState<"buku" | "penulis">("buku");
  const [sortBy, setSortBy] = React.useState<"relevan" | "terbaru" | "populer" | "rating" | "az">("relevan");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;

  // Sinkronisasi state saat searchParams di URL berubah (misal dari autocomplete navbar)
  React.useEffect(() => {
    setSelectedAuthor(authorParam);
    setCurrentPage(1);
  }, [authorParam]);

  React.useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
    }
  }, [categoryParam]);

  // Filter Koleksi Buku Berdasarkan Parameter Aktif
  const filteredBooks = React.useMemo(() => {
    return MOCK_BOOKS.filter((book) => {
      // 1. Filter Kata Kunci (Judul, Penulis, ISBN) dari Search Bar Utama
      if (queryParam.trim()) {
        const q = queryParam.toLowerCase().trim();
        const matchTitle = book.judul.toLowerCase().includes(q);
        const matchAuthor = book.penulis.toLowerCase().includes(q);
        const matchIsbn = book.isbn.toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchIsbn) return false;
      }

      // 2. Filter Penulis Spesifik (jika dipilih)
      if (selectedAuthor.trim()) {
        if (!book.penulis.toLowerCase().includes(selectedAuthor.toLowerCase().trim())) {
          return false;
        }
      }

      // 3. Filter Kategori
      if (selectedCategory && selectedCategory !== "Semua" && selectedCategory !== "Semua Kategori") {
        const catNorm = selectedCategory.toLowerCase();
        const bookCatNorm = book.kategori_nama.toLowerCase();
        const bookSubNorm = (book.subkategori || "").toLowerCase();
        if (!bookCatNorm.includes(catNorm) && !bookSubNorm.includes(catNorm)) {
          return false;
        }
      }

      // 4. Filter Bahasa (Indonesia / Inggris) - Sesuai Poin 3
      if (selectedBahasa !== "Semua") {
        const bookLang = (book.bahasa || "Indonesia").toLowerCase();
        if (bookLang !== selectedBahasa.toLowerCase()) {
          return false;
        }
      }

      // 5. Filter Stok: Hanya yang tersedia - Sesuai Poin 3
      if (onlyAvailable) {
        if (book.eksemplar_tersedia <= 0) return false;
      }

      return true;
    }).sort((a, b) => {
      // 6. Pengurutan (Sorting)
      if (sortBy === "populer") {
        return (b.is_populer ? 1 : 0) - (a.is_populer ? 1 : 0);
      }
      if (sortBy === "az") {
        return a.judul.localeCompare(b.judul);
      }
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "terbaru") {
        return (b.is_baru ? 1 : 0) - (a.is_baru ? 1 : 0);
      }
      // Default: Paling Relevan
      if (queryParam.trim()) {
        const q = queryParam.toLowerCase().trim();
        const aTitleMatch = a.judul.toLowerCase().includes(q) ? 2 : 0;
        const bTitleMatch = b.judul.toLowerCase().includes(q) ? 2 : 0;
        return bTitleMatch - aTitleMatch;
      }
      return 0;
    });
  }, [queryParam, selectedAuthor, selectedCategory, selectedBahasa, onlyAvailable, sortBy]);

  // Penulis yang cocok untuk Tab Penulis
  const matchingAuthors = React.useMemo(() => {
    const map = new Map<string, { nama: string; jumlahBuku: number }>();
    MOCK_BOOKS.forEach((book) => {
      if (!queryParam.trim() || book.penulis.toLowerCase().includes(queryParam.toLowerCase().trim())) {
        const item = map.get(book.penulis);
        if (item) {
          item.jumlahBuku += 1;
        } else {
          map.set(book.penulis, { nama: book.penulis, jumlahBuku: 1 });
        }
      }
    });
    return Array.from(map.values());
  }, [queryParam]);

  // Paginasi
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;
  const paginatedBooks = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage, itemsPerPage]);

  const hasActiveFilters =
    (selectedCategory !== "Semua" && selectedCategory !== "Semua Kategori") ||
    selectedBahasa !== "Semua" ||
    onlyAvailable ||
    Boolean(selectedAuthor);

  const handleResetFilters = () => {
    setSelectedCategory("Semua");
    setSelectedBahasa("Semua");
    setOnlyAvailable(false);
    setSelectedAuthor("");
    setSortBy("relevan");
    setCurrentPage(1);
    if (queryParam || authorParam) {
      router.push("/katalog");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <UtilityBar />
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
            <span className="font-semibold text-heading">Pencarian Koleksi</span>
            {queryParam && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                <span className="text-primary font-medium truncate max-w-[200px]">
                  &quot;{queryParam}&quot;
                </span>
              </>
            )}
          </nav>

          {/* =========================================================================
              2. GRAMEDIA STYLE LAYOUT (Sidebar Filter di Kiri + Hasil di Kanan)
             ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* SIDEBAR FILTER (KOLOM KIRI: md:col-span-4 lg:col-span-3) */}
            <aside className="md:col-span-4 lg:col-span-3 rounded-2xl border border-border bg-white p-5 shadow-xs space-y-6">
              {/* Header Filter & Tombol Reset */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2 font-bold text-heading text-sm">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <span>Filter</span>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Atur Ulang</span>
                  </button>
                )}
              </div>

              {/* 1. Filter Kategori */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-heading uppercase tracking-wider block">
                  Kategori
                </span>
                <div className="space-y-1 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("Semua");
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
                      selectedCategory === "Semua" || selectedCategory === "Semua Kategori"
                        ? "bg-primary-soft text-primary font-bold shadow-2xs"
                        : "text-foreground hover:bg-muted/60"
                    )}
                  >
                    <span>Semua Kategori</span>
                    <span className="text-[11px] text-muted-foreground">{MOCK_BOOKS.length}</span>
                  </button>
                  {MOCK_CATEGORIES.filter((c) => c.slug !== "semua").map((cat) => {
                    const isSelected = selectedCategory === cat.nama || selectedCategory === cat.slug;
                    const count = MOCK_BOOKS.filter(
                      (b) => b.kategori_id === cat.id || b.kategori_nama === cat.nama
                    ).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(isSelected ? "Semua" : cat.nama);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
                          isSelected
                            ? "bg-primary-soft text-primary font-bold shadow-2xs"
                            : "text-foreground hover:bg-muted/60"
                        )}
                      >
                        <span className="truncate">{cat.nama}</span>
                        <span className="text-[11px] text-muted-foreground shrink-0">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Filter Bahasa (Indonesia / Inggris) - Sesuai Poin 3 */}
              <div className="space-y-2.5 pt-3 border-t border-border">
                <span className="text-xs font-bold text-heading uppercase tracking-wider block">
                  Bahasa
                </span>
                <div className="space-y-2 text-xs">
                  {(["Semua", "Indonesia", "Inggris"] as const).map((lang) => (
                    <label
                      key={lang}
                      className="flex items-center gap-2.5 text-foreground hover:text-primary cursor-pointer select-none"
                    >
                      <input
                        type="radio"
                        name="filter-bahasa"
                        checked={selectedBahasa === lang}
                        onChange={() => {
                          setSelectedBahasa(lang);
                          setCurrentPage(1);
                        }}
                        className="h-4 w-4 text-primary border-input focus:ring-primary/20 accent-primary"
                      />
                      <span className={selectedBahasa === lang ? "font-bold text-primary" : "font-medium"}>
                        {lang === "Semua" ? "Semua Bahasa" : lang}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Filter Stok: Toggle "Hanya yang tersedia" (Persis Gambar 2) - Sesuai Poin 3 */}
              <div className="space-y-2.5 pt-3 border-t border-border">
                <span className="text-xs font-bold text-heading uppercase tracking-wider block">
                  Stok & Ketersediaan
                </span>
                <label className="flex items-center justify-between cursor-pointer select-none p-1 rounded-xl hover:bg-muted/40 transition-colors">
                  <span className="text-xs font-medium text-foreground">
                    Hanya yang tersedia
                  </span>
                  <div
                    onClick={() => {
                      setOnlyAvailable(!onlyAvailable);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      onlyAvailable ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                        onlyAvailable ? "translate-x-4" : "translate-x-0"
                      )}
                    />
                  </div>
                </label>
              </div>
            </aside>

            {/* HASIL PENCARIAN (KOLOM KANAN: md:col-span-8 lg:col-span-9) */}
            <div className="md:col-span-8 lg:col-span-9 space-y-5">
              {/* Header Baris Atas: Tabs [Buku (83)] [Penulis (2)] + Dropdown Urutkan (Persis Gambar 2) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                {/* Tabs Gramedia Style */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("buku")}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs",
                      activeTab === "buku"
                        ? "bg-heading text-white"
                        : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    Buku ({filteredBooks.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("penulis")}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs",
                      activeTab === "penulis"
                        ? "bg-heading text-white"
                        : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    Penulis ({matchingAuthors.length})
                  </button>
                </div>

                {/* Dropdown Urutkan */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground shrink-0 hidden sm:inline">Urutkan:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="h-9 rounded-xl border border-input bg-white px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none cursor-pointer"
                    aria-label="Urutkan pencarian"
                  >
                    <option value="relevan">Paling Relevan</option>
                    <option value="terbaru">Terbaru Ditambahkan</option>
                    <option value="populer">Paling Banyak Dipinjam</option>
                    <option value="rating">Rating Tertinggi</option>
                    <option value="az">Judul (A - Z)</option>
                  </select>
                </div>
              </div>

              {/* Ringkasan Hasil & Active Filter Chips (Persis Gambar 2) */}
              <div className="space-y-2.5">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Menampilkan{" "}
                  <strong className="text-heading">
                    {filteredBooks.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
                    {Math.min(filteredBooks.length, currentPage * itemsPerPage)}
                  </strong>{" "}
                  dari <strong className="text-heading">{filteredBooks.length}</strong> hasil pencarian
                  {queryParam && (
                    <>
                      {" "}untuk <strong className="text-primary">&quot;{queryParam}&quot;</strong>
                    </>
                  )}
                  {selectedAuthor && (
                    <>
                      {" "}karya <strong className="text-primary">&quot;{selectedAuthor}&quot;</strong>
                    </>
                  )}
                </p>

                {/* Active Filter Chips with 'x' button (Persis Gambar 2) */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-border bg-white text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors cursor-pointer"
                      title="Hapus semua filter"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    {selectedCategory !== "Semua" && selectedCategory !== "Semua Kategori" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-white text-xs font-medium text-foreground shadow-2xs">
                        <span>{selectedCategory}</span>
                        <X
                          onClick={() => setSelectedCategory("Semua")}
                          className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer"
                        />
                      </span>
                    )}
                    {selectedBahasa !== "Semua" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-white text-xs font-medium text-foreground shadow-2xs">
                        <span>Bahasa: {selectedBahasa}</span>
                        <X
                          onClick={() => setSelectedBahasa("Semua")}
                          className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer"
                        />
                      </span>
                    )}
                    {onlyAvailable && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-white text-xs font-medium text-foreground shadow-2xs">
                        <span>Stok Tersedia</span>
                        <X
                          onClick={() => setOnlyAvailable(false)}
                          className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer"
                        />
                      </span>
                    )}
                    {selectedAuthor && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-white text-xs font-medium text-foreground shadow-2xs">
                        <span>Penulis: {selectedAuthor}</span>
                        <X
                          onClick={() => setSelectedAuthor("")}
                          className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer"
                        />
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Konten Tab Aktif: Tab Buku vs Tab Penulis */}
              {activeTab === "buku" ? (
                // TAB BUKU
                paginatedBooks.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
                      {paginatedBooks.map((book) => (
                        <BookCard key={book.id} book={book} layout="vertical" />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-5 text-xs text-muted-foreground">
                        <div>
                          Halaman <strong className="text-heading">{currentPage}</strong> dari{" "}
                          <strong className="text-heading">{totalPages}</strong>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="px-3.5 py-1.5 rounded-lg border border-border bg-white text-xs font-semibold hover:bg-background hover:border-primary/40 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                          >
                            Sebelumnya
                          </button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              type="button"
                              onClick={() => setCurrentPage(page)}
                              className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                currentPage === page
                                  ? "bg-primary text-white shadow-xs hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_8px_16px_-4px_rgba(19,43,109,0.32)]"
                                  : "border border-border bg-white text-foreground hover:bg-background hover:border-primary/40 hover:-translate-y-0.5"
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                          <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="px-3.5 py-1.5 rounded-lg border border-border bg-white text-xs font-semibold hover:bg-background hover:border-primary/40 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                          >
                            Berikutnya
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Empty State jika tidak ada buku yang cocok
                  <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <Search className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-heading">Buku Tidak Ditemukan</h3>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Tidak ada koleksi buku yang cocok dengan kriteria filter atau kata kunci saat ini.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleResetFilters}
                      className="gap-2 rounded-full"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Atur Ulang Semua Filter</span>
                    </Button>
                  </div>
                )
              ) : (
                // TAB PENULIS (Gramedia Tab "Penulis")
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchingAuthors.length > 0 ? (
                    matchingAuthors.map((author) => (
                      <div
                        key={author.nama}
                        onClick={() => {
                          setSelectedAuthor(author.nama);
                          setActiveTab("buku");
                          setCurrentPage(1);
                        }}
                        className="p-4 rounded-xl border border-border bg-white hover:border-primary/50 hover:bg-primary-soft/40 transition-all duration-200 cursor-pointer shadow-xs flex items-center gap-3.5 group"
                      >
                        <div className="h-12 w-12 rounded-full bg-primary-soft border border-border flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-heading text-sm group-hover:text-primary transition-colors truncate">
                            {author.nama}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {author.jumlahBuku} koleksi buku di perpustakaan
                          </p>
                          <p className="text-[11px] text-primary font-semibold mt-1 flex items-center gap-1">
                            <span>Lihat Koleksi</span>
                            <ArrowRight className="h-3 w-3" />
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
                      Tidak ada data penulis yang cocok dengan pencarian.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function CatalogSearchPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-primary">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <SearchContent />
    </React.Suspense>
  );
}
