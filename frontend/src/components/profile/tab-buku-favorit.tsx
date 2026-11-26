"use client";

import * as React from "react";
import Link from "next/link";
import { BookCover } from "@/components/media/book-cover";
import { Heart, ExternalLink, Trash2 } from "lucide-react";
import type { MockBook } from "@/mocks";

interface TabBukuFavoritProps {
  initialBooks: MockBook[];
}

export function TabBukuFavorit({ initialBooks }: TabBukuFavoritProps) {
  const [favorites, setFavorites] = React.useState<MockBook[]>(initialBooks);
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);
  const toastTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showToast = React.useCallback((msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMsg(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg(null);
      toastTimerRef.current = null;
    }, 3500);
  }, []);

  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleRemove = (bookId: string, judul: string) => {
    setFavorites((prev) => prev.filter((b) => b.id !== bookId));
    showToast(`"${judul}" dihapus dari Buku Favorit.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback (Accessible Live Region) */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-heading px-4 py-3 text-card shadow-lg border border-border/20 text-xs sm:text-sm animate-in fade-in duration-200"
        >
          <Heart className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header (Clean tanpa filler subtitle) */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-heading">
          Buku Favorit
        </h2>
      </div>

      {/* Grid Buku Favorit */}
      {favorites.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-5 shadow-xs">
          <div className="py-16 text-center space-y-2">
            <Heart className="h-10 w-10 text-border mx-auto" />
            <p className="text-sm text-muted-foreground">Belum ada buku yang disimpan ke favorit.</p>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-heading transition-colors mt-2"
            >
              <span>Jelajahi Katalog</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((book) => (
            <div
              key={book.id}
              className="bg-card rounded-xl border border-border p-4 shadow-xs hover:shadow-sm transition-shadow flex gap-4"
            >
              {/* Cover Buku 2:3 */}
              <div className="w-20 sm:w-24 shrink-0 shadow-2xs rounded overflow-hidden">
                <BookCover
                  src={book.cover_url}
                  judul={book.judul}
                  kategoriSlug={book.kategori_nama?.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}
                  fit="contain"
                  className="rounded-xs"
                />
              </div>

              {/* Info & Aksi */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {book.kategori_nama}
                  </span>
                  <h3 className="text-sm font-bold text-heading leading-snug line-clamp-2">
                    {book.judul}
                  </h3>
                  <p className="text-xs text-muted-foreground">{book.penulis}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3">
                  <Link
                    href={`/buku/${book.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Lihat Buku</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(book.id, book.judul)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg border border-border text-muted-foreground text-xs font-semibold hover:text-destructive hover:border-destructive/30 hover:bg-danger-bg transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
