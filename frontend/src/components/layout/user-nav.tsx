"use client";

import * as React from "react";
import Link from "next/link";
import { UserAvatar } from "@/components/media/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import {
  User,
  BookOpen,
  Clock,
  Heart,
  BarChart2,
  LogOut,
  ShieldCheck,
  Settings,
} from "lucide-react";
import type { MockUserSession } from "@/mocks";

interface UserNavProps {
  user: MockUserSession;
}

export function UserNav({ user }: UserNavProps) {
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring p-0.5 hover:opacity-90 transition-opacity"
        aria-label={`Menu akun ${user.nama}`}
      >
        <UserAvatar
          src={user.foto_path || user.foto_url}
          nama={user.nama}
          size={40}
          className="h-9 w-9 rounded-full ring-2 ring-border shadow-xs hover:ring-primary transition-all"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-foreground leading-none">{user.nama}</p>
            <p className="text-[13px] text-muted-foreground leading-none">
              NISN/NIP: {user.identitas}
            </p>
            <div className="pt-1 flex items-center gap-1.5">
              <Badge variant="soft" className="text-[13px] capitalize font-medium">
                {user.peran}
              </Badge>
              {user.denda_aktif > 0 && (
                <Badge variant="destructive" className="text-[13px]">
                  Denda Rp{user.denda_aktif.toLocaleString("id-ID")}
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {/* Menu Khusus Warga */}
          <DropdownMenuItem asChild>
            <Link href="/pinjaman" className="flex items-center gap-2 w-full cursor-pointer">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span>Pinjaman Saya</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/antrean" className="flex items-center gap-2 w-full cursor-pointer">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Antrean &amp; Pengajuan Peminjaman</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/favorit" className="flex items-center gap-2 w-full cursor-pointer">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span>Buku Favorit</span>
            </Link>
          </DropdownMenuItem>

          {/* Menu Literasi: Nonaktif Segera Hadir */}
          <DropdownMenuItem
            disabled
            className="flex items-center justify-between opacity-50 cursor-not-allowed text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
              <span>Analisis Literasi</span>
            </div>
            <span className="text-[13px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              Segera hadir
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Menu Khusus Staf Pustakawan & Admin */}
        {(user.peran === "pustakawan" || user.peran === "admin") && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/pustakawan/sirkulasi"
                className="flex items-center gap-2 w-full text-primary font-semibold cursor-pointer bg-primary-soft/50"
              >
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Meja Pustakawan</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {/* Menu Khusus Admin */}
        {user.peran === "admin" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center gap-2 w-full font-semibold text-primary cursor-pointer">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Dashboard Admin</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/pengaturan" className="flex items-center gap-2 w-full cursor-pointer">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Pengaturan Sistem</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profil" className="flex items-center gap-2 w-full cursor-pointer">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Profil Pengguna</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="flex items-center gap-2 w-full text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar dari Akun</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
