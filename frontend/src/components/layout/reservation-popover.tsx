"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, Clock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_LOGGED_IN_USER, type MockUserActiveReservation } from "@/mocks";

interface ReservationPopoverProps {
  userReservation?: MockUserActiveReservation | null;
}

export function ReservationPopover({
  userReservation = MOCK_LOGGED_IN_USER.reservasi_aktif,
}: ReservationPopoverProps) {
  const hasItem = Boolean(userReservation);
  const count = hasItem ? 1 : 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Antrean & Booking (${count} item)`}
        >
          <Bookmark className="h-5 w-5 text-primary" />
          <span
            className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white transition-transform ${
              count > 0 ? "bg-primary scale-100" : "bg-muted-foreground/60 scale-90"
            }`}
          >
            {count}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[340px] sm:w-[380px] p-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-sm text-foreground">
              Antrean & Booking Saya
            </h4>
          </div>
          <span className="text-xs text-muted-foreground">Maks 1 Buku</span>
        </div>

        {hasItem && userReservation ? (
          <div className="mt-3 space-y-3">
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-left">
              <div className="flex items-start justify-between gap-2">
                <Badge
                  variant={
                    userReservation.status === "siap_diambil"
                      ? "tersedia"
                      : "perhatian"
                  }
                  className="mb-1"
                >
                  {userReservation.status === "siap_diambil" ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Siap Diambil di Meja
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3" />
                      Antrean #{userReservation.posisi_antrean}
                    </>
                  )}
                </Badge>
              </div>

              <h5 className="font-semibold text-sm text-foreground line-clamp-2">
                {userReservation.buku_judul}
              </h5>
              <p className="text-xs text-muted-foreground mt-0.5">
                {userReservation.buku_penulis}
              </p>

              {userReservation.status === "siap_diambil" && (
                <div className="mt-2 space-y-1 rounded border border-border/80 bg-card p-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kode Booking:</span>
                    <span className="font-mono font-semibold text-primary">
                      {userReservation.kode_booking}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Eksemplar:</span>
                    <span className="font-mono text-foreground">
                      {userReservation.nomor_induk_eksemplar}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-border/50 text-warning-fg font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Batas Ambil:
                    </span>
                    <span>{userReservation.sisa_waktu_teks}</span>
                  </div>
                </div>
              )}

              {userReservation.status === "antre" && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5 text-warning-fg" />
                  <span>
                    Otomatis menjadi pengajuan peminjaman ketika buku fisik dikembalikan.
                  </span>
                </div>
              )}
            </div>

            <Button asChild variant="outline" size="sm" className="w-full text-xs">
              <Link href="/antrean" className="flex items-center justify-center gap-1.5">
                <span>Lihat Detail Pengajuan & Antrean</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Bookmark className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Tidak Ada Pengajuan Aktif
            </p>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
              Sesuai aturan sirkulasi, Anda dapat mengajukan peminjaman atau
              antre maksimal 1 buku pada satu waktu.
            </p>
            <Button asChild variant="soft" size="sm" className="mt-4 text-xs">
              <Link href="/katalog">Jelajahi Katalog Buku</Link>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
