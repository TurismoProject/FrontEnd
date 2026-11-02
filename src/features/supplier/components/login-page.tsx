"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { errorMessage, supplierRequest } from "../api";
import { ActionButton, ErrorState } from "./shared";
import { BrandLogo } from "./brand-logo";
import styles from "../supplier.module.css";

export function SupplierLoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setExpired(new URLSearchParams(window.location.search).has("expirada"));
    setReady(true);
  }, []);

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginStory}>
        <Link href="/" className={styles.brand}>
          <BrandLogo light className={styles.loginBrandLogo} />
        </Link>
        <div>
          <span className={styles.storyTag}>
            PARA QUEM FAZ A VIAGEM ACONTECER
          </span>
          <h1>
            Mais organização.
            <br />
            Melhores
            <br />
            <em>experiências.</em>
          </h1>
          <p>
            Do primeiro pedido ao último embarque, acompanhe cada detalhe dos
            seus passeios.
          </p>
        </div>
        <span>Seu próximo destino é uma gestão mais simples.</span>
      </div>
      <div className={styles.loginContent}>
        <Link href="/" className={styles.mobileBrand}>
          <BrandLogo />
        </Link>
        <Link className={styles.backLink} href="/">
          <ArrowLeft size={16} />
          Voltar ao site
        </Link>
        <section className={styles.loginCard}>
          <div className={styles.loginIcon}>
            <LockKeyhole size={24} />
          </div>
          <p className={styles.eyebrow}>ÁREA DO EMPRESÁRIO</p>
          <h2>Bem-vindo de volta.</h2>
          <p className={styles.muted}>
            Entre com sua conta de fornecedor para acompanhar suas reservas.
          </p>
          {expired && (
            <p className={styles.notice} role="status">
              Sua sessão expirou. Entre novamente para continuar.
            </p>
          )}
          <form
            method="post"
            action="/api/empresario/sessao"
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              setError("");
              const form = new FormData(event.currentTarget);
              try {
                await supplierRequest("sessao", {
                  method: "POST",
                  body: JSON.stringify({
                    email: form.get("email"),
                    password: form.get("password"),
                  }),
                });
                const destination = new URLSearchParams(
                  window.location.search,
                ).get("destino");
                // Aceita apenas caminhos desta área, impedindo redirecionamento para sites externos.
                const safe =
                  destination &&
                  /^\/empresario(?:\/reservas(?:\/[0-9a-f-]+)?)?(?:\?[^#]*)?$/.test(
                    destination,
                  );
                router.replace(safe ? destination : "/empresario");
                router.refresh();
              } catch (failure) {
                setError(errorMessage(failure));
              } finally {
                setBusy(false);
              }
            }}
          >
            <label className={styles.field}>
              E-mail da empresa
              <input
                type="email"
                name="email"
                autoComplete="username"
                required
                maxLength={254}
                placeholder="voce@suaempresa.com.br"
                disabled={busy || !ready}
              />
            </label>
            <label className={styles.field}>
              Senha
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                maxLength={256}
                placeholder="Sua senha"
                disabled={busy || !ready}
              />
            </label>
            {error && <ErrorState message={error} />}
            <ActionButton
              disabled={busy || !ready}
              className={styles.fullWidth}
            >
              {!ready
                ? "Preparando acesso…"
                : busy
                  ? "Entrando…"
                  : "Entrar no painel"}
              <ArrowRight size={18} />
            </ActionButton>
          </form>
          <p className={styles.loginHelp}>
            Use as credenciais cadastradas como fornecedor na plataforma.
          </p>
        </section>
        <p className={styles.loginFooter}>
          Conheça seu destino · Parceiros de boas experiências
        </p>
      </div>
    </div>
  );
}
