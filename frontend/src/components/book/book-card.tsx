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

  const statusColor = isAvailable
    ? "bg-emerald-500"
    : isBookedOnly
    ? "bg-amber-500"
    : "bg-red-500";

  const statusText = isAvailable
    ? "Tersedia"
    : isBookedOnly
    ? `Direservasi (${book.eksemplar_dibooking})`
    : "Antre";

  // Both layouts now use the same cover-dominant vertical design.
  // "horizontal" = compact card for carousel rows (fixed width)
  // "vertical"   = fluid card for catalog grid (fills container)
  const isCompact = layout === "horizontal";

  return (
    <Link
      href={`/buku/${book.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isCompact ? "w-[172px] shrink-0" : "w-full"} ${className}`}
    >
      {/* Cover Area: borderless, fills card width */}
      <div className="relative w-full bg-muted/30">
        <BookCover
          src={book.cover_path || book.cover_url}
          judul={book.judul}
          kategoriSlug={book.kategori_id.replace("cat-", "")}
          fit="cover"
          borderless
          className="w-full aspect-[2/3] rounded-none border-none shadow-none"
        />
      </div>

      {/* Info Area: compact metadata below the cover */}
      <div className={`flex flex-1 flex-col justify-between gap-1.5 ${isCompact ? "px-3 py-2.5" : "px-3.5 py-3"}`}>
        <div className="space-y-1">
          {/* Title */}
          <h3 className={`line-clamp-2 font-bold text-heading leading-snug group-hover:text-primary transition-colors ${isCompact ? "text-[12.5px]" : "text-[13px]"}`}>
            {book.judul}
          </h3>

          {/* Author */}
          <p className="line-clamp-1 text-[11px] text-muted-foreground leading-tight">
            {book.penulis}
          </p>

          {/* Category chip */}
          <span className="inline-block rounded-[5px] bg-primary-soft px-1.5 py-px text-[10px] font-semibold text-primary truncate max-w-full">
            {book.kategori_nama}
          </span>
        </div>

        {/* Status & Rating row */}
        <div className="flex items-center justify-between pt-1.5 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-[10.5px] font-medium text-foreground">
            <span className={`h-[7px] w-[7px] rounded-full ${statusColor} shrink-0`} />
            <span>{statusText}</span>
          </div>

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
