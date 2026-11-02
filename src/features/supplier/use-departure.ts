"use client";

import { useCallback, useEffect, useState } from "react";
import { errorMessage, queryString, supplierRequest } from "./api";
import type { Departure, Page } from "./types";

/**
 * O backend ainda não expõe GET de uma saída por ID. Os links levam produto e
 * instante para restringir a consulta; links sem contexto percorrem as páginas.
 * A autorização continua no backend e o ID é sempre conferido na resposta.
 */
export function useDeparture(id: string, productId: string, startsAt: string) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<{
    key: string;
    data?: Departure;
    error?: string;
  }>({ key: "" });
  const key = `${id}:${productId}:${startsAt}:${version}`;
  const reload = useCallback(() => setVersion((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      const instant =
        startsAt && Number.isFinite(Date.parse(startsAt))
          ? new Date(startsAt)
          : null;
      let page = 1;
      while (!controller.signal.aborted) {
        const result = await supplierRequest<Page<Departure>>(
          `saidas?${queryString({
            productId: productId || undefined,
            startsFrom: instant?.toISOString(),
            startsBefore: instant
              ? new Date(instant.getTime() + 1).toISOString()
              : undefined,
            page,
            limit: 100,
          })}`,
          { signal: controller.signal },
        );
        const found = result.items.find((item) => item.id === id);
        if (found) {
          if (!controller.signal.aborted) setState({ key, data: found });
          return;
        }
        if (page * result.limit >= result.total || !result.items.length) break;
        page++;
      }
      if (!controller.signal.aborted)
        throw new Error(
          "Saída não encontrada ou indisponível para esta conta.",
        );
    }
    void load().catch((failure: unknown) => {
      if (!controller.signal.aborted)
        setState({ key, error: errorMessage(failure) });
    });
    return () => controller.abort();
  }, [id, productId, startsAt, key]);

  const current = state.key === key ? state : undefined;
  return {
    data: current?.data,
    error: current?.error,
    loading: !current,
    reload,
  };
}
