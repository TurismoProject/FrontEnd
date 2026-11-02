import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Store, UserRound } from "lucide-react";
import { AuthLayout } from "@/components/forms/sign-box/auth-layout";
import styles from "@/components/forms/sign-box/auth.module.css";

export const metadata: Metadata = {
  title: "Criar conta | Conheça seu destino",
  description: "Escolha sua conta de usuário ou provedor para começar.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      titleId="register-profile-title"
      eyebrow="CRIE SUA CONTA"
      title="Como você quer começar?"
      description="Escolha o tipo de conta que combina com você."
    >
      <div className={styles.accountChoices}>
        <Link
          href="/cadastro/usuario/steps/nome"
          className={styles.accountChoice}
        >
          <span className={styles.choiceIcon}>
            <UserRound size={22} aria-hidden="true" />
          </span>
          <span className={styles.choiceText}>
            <strong>Usuário</strong>
            <span>Encontre passeios e acompanhe suas reservas.</span>
          </span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <Link
          href="/cadastro/provedor/steps/nome"
          className={styles.accountChoice}
        >
          <span className={styles.choiceIcon}>
            <Store size={22} aria-hidden="true" />
          </span>
          <span className={styles.choiceText}>
            <strong>Provedor</strong>
            <span>Ofereça passeios e gerencie seu negócio.</span>
          </span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <p className={styles.registerLink}>
        Já tem uma conta? <Link href="/login">Entrar</Link>
      </p>
    </AuthLayout>
  );
}
