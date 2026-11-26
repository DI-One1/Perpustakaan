import { NextResponse } from "next/server";
import { hapusSesiAktif } from "@/lib/auth";

export async function POST() {
  await hapusSesiAktif();
  return NextResponse.json({ berhasil: true });
}
