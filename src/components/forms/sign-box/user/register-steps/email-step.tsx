"use client";

import { checkEmailAvailability } from "@/app/actions";
import { useUserRegister } from "@/contexts/UserRegisterContext";
import { safeAsync } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StepButton } from "./step-button";
import styles from "../../auth.module.css";

export function EmailStep() {
  const router = useRouter();
  const { email, changeEmail } = useUserRegister();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleNextStep(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || pending) return;
    setError("");
    setPending(true);
    try {
      const [failure, response] = await safeAsync(
        checkEmailAvailability(email),
      );
      if (failure || !response || typeof response.inUse !== "boolean") {
        setError("Não foi possível verificar seu e-mail. Tente novamente.");
        return;
      }
      if (response.inUse) {
        setError(
          "Este e-mail já está cadastrado. Entre na sua conta ou use outro e-mail.",
        );
        return;
      }
      router.push("/cadastro/usuario/steps/senha");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleNextStep}>
      <fieldset className={styles.fields} disabled={pending}>
        <label className={styles.field}>
          E-mail
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            required
            maxLength={254}
            value={email || ""}
            aria-describedby={error ? "register-email-error" : undefined}
            onChange={(event) => changeEmail?.(event.target.value)}
          />
        </label>
      </fieldset>
      {error && (
        <p id="register-email-error" className={styles.error} role="alert">
          {error}
        </p>
      )}
      <StepButton pending={pending} />
    </form>
  );
}
