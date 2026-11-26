"use client";

import * as React from "react";
import Link from "next/link";
import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BookCover } from "@/components/media/book-cover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MOCK_USER_QUEUES, type MockQueueItem } from "@/mocks";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  Copy,
  Check,
  XCircle,
  Users,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

/**
 * Komponen Countdown Aktual Real-Time
 * Format resmi: "Batas Pengambilan: HH:MM:SS"
 */
function CountdownDisplay({ targetIso }: { targetIso?: string }) {
  const calculateRemaining = React.useCallback((): {
    formatted: string;
    isExpired: boolean;
    urgency: "normal" | "warning" | "critical";
  } => {
    if (!targetIso) {
      return { formatted: "23:59:12", isExpired: false, urgency: "normal" };
    }

    const targetTime = new Date(targetIso).getTime();
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      return { formatted: "00:00:00", isExpired: true, urgency: "critical" };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    let urgency: "normal" | "warning" | "critical" = "normal";
    if (hours < 1) {
      urgency = "critical";
    } else if (hours < 4) {
      urgency = "warning";
    }

    return { formatted, isExpired: false, urgency };
  }, [targetIso]);

  const [timeLeft, setTimeLeft] = React.useState(calculateRemaining);
  const isClient = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateRemaining]);

  const urgencyColor =
    timeLeft.urgency === "critical"
      ? "text-destructive font-bold"
      : timeLeft.urgency === "warning"
      ? "text-amber-600 font-bold"
      : "text-heading font-semibold";

  return (
    <div className="flex items-center gap-1.5 text-xs sm:text-sm">
      <span className="text-muted-foreground font-medium">Batas Pengambilan:</span>
      <span className={cn("font-mono tracking-tight", urgencyColor)}>
        {isClient ? timeLeft.formatted : "23:59:12"}
      </span>
    </div>
  );
}

