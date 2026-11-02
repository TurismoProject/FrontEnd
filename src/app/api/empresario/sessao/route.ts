import { NextRequest, NextResponse } from "next/server";
import {
  authenticatedRequest,
  backendRequest,
  clearSession,
  hasSameOrigin,
  jsonError,
  relayError,
  setSession,
} from "@/lib/supplier-server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return jsonError("Origem não permitida.", 403);
  try {
    const body: unknown = await request.json().catch(() => null);
    if (
      !body ||
      typeof body !== "object" ||
      !("email" in body) ||
      !("password" in body) ||
      typeof body.email !== "string" ||
      typeof body.password !== "string" ||
      body.email.length > 254 ||
      body.password.length > 256
    ) {
      return jsonError("Informe e-mail e senha válidos.", 400);
    }
    const upstream = await backendRequest("provedor/login", {
      method: "POST",
      body: JSON.stringify({
        email: body.email.trim(),
        password: body.password,
      }),
    });
    if (!upstream.ok) return relayError(upstream);
    const data = await upstream.json();
    const response = NextResponse.json(data.supplier, {
      headers: { "Cache-Control": "no-store" },
    });
    setSession(response, data);
    return response;
  } catch {
    return jsonError(
      "Não foi possível acessar o servidor. Tente novamente em instantes.",
      502,
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    return await authenticatedRequest(request, "provedor");
  } catch {
    return jsonError(
      "Não foi possível verificar sua sessão. Tente novamente.",
      502,
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!hasSameOrigin(request)) return jsonError("Origem não permitida.", 403);
  const response = NextResponse.json({
    message: "Sessão encerrada neste navegador.",
  });
  clearSession(response);
  return response;
}
