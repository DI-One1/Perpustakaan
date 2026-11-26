"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { assetUrl } from "@/lib/asset";

interface BannerImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  objectPosition?: string;
  children?: React.ReactNode;
}

export function BannerImage({
  src,
  alt,
  className,
  priority = false,
  objectPosition = "center",
  children,
}: BannerImageProps) {
  const [hasError, setHasError] = React.useState(false);
  const defaultFallback = "/images/defaults/banner-umum.svg";
  const resolvedSrc = hasError || !src ? defaultFallback : (assetUrl(src) || defaultFallback);

  return (
    <div
      className={cn(
        "relative aspect-[2/1] w-full overflow-hidden rounded-xl border border-border bg-muted",
        className
      )}
    >
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 66vw"
        className="object-cover"
        style={{ objectPosition }}
        onError={() => setHasError(true)}
      />

      {/* Scrim Overlay untuk memastikan kontras teks >= 4.5:1 saat ada konten teks di atas banner */}
      {children && (
        <div className="absolute inset-0 z-10 flex flex-col justify-between bg-gradient-to-t from-background/90 via-background/40 to-transparent p-6 sm:p-8">
          {children}
        </div>
      )}
    </div>
  );
}