export default function AntreanPage() {
  const [queues, setQueues] = React.useState<MockQueueItem[]>(MOCK_USER_QUEUES);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = React.useState<MockQueueItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

  // Filter Pengajuan Peminjaman (Booking) dan Antrean
  const loanRequests = queues.filter((q) => q.jenis === "booking");
  const waitingQueues = queues.filter(
    (q) => q.jenis === "antrean" && q.status === "menunggu_antrean"
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleConfirmCancel = () => {
    if (cancelTarget) {
      const isBooking = cancelTarget.jenis === "booking";
      setQueues((prev) => prev.filter((q) => q.id !== cancelTarget.id));
      setCancelTarget(null);
      setFeedbackMessage(
        isBooking
          ? "Pengajuan peminjaman berhasil dibatalkan."
          : "Antrean buku berhasil dibatalkan."
      );
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <UtilityBar />
      <Header />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-auto w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)] space-y-6">
          {/* Breadcrumb Navigasi */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors font-medium">
              Beranda
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span className="font-semibold text-heading">Antrean & Pengajuan Peminjaman Saya</span>
          </nav>

          {/* Feedback Notifikasi */}
          {feedbackMessage && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-2 rounded-lg bg-card border border-emerald-300 p-3 text-xs sm:text-sm text-emerald-800 shadow-xs"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* SEKSI 1: PENGAJUAN PEMINJAMAN */}
          <section className="space-y-4" aria-labelledby="pengajuan-heading">
            <div className="flex items-center justify-between">
              <h2 id="pengajuan-heading" className="text-lg font-bold text-heading flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-primary" />
                <span>Pengajuan Peminjaman</span>
              </h2>
            </div>

            {loanRequests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-xs text-muted-foreground">
                Tidak ada pengajuan peminjaman aktif saat ini.
              </div>
            ) : (
              loanRequests.map((item) => {
                const isReady = item.status === "siap_diambil";
                const isRejected = item.status === "ditolak";

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4"
                  >
                    {/* Header Bar Kartu Pengajuan: Status & Batas Waktu Countdown */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3.5">
                      <div className="flex items-center gap-2">
                        {isReady && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Siap Dipinjam</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full border border-destructive/20">
                            <XCircle className="h-3.5 w-3.5 text-destructive" />
                            <span>Ditolak</span>
                          </span>
                        )}
                      </div>

                      {/* Countdown Batas Pengambilan (Hanya untuk yang Siap Dipinjam) */}
                      {isReady && <CountdownDisplay targetIso={item.batas_ambil_iso} />}
                    </div>

                    {/* Konten Utama: Cover, Detail Buku, Referensi & Aksi */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      {/* Sisi Kiri: Cover & Metadata Buku */}
                      <div className="flex flex-col sm:flex-row gap-4 items-start flex-1 min-w-0">
                        <div className="w-[100px] sm:w-[110px] shrink-0">
                          <BookCover
                            src={item.cover_url}
                            judul={item.judul_buku}
                            kategoriSlug="sastra-bahasa"
                            className="rounded-md shadow-2xs"
                          />
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <Badge
                            variant="outline"
                            className="text-xs border-border bg-muted/60 text-primary font-semibold"
                          >
                            {item.kategori}
                          </Badge>
                          <h3 className="text-lg sm:text-xl font-bold text-heading leading-tight line-clamp-2">
                            {item.judul_buku}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Penulis: {item.penulis_buku}
                          </p>

                          <div className="pt-2 text-xs text-muted-foreground space-y-1">
                            <div>
                              Label Barcode Eksemplar:{" "}
                              <span className="font-mono font-bold text-primary">
                                {item.nomor_induk_eksemplar || "-"}
                              </span>
                            </div>
                            <div>
                              Diajukan:{" "}
                              <span className="text-foreground font-medium">
                                {item.waktu_pengajuan}
                              </span>
                            </div>

                            {/* Alasan Penolakan Ringkas (Bila Ditolak) */}
                            {isRejected && item.alasan_penolakan && (
                              <div className="flex items-start gap-1.5 text-xs text-destructive bg-destructive/5 border border-destructive/15 rounded-md px-3 py-1.5 mt-2">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-destructive" />
                                <div>
                                  <span className="font-semibold">Alasan Penolakan: </span>
                                  <span>{item.alasan_penolakan}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Sisi Kanan: Nomor Referensi & Tombol Pembatalan */}
                      <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between md:justify-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-border">
                        {/* Nomor Referensi Pengajuan */}
                        {item.kode_booking && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span>No. Referensi:</span>
                            <span className="font-mono font-bold text-heading bg-muted/60 px-2 py-0.5 rounded border border-border">
                              {item.kode_booking}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-heading"
                              onClick={() => handleCopyCode(item.kode_booking!)}
                              aria-label="Salin Nomor Referensi"
                            >
                              {copiedCode === item.kode_booking ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        )}

                        {/* Tombol Aksi Pembatalan */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCancelTarget(item)}
                          className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-border min-h-[38px] w-full sm:w-auto"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1.5 text-destructive" />
                          <span>Batalkan Pengajuan Peminjaman</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </section>

          {/* SEKSI 2: ANTREAN MENUNGGU BUKU */}
          <section className="space-y-4 pt-4" aria-labelledby="antrean-heading">
            <div className="flex items-center justify-between">
              <h2 id="antrean-heading" className="text-lg font-bold text-heading flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Antrean Menunggu Buku</span>
                {waitingQueues.length > 0 && (
                  <span className="text-xs font-semibold text-muted-foreground">
                    ({waitingQueues.length})
                  </span>
                )}
              </h2>
            </div>

            {waitingQueues.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-xs text-muted-foreground">
                Anda tidak sedang dalam antrean buku mana pun.
              </div>
            ) : (
              waitingQueues.map((queue) => (
                <div
                  key={queue.id}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-[60px] shrink-0">
                      <BookCover
                        src={queue.cover_url}
                        judul={queue.judul_buku}
                        kategoriSlug="sastra-bahasa"
                        className="rounded-md"
                      />
                    </div>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-[11px] border-border bg-muted/60 text-primary">
                        {queue.kategori}
                      </Badge>
                      <h3 className="text-sm sm:text-base font-bold text-heading">{queue.judul_buku}</h3>
                      <p className="text-xs text-muted-foreground">{queue.penulis_buku}</p>
                    </div>
                  </div>

                  {/* Status Posisi Antrean */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-left sm:text-right text-xs">
                      <div className="font-semibold text-heading">
                        Posisi Antrean:{" "}
                        <span className="text-primary font-bold">
                          #{queue.nomor_antrean} dari {queue.total_antrean}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-[11px] mt-0.5">
                        Diajukan: {queue.waktu_pengajuan}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCancelTarget(queue)}
                      className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-border min-h-[36px]"
                    >
                      Batalkan Antrean
                    </Button>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </main>

      {/* Dialog Konfirmasi Pembatalan Minimalis */}
      <Dialog open={Boolean(cancelTarget)} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-heading font-bold text-base sm:text-lg">
              {cancelTarget?.jenis === "booking" ? "Batalkan Pengajuan?" : "Batalkan Antrean?"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground pt-1">
              {cancelTarget?.jenis === "booking"
                ? "Apakah Anda yakin ingin membatalkan pengajuan peminjaman ini?"
                : "Apakah Anda yakin ingin membatalkan antrean buku ini?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelTarget(null)}
              className="border-border text-xs sm:text-sm font-medium"
            >
              Kembali
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmCancel}
              className="bg-destructive hover:bg-destructive-hover text-white text-xs sm:text-sm font-medium"
            >
              Ya, Batalkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
      <MobileNav />
    </div>
  );
}
