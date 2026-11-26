import { NextResponse } from "next/server";

export function problemResponse(
  status: number,
  code: string,
  title: string,
  detail: string,
  instance?: string
) {
  return NextResponse.json(
    {
      type: `https://bilik.smktibazma.sch.id/problems/${code.toLowerCase().replace(/_/g, "-")}`,
      title,
      status,
      code,
      detail,
      instance: instance ?? "/api/v1",
    },
    {
      status,
      headers: { "Content-Type": "application/problem+json" },
    }
  );
}
