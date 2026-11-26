"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAuth } from "@/lib/auth-context";
import { MOCK_USER_LOANS, MOCK_USER_QUEUES, MOCK_BOOKS } from "@/mocks";
import { ChevronRight } from "lucide-react";

import {
  ProfileBanner,
  ProfileSidebar,
  TabDashboard,
  TabDataPribadi,
  TabRiwayatMembaca,
  TabPeminjamanSaya,
  TabBukuFavorit,
  TabPengaturanAkun,
  TabDaftarBlokir,
} from "@/components/profile";
import type { ProfileTab } from "@/components/profile";

// Daftar tab yang valid sebagai guard untuk query parameter
const VALID_TABS: ProfileTab[] = [
  "dashboard",
  "riwayat",
  "peminjaman",
  "favorit",
  "data-pribadi",
  "pengaturan",
  "blokir",
];

// Judul breadcrumb untuk setiap tab
const TAB_LABELS: Record<ProfileTab, string> = {
  dashboard: "Dashboard",
  riwayat: "Riwayat Membaca",
  peminjaman: "Peminjaman Saya",
  favorit: "Buku Favorit",
  "data-pribadi": "Data Pribadi",
  pengaturan: "Pengaturan Akun",
  blokir: "Daftar Blokir",
};

// Subset buku untuk Buku Favorit mock
const FAVORITE_BOOKS = MOCK_BOOKS.filter((b) =>
  ["buku-laskar", "buku-bumi", "buku-hujan", "buku-laut-bercerita"].includes(b.id)
);

export default function ProfilPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil tab aktif dari query ?tab=..., default "dashboard"
  const rawTab = searchParams.get("tab");
  const activeTab: ProfileTab =
    rawTab && VALID_TABS.includes(rawTab as ProfileTab)
      ? (rawTab as ProfileTab)
      : "dashboard";

  // Handler navigasi tab tanpa reload halaman
  const handleSelectTab = React.useCallback(
    (tab: ProfileTab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.push(`/profil?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Data user dari auth context
  const nama = user?.nama || "Muhammad Fadhil";
  const identitas = user?.identitas || "0061234567";
  const kelas = user?.kelas_atau_unit || "XII SIJA 1";
  const fotoUrl = user?.foto_url || null;
  const isBlocked = user?.is_blocked || false;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <UtilityBar />
      <Header />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-auto w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)] space-y-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Link
              href="/"
              className="hover:text-primary transition-colors font-medium"
            >
              Beranda
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <Link
              href="/profil"
              className="hover:text-primary transition-colors font-medium"
            >
              Profil
            </Link>
            {activeTab !== "dashboard" && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                <span className="font-semibold text-heading">
                  {TAB_LABELS[activeTab]}
                </span>
              </>
            )}
          </nav>

          {/* Banner Profil: Foto + Nama + Kelas + NIS (Clean, Tanpa Badge/Slogan) */}
          <ProfileBanner
            nama={nama}
            identitas={identitas}
            kelas={kelas}
            fotoUrl={fotoUrl}
          />

          {/* Layout Utama: Sidebar + Konten Dinamis */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-start w-full min-w-0">
            {/* Sidebar Navigasi (Desktop Vertikal, Mobile Horizontal Scroll) */}
            <ProfileSidebar
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              hasBlockingRecord={isBlocked}
              onLogout={logout}
            />

            {/* Area Konten Utama yang Berubah Sesuai Menu Aktif */}
            <div className="flex-1 min-w-0 w-full">
              {activeTab === "dashboard" && (
                <TabDashboard
                  loans={MOCK_USER_LOANS}
                  onNavigateTab={handleSelectTab}
                />
              )}

              {activeTab === "data-pribadi" && (
                <TabDataPribadi
                  initialNama={nama}
                  initialIdentitas={identitas}
                  initialKelas={kelas}
                  initialFotoUrl={fotoUrl}
                />
              )}

              {activeTab === "riwayat" && <TabRiwayatMembaca />}

              {activeTab === "peminjaman" && (
                <TabPeminjamanSaya
                  initialLoans={MOCK_USER_LOANS}
                  initialQueues={MOCK_USER_QUEUES}
                />
              )}

              {activeTab === "favorit" && (
                <TabBukuFavorit initialBooks={FAVORITE_BOOKS} />
              )}

              {activeTab === "pengaturan" && <TabPengaturanAkun />}

              {activeTab === "blokir" && (
                <TabDaftarBlokir isBlocked={isBlocked} />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
