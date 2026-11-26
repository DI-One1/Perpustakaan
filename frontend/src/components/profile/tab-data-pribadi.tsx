"use client";

import * as React from "react";
import { UserAvatar } from "@/components/media/user-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Upload,
  Trash2,
  CheckCircle2,
  Crop,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface TabDataPribadiProps {
  initialNama: string;
  initialIdentitas: string;
  initialKelas: string;
  initialFotoUrl?: string | null;
  onUpdateAvatar?: (url: string | null) => void;
}

export function TabDataPribadi({
  initialNama,
  initialIdentitas,
  initialKelas,
  initialFotoUrl,
  onUpdateAvatar,
}: TabDataPribadiProps) {
  const [activeSubTab, setActiveSubTab] = React.useState<"pribadi" | "kontak">("pribadi");

  // State Avatar Foto Profil
  const [currentFoto, setCurrentFoto] = React.useState<string | null>(
    initialFotoUrl || "/images/defaults/avatar.png"
  );
  const [tempImageSrc, setTempImageSrc] = React.useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState(100);

  // Native Dialog Ref & File Input Ref
  const cropDialogRef = React.useRef<HTMLDialogElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const uploadButtonRef = React.useRef<HTMLButtonElement | null>(null);

  // State Kontak yang dapat diedit
  const [email, setEmail] = React.useState("fadhil.bazma@smktibazma.sch.id");
  const [telepon, setTelepon] = React.useState("+62 812-3456-7890");
  const [alamat, setAlamat] = React.useState(
    "Asrama Siswa SMK TI BAZMA, Jl. Raya Cipayung No. 12, Megamendung, Bogor, Jawa Barat"
  );

  // Toast feedback state with proper cleanup
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

  // Handler Pilih File Foto
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi format
    const validFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!validFormats.includes(file.type)) {
      alert("Format berkas harus JPG, PNG, atau WEBP.");
      return;
    }

    // Validasi ukuran (maks 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar maksimal adalah 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setTempImageSrc(reader.result);
        setZoomLevel(100);
        cropDialogRef.current?.showModal();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Simpan hasil crop modal
  const handleApplyCrop = () => {
    if (tempImageSrc) {
      setCurrentFoto(tempImageSrc);
      onUpdateAvatar?.(tempImageSrc);
      cropDialogRef.current?.close();
      setTempImageSrc(null);
      showToast("Foto profil berhasil diperbarui.");
      uploadButtonRef.current?.focus();
    }
  };

  // Tutup crop modal
  const handleCloseCrop = () => {
    cropDialogRef.current?.close();
    setTempImageSrc(null);
    uploadButtonRef.current?.focus();
  };

  // Dismiss saat klik backdrop native dialog
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = cropDialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );
    if (!isInDialog) {
      handleCloseCrop();
    }
  };

  // Hapus foto profil
  const handleRemoveFoto = () => {
    const defaultAvatar = "/images/avatars/.png";
    setCurrentFoto(defaultAvatar);
    onUpdateAvatar?.(defaultAvatar);
    showToast("Foto profil dikembalikan ke avatar bawaan.");
  };

  // Simpan perubahan kontak
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        "bilik_user_contact",
        JSON.stringify({ email, telepon, alamat })
      );
    } catch {
      // Ignored
    }
    showToast("Informasi kontak berhasil disimpan.");
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
          Data Pribadi
        </h2>
      </div>

      {/* Card Utama */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        {/* Sub-tab Navigasi */}
        <div className="flex border-b border-border px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveSubTab("pribadi")}
            className={cn(
              "px-4 py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px",
              activeSubTab === "pribadi"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-heading"
            )}
          >
            Informasi Pribadi
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("kontak")}
            className={cn(
              "px-4 py-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px",
              activeSubTab === "kontak"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-heading"
            )}
          >
            Informasi Kontak
          </button>
        </div>

        {/* Tab 1: Informasi Pribadi */}
        {activeSubTab === "pribadi" && (
          <div className="p-6 sm:p-8 space-y-8">
            {/* Bagian Foto Profil */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-border">
              <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden border-2 border-primary-soft bg-background shadow-xs">
                <UserAvatar
                  src={currentFoto || "/images/avatars/.png"}
                  nama={initialNama}
                  size={96}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-3 text-center sm:text-left">
                <div>
                  <h3 className="text-sm font-bold text-heading">Foto Profil</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Format JPG, PNG, atau WEBP. Maksimal 2 MB.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                    aria-label="Unggah foto profil baru"
                  />
                  <Button
                    ref={uploadButtonRef}
                    type="button"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold gap-1.5 rounded-lg px-3.5 min-h-[38px]"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Ganti Foto</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveFoto}
                    className="border-border text-muted-foreground hover:text-destructive hover:bg-danger-bg text-xs font-semibold gap-1.5 rounded-lg px-3.5 min-h-[38px]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus Foto</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Field Identitas (Data Sekolah, Disabled Murni Tanpa Gembok) */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Nama Lengkap */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="field-nama" className="text-xs font-semibold text-heading">
                    Nama Lengkap
                  </label>
                  <input
                    id="field-nama"
                    type="text"
                    disabled
                    value={initialNama}
                    className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-xs sm:text-sm text-muted-foreground cursor-not-allowed select-none"
                  />
                </div>

                {/* NIS */}
                <div className="space-y-1.5">
                  <label htmlFor="field-nis" className="text-xs font-semibold text-heading">
                    Nomor Induk Siswa (NIS)
                  </label>
                  <input
                    id="field-nis"
                    type="text"
                    disabled
                    value={initialIdentitas}
                    className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-xs sm:text-sm font-mono text-muted-foreground cursor-not-allowed select-none"
                  />
                </div>

                {/* Kelas */}
                <div className="space-y-1.5">
                  <label htmlFor="field-kelas" className="text-xs font-semibold text-heading">
                    Kelas / Rombel
                  </label>
                  <input
                    id="field-kelas"
                    type="text"
                    disabled
                    value={initialKelas}
                    className="w-full rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-xs sm:text-sm text-muted-foreground cursor-not-allowed select-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Informasi Kontak */}
        {activeSubTab === "kontak" && (
          <form onSubmit={handleSaveContact} className="p-6 sm:p-8 space-y-6">
            <div className="space-y-5">
              {/* Alamat Email */}
              <div className="space-y-1.5">
                <label htmlFor="field-email" className="text-xs font-semibold text-heading">
                  Alamat Email
                </label>
                <input
                  id="field-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Perubahan email memerlukan konfirmasi melalui tautan verifikasi.
                </p>
              </div>

              {/* Nomor Telepon */}
              <div className="space-y-1.5">
                <label htmlFor="field-telepon" className="text-xs font-semibold text-heading">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  id="field-telepon"
                  type="tel"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Alamat Domisili */}
              <div className="space-y-1.5">
                <label htmlFor="field-alamat" className="text-xs font-semibold text-heading">
                  Alamat Domisili
                </label>
                <textarea
                  id="field-alamat"
                  rows={3}
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-primary-foreground text-xs sm:text-sm font-semibold rounded-lg px-6 min-h-[42px]"
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Native HTML Dialog: Penyesuaian & Crop Foto Sebelum Menyimpan */}
      <dialog
        ref={cropDialogRef}
        onClick={handleDialogClick}
        onClose={handleCloseCrop}
        aria-labelledby="crop-modal-title"
        className="m-auto rounded-2xl bg-card text-card-foreground p-6 shadow-2xl border border-border backdrop:bg-black/50 backdrop:backdrop-blur-xs max-w-md w-[calc(100%-2rem)]"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Crop className="h-5 w-5 text-primary" />
              <h3 id="crop-modal-title" className="text-base font-bold text-heading">
                Sesuaikan Foto Profil
              </h3>
            </div>
            <button
              type="button"
              onClick={handleCloseCrop}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-heading"
              aria-label="Tutup dialog penyesuaian foto"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Area Preview Lingkaran */}
          <div className="flex flex-col items-center justify-center p-4 bg-background rounded-xl border border-dashed border-border">
            <div
              className="relative h-44 w-44 rounded-full overflow-hidden border-4 border-card shadow-md bg-card flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transition: "transform 0.15s ease",
              }}
            >
              {tempImageSrc && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={tempImageSrc}
                  alt="Pratinjau Crop Foto Profil"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Geser slider untuk mengatur pembesaran foto profil.
            </p>
          </div>

          {/* Slider Zoom */}
          <div className="flex items-center gap-3 px-2">
            <ZoomOut className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="range"
              min="80"
              max="160"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              aria-label="Pengatur skala foto"
            />
            <ZoomIn className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCloseCrop}
              className="text-xs text-muted-foreground border-border min-h-[38px]"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApplyCrop}
              className="bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold min-h-[38px]"
            >
              Terapkan Foto
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
