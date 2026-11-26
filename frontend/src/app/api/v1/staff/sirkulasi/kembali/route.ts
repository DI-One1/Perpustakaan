// SEMENTARA: Route Handler Pengembalian Buku Fisik
// Akan digantikan oleh backend permanen Laravel / .NET

import { NextRequest, NextResponse } from "next/server";
import { kembalikanBuku } from "@/server/domain/sirkulasi";
import { DomainError, createProblemResponse } from "@/server/problem";
import { z } from "zod";

const kembaliSchema = z.object({
  nomor_induk_eksemplar: z.string().min(1, "nomor_induk_eksemplar wajib diisi"),
  kondisi: z.enum(["baik", "rusak", "hilang"]).default("baik"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = kembaliSchema.safeParse(body);

    if (!parsed.success) {
      return createProblemResponse({
        type: "https://bilik.smktibazma.sch.id/problems/validasi",
        title: "Validasi Gagal",
        status: 422,
        code: "VALIDATION_ERROR",
        detail: "Format input pengembalian tidak valid.",
        errors: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
    }

    const petugasId = request.headers.get("x-user-id") || "usr-pustakawan-1";

    const result = await kembalikanBuku(
      parsed.data.nomor_induk_eksemplar,
      petugasId,
      parsed.data.kondisi
    );

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof DomainError) {
      return createProblemResponse(err.problem);
    }
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan internal server.";
    return createProblemResponse({
      type: "https://bilik.smktibazma.sch.id/problems/server-error",
      title: "Gagal Memproses Pengembalian",
      status: 500,
      code: "VALIDATION_ERROR",
      detail: msg,
    });
  }
}
