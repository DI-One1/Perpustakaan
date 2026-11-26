"use client";

import * as React from "react";
import { ShieldAlert, CheckCircle2, Calendar, AlertTriangle } from "lucide-react";

interface TabDaftarBlokirProps {
  isBlocked: boolean;
}

export function TabDaftarBlokir({ isBlocked }: TabDaftarBlokirProps) {
  return (
    <div className="space-y-6">
      {/* Header (Clean tanpa filler subtitle) */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-heading">
          Daftar Blokir
        </h2>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 sm:p-6 shadow-xs">
        {!isBlocked ? (
          /* Tidak Ada Catatan Pemblokiran */
          <div className="py-16 text-center space-y-3">
            <div className="mx-auto h-14 w-14 rounded-full bg-success-bg flex items-center justify-center border border-emerald-300">
              <CheckCircle2 className="h-7 w-7 text-success-fg" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-heading">
                Tidak ada catatan pemblokiran.
              </p>
              <p className="text-xs text-muted-foreground">
                Akun Anda dalam kondisi aktif tanpa pembatasan sirkulasi.
              </p>
            </div>
          </div>
        ) : (
          /* Ada Catatan Pembatasan Aktif */
          <div className="space-y-5">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-danger-bg border border-red-300">
              <div className="shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-destructive border border-red-300">
                    <ShieldAlert className="h-3 w-3" />
                    <span>Pembatasan Aktif</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-destructive">
                  Akun Anda sedang dalam status pembatasan sementara.
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-destructive">Alasan</span>
                    <p className="text-foreground">
                      Keterlambatan pengembalian buku melebihi batas toleransi.
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-semibold text-destructive">Tanggal Mulai</span>
                    <p className="text-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>18 Nov 2026</span>
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-semibold text-destructive">Tanggal Berakhir</span>
                    <p className="text-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>25 Nov 2026</span>
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-semibold text-destructive">Keterangan Administrator</span>
                    <p className="text-foreground">
                      Silakan selesaikan pengembalian dan denda di Meja Sirkulasi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Data ini dikelola oleh administrator perpustakaan. Hubungi petugas di Meja Sirkulasi untuk bantuan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
