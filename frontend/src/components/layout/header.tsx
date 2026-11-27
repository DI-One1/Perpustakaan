"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ReservationPopover } from "@/components/layout/reservation-popover";
import { UserNav } from "@/components/layout/user-nav";
import { useAuth } from "@/lib/auth-context";
import { MOCK_CATEGORIES, MOCK_POPULAR_SEARCHES, MOCK_BOOKS } from "@/mocks";

export function Header() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Semua Kategori");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = React.useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  const queryClean = searchQuery.trim().toLowerCase();

  // 1. Rekomendasi kata kunci & judul buku dinamis
  const keywordSuggestions = React.useMemo(() => {
    if (!queryClean) return [];
    const list: string[] = [];

    // Tambahkan query teks yang sedang diketik pengguna
    list.push(searchQuery.trim());

    // Cari judul buku yang cocok
    MOCK_BOOKS.forEach((book) => {
      if (
        book.judul.toLowerCase().includes(queryClean) ||
        book.penulis.toLowerCase().includes(queryClean)
      ) {
        if (!list.some((item) => item.toLowerCase() === book.judul.toLowerCase())) {
          list.push(book.judul);
        }
      }
    });

    return list.slice(0, 5);
  }, [queryClean, searchQuery]);

  // 2. Rekomendasi nama penulis yang relevan dari data buku (Gambar 4 & 5)
  const authorSuggestions = React.useMemo(() => {
    if (!queryClean) return [];
    const map = new Map<string, { nama: string; jumlahBuku: number }>();

    MOCK_BOOKS.forEach((book) => {
      if (book.penulis.toLowerCase().includes(queryClean)) {
        const item = map.get(book.penulis);
        if (item) {
          item.jumlahBuku += 1;
        } else {
          map.set(book.penulis, { nama: book.penulis, jumlahBuku: 1 });
        }
      }
    });

    return Array.from(map.values()).slice(0, 3);
  }, [queryClean]);

  // Tutup dropdown autocomplete saat klik di luar
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuggestionsOpen(false);
    if (searchQuery.trim()) {
      const catParam =
        selectedCategory !== "Semua Kategori"
          ? `&kategori=${encodeURIComponent(selectedCategory)}`
          : "";
      router.push(`/katalog?q=${encodeURIComponent(searchQuery.trim())}${catParam}`);
    } else if (selectedCategory !== "Semua Kategori") {
      router.push(`/katalog?kategori=${encodeURIComponent(selectedCategory)}`);
    } else {
      router.push("/katalog");
    }
  };

  const handleSelectKeyword = (term: string) => {
    setSearchQuery(term);
    setIsSuggestionsOpen(false);
    router.push(`/katalog?q=${encodeURIComponent(term)}`);
  };

  const handleSelectAuthor = (authorName: string) => {
    setSearchQuery(authorName);
    setIsSuggestionsOpen(false);
    router.push(`/katalog?q=${encodeURIComponent(authorName)}&penulis=${encodeURIComponent(authorName)}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white">
      {/* Container Lebar 1280px */}
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)]">
        {/* Baris Utama Header: Logo, Search + Popular Chips Terpadu, Masuk/Profil */}
        <div className="flex items-center justify-between gap-4 sm:gap-8 py-3.5 sm:py-4">
          {/* Sisi Kiri: Logo + BILIK */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md py-1"
          >
            <div className="relative h-11 w-11 overflow-hidden rounded-md flex items-center justify-center shrink-0">
              <Image
                src="/BILIK.png"
                alt="Logo BILIK"
                width={44}
                height={44}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[22px] font-bold tracking-tight text-heading leading-none">
                BILIK
              </span>
              <span className="text-[12px] font-medium text-muted-foreground leading-tight mt-0.5">
                Perpustakaan Digital
              </span>
            </div>
          </Link>

          {/* Tengah: Search Component Terintegrasi & Popular Search Chips & Dynamic Autocomplete Suggestion */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-[620px] hidden md:flex flex-col gap-2">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex h-[44px] w-full items-center rounded-2xl border border-input bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-xs"
            >
              {/* Bagian 1: Category Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  type="button"
                  className="flex h-full items-center gap-1.5 border-r border-border px-3.5 text-[13px] font-medium text-foreground hover:bg-background focus-visible:outline-none shrink-0 transition-colors rounded-l-2xl"
                >
                  <span className="max-w-[130px] truncate">{selectedCategory}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-card border-border shadow-lg">
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory("Semua Kategori")}
                    className={selectedCategory === "Semua Kategori" ? "font-semibold text-primary" : ""}
                  >
                    Semua Kategori
                  </DropdownMenuItem>
                  {MOCK_CATEGORIES.map((cat) => (
                    <DropdownMenuItem
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.nama)}
                      className={selectedCategory === cat.nama ? "font-semibold text-primary" : ""}
                    >
                      {cat.nama}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Bagian 2: Search Input */}
              <div className="relative flex-1 flex items-center h-full">
                <input
                  id="desktop-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSuggestionsOpen(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) {
                      setIsSuggestionsOpen(true);
                    }
                  }}
                  placeholder="Cari judul buku, penulis, atau ISBN..."
                  className="w-full bg-transparent px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                  aria-label="Cari buku, penulis, atau ISBN"
                  autoComplete="off"
                />
              </div>

              {/* Bagian 3: Search Action Button */}
              <button
                type="submit"
                className="flex h-full items-center justify-center bg-primary px-5 text-white hover:bg-primary-hover focus-visible:outline-none transition-colors shrink-0 rounded-r-2xl"
                aria-label="Submit pencarian"
              >
                <Search className="h-4 w-4 text-white" />
              </button>
            </form>

            {/* Floating Search Autocomplete Dropdown (Persis Gambar 4 & 5) */}
            {isSuggestionsOpen && queryClean.length >= 1 && (keywordSuggestions.length > 0 || authorSuggestions.length > 0) && (
              <div className="absolute top-[48px] left-0 right-0 z-50 rounded-2xl border border-border bg-white shadow-xl overflow-hidden p-3 space-y-3 animate-in fade-in-50 duration-150">
                {/* 1. Rekomendasi Kata Kunci & Judul */}
                {keywordSuggestions.length > 0 && (
                  <div className="space-y-0.5">
                    {keywordSuggestions.map((term, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectKeyword(term)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors cursor-pointer group"
                      >
                        <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                        <span className="truncate">{term}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 2. Rekomendasi Penulis (Section Penulis Sesuai Gambar 4 & 5) */}
                {authorSuggestions.length > 0 && (
                  <div className="pt-2 border-t border-border/70 space-y-1.5">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2 block">
                      Penulis
                    </span>
                    <div className="space-y-1">
                      {authorSuggestions.map((author) => (
                        <button
                          key={author.nama}
                          type="button"
                          onClick={() => handleSelectAuthor(author.nama)}
                          className="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-primary-soft transition-colors cursor-pointer group"
                        >
                          <div className="relative h-9 w-9 rounded-full bg-primary-soft border border-border flex items-center justify-center text-primary font-bold text-xs shrink-0 overflow-hidden">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-heading group-hover:text-primary transition-colors truncate">
                              {author.nama}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {author.jumlahBuku} koleksi buku di perpustakaan
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Popular Search Chips (Tepat di bawah search bar, sejajar sisi kiri search bar) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {MOCK_POPULAR_SEARCHES.slice(0, 5).map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchQuery(term);
                    router.push(`/katalog?q=${encodeURIComponent(term)}`);
                  }}
                  className="rounded-full bg-primary-soft border border-sky-blue px-3 py-0.5 text-[12px] font-medium text-primary-soft-foreground hover:bg-pale-blue hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shrink-0"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Sisi Kanan: Masuk / Akun Pengguna */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!isLoading && user ? (
              // Status: SUDAH LOGIN (Reservasi Popover + User Nav)
              <>
                <ReservationPopover userReservation={user.reservasi_aktif} />
                <UserNav user={user} />
              </>
            ) : (
              // Status: BELUM LOGIN (Tombol Masuk Biru Royal Sesuai Screenshot)
              <Button
                asChild
                className="h-[40px] px-5 gap-2"
              >
                <Link href="/masuk">
                  <User className="h-4 w-4" />
                  <span>Masuk</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Kolom Cari Ponsel (< 768px) */}
      <div className="border-t border-border p-3 md:hidden bg-card space-y-2">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            id="mobile-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul buku, penulis, atau ISBN..."
            className="w-full rounded-2xl border border-input bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Cari judul buku, penulis, atau ISBN pada perangkat ponsel"
          />
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        </form>

        {/* Popular Search Chips di Ponsel */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {MOCK_POPULAR_SEARCHES.slice(0, 5).map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setSearchQuery(term);
                router.push(`/katalog?q=${encodeURIComponent(term)}`);
              }}
              className="rounded-full bg-primary-soft border border-sky-blue px-3 py-0.5 text-[11px] font-medium text-primary-soft-foreground hover:bg-pale-blue hover:text-primary transition-colors focus-visible:outline-none shrink-0"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
