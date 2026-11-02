"use client";

import { useUserRegister } from "@/contexts/UserRegisterContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StepButton } from "./step-button";
import styles from "../../auth.module.css";

export function PasswordStep() {
  const router = useRouter();
  const {
    password,
    confirmPassword,
    changePassword,
    changeConfirmPassword,
    handleRegisterUser,
  } = useUserRegister();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const mismatch = Boolean(confirmPassword) && password !== confirmPassword;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || !confirmPassword || pending) return;
    setError("");
    if (password !== confirmPassword) {
      setError("As senhas precisam ser iguais.");
      return;
    }
    setPending(true);
    try {
      const success = await handleRegisterUser?.();
      if (success) router.push("/");
      else
        setError(
          "Não foi possível criar sua conta. Confira seus dados e tente novamente.",
        );
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <fieldset className={styles.fields} disabled={pending}>
        <label className={styles.field}>
          Senha
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={256}
            placeholder="Crie uma senha"
            value={password || ""}
            aria-describedby="register-password-hint"
            onChange={(event) => changePassword?.(event.target.value)}
          />
        </label>
        <p id="register-password-hint" className={styles.hint}>
          Use pelo menos 8 caracteres, com letras maiúsculas, minúsculas, número
          e caractere especial.
        </p>
        <label className={styles.field}>
          Confirmar senha
          <input
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={256}
            placeholder="Repita sua senha"
            value={confirmPassword || ""}
            aria-invalid={mismatch}
            aria-describedby={mismatch ? "password-mismatch" : undefined}
            onChange={(event) => changeConfirmPassword?.(event.target.value)}
          />
          {mismatch && (
            <span id="password-mismatch" className={styles.fieldError}>
              As senhas precisam ser iguais.
            </span>
          )}
        </label>
      </fieldset>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <StepButton pending={pending} last />
    </form>
  );
}
