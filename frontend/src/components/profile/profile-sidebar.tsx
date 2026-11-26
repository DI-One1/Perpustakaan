"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Heart,
  User,
  Settings,
  ShieldAlert,
  LogOut,
} from "lucide-react";

export type ProfileTab =
  | "dashboard"
  | "riwayat"
  | "peminjaman"
  | "favorit"
  | "data-pribadi"
  | "pengaturan"
  | "blokir";

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  onSelectTab: (tab: ProfileTab) => void;
  hasBlockingRecord?: boolean;
  onLogout?: () => void;
}

interface MenuItem {
  id: ProfileTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export function ProfileSidebar({
  activeTab,
  onSelectTab,
  hasBlockingRecord = false,
  onLogout,
}: ProfileSidebarProps) {
  const sections: MenuSection[] = [
    {
      title: "RINGKASAN",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "AKTIVITAS PERPUSTAKAAN",
      items: [
        { id: "riwayat", label: "Riwayat Membaca", icon: BookOpen },
        { id: "peminjaman", label: "Peminjaman Saya", icon: BookMarked },
        { id: "favorit", label: "Buku Favorit", icon: Heart },
      ],
    },
    {
      title: "AKUN",
      items: [
        { id: "data-pribadi", label: "Data Pribadi", icon: User },
        { id: "pengaturan", label: "Pengaturan Akun", icon: Settings },
      ],
    },
    ...(hasBlockingRecord || activeTab === "blokir"
      ? [
          {
            title: "LAINNYA",
            items: [
              { id: "blokir" as ProfileTab, label: "Daftar Blokir", icon: ShieldAlert },
            ],
          },
        ]
      : []),
  ];

  // Flattened items for mobile horizontal bar
  const allItems = sections.flatMap((s) => s.items);

  return (
    <aside aria-label="Navigasi Menu Profil" className="w-full max-w-full overflow-hidden lg:overflow-visible lg:w-64 shrink-0">
      {/* Mobile Horizontal Navigation Tabs */}
      <nav
        aria-label="Menu Profil Mobile"
        className="flex lg:hidden items-center gap-1.5 w-full max-w-full overflow-x-auto pb-2 scrollbar-none border-b border-border mb-4"
      >
        {allItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0",
                isActive
                  ? "bg-primary-soft text-primary font-bold shadow-2xs"
                  : "bg-card text-secondary-text hover:text-heading border border-border"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Vertical Sidebar */}
      <div className="hidden lg:block bg-card rounded-xl border border-border p-3.5 shadow-xs space-y-5">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h2 className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase px-3 py-1">
              {section.title}
            </h2>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 min-h-[40px] rounded-lg text-xs transition-all text-left",
                      isActive
                        ? "bg-primary-soft text-primary font-bold shadow-2xs"
                        : "text-secondary-text hover:text-heading hover:bg-muted font-medium"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Tombol Logout Sesi */}
        {onLogout && (
          <div className="pt-2 border-t border-border">
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 min-h-[40px] rounded-lg text-xs font-medium text-destructive hover:bg-danger-bg transition-colors text-left"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Keluar Sesi</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
