import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const backend =
    process.env.API_URL ||
    process.env.TURISMO_API_URL ||
    "http://127.0.0.1:3003";
  return NextResponse.redirect(
    `${backend.replace(/\/+$/, "")}/usuario/auth/google`,
  );
}
