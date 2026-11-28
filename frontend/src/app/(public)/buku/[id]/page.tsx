"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BookCover } from "@/components/media/book-cover";
import { BookCard } from "@/components/book/book-card";
import { UserAvatar } from "@/components/media/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import {
  MOCK_BOOKS,
  MOCK_REVIEWS,
  type MockBook,
  type MockReview,
} from "@/mocks";
import {
  ChevronRight,
  Star,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  ArrowRight,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Check,
  ChevronLeft,
  Users,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const book: MockBook | undefined = MOCK_BOOKS.find((b) => b.id === id);

  if (!book) {
    notFound();
  }

  // State Container 1: Peminjaman & Gambar
  const galleryImages = book.galeri_foto && book.galeri_foto.length > 0
    ? book.galeri_foto
    : [book.cover_path || book.cover_url || "/images/defaults/cover-umum.png"];
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [selectedDuration, setSelectedDuration] = React.useState<number>(7);
  const [durationType, setDurationType] = React.useState<"7" | "custom">("7");
  const [customDays, setCustomDays] = React.useState<number>(14);
  const isSinopsisLong = (book.sinopsis || "").length > 120;
  const [isFavorited, setIsFavorited] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);

  // State Dialog Konfirmasi Pengajuan / Antre Buku
  const [actionType, setActionType] = React.useState<"booking" | "antre" | null>(null);
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);

  // State Container 4: Rating & Ulasan
  const initialBookReviews = MOCK_REVIEWS.filter((r) => r.buku_id === book.id);
  // Jika buku belum ada ulasan khusus di mock, gunakan sample ulasan agar UI selalu kaya & berfungsi
  const fallbackReviews = initialBookReviews.length > 0 ? initialBookReviews : MOCK_REVIEWS.slice(0, 5);
  const [reviews, setReviews] = React.useState<MockReview[]>(fallbackReviews);

  const [interactiveRating, setInteractiveRating] = React.useState<number>(0);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [activeFilter, setActiveFilter] = React.useState<string>("semua");
  const [isWriteReviewOpen, setIsWriteReviewOpen] = React.useState(false);
  const [newReviewText, setNewReviewText] = React.useState("");
  const [newReviewRating, setNewReviewRating] = React.useState(5);
  const [visibleReviewCount, setVisibleReviewCount] = React.useState(3);

  // State Container 5: Carousel Rekomendasi Buku
  const relatedBooks = MOCK_BOOKS.filter(
    (b) => b.id !== book.id && (b.kategori_id === book.kategori_id || b.is_populer)
  );
  const [carouselIndex, setCarouselIndex] = React.useState(0);
  const maxCarouselIndex = Math.max(0, relatedBooks.length - 4);

  // Handler Favorit
  const handleFavoriteClick = () => {
    const next = !isFavorited;
    setIsFavorited(next);
    toast({
      message: next
        ? "Berhasil ditambahkan ke favorit"
        : "Berhasil dihapus dari favorit",
      variant: "success",
      action: {
        label: "Cek Favorit",
        onClick: () => router.push("/favorit"),
      },
    });
  };

  // Handler Aksi Pengajuan Peminjaman / Antre Buku
  const handleActionClick = (type: "booking" | "antre") => {
    if (!user) {
      router.push(`/masuk?next=/buku/${book.id}`);
      return;
    }

    if (user.is_blocked) {
      toast({
        message: "Akun Anda sedang dibekukan. Hubungi pustakawan untuk informasi lebih lanjut.",
        variant: "error",
      });
      return;
    }

    if (user.denda_aktif > 0) {
      toast({
        message: `Anda memiliki tunggakan denda keterlambatan sebesar Rp${user.denda_aktif.toLocaleString("id-ID")} yang belum diselesaikan.`,
        variant: "warning",
      });
      return;
    }

    if (user.reservasi_aktif) {
      toast({
        message: "Anda memiliki ajuan pinjam",
        variant: "warning",
        action: {
          label: "Lihat Ajuan",
          onClick: () => router.push("/pinjaman"),
        },
      });
      return;
    }

    setActionType(type);
  };

  const handleConfirmAction = () => {
    if (actionType === "booking") {
      setActionSuccess(
        `Pengajuan peminjaman "${book.judul}" berhasil diajukan. Ambil buku di meja sirkulasi dalam 24 jam.`
      );
    } else {
      setActionSuccess(
        `Berhasil masuk antrean buku "${book.judul}". Anda akan otomatis dipromosikan saat buku siap diambil.`
      );
    }
    setActionType(null);
  };

  // Handler Submit Tulis Ulasan
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev: MockReview = {
      id: `rev-${reviews.length + 101}`,
      buku_id: book.id,
      pengguna_id: user?.id || "usr-anon",
      pengguna_nama: user?.nama || "Warga SMK TI Bazma",
      pengguna_avatar: user?.foto_url || "/images/defaults/avatar.png",
      rating: newReviewRating,
      tanggal: "Hari ini, 20 November 2026",
      isi: newReviewText.trim(),
      foto_url: null,
      berguna_count: 0,
      user_voted: null,
    };

    setReviews([newRev, ...reviews]);
    setIsWriteReviewOpen(false);
    setNewReviewText("");
    setInteractiveRating(newReviewRating);
  };

  // Handler Vote Kegunaan Ulasan (Ya / Tidak)
  const handleVoteHelpful = (reviewId: string, vote: "ya" | "tidak") => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          if (r.user_voted === vote) return r; // sudah vote yang sama
          const countDiff = vote === "ya" ? (r.user_voted === "tidak" ? 1 : 1) : r.user_voted === "ya" ? -1 : 0;
          return {
            ...r,
            user_voted: vote,
            berguna_count: Math.max(0, r.berguna_count + countDiff),
          };
        }
        return r;
      })
    );
  };

  // Kalkulasi Ringkasan Rating & Filter
  const totalReviewsCount = reviews.length;
  const averageRatingNum =
    totalReviewsCount > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1)
      : "5.0";

  const count5 = reviews.filter((r) => r.rating === 5).length;
  const count4 = reviews.filter((r) => r.rating === 4).length;
  const count3 = reviews.filter((r) => r.rating === 3).length;
  const count2 = reviews.filter((r) => r.rating === 2).length;
  const count1 = reviews.filter((r) => r.rating === 1).length;
  const countComment = reviews.filter((r) => r.isi && r.isi.trim().length > 0).length;

  // Filtered Reviews
  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === "semua") return true;
    if (activeFilter === "5") return r.rating === 5;
    if (activeFilter === "4") return r.rating === 4;
    if (activeFilter === "3") return r.rating === 3;
    if (activeFilter === "2") return r.rating === 2;
    if (activeFilter === "1") return r.rating === 1;
    if (activeFilter === "komentar") return r.isi && r.isi.trim().length > 0;
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <UtilityBar />
      <Header />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-auto w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)] space-y-6 sm:space-y-8">
          {/* =========================================================================
              1. BREADCRUMB NAVIGATION (Di Luar dan Tepat di Atas Container Pertama)
             ========================================================================= */}
          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors font-medium">
              Beranda
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <Link href="/katalog" className="hover:text-primary transition-colors font-medium">
              Katalog Buku
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <Link
              href={`/katalog?kategori=${encodeURIComponent(book.kategori_nama)}`}
              className="hover:text-primary transition-colors font-medium"
            >
              {book.kategori_nama}
            </Link>
            {book.subkategori && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                <span className="text-muted-foreground">{book.subkategori}</span>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span className="text-heading font-semibold truncate max-w-[240px] sm:max-w-none">
              {book.judul}
            </span>
          </nav>

          {/* Notifikasi Aksi Sukses (Jika Ada) */}
          {actionSuccess && (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-900 shadow-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{actionSuccess}</span>
              </div>
              <button
                onClick={() => setActionSuccess(null)}
                className="text-xs hover:opacity-70 focus:outline-none"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>
          )}

          {/* =========================================================================
              2. CONTAINER 1 : INFORMASI UTAMA BUKU & PEMINJAMAN (Modular 2 Kolom)
             ========================================================================= */}
          <section
            aria-labelledby="main-info-heading"
            className="rounded-xl border border-border bg-card p-6 sm:p-7 shadow-xs"
          >
            <h2 id="main-info-heading" className="sr-only">
              Informasi Utama Buku dan Formulir Peminjaman
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* KOLOM KIRI: SAMPUL BUKU & THUMBNAILS DI BAWAHNYA */}
              <div className="md:col-span-5 lg:col-span-4 space-y-4">
                <div className="relative mx-auto max-w-[280px] sm:max-w-[310px] rounded-xl overflow-hidden border border-border/80 shadow-md bg-muted/20">
                  <BookCover
                    src={galleryImages[activeImageIndex]}
                    judul={book.judul}
                    kategoriSlug={book.kategori_id.replace("cat-", "")}
                    priority
                    fit="cover"
                    borderless
                    className="w-full aspect-[2/3]"
                  />
                </div>

                {/* Thumbnail Gambar Buku di Bawah Cover */}
                {galleryImages.length > 1 && (
                  <div className="flex items-center justify-center gap-2.5 py-2 px-1 overflow-x-auto overflow-y-hidden no-scrollbar">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={cn(
                          "relative w-12 sm:w-14 aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          activeImageIndex === idx
                            ? "border-primary ring-2 ring-primary/25 shadow-xs"
                            : "border-border/80 opacity-70 hover:opacity-100 hover:border-primary/50"
                        )}
                        aria-label={`Lihat gambar sampul ${idx + 1}`}
                      >
                        <BookCover
                          src={img}
                          judul={`${book.judul} ${idx + 1}`}
                          kategoriSlug={book.kategori_id.replace("cat-", "")}
                          fit="cover"
                          borderless
                          className="h-full w-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* KOLOM KANAN: INFORMASI BUKU, SINOPSIS & KONTROL TRANSAKSI */}
              <div className="md:col-span-7 lg:col-span-8 space-y-4">
                {/* 1. Judul, Penulis, Penerbit, Tahun & Rating Ulasan */}
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-heading leading-tight">
                      {book.judul}
                    </h1>
                    <button
                      type="button"
                      onClick={handleFavoriteClick}
                      className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                      aria-label={isFavorited ? "Hapus dari favorit" : "Tambah ke favorit"}
                    >
                      <Heart
                        className={cn(
                          "h-5 w-5 transition-colors duration-200",
                          isFavorited
                            ? "fill-pink-500 text-pink-500"
                            : "fill-none text-muted-foreground"
                        )}
                      />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {book.penulis} · {book.penerbit}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {book.tahun}
                  </p>

                  {/* Rating & Ulasan */}
                  <div className="flex items-center gap-2 pt-1 text-xs font-semibold">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{averageRatingNum}</span>
                    </div>
                    <span className="text-muted-foreground">·</span>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("ulasan");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-muted-foreground hover:text-primary hover:underline transition-colors focus:outline-none"
                    >
                      {totalReviewsCount} Ulasan
                    </button>
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* 2. SINOPSIS */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    SINOPSIS
                  </span>
                  <p className={cn("text-xs text-foreground/90 leading-relaxed", isSinopsisLong && "line-clamp-3")}>
                    {book.sinopsis}
                  </p>
                  {isSinopsisLong && (
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("sinopsis-lengkap");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline focus:outline-none pt-0.5 cursor-pointer"
                    >
                      <span>Baca selengkapnya ↓</span>
                    </button>
                  )}
                </div>

                <div className="border-t border-border" />

                {/* 3. DURASI PEMINJAMAN */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    DURASI PEMINJAMAN
                  </span>
                  <div className="flex items-center flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDurationType("7");
                        setSelectedDuration(7);
                      }}
                      className={cn(
                        "px-4 py-2 rounded-lg text-xs font-bold border transition-colors",
                        durationType === "7"
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-background text-foreground border-border hover:bg-muted/60"
                      )}
                    >
                      7 Hari
                    </button>
                    <div
                      onClick={() => {
                        setDurationType("custom");
                        setSelectedDuration(customDays);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer",
                        durationType === "custom"
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-background text-foreground border-border hover:bg-muted/60"
                      )}
                    >
                      <span> Kustom:</span>
                      <input
                        type="number"
                        min={1}
                        max={14}
                        value={customDays}
                        onChange={(e) => {
                          const val = Math.min(14, Math.max(1, parseInt(e.target.value) || 1));
                          setCustomDays(val);
                          setSelectedDuration(val);
                          setDurationType("custom");
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          "w-12 px-1 py-0.5 text-center text-xs font-bold rounded border focus:outline-none transition-colors",
                          durationType === "custom"
                            ? "bg-primary-hover text-white border-white/40 focus:border-white"
                            : "bg-muted text-foreground border-input focus:border-primary"
                        )}
                        aria-label="Jumlah hari kustom"
                      />
                      <span>Hari </span>
                    </div>
                  </div>
                </div>

                {/* 4. JUMLAH EKSEMPLAR */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    JUMLAH BUKU
                  </span>
                  <div className="flex items-center gap-3.5 flex-wrap">
                    <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="px-3 py-1.5 text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors focus:outline-none"
                        aria-label="Kurangi eksemplar"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-4 py-1.5 font-mono font-bold text-xs text-foreground min-w-[44px] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(Math.max(1, book.eksemplar_tersedia), q + 1))}
                        disabled={quantity >= Math.max(1, book.eksemplar_tersedia) || quantity >= 1}
                        className="px-3 py-1.5 text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors focus:outline-none"
                        aria-label="Tambah eksemplar"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      <strong className="text-foreground font-semibold">{quantity}</strong> dari{" "}
                      <strong className="text-foreground font-semibold">
                        {book.eksemplar_tersedia > 0 ? book.eksemplar_tersedia : book.total_eksemplar}
                      </strong>{" "}
                      tersedia
                    </span>
                  </div>
                </div>

                {/* 5. TOMBOL AKSI (Antre Buku di kiri & Ajukan Peminjaman di kanan) */}
                <div className="pt-2 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleActionClick("antre")}
                    className="flex-1 sm:flex-none sm:min-w-[180px] gap-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Antre Buku</span>
                  </Button>

                  <Button
                    type="button"
                    disabled={book.eksemplar_tersedia <= 0}
                    onClick={() => handleActionClick("booking")}
                    className="flex-1 sm:flex-none sm:min-w-[190px] gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    <span>{book.eksemplar_tersedia <= 0 ? "Stok Habis" : "Ajukan Peminjaman"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              3. CONTAINER 2 : SINOPSIS
             ========================================================================= */}
          <section
            id="sinopsis-lengkap"
            aria-labelledby="full-desc-heading"
            className="rounded-xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-4 scroll-mt-24"
          >
            <h2 id="full-desc-heading" className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              SINOPSIS
            </h2>

            <div className="max-w-4xl space-y-3.5 text-sm leading-relaxed text-foreground/90">
              {book.deskripsi_lengkap && book.deskripsi_lengkap.length > 0 ? (
                book.deskripsi_lengkap.map((paragraf, pIdx) => (
                  <p key={pIdx} className="text-justify sm:text-left">
                    {paragraf}
                  </p>
                ))
              ) : (
                <p>{book.sinopsis}</p>
              )}
            </div>
          </section>

          {/* =========================================================================
              4. CONTAINER 3 : DETAIL BUKU (Bibliografi & Koleksi)
             ========================================================================= */}
          <section
            aria-labelledby="book-detail-heading"
            className="rounded-xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-6"
          >
            <h2 id="book-detail-heading" className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              DETAIL BUKU
            </h2>

            {/* A. Informasi Bibliografi */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Informasi Bibliografi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Judul Buku</span>
                  <span className="font-semibold text-foreground text-right">{book.judul}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Penulis</span>
                  <span className="font-semibold text-foreground text-right">{book.penulis}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Penerbit</span>
                  <span className="font-semibold text-foreground text-right">{book.penerbit}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Tahun Terbit</span>
                  <span className="font-semibold text-foreground text-right">{book.tahun}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">ISBN</span>
                  <span className="font-mono font-semibold text-foreground text-right">{book.isbn}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Kategori</span>
                  <span className="font-semibold text-foreground text-right">{book.kategori_nama}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Subkategori</span>
                  <span className="font-semibold text-foreground text-right">{book.subkategori || "Novel / Fiksi"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Bahasa</span>
                  <span className="font-semibold text-foreground text-right">{book.bahasa || "Indonesia"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Jumlah Halaman</span>
                  <span className="font-semibold text-foreground text-right">
                    {book.jumlah_halaman ? `${book.jumlah_halaman} Halaman` : "529 Halaman"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Edisi</span>
                  <span className="font-semibold text-foreground text-right">{book.edisi || "Edisi Pertama"}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* B. Informasi Koleksi Aktual */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Informasi Koleksi
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="bg-muted/40 p-3 rounded-lg border border-border/70">
                  <span className="text-muted-foreground block text-[11px]">Total Eksemplar</span>
                  <span className="text-base font-bold text-foreground mt-0.5 block">{book.total_eksemplar}</span>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                  <span className="text-emerald-700 block text-[11px]">Tersedia</span>
                  <span className="text-base font-bold text-emerald-600 mt-0.5 block">
                    {book.eksemplar_tersedia}
                  </span>
                </div>
                <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                  <span className="text-amber-700 block text-[11px]">Dialokasikan</span>
                  <span className="text-base font-bold text-amber-600 mt-0.5 block">
                    {book.eksemplar_dibooking}
                  </span>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                  <span className="text-blue-700 block text-[11px]">Dipinjam</span>
                  <span className="text-base font-bold text-blue-600 mt-0.5 block">
                    {book.eksemplar_dipinjam}
                  </span>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                  <span className="text-purple-700 block text-[11px]">Perbaikan</span>
                  <span className="text-base font-bold text-purple-600 mt-0.5 block">
                    {book.eksemplar_perbaikan || 1}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              5. CONTAINER 4 : RATING DAN ULASAN (Inspirasi Google Play & Shopee)
             ========================================================================= */}
          <section
            aria-labelledby="reviews-heading"
            className="rounded-xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 id="reviews-heading" className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                RATING DAN ULASAN
              </h2>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("semua");
                  setVisibleReviewCount(reviews.length);
                }}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* A. FORMULIR RATING BUKU */}
            <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5 sm:p-6 text-center space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary block">
                BERIKAN RATING BUKU INI
              </span>
              <p className="text-xs text-muted-foreground">Sampaikan pendapat Anda.</p>

              {/* 5 Bintang Interaktif */}
              <div className="flex items-center justify-center gap-2 py-1" role="radiogroup" aria-label="Beri nilai bintang">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isFilled = (hoverRating || interactiveRating) >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => {
                        setInteractiveRating(starVal);
                        setNewReviewRating(starVal);
                        setIsWriteReviewOpen(true);
                      }}
                      className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                      aria-label={`${starVal} dari 5 bintang`}
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${isFilled
                          ? "fill-amber-400 text-amber-500"
                          : "text-muted-foreground/40 hover:text-amber-400"
                          }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div>
                <Button
                  type="button"
                  onClick={() => setIsWriteReviewOpen(true)}
                  className="text-xs font-bold px-6 h-9"
                >
                  <span>{interactiveRating > 0 ? "Ubah Ulasan" : "Tulis Ulasan"}</span>
                </Button>
              </div>
            </div>

            {/* B. RINGKASAN RATING (Dominan, Tanpa Histogram/Grafik Sesuai Ketentuan) */}
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-3 text-center sm:text-left pt-1">
              <span className="text-4xl font-extrabold tracking-tight text-foreground font-mono">
                {averageRatingNum} / 5,0
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-500" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                Berdasarkan <strong>{totalReviewsCount * 35}</strong> ulasan
              </span>
            </div>

            <div className="border-t border-border" />

            {/* C. FILTER KATEGORI ULASAN */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                FILTER ULASAN
              </span>

              {/* Segmented Chips Berdasarkan Nilai Aktual Database */}
              <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setActiveFilter("semua")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${activeFilter === "semua"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/40 text-foreground border-border hover:bg-muted"
                    }`}
                >
                  Semua ({totalReviewsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("5")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${activeFilter === "5"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/40 text-foreground border-border hover:bg-muted"
                    }`}
                >
                  5 Bintang ({count5})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("4")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${activeFilter === "4"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/40 text-foreground border-border hover:bg-muted"
                    }`}
                >
                  4 Bintang ({count4})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("3")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${activeFilter === "3"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/40 text-foreground border-border hover:bg-muted"
                    }`}
                >
                  3 Bintang ({count3})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("2")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${activeFilter === "2"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/40 text-foreground border-border hover:bg-muted"
                    }`}
                >
                  2 Bintang ({count2})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("1")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${activeFilter === "1"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/40 text-foreground border-border hover:bg-muted"
                    }`}
                >
                  1 Bintang ({count1})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("komentar")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${activeFilter === "komentar"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/40 text-foreground border-border hover:bg-muted"
                    }`}
                >
                  Dengan Komentar ({countComment})
                </button>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* D. DAFTAR ULASAN PENGGUNA */}
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                ULASAN PENGGUNA
              </span>

              {filteredReviews.length > 0 ? (
                <div className="space-y-4">
                  {filteredReviews.slice(0, visibleReviewCount).map((rev) => (
                    <article
                      key={rev.id}
                      className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs"
                    >
                      {/* Header Ulasan: Avatar + Nama + Menu Titik Tiga */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <UserAvatar src={rev.pengguna_avatar} nama={rev.pengguna_nama} size={32} />
                          <div>
                            <span className="font-bold text-xs text-foreground block">{rev.pengguna_nama}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              {/* Bintang */}
                              <div className="flex items-center text-amber-500">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`h-3 w-3 ${s <= rev.rating ? "fill-amber-400 text-amber-500" : "text-muted-foreground/30"
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[11px] text-muted-foreground">{rev.tanggal}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground p-1 rounded focus:outline-none"
                          aria-label="Menu opsi ulasan"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Isi Teks Ulasan */}
                      <p className="text-xs text-foreground/90 leading-relaxed">{rev.isi}</p>

                      {/* Evaluasi Kegunaan Ulasan */}
                      <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <span className="text-[11px] text-muted-foreground">
                          <strong>{rev.berguna_count}</strong> orang merasa ulasan ini berguna.
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-muted-foreground">Apakah ulasan ini berguna bagi Anda?</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleVoteHelpful(rev.id, "ya")}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] border transition-colors ${rev.user_voted === "ya"
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 font-bold"
                                : "bg-muted/40 hover:bg-muted text-foreground border-border"
                                }`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span>Ya</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVoteHelpful(rev.id, "tidak")}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] border transition-colors ${rev.user_voted === "tidak"
                                ? "bg-red-500/10 text-red-700 border-red-500/30 font-bold"
                                : "bg-muted/40 hover:bg-muted text-foreground border-border"
                                }`}
                            >
                              <ThumbsDown className="h-3 w-3" />
                              <span>Tidak</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}

                  {/* Tombol Lihat Ulasan Lainnya */}
                  {visibleReviewCount < filteredReviews.length && (
                    <div className="text-center pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setVisibleReviewCount((v) => v + 3)}
                        className="text-xs font-semibold px-6"
                      >
                        <span>Lihat Ulasan Lainnya</span>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                /* E. EMPTY STATE */
                <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground space-y-2">
                  <Star className="h-8 w-8 mx-auto text-muted-foreground/40 mb-1" />
                  <p className="font-semibold text-foreground">Belum ada ulasan untuk filter ini</p>
                  <p>Jadilah warga pertama yang memberikan ulasan dan rating untuk buku ini!</p>
                </div>
              )}
            </div>
          </section>

          {/* =========================================================================
              6. CONTAINER 5 : BUKU TERKAIT (Carousel / Rekomendasi Kategori Sejenis)
             ========================================================================= */}
          <section
            aria-labelledby="related-heading"
            className="rounded-xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 id="related-heading" className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  BUKU TERKAIT
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Rekomendasi buku lainnya dalam kategori <strong>{book.kategori_nama}</strong>
                </p>
              </div>

              <Link
                href={`/katalog?kategori=${encodeURIComponent(book.kategori_nama)}`}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>Lihat Katalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Grid Buku Terkait Responsif */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedBooks.slice(carouselIndex, carouselIndex + 4).map((relBook) => (
                <BookCard key={relBook.id} book={relBook} />
              ))}
            </div>

            {/* Navigasi Carousel [ ← ] [ → ] */}
            {relatedBooks.length > 4 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setCarouselIndex((i) => Math.max(0, i - 1))}
                  disabled={carouselIndex <= 0}
                  className="h-8 w-8 rounded-full"
                  aria-label="Buku sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs font-mono text-muted-foreground">
                  {carouselIndex + 1} - {Math.min(carouselIndex + 4, relatedBooks.length)} dari {relatedBooks.length}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setCarouselIndex((i) => Math.min(maxCarouselIndex, i + 1))}
                  disabled={carouselIndex >= maxCarouselIndex}
                  className="h-8 w-8 rounded-full"
                  aria-label="Buku berikutnya"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* DIALOG FORMULIR TULIS / UBAH ULASAN */}
      <Dialog open={isWriteReviewOpen} onOpenChange={setIsWriteReviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tulis Ulasan Buku</DialogTitle>
            <DialogDescription>
              Bagikan penilaian Anda tentang buku <strong>{book.judul}</strong> untuk membantu warga lain.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-4 py-2">
            <div className="space-y-1.5 text-center">
              <label className="text-xs font-semibold text-foreground block">Pilih Bintang Penilaian</label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewReviewRating(s)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${s <= newReviewRating ? "fill-amber-400 text-amber-500" : "text-muted-foreground/30"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Isi Ulasan &amp; Kesan Membaca</label>
              <textarea
                rows={4}
                required
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Tuliskan ulasan mengenai alur cerita, gaya penulisan, atau wawasan yang Anda dapatkan..."
                className="w-full rounded-md border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none leading-relaxed"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsWriteReviewOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" className="font-semibold gap-1.5">
                <Check className="h-4 w-4" />
                <span>Kirim Ulasan</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG KONFIRMASI PENGAJUAN / ANTRE BUKU */}
      <Dialog open={actionType !== null} onOpenChange={(open) => !open && setActionType(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "booking" ? "Konfirmasi Pengajuan Peminjaman" : "Konfirmasi Antrean Buku"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "booking"
                ? "Satu eksemplar fisik akan disisihkan selama 24 jam kalender di rak sirkulasi meja pustakawan."
                : `Anda akan didaftarkan ke antrean daring FIFO untuk buku "${book.judul}". Begitu buku dikembalikan, Anda otomatis dipromosikan.`}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-2 text-xs">
            <div className="font-bold text-foreground">{book.judul}</div>
            <div className="text-muted-foreground">Penulis: {book.penulis}</div>
            {actionType === "booking" ? (
              <>
                <div className="flex justify-between pt-1 border-t border-border/60">
                  <span className="text-muted-foreground">Durasi:</span>
                  <span className="font-bold text-foreground">{selectedDuration} Hari</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jumlah:</span>
                  <span className="font-bold text-foreground">{quantity} Eksemplar</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between pt-1 border-t border-border/60">
                <span className="text-muted-foreground">Nomor Antrean Anda:</span>
                <span className="font-bold text-primary font-mono">#{(book.jumlah_antrean || 0) + 1}</span>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setActionType(null)}>
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmAction}
              className="font-semibold rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-4px_rgba(19,43,109,0.32)] active:translate-y-0 cursor-pointer"
            >
              {actionType === "booking" ? "Ya, Ajukan Peminjaman" : "Ya, Masuk Antrean"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
      <MobileNav />
    </div>
  );
}
