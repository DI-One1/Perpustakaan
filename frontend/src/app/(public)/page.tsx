import { UtilityBar } from "@/components/layout/utility-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BannerCarousel } from "@/components/home/banner-carousel";
import { CategoryChips } from "@/components/home/category-chips";
import { BookRow } from "@/components/home/book-row";
import { MOCK_BOOKS } from "@/mocks";

export default function HomePage() {
  // Ambil 5 buku persis sesuai dengan tampilan referensi "Baru Ditambahkan"
  const newBooksOrder = ["buku-laskar", "buku-bumi", "buku-hujan", "buku-laut-bercerita", "buku-gadis-kretek"];
  const newBooks = newBooksOrder
    .map((id) => MOCK_BOOKS.find((b) => b.id === id))
    .filter(Boolean) as typeof MOCK_BOOKS;

  // Koleksi buku untuk "Pilihan untuk Anda"
  const personalizedBooks = MOCK_BOOKS.filter(
    (b) => !newBooksOrder.includes(b.id) && (b.is_populer || b.is_pilihan_pekan)
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* 1. Top Information Bar (Navy Blue navy) */}
      <UtilityBar />

      {/* 2. Main Navigation Header (White with Integrated Search & Popular Suggestions) */}
      <Header />

      {/* 3. Main Content Container: max-w 1280px centered */}
      <main className="flex-1 py-5 sm:py-7">
        <div className="mx-auto w-[min(calc(100%-32px),1280px)] sm:w-[min(calc(100%-48px),1280px)] space-y-7 sm:space-y-9">
          {/* Section 1: Featured Hero Banner + Secondary Promotional Banners */}
          <BannerCarousel />

          {/* Section 2: Category Navigation ("Jelajahi Kategori") */}
          <CategoryChips />

          {/* Section 3: Section "Buku Terkini" */}
          <BookRow
            title="Buku Terkini"
            books={newBooks.length > 0 ? newBooks : MOCK_BOOKS.slice(0, 5)}
            viewAllHref="/katalog?filter=baru"
          />

          {/* Section 4: Section "Pilihan untuk Anda" */}
          <BookRow
            title="Pilihan untuk Anda"
            books={personalizedBooks.length > 0 ? personalizedBooks : MOCK_BOOKS.slice(0, 5)}
            viewAllHref="/katalog?filter=pilihan"
          />
        </div>
      </main>

      {/* 4. Footer */}
      <Footer />

      {/* 5. Navigasi Khusus Mobile (< 768px) */}
      <MobileNav />
    </div>
  );
}
