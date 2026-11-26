"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UtilityBar() {
  const t = useTranslations("common");
  const locale = useLocale();

  const setLanguage = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  return (
    <div className="bg-navy text-white/90 text-xs">
      <div className="mx-auto flex h-[38px] w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)] items-center justify-between">
        {/* KIRI: Yayasan & Sekolah */}
        <div className="hidden sm:flex items-center gap-2.5 text-[12px] font-normal text-white/95">
          <span>Yayasan BAZMA Pertamina</span>
          <span className="text-white/30">|</span>
          <span>SMK TI BAZMA</span>
        </div>

        {/* KANAN: Tautan Info & Bahasa */}
        <div className="flex w-full sm:w-auto items-center justify-end gap-3.5 text-[12px] text-white/90">
          <Link
            href="/tentang"
            className="hover:text-white transition-colors py-1"
          >
            {t("aboutLibrary")}
          </Link>
          <span className="text-white/30">|</span>
          <Link
            href="/tentang-pengembang"
            className="hover:text-white transition-colors py-1"
          >
            {t("aboutDeveloper")}
          </Link>
          <span className="text-white/30">|</span>

          {/* Atur Bahasa */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 hover:text-white py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-xs">
              <Globe className="h-3.5 w-3.5 text-white/80" />
              <span>{locale === "en" ? "English" : "Indonesia"}</span>
              <span className="text-white/70 text-[10px]">▼</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 bg-card text-foreground border-border shadow-md">
              <DropdownMenuItem
                onClick={() => setLanguage("id")}
                className={locale === "id" ? "font-semibold text-primary" : ""}
              >
                {t("languageId")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("en")}
                className={locale === "en" ? "font-semibold text-primary" : ""}
              >
                {t("languageEn")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
