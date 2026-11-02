"use client";

import { checkCpfAvailability, checkPhoneAvailability } from "@/app/actions";
import { useUserRegister } from "@/contexts/UserRegisterContext";
import { safeAsync } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StepButton } from "./step-button";
import styles from "../../auth.module.css";

export function BasicInfoStep() {
  const router = useRouter();
  const {
    cpf,
    phoneNumber,
    address,
    changeCpf,
    changePhoneNumber,
    changeAddress,
  } = useUserRegister();
  const [cpfError, setCpfError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleNextStep(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cpf || !phoneNumber || !address || pending) return;
    setError("");
    setPending(true);
    try {
      const [[cpfFailure, cpfResponse], [phoneFailure, phoneResponse]] =
        await Promise.all([
          safeAsync(checkCpfAvailability(cpf)),
          safeAsync(checkPhoneAvailability(phoneNumber)),
        ]);
      if (
        cpfFailure ||
        phoneFailure ||
        !cpfResponse ||
        !phoneResponse ||
        typeof cpfResponse.inUse !== "boolean" ||
        typeof phoneResponse.inUse !== "boolean"
      ) {
        setError("Não foi possível verificar seus dados. Tente novamente.");
        return;
      }
      setCpfError(Boolean(cpfResponse.inUse));
      setPhoneError(Boolean(phoneResponse.inUse));
      if (cpfResponse.inUse || phoneResponse.inUse) return;
      router.push("/cadastro/usuario/steps/email");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleNextStep}>
      <fieldset className={styles.fields} disabled={pending}>
        <label className={styles.field}>
          CPF
          <input
            name="cpf"
            inputMode="numeric"
            maxLength={14}
            placeholder="000.000.000-00"
            required
            value={cpf || ""}
            aria-invalid={cpfError}
            aria-describedby={cpfError ? "cpf-error" : undefined}
            onChange={(event) => changeCpf?.(event.target.value)}
          />
          {cpfError && (
            <span id="cpf-error" className={styles.fieldError}>
              Este CPF já está cadastrado.
            </span>
          )}
        </label>
        <label className={styles.field}>
          Telefone
          <input
            name="phoneNumber"
            type="tel"
            autoComplete="tel"
            maxLength={15}
            placeholder="(82) 99999-9999"
            required
            value={phoneNumber || ""}
            aria-invalid={phoneError}
            aria-describedby={phoneError ? "phone-error" : undefined}
            onChange={(event) => changePhoneNumber?.(event.target.value)}
          />
          {phoneError && (
            <span id="phone-error" className={styles.fieldError}>
              Este telefone já está cadastrado.
            </span>
          )}
        </label>
        <label className={styles.field}>
          Endereço
          <input
            name="address"
            autoComplete="street-address"
            placeholder="Rua, número, bairro e cidade"
            required
            value={address || ""}
            onChange={(event) => changeAddress?.(event.target.value)}
          />
        </label>
      </fieldset>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <StepButton pending={pending} />
    </form>
  );
}
