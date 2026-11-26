import { describe, it, expect, vi } from "vitest";
import { ajukanBooking, ajukanAntrean } from "@/server/domain/reservasi";
import { DomainError } from "@/server/problem";

// Mocking mod kelayakan
vi.mock("@/server/domain/kelayakan", () => ({
  cekKelayakanWarga: vi.fn().mockImplementation(async (id: string) => {
    if (id === "usr-fined") {
      return {
        is_eligible: false,
        kode_alasan: "DENDA_AKTIF",
        alasan_penolakan: "Ada denda aktif",
      };
    }
    return {
      is_eligible: true,
      kode_alasan: null,
      alasan_penolakan: null,
    };
  }),
}));

// Mocking sql client
vi.mock("@/server/db", () => {
  return {
    sql: {
      begin: vi.fn().mockImplementation(async (callback) => {
        // Objek trx mock
        const mockTrx: any = vi.fn();
        return callback(mockTrx);
      }),
    },
  };
});

describe("Domain Rule: Sirkulasi Reservasi & Antrean FIFO", () => {
  it("Menolak booking online jika kuota stok buku berstatus 'tersedia' habis", async () => {
    const { sql } = await import("@/server/db");
    const mockBegin = vi.mocked(sql.begin);

    mockBegin.mockImplementationOnce(async (callback: any) => {
      const mockTrx: any = vi.fn();
      // Eksemplar tidak ditemukan (habis)
      mockTrx.mockResolvedValueOnce([]);
      return callback(mockTrx);
    });

    await expect(ajukanBooking("usr-clean", "buku-empty")).rejects.toThrow(
      DomainError
    );
  });

  it("Menolak pendaftar antrean baru jika batas maksimal antrean dinamis tercapai (Buku 1-5 eksemplar = maks 3 antrean)", async () => {
    const { sql } = await import("@/server/db");
    const mockBegin = vi.mocked(sql.begin);

    mockBegin.mockImplementationOnce(async (callback: any) => {
      const mockTrx: any = vi.fn();
      // Buku memiliki 4 total eksemplar, antrean saat ini sudah 3
      mockTrx.mockResolvedValueOnce([
        {
          id: "buku-small",
          total_eksemplar: 4,
          antrean_saat_ini: 3,
        },
      ]);
      return callback(mockTrx);
    });

    await expect(ajukanAntrean("usr-clean", "buku-small")).rejects.toThrow(
      DomainError
    );
  });

  it("Mengizinkan hingga 5 antrean untuk buku dengan 6+ eksemplar fisik", async () => {
    const { sql } = await import("@/server/db");
    const mockBegin = vi.mocked(sql.begin);

    mockBegin.mockImplementationOnce(async (callback: any) => {
      const mockTrx: any = vi.fn();
      // Buku 8 eksemplar, antrean saat ini 3 -> boleh antre ke-4
      mockTrx
        .mockResolvedValueOnce([
          {
            id: "buku-large",
            total_eksemplar: 8,
            antrean_saat_ini: 3,
          },
        ])
        // Insert reservasi
        .mockResolvedValueOnce([{ id: "res-new" }])
        // Insert audit log
        .mockResolvedValueOnce([]);

      return callback(mockTrx);
    });

    const res = await ajukanAntrean("usr-clean", "buku-large");
    expect(res.posisi_antrean).toBe(4);
    expect(res.maks_antrean).toBe(5);
  });
});
