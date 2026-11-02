"use client";

import { useUserRegister } from "@/contexts/UserRegisterContext";
import { useRouter } from "next/navigation";
import { StepButton } from "./step-button";
import styles from "../../auth.module.css";

export function NameStep() {
  const router = useRouter();
  const { firstName, changeFirstName, lastName, changeLastName } =
    useUserRegister();

  function handleNextStep(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!firstName?.trim() || !lastName?.trim()) return;
    router.push("/cadastro/usuario/steps/nascimento");
  }

  return (
    <form className={styles.form} onSubmit={handleNextStep}>
      <div className={styles.fields}>
        <label className={styles.field}>
          Nome
          <input
            name="firstname"
            autoComplete="given-name"
            placeholder="Seu nome"
            required
            value={firstName || ""}
            onChange={(event) => changeFirstName?.(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          Sobrenome
          <input
            name="lastname"
            autoComplete="family-name"
            placeholder="Seu sobrenome"
            required
            value={lastName || ""}
            onChange={(event) => changeLastName?.(event.target.value)}
          />
        </label>
      </div>
      <StepButton />
    </form>
  );
}
