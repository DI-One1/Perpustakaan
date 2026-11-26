"use client";

import * as React from "react";
import { UserAvatar } from "@/components/media/user-avatar";

interface ProfileBannerProps {
  nama: string;
  identitas: string;
  kelas: string;
  fotoUrl?: string | null;
}

export function ProfileBanner({
  nama,
  identitas,
  kelas,
  fotoUrl,
}: ProfileBannerProps) {
  return (
    <section
      aria-label="Informasi Banner Profil"
      className="relative overflow-hidden rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs"
    >
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Foto Profil Berbentuk Lingkaran */}
        <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary-soft bg-background shadow-xs">
          <UserAvatar
            src={fotoUrl || "/images/avatars/.png"}
            nama={nama}
            size={64}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Informasi Ringkas: Nama, Kelas, NIS */}
        <div className="min-w-0 flex-1 space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-heading truncate">
            {nama}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-primary">
            {kelas}
          </p>
          <p className="text-xs sm:text-sm font-mono text-muted-foreground">
            {identitas}
          </p>
        </div>
      </div>
    </section>
  );
}
