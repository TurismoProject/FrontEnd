import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthLayout } from "../auth-layout";
import { UserLoginPage } from "./user-login-page";
import RegisterSteps from "./register-steps";
import styles from "../auth.module.css";

const registrationSteps = [
  {
    id: "name",
    label: "Seu nome",
    path: "nome",
    title: "Crie sua conta.",
    description:
      "Vamos começar pelo seu nome. Sua próxima experiência está mais perto.",
  },
  {
    id: "birthday",
    label: "Nascimento",
    path: "nascimento",
    title: "Quando você nasceu?",
    description: "Informe sua data de nascimento para continuar o cadastro.",
  },
  {
    id: "basicInfo",
    label: "Seus dados",
    path: "info",
    title: "Seus dados de contato.",
    description:
      "Preencha seus dados para identificar sua conta e facilitar o contato sobre suas reservas.",
  },
  {
    id: "email",
    label: "E-mail",
    path: "email",
    title: "Qual é seu e-mail?",
    description:
      "Você vai usá-lo para entrar na sua conta e acompanhar suas reservas.",
  },
  {
    id: "password",
    label: "Senha",
    path: "senha",
    title: "Crie sua senha.",
    description:
      "Falta pouco! Escolha uma senha para proteger o acesso à sua conta.",
  },
] as const;

interface SignFormProps {
  type: "register" | "login";
  step?: "name" | "email" | "birthday" | "basicInfo" | "password";
}

export default function UserSignBox({ type, step }: SignFormProps) {
  if (type === "login") return <UserLoginPage />;
  const index = registrationSteps.findIndex((item) => item.id === step);
  const current = registrationSteps[index];
  if (!current) throw new Error("Etapa de cadastro inválida.");
  const previous = registrationSteps[index - 1];

  return (
    <AuthLayout
      titleId="user-register-title"
      eyebrow="CRIE SUA CONTA"
      title={current.title}
      description={current.description}
      storyTitle={
        <>
          Sua próxima
          <br />
          história
          <br />
          começa aqui.
        </>
      }
      storyDescription="Encontre experiências, planeje seus passeios e tenha suas reservas sempre por perto."
    >
      <div
        className={styles.progress}
        role="group"
        aria-label="Progresso do cadastro"
      >
        <p>
          <span>
            Etapa {index + 1} de {registrationSteps.length}
          </span>
          <strong>{current.label}</strong>
        </p>
        <ol>
          {registrationSteps.map((item, position) => (
            <li
              key={item.id}
              aria-current={position === index ? "step" : undefined}
              data-complete={position < index || undefined}
            >
              <span className={styles.srOnly}>{item.label}</span>
            </li>
          ))}
        </ol>
      </div>
      <RegisterSteps step={step} />
      {previous && (
        <nav className={styles.stepBack} aria-label="Navegação do cadastro">
          <Link
            href={`/cadastro/usuario/steps/${previous.path}`}
            className={styles.backLink}
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Voltar à etapa anterior
          </Link>
        </nav>
      )}
      <p className={styles.registerLink}>
        Já tem uma conta? <Link href="/login">Entrar</Link>
      </p>
    </AuthLayout>
  );
}
