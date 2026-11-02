"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ArrowUpRight, LayoutDashboard, LogOut, Ticket } from "lucide-react";
import { ApiError, errorMessage, supplierRequest } from "../api";
import type { Supplier } from "../types";
import { ActionButton, ErrorState, LoadingState } from "./shared";
import { BrandLogo } from "./brand-logo";
import styles from "../supplier.module.css";

const SupplierContext = createContext<Supplier | null>(null);
export function useSupplier() {
  const supplier = useContext(SupplierContext);
  if (!supplier)
    throw new Error("useSupplier precisa estar dentro de SupplierShell.");
  return supplier;
}

export function SupplierShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let active = true;
    const expired = () => {
      setSupplier(null);
      router.replace(
        `/empresario/login?expirada=1&destino=${encodeURIComponent(window.location.pathname + window.location.search)}`,
      );
    };
    window.addEventListener("supplier-session-expired", expired);
    supplierRequest<Supplier>("sessao")
      .then((data) => {
        if (active) setSupplier(data);
      })
      .catch((failure: unknown) => {
        if (!active) return;
        if (failure instanceof ApiError && failure.status === 401) {
          router.replace(
            `/empresario/login?destino=${encodeURIComponent(window.location.pathname + window.location.search)}`,
          );
        } else setError(errorMessage(failure));
      });
    return () => {
      active = false;
      window.removeEventListener("supplier-session-expired", expired);
    };
  }, [router, attempt]);

  if (!supplier)
    return (
      <div className={styles.authScreen}>
        {error ? (
          <ErrorState
            message={error}
            retry={() => {
              setError("");
              setAttempt((value) => value + 1);
            }}
          />
        ) : (
          <LoadingState label="Verificando sua sessão…" />
        )}
      </div>
    );

  return (
    <SupplierContext.Provider value={supplier}>
      <div className={styles.workspace}>
        <a className={styles.skipLink} href="#conteudo-empresario">
          Pular para o conteúdo
        </a>
        <aside className={styles.sidebar}>
          <Link className={styles.brand} href="/empresario">
            <BrandLogo />
          </Link>
          <p className={styles.sidebarLabel}>ÁREA DO EMPRESÁRIO</p>
          <nav className={styles.navigation} aria-label="Menu do empresário">
            <Link
              href="/empresario"
              aria-current={pathname === "/empresario" ? "page" : undefined}
            >
              <LayoutDashboard size={19} />
              Visão geral
            </Link>
            <Link
              href="/empresario/reservas"
              aria-current={
                pathname.startsWith("/empresario/reservas") ? "page" : undefined
              }
            >
              <Ticket size={19} />
              Reservas
            </Link>
          </nav>
          <div className={styles.sidebarBottom}>
            <div className={styles.sidebarNote}>
              <span className={styles.onlineDot} />
              Sua operação, em um só lugar.
              <p>Organize as reservas e cuide de cada experiência.</p>
            </div>
            <Link className={styles.publicLink} href="/">
              Ver site público
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </aside>
        <div className={styles.mainColumn}>
          <header className={styles.topbar}>
            <span className={styles.topbarLabel}>Seu espaço de gestão</span>
            <div className={styles.account}>
              <div className={styles.avatar}>
                {supplier.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <strong>{supplier.name}</strong>
                <span>Fornecedor</span>
              </div>
              <ActionButton
                secondary
                disabled={leaving}
                aria-label="Sair da conta"
                onClick={async () => {
                  setLeaving(true);
                  setError("");
                  try {
                    await supplierRequest("sessao", { method: "DELETE" });
                    setSupplier(null);
                    router.replace("/empresario/login");
                  } catch (failure) {
                    setError(errorMessage(failure));
                  } finally {
                    setLeaving(false);
                  }
                }}
              >
                <LogOut size={16} />
                <span className={styles.logoutLabel}>Sair</span>
              </ActionButton>
            </div>
          </header>
          <main id="conteudo-empresario" className={styles.content}>
            {error && <ErrorState message={error} />}
            {children}
          </main>
          <footer className={styles.workspaceFooter}>
            Conheça seu destino · Área do empresário
            <span>Experiências que conectam.</span>
          </footer>
        </div>
      </div>
    </SupplierContext.Provider>
  );
}
