import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "./prisma";
import { KodePeran } from "@prisma/client";

export const SESSION_COOKIE_NAME = "bilik_session";

export async function buatSesi(pengguna_id: string, konteks: KodePeran = "warga") {
  const token = crypto.randomBytes(32).toString("hex");
  const kedaluwarsa_pada = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.sesi.create({
    data: {
      token,
      pengguna_id,
      konteks_peran_aktif: konteks,
      kedaluwarsa_pada,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: kedaluwarsa_pada,
  });

  return token;
}

export async function ambilSesiAktif() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const sesi = await prisma.sesi.findUnique({
    where: { token },
    include: { pengguna: true },
  });

  if (!sesi || sesi.kedaluwarsa_pada < new Date() || sesi.pengguna.deleted_at) {
    return null;
  }

  return sesi;
}

export async function hapusSesiAktif() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await prisma.sesi.deleteMany({ where: { token } });
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}
