import { Prisma } from "@prisma/client";
import crypto from "crypto";

interface AuditInput {
  pengguna_id?: string | null;
  konteks_peran: "warga" | "admin" | "admin_master" | "sistem_cron";
  aksi: string;
  pesan_commit: string;
  tabel: string;
  entitas_id: string;
  data_lama?: Prisma.InputJsonValue | null;
  data_baru?: Prisma.InputJsonValue | null;
}

export async function catatAuditCommit(
  tx: Prisma.TransactionClient,
  input: AuditInput
) {
  const kode_commit = crypto.randomBytes(4).toString("hex");
  return tx.logAudit.create({
    data: {
      kode_commit,
      pengguna_id: input.pengguna_id ?? null,
      konteks_peran: input.konteks_peran,
      aksi: input.aksi,
      pesan_commit: input.pesan_commit,
      tabel: input.tabel,
      entitas_id: input.entitas_id,
      data_lama: input.data_lama ?? Prisma.JsonNull,
      data_baru: input.data_baru ?? Prisma.JsonNull,
    },
  });
}
