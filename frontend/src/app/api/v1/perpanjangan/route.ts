// SEMENTARA: Route Handler Ajuan Perpanjangan Pinjaman Warga
// Akan digantikan oleh backend permanen Laravel / .NET

import { NextRequest, NextResponse } from "next/server";
import { ajukanPerpanjangan } from "@/server/domain/perpanjangan";
import { DomainError, createProblemResponse } from "@/server/problem";
import { z } from "zod";

const perpanjanganSchema = z.object({
  pinjaman_id: z.string().min(1, "pinjaman_id wajib diisi"),
  alasan: z.string().min(5, "Alasan perpanjangan wajib diisi minimal 5 karakter"),
  durasi_hari_diminta: z.number().int().min(1).max(14).default(7),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = perpanjanganSchema.safeParse(body);

    if (!parsed.success) {
      return createProblemResponse({
        type: "https://bilik.smktibazma.sch.id/problems/validasi",
        title: "Validasi Gagal",
        status: 422,
        code: "VALIDATION_ERROR",
        detail: "Input ajuan perpanjangan tidak valid.",
        errors: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
    }

    const userId = request.headers.get("x-user-id") || "usr-warga-3";

    const result = await ajukanPerpanjangan({
      pinjaman_id: parsed.data.pinjaman_id,
      pengguna_id: userId,
      alasan: parsed.data.alasan,
      durasi_hari_diminta: parsed.data.durasi_hari_diminta,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof DomainError) {
      return createProblemResponse(err.problem);
    }
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan internal server.";
    return createProblemResponse({
      type: "https://bilik.smktibazma.sch.id/problems/server-error",
      title: "Gagal Mengajukan Perpanjangan",
      status: 500,
      code: "VALIDATION_ERROR",
      detail: msg,
    });
  }
}
