import Link from "next/link";
import { AuthLayout } from "../auth-layout";
import UserLoginForm from "./user-login-form";
import styles from "../auth.module.css";

export function UserLoginPage() {
  return (
    <AuthLayout
      titleId="user-login-title"
      eyebrow="SUA PRÓXIMA EXPERIÊNCIA"
      title="Bem-vindo de volta."
      description="Entre para acompanhar suas reservas e planejar sua próxima viagem."
    >
      <UserLoginForm />
      <p className={styles.registerLink}>
        Ainda não tem uma conta? <Link href="/cadastro">Cadastre-se</Link>
      </p>
    </AuthLayout>
  );
}
