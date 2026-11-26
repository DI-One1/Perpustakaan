/**
 * Tipe dan Pembantu Format Error Standar RFC 9457 (Problem Details for HTTP APIs)
 */

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  code:
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "VALIDATION_ERROR"
    | "PINJAMAN_AKTIF"
    | "RESERVASI_AKTIF"
    | "DENDA_AKTIF"
    | "DIBLOKIR_SEMENTARA"
    | "DIBLOKIR_PERMANEN"
    | "ANTREAN_PENUH"
    | "STOK_HABIS"
    | "EKSEMPLAR_DIBOOKING_ORANG_LAIN"
    | "DURASI_TIDAK_VALID";
  detail: string;
  instance?: string;
  errors?: Array<{ field: string; message: string }>;
}

export class DomainError extends Error {
  public problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(problem.detail);
    this.name = "DomainError";
    this.problem = problem;
  }
}

export function createProblemResponse(problem: ProblemDetails): Response {
  return new Response(JSON.stringify(problem), {
    status: problem.status,
    headers: {
      "Content-Type": "application/problem+json",
    },
  });
}
