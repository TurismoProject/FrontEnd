import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE = "turismo_supplier_access";
const REFRESH_COOKIE = "turismo_supplier_refresh";
type Tokens = { accessToken: string; refreshToken: string };
const refreshes = new Map<string, Promise<Tokens | null>>();

/** Endereço privado do NestJS; nunca depende de uma URL fornecida pelo navegador. */
export function backendRequest(path: string, init: RequestInit = {}) {
  const base = process.env.TURISMO_API_URL || "http://127.0.0.1:3003";
  return fetch(`${base.replace(/\/$/, "")}/${path}`, {
    ...init,
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(15000),
    headers: { "Content-Type": "application/json", ...init.headers },
  });
}

export function setSession(response: NextResponse, tokens: Tokens) {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/api/empresario",
  };
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    ...options,
    maxAge: 15 * 60,
  });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
    ...options,
    maxAge: 7 * 86400,
  });
}

export function clearSession(response: NextResponse) {
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE]) {
    response.cookies.set(name, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/api/empresario",
      maxAge: 0,
    });
  }
}

export function jsonError(message: string, status: number) {
  return NextResponse.json(
    { message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

/** Cookies autenticam mutações somente quando originadas neste frontend. */
export function hasSameOrigin(request: NextRequest) {
  // Next pode normalizar o hostname da URL para localhost. O Host preserva
  // o endereço que o navegador usou (por exemplo, 127.0.0.1 em desenvolvimento).
  const host = request.headers.get("host");
  return (
    Boolean(host) &&
    request.headers.get("origin") === `${request.nextUrl.protocol}//${host}`
  );
}

export async function relayError(response: Response) {
  const body = await response.json().catch(() => null);
  const message = Array.isArray(body?.message)
    ? body.message.join(" ")
    : body?.message;
  return jsonError(
    typeof message === "string"
      ? message
      : "Não foi possível concluir a solicitação.",
    response.status,
  );
}

/** Deduplica a rotação de refresh dentro desta instância do servidor Next. */
function refreshSession(token: string): Promise<Tokens | null> {
  const existing = refreshes.get(token);
  if (existing) return existing;
  const pending = (async () => {
    const response = await backendRequest("provedor/relogar", {
      method: "POST",
      body: JSON.stringify({ refreshToken: token }),
    });
    if (response.status === 401) return null;
    if (!response.ok) throw new Error("Não foi possível renovar a sessão.");
    return response.json() as Promise<Tokens>;
  })();
  refreshes.set(token, pending);
  // Mantém a mesma resposta por alguns segundos para chamadas simultâneas com o cookie antigo.
  void pending
    .finally(() => {
      const timer = setTimeout(() => refreshes.delete(token), 5000);
      timer.unref();
    })
    .catch(() => undefined);
  return pending;
}

/** Encaminha apenas rotas previamente autorizadas pelo Route Handler. */
export async function authenticatedRequest(
  request: NextRequest,
  path: string,
  init: RequestInit = {},
) {
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  let tokens: Tokens | null = null;
  let upstream = access
    ? await backendRequest(path, {
        ...init,
        headers: { Authorization: `Bearer ${access}` },
      })
    : null;
  if ((!upstream || upstream.status === 401) && refresh) {
    tokens = await refreshSession(refresh);
    if (tokens)
      upstream = await backendRequest(path, {
        ...init,
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });
    else upstream = null;
  }
  if (!upstream || upstream.status === 401) {
    const response = jsonError(
      "Sua sessão expirou. Entre novamente para continuar.",
      401,
    );
    clearSession(response);
    return response;
  }
  const response = upstream.ok
    ? NextResponse.json(await upstream.json(), {
        headers: { "Cache-Control": "no-store" },
      })
    : await relayError(upstream);
  if (tokens) setSession(response, tokens);
  return response;
}
