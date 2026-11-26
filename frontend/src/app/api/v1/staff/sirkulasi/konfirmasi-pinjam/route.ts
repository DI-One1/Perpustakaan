// SEMENTARA: Route Handler Konfirmasi Peminjaman Meja Pustakawan
// Akan digantikan oleh backend permanen Laravel / .NET

import { NextRequest, NextResponse } from "next/server";
import { konfirmasiPeminjaman } from "@/server/domain/sirkulasi";
import { DomainError, createProblemResponse } from "@/server/problem";
import { z } from "zod";

const konfirmasiSchema = z.object({
  pengguna_id: z.string().min(1, "pengguna_id wajib diisi"),
  eksemplar_id: z.string().min(1, "eksemplar_id wajib diisi"),
  jalur: z.enum(["booking_online", "langsung_offline"]),
  durasi_hari: z.number().int().min(1).max(30).default(7),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = konfirmasiSchema.safeParse(body);

    if (!parsed.success) {
      return createProblemResponse({
        type: "https://bilik.smktibazma.sch.id/problems/validasi",
        title: "Validasi Gagal",
        status: 422,
        code: "VALIDATION_ERROR",
        detail: "Data transaksi peminjaman tidak valid.",
        errors: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
    }

    const petugasId = request.headers.get("x-user-id") || "usr-pustakawan-1";

    const result = await konfirmasiPeminjaman({
      ...parsed.data,
      petugas_id: petugasId,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof DomainError) {
      return createProblemResponse(err.problem);
    }
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan internal server.";
    return createProblemResponse({
      type: "https://bilik.smktibazma.sch.id/problems/server-error",
      title: "Gagal Mengonfirmasi Pinjaman",
      status: 500,
      code: "VALIDATION_ERROR",
      detail: msg,
    });
  }
}
