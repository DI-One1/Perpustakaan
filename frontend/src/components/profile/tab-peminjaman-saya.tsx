"use client";

import * as React from "react";
import { BookCover } from "@/components/media/book-cover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";
import type { MockLoanItem, MockQueueItem } from "@/mocks";

interface TabPeminjamanSayaProps {
  initialLoans: MockLoanItem[];
  initialQueues: MockQueueItem[];
}

export function TabPeminjamanSaya({
  initialLoans,
  initialQueues,
}: TabPeminjamanSayaProps) {
  const [subTab, setSubTab] = React.useState<"aktif" | "riwayat" | "pengajuan">("aktif");

  // Loans & queues state
  const [loans, setLoans] = React.useState<MockLoanItem[]>(initialLoans);
  const [queues, setQueues] = React.useState<MockQueueItem[]>(initialQueues);

  // Perpanjangan Modal State & Native Dialog Ref
  const [extendTarget, setExtendTarget] = React.useState<MockLoanItem | null>(null);
  const [extendReason, setExtendReason] = React.useState("");
  const extendDialogRef = React.useRef<HTMLDialogElement | null>(null);
  const lastExtendTriggerRef = React.useRef<HTMLButtonElement | null>(null);

  // Pembatalan Booking State & Native Dialog Ref
  const [cancelBookingTarget, setCancelBookingTarget] = React.useState<MockQueueItem | null>(null);
  const cancelBookingDialogRef = React.useRef<HTMLDialogElement | null>(null);
  const lastCancelTriggerRef = React.useRef<HTMLButtonElement | null>(null);

  // Toast State with Timer Cleanup
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const toastTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showToast = React.useCallback((msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
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

  const activeLoans = loans.filter((l) => l.status === "aktif" || l.status === "perpanjangan_diajukan");
  const historyLoans = loans.filter((l) => l.status === "kembali");

  // Buka dialog perpanjangan
  const openExtendDialog = (loan: MockLoanItem, e: React.MouseEvent<HTMLButtonElement>) => {
    lastExtendTriggerRef.current = e.currentTarget;
    setExtendTarget(loan);
    setExtendReason("");
    extendDialogRef.current?.showModal();
  };

  const closeExtendDialog = () => {
    extendDialogRef.current?.close();
    setExtendTarget(null);
    setExtendReason("");
    lastExtendTriggerRef.current?.focus();
  };

  // Submit perpanjangan
  const handleConfirmExtend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendTarget) return;

    setLoans((prev) =>
      prev.map((l) =>
        l.id === extendTarget.id
          ? {
              ...l,
              status: "perpanjangan_diajukan",
              bisa_diperpanjang: false,
              alasan_perpanjangan: extendReason,
            }
          : l
      )
    );

    closeExtendDialog();
    showToast("Permohonan perpanjangan 7 hari berhasil diajukan ke pustakawan.");
  };

  // Buka dialog pembatalan booking
  const openCancelBookingDialog = (item: MockQueueItem, e: React.MouseEvent<HTMLButtonElement>) => {
    lastCancelTriggerRef.current = e.currentTarget;
    setCancelBookingTarget(item);
    cancelBookingDialogRef.current?.showModal();
  };

  const closeCancelBookingDialog = () => {
    cancelBookingDialogRef.current?.close();
    setCancelBookingTarget(null);
    lastCancelTriggerRef.current?.focus();
  };

  // Submit batal booking
  const handleConfirmCancelBooking = () => {
    if (!cancelBookingTarget) return;

    setQueues((prev) => prev.filter((q) => q.id !== cancelBookingTarget.id));
    closeCancelBookingDialog();
    showToast("Pengajuan peminjaman berhasil dibatalkan.");
  };

  // Dismiss saat klik backdrop dialog
  const handleDialogBackdropClick = (
    e: React.MouseEvent<HTMLDialogElement>,
    dialog: HTMLDialogElement | null,
    closeFn: () => void
  ) => {
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );
    if (!isInDialog) {
      closeFn();
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback (Accessible Live Region) */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-heading px-4 py-3 text-card shadow-lg border border-border/20 text-xs sm:text-sm animate-in fade-in duration-200"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Halaman (Clean tanpa filler subtitle) */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-heading">
          Peminjaman Saya
        </h2>
      </div>

      {/* Card Utama Berisi 3 Sub-tab */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-border px-6 pt-2">
          <button
            type="button"
            onClick={() => setSubTab("aktif")}
            className={cn(
              "px-4 py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2",
              subTab === "aktif"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-heading"
            )}
          >
            <span>Sedang Dipinjam</span>
            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-primary-soft text-primary">
              {activeLoans.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab("riwayat")}
            className={cn(
              "px-4 py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2",
              subTab === "riwayat"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-heading"
            )}
          >
            <span>Riwayat Peminjaman</span>
            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-muted text-muted-foreground">
              {historyLoans.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab("pengajuan")}
            className={cn(
              "px-4 py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px flex items-center gap-2",
              subTab === "pengajuan"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-heading"
            )}
          >
            <span>Pengajuan Peminjaman</span>
            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-warning-bg text-warning-fg">
              {queues.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Sedang Dipinjam */}
        {subTab === "aktif" && (
          <div className="p-6 sm:p-8 space-y-4">
            {activeLoans.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                Tidak ada buku yang sedang dipinjam saat ini.
              </div>
            ) : (
              <div className="space-y-4">
                {activeLoans.map((loan) => {
                  const isDueSoon = loan.sisa_hari <= 1;

                  return (
                    <div
                      key={loan.id}
                      className="rounded-xl border border-border bg-background/50 p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-16 sm:w-20 shrink-0 shadow-2xs rounded overflow-hidden">
                          <BookCover
                            src={loan.cover_url}
                            judul={loan.judul_buku}
                            kategoriSlug={loan.kategori.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}
                            className="rounded-xs"
                          />
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            {loan.kategori}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-heading leading-snug">
                            {loan.judul_buku}
                          </h3>
                          <p className="text-xs text-muted-foreground">{loan.penulis_buku}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-secondary-text pt-1">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>Pinjam: <strong>{loan.tanggal_pinjam}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>Jatuh Tempo: <strong className={isDueSoon ? "text-warning-fg" : ""}>{loan.tanggal_jatuh_tempo}</strong></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status & Aksi Sisa Waktu */}
                      <div className="w-full md:w-auto shrink-0 flex flex-col items-start md:items-end gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                        {isDueSoon ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning-bg border border-amber-300 text-warning-fg text-xs font-semibold">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span>Batas waktu sisa {loan.sisa_hari} hari!</span>
                          </div>
                        ) : (
                          <div className="px-3 py-1 rounded-lg bg-primary-soft text-primary text-xs font-medium">
                            Sisa waktu: {loan.sisa_hari} hari
                          </div>
                        )}

                        <span className="text-xs font-mono text-muted-foreground">
                          ID: {loan.nomor_induk_eksemplar}
                        </span>

                        {loan.status === "perpanjangan_diajukan" ? (
                          <span className="text-xs font-medium text-warning-fg bg-warning-bg border border-amber-300 px-3 py-1 rounded-md">
                            Perpanjangan Menunggu Verifikasi
                          </span>
                        ) : loan.bisa_diperpanjang ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={(e) => openExtendDialog(loan, e)}
                            className="text-xs font-semibold text-primary border-primary/40 hover:bg-primary-soft min-h-[38px]"
                          >
                            Ajukan Perpanjangan (+7 Hari)
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Batas perpanjangan maksimal
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Riwayat Peminjaman */}
        {subTab === "riwayat" && (
          <div className="p-6 sm:p-8 space-y-4">
            {historyLoans.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                Belum ada riwayat buku yang dikembalikan.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {historyLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-14 sm:w-16 shrink-0 shadow-2xs rounded overflow-hidden">
                        <BookCover
                          src={loan.cover_url}
                          judul={loan.judul_buku}
                          kategoriSlug={loan.kategori.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}
                          className="rounded-xs"
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          {loan.kategori}
                        </span>
                        <h4 className="text-sm font-bold text-heading leading-snug line-clamp-1">
                          {loan.judul_buku}
                        </h4>
                        <p className="text-xs text-muted-foreground">{loan.penulis_buku}</p>
                        <p className="text-xs text-muted-foreground">
                          Pinjam: {loan.tanggal_pinjam} • Dikembalikan: <strong>{loan.tanggal_kembali}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto shrink-0 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-success-bg text-success-fg border border-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Selesai (Tepat Waktu)</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Booking */}
        {subTab === "pengajuan" && (
          <div className="p-6 sm:p-8 space-y-4">
            {queues.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                Tidak ada pengajuan peminjaman aktif saat ini.
              </div>
            ) : (
              <div className="space-y-4">
                {queues.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border bg-background/50 p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 sm:w-20 shrink-0 shadow-2xs rounded overflow-hidden">
                        <BookCover
                          src={item.cover_url}
                          judul={item.judul_buku}
                          kategoriSlug={item.kategori.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}
                          className="rounded-xs"
                        />
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-warning-fg uppercase tracking-wider bg-warning-bg border border-amber-300 px-2 py-0.5 rounded">
                            {item.jenis === "booking" ? "Pengajuan 24 Jam" : "Antrean"}
                          </span>
                          <span className="text-xs font-mono font-bold text-heading">
                            {item.kode_booking}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-heading leading-snug">
                          {item.judul_buku}
                        </h4>
                        <p className="text-xs text-muted-foreground">{item.penulis_buku}</p>
                        <p className="text-xs text-secondary-text">
                          Pengajuan: <strong>{item.waktu_pengajuan}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="w-full md:w-auto shrink-0 flex flex-col items-start md:items-end gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-success-bg border border-emerald-300 text-success-fg text-xs font-semibold">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{item.sisa_waktu_teks || "Siap Diambil"}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ambil di Meja Sirkulasi sebelum batas habis.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => openCancelBookingDialog(item, e)}
                        className="text-xs text-destructive border-destructive/30 hover:bg-danger-bg min-h-[38px]"
                      >
                        Batalkan Pengajuan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Native HTML Dialog: Ajukan Perpanjangan */}
      <dialog
        ref={extendDialogRef}
        onClick={(e) => handleDialogBackdropClick(e, extendDialogRef.current, closeExtendDialog)}
        onClose={closeExtendDialog}
        aria-labelledby="extend-modal-title"
        className="m-auto rounded-2xl bg-card text-card-foreground p-6 shadow-2xl border border-border backdrop:bg-black/50 backdrop:backdrop-blur-xs max-w-md w-[calc(100%-2rem)]"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 id="extend-modal-title" className="text-base font-bold text-heading">
                Ajukan Perpanjangan Pinjaman
              </h3>
            </div>
            <button
              type="button"
              onClick={closeExtendDialog}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              aria-label="Tutup modal perpanjangan"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Perpanjangan akan menambahkan durasi pinjam selama <strong>7 hari kalender</strong> terhitung dari tanggal jatuh tempo saat ini, dengan persetujuan pustakawan.
          </p>

          <form onSubmit={handleConfirmExtend} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="reason" className="text-xs font-semibold text-heading">
                Alasan Perpanjangan <span className="text-destructive">*</span>
              </label>
              <textarea
                id="reason"
                required
                rows={3}
                value={extendReason}
                onChange={(e) => setExtendReason(e.target.value)}
                placeholder="Contoh: Masih menyelesaikan referensi modul laporan SIJA."
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={closeExtendDialog}
                className="text-xs text-muted-foreground border-border min-h-[38px]"
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold min-h-[38px]"
              >
                Kirim Permohonan
              </Button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Native HTML Dialog: Konfirmasi Batal Booking */}
      <dialog
        ref={cancelBookingDialogRef}
        onClick={(e) => handleDialogBackdropClick(e, cancelBookingDialogRef.current, closeCancelBookingDialog)}
        onClose={closeCancelBookingDialog}
        aria-labelledby="cancel-modal-title"
        className="m-auto rounded-2xl bg-card text-card-foreground p-6 shadow-2xl border border-border backdrop:bg-black/50 backdrop:backdrop-blur-xs max-w-sm w-[calc(100%-2rem)]"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-warning-fg">
            <AlertCircle className="h-6 w-6 shrink-0" />
            <h3 id="cancel-modal-title" className="text-base font-bold text-heading">
              Batalkan Pengajuan?
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Apakah Anda yakin ingin membatalkan pengajuan peminjaman ini?
          </p>
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={closeCancelBookingDialog}
              className="text-xs text-muted-foreground border-border min-h-[38px]"
            >
              Kembali
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmCancelBooking}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-semibold min-h-[38px]"
            >
              Ya, Batalkan
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
