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
import { MOCK_CATEGORIES, MOCK_POPULAR_SEARCHES } from "@/mocks";

export function Header() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Semua Kategori");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/katalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
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

          {/* Tengah: Search Component Terintegrasi & Popular Search Chips (Satu Kelompok Visual) */}
          <div className="flex-1 max-w-[620px] hidden md:flex flex-col gap-2">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex h-[44px] w-full items-center rounded-2xl border border-input bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-xs overflow-hidden"
            >
              {/* Bagian 1: Category Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  type="button"
                  className="flex h-full items-center gap-1.5 border-r border-border px-3.5 text-[13px] font-medium text-foreground hover:bg-background focus-visible:outline-none shrink-0 transition-colors"
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul buku, penulis, atau ISBN..."
                  className="w-full bg-transparent px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                  aria-label="Cari buku, penulis, atau ISBN"
                />
              </div>

              {/* Bagian 3: Search Action Button */}
              <button
                type="submit"
                className="flex h-full items-center justify-center bg-primary px-5 text-white hover:bg-primary-hover focus-visible:outline-none transition-colors shrink-0"
                aria-label="Submit pencarian"
              >
                <Search className="h-4 w-4 text-white" />
              </button>
            </form>

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
                className="h-[38px] px-5 rounded-[8px] bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold gap-2 shadow-xs transition-colors"
              >
                <Link href="/masuk">
                  <User className="h-4 w-4 text-white" />
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
