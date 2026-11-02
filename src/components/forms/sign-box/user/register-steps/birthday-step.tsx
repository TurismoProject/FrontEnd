"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useUserRegister } from "@/contexts/UserRegisterContext";
import { StepButton } from "./step-button";
import styles from "../../auth.module.css";

export function BirthdayStep() {
  const router = useRouter();
  const { birthday, changeBirthday } = useUserRegister();

  function handleNextStep(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!birthday?.isValid()) return;
    router.push("/cadastro/usuario/steps/info");
  }

  return (
    <form className={styles.form} onSubmit={handleNextStep}>
      <label className={styles.field}>
        Data de nascimento
        <input
          name="birthday"
          type="date"
          autoComplete="bday"
          required
          value={birthday?.format("YYYY-MM-DD") || ""}
          onChange={(event) =>
            changeBirthday?.(
              event.target.value ? dayjs(event.target.value) : null,
            )
          }
        />
      </label>
      <StepButton />
    </form>
  );
}
