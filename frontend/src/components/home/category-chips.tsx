"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Laptop, Code, Server, Landmark, Atom, User, ArrowRight } from "lucide-react";

interface CategoryItem {
  id: string;
  nama: string;
  slug: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryItem[] = [
  { id: "cat-2", nama: "Teknologi & SIJA", slug: "Teknologi", icon: Laptop },
  { id: "cat-3", nama: "Pemrograman Web", slug: "Pemrograman Web", icon: Code },
  { id: "cat-4", nama: "Jaringan Komputer", slug: "Jaringan Komputer", icon: Server },
  { id: "cat-5", nama: "Keislaman & Akhlak", slug: "Keislaman", icon: Landmark },
  { id: "cat-6", nama: "Sains & Matematika", slug: "Sains", icon: Atom },
  { id: "cat-7", nama: "Pengembangan Diri", slug: "Pengembangan Diri", icon: User },
];

export function CategoryChips() {
  const router = useRouter();

  return (
    <section aria-labelledby="category-nav-heading" className="w-full space-y-3.5">
      {/* Header Kategori: Judul Navy di Kiri & "Lihat Semua →" di Kanan */}
      <div className="flex items-center justify-between">
        <h2 id="category-nav-heading" className="text-xl sm:text-[22px] font-bold text-heading tracking-tight">
          Jelajahi Kategori
        </h2>
        <Link
          href="/katalog"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Row Chip Kategori Horizontal (Scrollable di Mobile, Flex Wrap di Desktop) */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => {
          const IconComp = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => router.push(`/katalog?kategori=${encodeURIComponent(cat.slug)}`)}
              className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-white px-5 py-2.5 text-[13px] font-semibold text-heading shadow-xs hover:border-primary/40 hover:bg-primary-soft hover:text-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <IconComp className="h-4 w-4 text-primary shrink-0" />
              <span>{cat.nama}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
