// SEMENTARA: Route Handler Booking Online
// Akan digantikan oleh backend permanen Laravel / .NET

import { NextRequest, NextResponse } from "next/server";
import { ajukanBooking } from "@/server/domain/reservasi";
import { DomainError, createProblemResponse } from "@/server/problem";
import { z } from "zod";

const bookingSchema = z.object({
  buku_id: z.string().min(1, "buku_id wajib diisi"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return createProblemResponse({
        type: "https://bilik.smktibazma.sch.id/problems/validasi",
        title: "Validasi Gagal",
        status: 422,
        code: "VALIDATION_ERROR",
        detail: "Format data booking tidak sesuai.",
        errors: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
    }

    // Ambil ID pengguna dari sesi cookie atau header x-user-id (untuk pengujian)
    const userId = request.headers.get("x-user-id") || "usr-warga-2"; // fallback persona bersih

    const result = await ajukanBooking(userId, parsed.data.buku_id);

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof DomainError) {
      return createProblemResponse(err.problem);
    }
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan internal server.";
    return createProblemResponse({
      type: "https://bilik.smktibazma.sch.id/problems/server-error",
      title: "Gagal Mengajukan Booking",
      status: 500,
      code: "VALIDATION_ERROR",
      detail: msg,
    });
  }
}
