"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { assetUrl } from "@/lib/asset";

interface BookCoverProps {
  src?: string | null;
  judul: string;
  kategoriSlug?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fit?: "contain" | "cover";
}

// Map kategori slug ke default PNG modern (bukan SVG) sesuai inventaris
const CATEGORY_DEFAULT_COVERS: Record<string, string> = {
  "teknologi-sija": "/images/defaults/cover-teknologi.png",
  "pemrograman-web": "/images/defaults/cover-pemrograman.png",
  "jaringan-komputer": "/images/defaults/cover-jaringan.png",
  "keislaman": "/images/defaults/cover-keislaman.png",
  "keislaman-akhlak": "/images/defaults/cover-keislaman.png",
  "sains-matematika": "/images/defaults/cover-sains.png",
  "pengembangan-diri": "/images/defaults/cover-pengembangan.png",
};

export function BookCover({
  src,
  judul,
  kategoriSlug,
  className,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",
  fit = "contain",
}: BookCoverProps) {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Tentukan cover default berdasarkan slug kategori jika ada (format PNG modern)
  const defaultFallback = (kategoriSlug && CATEGORY_DEFAULT_COVERS[kategoriSlug]) || "/images/defaults/cover-umum.png";

  // URL yang akan dimuat: jika src null atau terjadi error, pakai defaultFallback
  const resolvedSrc = hasError || !src ? defaultFallback : (assetUrl(src) || defaultFallback);

  const isDefault = hasError || !src;
  const altText = isDefault ? `Sampul belum tersedia: ${judul}` : `Sampul buku ${judul}`;

  return (
    <div
      className={cn(
        "relative aspect-[2/3] w-full overflow-hidden rounded-md border border-border bg-background shadow-xs transition-shadow duration-200 group-hover:shadow-md",
        className
      )}
    >
      {/* Skeleton Shimmer saat sedang memuat */}
      {isLoading && (
        <div className="absolute inset-0 z-10 animate-pulse bg-muted/80" aria-hidden="true" />
      )}

      <Image
        src={resolvedSrc}
        alt={altText}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          fit === "cover" ? "object-cover" : "object-contain p-0.5",
          "transition-transform duration-300 group-hover:scale-[1.02]",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
