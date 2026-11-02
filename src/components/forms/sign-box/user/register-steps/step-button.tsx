import { ArrowRight, LoaderCircle } from "lucide-react";
import styles from "../../auth.module.css";

export function StepButton({
  pending = false,
  last = false,
}: {
  pending?: boolean;
  last?: boolean;
}) {
  return (
    <button
      type="submit"
      className={styles.submit}
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? "Aguarde…" : last ? "Criar minha conta" : "Continuar"}
      {pending ? (
        <LoaderCircle size={18} className={styles.spinner} aria-hidden="true" />
      ) : (
        <ArrowRight size={18} aria-hidden="true" />
      )}
    </button>
  );
}
