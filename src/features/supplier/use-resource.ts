"use client";

import { useCallback, useEffect, useState } from "react";
import { errorMessage, supplierRequest } from "./api";

/** Descarta respostas antigas quando os filtros mudam e permite recarregar sem navegar. */
export function useResource<T>(path: string | null) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<{ key: string; data?: T; error?: string }>(
    { key: "" },
  );
  const key = `${path}:${version}`;
  const reload = useCallback(() => setVersion((value) => value + 1), []);

  useEffect(() => {
    if (path === null) return;
    const controller = new AbortController();
    supplierRequest<T>(path, { signal: controller.signal })
      .then((data) => setState({ key, data }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setState({ key, error: errorMessage(error) });
      });
    return () => controller.abort();
  }, [path, key]);

  const current = state.key === key ? state : undefined;
  return {
    data: current?.data,
    error: current?.error,
    loading: path !== null && !current,
    reload,
  };
}
