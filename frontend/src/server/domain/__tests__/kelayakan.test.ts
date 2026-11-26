import { describe, it, expect, vi } from "vitest";
import { cekKelayakanWarga } from "@/server/domain/kelayakan";
import { DomainError } from "@/server/problem";

describe("Domain Rule: Cek Kelayakan Warga", () => {
  it("Memvalidasi pengguna bersih (tanpa pinjaman, tanpa denda, tidak terblokir)", async () => {
    // Mocking query DB untuk persona bersih
    const mockTx: any = vi.fn();
    mockTx
      // 1. Pengguna
      .mockResolvedValueOnce([
        {
          id: "usr-clean",
          nama: "Ahmad Dahlan",
          peran: "warga",
          is_blocked: false,
          blocked_until: null,
          blocked_count: 0,
        },
      ])
      // 2. Pinjaman Aktif
      .mockResolvedValueOnce([])
      // 3. Reservasi Aktif
      .mockResolvedValueOnce([])
      // 4. Denda
      .mockResolvedValueOnce([{ total: 0 }]);

    const result = await cekKelayakanWarga("usr-clean", mockTx);
    expect(result.is_eligible).toBe(true);
    expect(result.alasan_penolakan).toBeNull();
    expect(result.kode_alasan).toBeNull();
  });

  it("Menolak warga yang masih memiliki pinjaman aktif (Maksimal 1 buku)", async () => {
    const mockTx: any = vi.fn();
    mockTx
      .mockResolvedValueOnce([
        {
          id: "usr-loan",
          nama: "Salma Zahira",
          peran: "warga",
          is_blocked: false,
          blocked_until: null,
          blocked_count: 0,
        },
      ])
      // Ada pinjaman aktif
      .mockResolvedValueOnce([{ id: "pinj-1", tanggal_jatuh_tempo: "2026-11-25" }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ total: 0 }]);

    const result = await cekKelayakanWarga("usr-loan", mockTx);
    expect(result.is_eligible).toBe(false);
    expect(result.kode_alasan).toBe("PINJAMAN_AKTIF");
    expect(result.has_active_loan).toBe(true);
  });

  it("Menolak warga yang memiliki tunggakan denda keterlambatan belum lunas", async () => {
    const mockTx: any = vi.fn();
    mockTx
      .mockResolvedValueOnce([
        {
          id: "usr-fined",
          nama: "Rian Pratama",
          peran: "warga",
          is_blocked: false,
          blocked_until: null,
          blocked_count: 0,
        },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      // Denda Rp1.500
      .mockResolvedValueOnce([{ total: 1500 }]);

    const result = await cekKelayakanWarga("usr-fined", mockTx);
    expect(result.is_eligible).toBe(false);
    expect(result.kode_alasan).toBe("DENDA_AKTIF");
    expect(result.total_denda).toBe(1500);
  });

  it("Menolak warga yang terkena sanksi blokir sementara (3x tidak mengambil booking)", async () => {
    const mockTx: any = vi.fn();
    const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    mockTx
      .mockResolvedValueOnce([
        {
          id: "usr-blocked",
          nama: "Bayu Saputra",
          peran: "warga",
          is_blocked: true,
          blocked_until: futureDate,
          blocked_count: 1,
        },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ total: 0 }]);

    const result = await cekKelayakanWarga("usr-blocked", mockTx);
    expect(result.is_eligible).toBe(false);
    expect(result.kode_alasan).toBe("DIBLOKIR_SEMENTARA");
    expect(result.is_blocked).toBe(true);
  });

  it("Menolak warga yang terkena sanksi blokir permanen (3x akumulasi blokir sementara)", async () => {
    const mockTx: any = vi.fn();
    mockTx
      .mockResolvedValueOnce([
        {
          id: "usr-perm-blocked",
          nama: "Siswa Pelanggar",
          peran: "warga",
          is_blocked: true,
          blocked_until: null,
          blocked_count: 3,
        },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ total: 0 }]);

    const result = await cekKelayakanWarga("usr-perm-blocked", mockTx);
    expect(result.is_eligible).toBe(false);
    expect(result.kode_alasan).toBe("DIBLOKIR_PERMANEN");
  });

  it("Melempar error NOT_FOUND jika ID warga tidak terdaftar", async () => {
    const mockTx: any = vi.fn();
    mockTx.mockResolvedValueOnce([]); // Pengguna tidak ditemukan

    await expect(cekKelayakanWarga("usr-invalid", mockTx)).rejects.toThrow(DomainError);
  });
});
