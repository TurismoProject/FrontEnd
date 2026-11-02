"use client";

import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { getUserBasicInfo, loginUser } from "@/app/actions";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { safeAsync } from "@/lib/utils";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import styles from "../auth.module.css";

function LoginFields() {
  const { pending } = useFormStatus();
  return (
    <fieldset className={styles.fields} disabled={pending}>
      <label className={styles.field}>
        E-mail
        <input
          name="email"
          type="email"
          autoComplete="username"
          placeholder="voce@exemplo.com"
          maxLength={254}
          required
        />
      </label>
      <label className={styles.field}>
        Senha
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          maxLength={256}
          required
        />
      </label>
    </fieldset>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={styles.submit}
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? "Entrando…" : "Entrar na minha conta"}
      {pending ? (
        <LoaderCircle size={18} className={styles.spinner} aria-hidden="true" />
      ) : (
        <ArrowRight size={18} aria-hidden="true" />
      )}
    </button>
  );
}

export default function UserLoginForm() {
  const { setJWTAccessToken, setUserData } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleAction(formData: FormData) {
    setError("");
    const [loginError, response] = await safeAsync(loginUser(formData));
    if (loginError) {
      setError(
        "Não foi possível entrar. Confira seu e-mail e senha e tente novamente.",
      );
      return;
    }
    if (!setJWTAccessToken || !setUserData) {
      setError(
        "Não foi possível iniciar sua sessão. Atualize a página e tente novamente.",
      );
      return;
    }
    const [profileError, userData] = await safeAsync(
      getUserBasicInfo(response.accessToken),
    );
    if (profileError) {
      setError("Não foi possível carregar sua conta. Tente novamente.");
      return;
    }
    setJWTAccessToken(response.accessToken);
    setUserData({
      name: userData?.name || "",
      email: formData.get("email") as string,
    });
    router.push("/");
  }

  return (
    <form className={styles.form} action={handleAction}>
      <LoginFields />
      <Link href="/login/esqueci" className={styles.forgotLink}>
        Esqueceu sua senha?
      </Link>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
