import { NextRequest } from "next/server";
import {
  authenticatedRequest,
  hasSameOrigin,
  jsonError,
} from "@/lib/supplier-server";

export const dynamic = "force-dynamic";
const uuid =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
const reads = [
  /^saidas$/,
  /^painel\/reservas$/,
  new RegExp(`^saidas/${uuid}/reservas$`),
  new RegExp(`^saidas/${uuid}/reservas/${uuid}/historico$`),
];
const writes = [
  new RegExp(
    `^saidas/${uuid}/(?:status|reservas/resolver|participantes/comparecimento)$`,
  ),
];

async function proxy(
  request: NextRequest,
  context: { params: { path: string[] } },
) {
  const path = context.params.path.join("/");
  const isRead = request.method === "GET";
  if (!(isRead ? reads : writes).some((pattern) => pattern.test(path)))
    return jsonError("Rota não encontrada.", 404);
  if (!isRead && !hasSameOrigin(request))
    return jsonError("Origem não permitida.", 403);
  try {
    const body = isRead ? undefined : await request.text();
    if (body && body.length > 100000)
      return jsonError("Solicitação muito grande.", 413);
    return await authenticatedRequest(
      request,
      `provedor/${path}${request.nextUrl.search}`,
      { method: request.method, body },
    );
  } catch {
    return jsonError(
      "Não foi possível acessar o servidor. Atualize os dados antes de repetir uma ação.",
      502,
    );
  }
}

export const GET = proxy;
export const PATCH = proxy;
