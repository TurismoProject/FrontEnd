/** Erro HTTP preservado para distinguir sessão expirada de falhas transitórias. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Tokens ficam nos cookies HttpOnly do servidor; o navegador só recebe dados públicos. */
export async function supplierRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`/api/empresario/${path}`, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && path !== "sessao") {
      window.dispatchEvent(new Event("supplier-session-expired"));
    }
    throw new ApiError(
      data?.message || "Não foi possível concluir a solicitação.",
      response.status,
    );
  }
  return data as T;
}

export function queryString(
  values: Record<string, string | number | undefined>,
) {
  const query = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  return query.toString();
}

export function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Ocorreu um erro inesperado. Tente novamente.";
}
