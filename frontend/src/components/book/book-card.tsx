import Link from "next/link";
import { BookCover } from "@/components/media/book-cover";
import { Star } from "lucide-react";
import type { MockBook } from "@/mocks";

interface BookCardProps {
  book: MockBook;
  layout?: "horizontal" | "vertical";
  className?: string;
}

export function BookCard({ book, layout = "horizontal", className = "" }: BookCardProps) {
  const isAvailable = book.eksemplar_tersedia > 0;
  const isBookedOnly = !isAvailable && book.eksemplar_dibooking > 0;

  // Format Status Ketersediaan
  const statusColor = isAvailable
    ? "bg-emerald-500"
    : isBookedOnly
    ? "bg-amber-500"
    : "bg-red-500";

  const statusText = isAvailable
    ? "Tersedia"
    : isBookedOnly
    ? `Dibooking (${book.eksemplar_dibooking})`
    : "Antre";

  if (layout === "horizontal") {
    return (
      <Link
        href={`/buku/${book.id}`}
        className={`group relative flex w-[249px] h-[193px] shrink-0 items-center rounded-[10px] border border-border bg-card p-3.5 shadow-xs transition-all duration-200 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      >
        {/* SISI KIRI: Cover Buku Fisik (Proporsi 2:3 Presisi ~86px x ~129px, object-fit contain, tidak terpotong) */}
        <div className="relative w-[86px] h-[129px] shrink-0 rounded-[6px] overflow-hidden border border-border bg-background shadow-2xs">
          <BookCover
            src={book.cover_path || book.cover_url}
            judul={book.judul}
            kategoriSlug={book.kategori_id.replace("cat-", "")}
            fit="contain"
            className="h-full w-full rounded-[5px] border-none shadow-none"
          />
        </div>

        {/* SISI KANAN: Informasi Buku Lengkap (Tinggi 129px seimbang dengan cover) */}
        <div className="ml-3.5 flex flex-1 flex-col justify-between h-[129px] min-w-0">
          <div>
            {/* 1. Judul Buku (Dominan, Semibold/Bold, Maks 2 baris, Navy) */}
            <h3 className="line-clamp-2 text-[13px] font-bold text-heading leading-[1.3] group-hover:text-primary transition-colors">
              {book.judul}
            </h3>

            {/* 2. Nama Penulis (Secondary Text, Lebih kecil) */}
            <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground leading-tight">
              {book.penulis}
            </p>

            {/* 3. Kategori (Chip Pale Blue, Teks Primary Blue) */}
            <div className="mt-2">
              <span className="inline-block rounded-[5px] bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary truncate max-w-full">
                {book.kategori_nama}
              </span>
            </div>
          </div>

          {/* 4. Ketersediaan & Rating Aktual */}
          <div className="pt-1.5 flex items-center justify-between border-t border-border/80">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
              <span className={`h-2 w-2 rounded-full ${statusColor} shrink-0`} />
              <span>{statusText}</span>
            </div>

            {/* Rating Bintang (Hanya tampil jika ada data rating aktual) */}
            {typeof book.rating === "number" && book.rating > 0 && (
              <div className="flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                <span>{book.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Layout Vertikal Standar (Fallback untuk Grid Katalog jika dibutuhkan)
  return (
    <article className={`group relative flex flex-col rounded-[10px] border border-border bg-card p-3 shadow-xs transition-all duration-200 hover:border-primary/50 hover:shadow-md ${className}`}>
      <Link
        href={`/buku/${book.id}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
        tabIndex={-1}
        aria-hidden="true"
      >
        <BookCover
          src={book.cover_path || book.cover_url}
          judul={book.judul}
          kategoriSlug={book.kategori_id.replace("cat-", "")}
          fit="contain"
          className="w-full aspect-[2/3] rounded-md border border-border bg-background"
        />
      </Link>

      <div className="mt-2.5 flex flex-1 flex-col justify-between">
        <div>
          <span className="inline-block rounded-[5px] bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary mb-1.5">
            {book.kategori_nama}
          </span>

          <h3 className="line-clamp-2 text-sm font-bold text-heading leading-snug group-hover:text-primary transition-colors">
            <Link
              href={`/buku/${book.id}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
            >
              {book.judul}
            </Link>
          </h3>

          <p className="mt-1 line-clamp-1 text-[12px] text-muted-foreground">
            {book.penulis}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-[12px]">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <span className={`h-2 w-2 rounded-full ${statusColor}`} />
            <span>{statusText}</span>
          </div>

          {typeof book.rating === "number" && book.rating > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
