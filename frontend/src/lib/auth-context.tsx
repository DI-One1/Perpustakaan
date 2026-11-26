"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { MockUserSession } from "@/mocks";

export interface AuthContextType {
  user: MockUserSession | null;
  isLoading: boolean;
  login: (nomorInduk: string, roleHint?: "warga" | "pustakawan" | "admin") => Promise<boolean>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// 3 Akun Persona Resmi BILIK
export const PRESET_ACCOUNTS: Record<string, MockUserSession> = {
  warga: {
    id: "usr-warga-1",
    nama: "Muhammad Fadhil",
    identitas: "0061234567",
    peran: "warga",
    kelas_atau_unit: "XII SIJA 1",
    denda_aktif: 0,
    is_blocked: false,
    foto_path: "avatars/user-1.png",
    foto_url: "/images/avatars/user-1.png",
    reservasi_aktif: {
      id: "res-101",
      jenis: "booking",
      buku_id: "buku-bumi",
      buku_judul: "Bumi",
      buku_penulis: "Tere Liye",
      kode_booking: "BKG-202611-0042",
      nomor_induk_eksemplar: "BK-0004",
      status: "siap_diambil",
      waktu_tenggat_iso: "2026-11-21T14:30:00+07:00",
      sisa_waktu_teks: "16 jam tersisa",
    },
  },
  pustakawan: {
    id: "usr-pustakawan-1",
    nama: "Ibu Nurul Hidayah",
    identitas: "PUST-001",
    peran: "pustakawan",
    kelas_atau_unit: "Kepala Perpustakaan",
    denda_aktif: 0,
    is_blocked: false,
    foto_path: "avatars/user-2.png",
    foto_url: "/images/avatars/user-2.png",
    reservasi_aktif: null,
  },
  admin: {
    id: "usr-admin",
    nama: "Pak Ridwan Santoso",
    identitas: "ADMIN-001",
    peran: "admin",
    kelas_atau_unit: "Kepala Lab & IT TEFA",
    denda_aktif: 0,
    is_blocked: false,
    foto_path: "avatars/user-default.png",
    foto_url: "/images/avatars/user-default.png",
    reservasi_aktif: null,
  },
};

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("bilik_auth_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("bilik_auth_change", callback);
  };
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem("bilik_active_session");
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // useSyncExternalStore secara native menangani SSR snapshot & hydration tanpa mismatch
  const sessionRaw = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const user = React.useMemo(() => {
    if (!sessionRaw) return null;
    try {
      return JSON.parse(sessionRaw) as MockUserSession;
    } catch {
      return null;
    }
  }, [sessionRaw]);

  const login = async (
    nomorInduk: string,
    roleHint?: "warga" | "pustakawan" | "admin"
  ): Promise<boolean> => {
    let matchedUser: MockUserSession | null = null;

    if (roleHint && PRESET_ACCOUNTS[roleHint]) {
      matchedUser = PRESET_ACCOUNTS[roleHint];
    } else {
      const found = Object.values(PRESET_ACCOUNTS).find(
        (acc) => acc.identitas.toLowerCase() === nomorInduk.trim().toLowerCase()
      );
      if (found) matchedUser = found;
    }

    if (matchedUser) {
      localStorage.setItem("bilik_active_session", JSON.stringify(matchedUser));
      document.cookie = `bilik_user_role=${matchedUser.peran}; path=/; max-age=86400; SameSite=Lax`;
      window.dispatchEvent(new Event("bilik_auth_change"));
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem("bilik_active_session");
    document.cookie = "bilik_user_role=; path=/; max-age=0;";
    window.dispatchEvent(new Event("bilik_auth_change"));
    router.push("/");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading: false, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
