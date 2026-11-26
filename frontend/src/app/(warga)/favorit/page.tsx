"use client";

import * as React from "react";
import Link from "next/link";
import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BookCard } from "@/components/book/book-card";
import { Button } from "@/components/ui/button";
import { MOCK_BOOKS, type MockBook } from "@/mocks";
import { Bookmark, ArrowRight, HeartCrack } from "lucide-react";

export default function FavoritPage() {
  // Ambil buku favorit (mock: buku populer & pilihan pekan sebagai contoh)
  const [favoriteBooks, setFavoriteBooks] = React.useState<MockBook[]>(
    MOCK_BOOKS.filter((b) => b.is_populer || b.is_pilihan_pekan).slice(0, 4)
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <UtilityBar />
      <Header />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-auto w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)] space-y-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Buku Favorit</span>
          </nav>

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <Bookmark className="h-6 w-6 text-primary" />
                <span>Koleksi Favorit Saya</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Daftar buku yang Anda simpan untuk dibaca atau dipinjam di masa mendatang.
              </p>
            </div>

            <span className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-md border border-border">
              {favoriteBooks.length} Buku Tersimpan
            </span>
          </div>

          {/* Grid Buku Favorit */}
          {favoriteBooks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <HeartCrack className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Belum Ada Buku Favorit</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Temukan buku yang menarik di katalog dan tekan tombol &quot;Simpan ke Favorit&quot; untuk menyimpannya di sini.
              </p>
              <Button asChild className="text-xs font-semibold gap-1.5">
                <Link href="/katalog">
                  <span>Jelajahi Katalog Buku</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
              {favoriteBooks.map((book) => (
                <div key={book.id} className="relative group">
                  <BookCard book={book} />
                  <button
                    onClick={() => setFavoriteBooks((prev) => prev.filter((b) => b.id !== book.id))}
                    className="absolute top-2 right-2 bg-background/90 backdrop-blur-xs text-muted-foreground hover:text-red-500 hover:bg-card border border-border p-1.5 rounded-full shadow-xs transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Hapus ${book.judul} dari favorit`}
                  >
                    <Bookmark className="h-3.5 w-3.5 fill-primary text-primary" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
