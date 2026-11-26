"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { assetUrl } from "@/lib/asset";

interface UserAvatarProps {
  src?: string | null;
  nama: string;
  size?: 32 | 40 | 64 | 96;
  className?: string;
}

export function UserAvatar({
  src,
  nama,
  size = 40,
  className,
}: UserAvatarProps) {
  const [hasError, setHasError] = React.useState(false);
  const defaultFallback = "/images/defaults/avatar.png";
  const resolvedSrc = hasError || !src ? defaultFallback : (assetUrl(src) || defaultFallback);

  const dimensionClasses: Record<number, string> = {
    32: "h-8 w-8",
    40: "h-10 w-10",
    64: "h-16 w-16",
    96: "h-24 w-24",
  };

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full border border-border bg-muted",
        dimensionClasses[size] || "h-10 w-10",
        className
      )}
    >
      <Image
        src={resolvedSrc}
        alt={`Foto profil ${nama}`}
        width={size}
        height={size}
        className="h-full w-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
