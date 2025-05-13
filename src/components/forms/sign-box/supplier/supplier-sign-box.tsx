import { LogoImg } from "@/components/cardImport";
import Button from "@mui/material/Button";
import Image from "next/image";
import Link from "next/link";
import SupplierLoginForm from "./supplier-login-form";
import RegisterSteps from "./register-steps";

interface SignFormProps {
  type: "register" | "login";
  step?: "name" | "email" | "basicInfo" | "password";
}

export function SupplierSignBox({ type, step }: SignFormProps) {
  if (type === "register" && !step) throw new Error("Missing step");

  return (
    <div className="grid grid-cols-2 bg-white shadow-md rounded-lg overflow-hidden w-3/4">
      <div className="hidden md:flex flex-col justify-center p-8 bg-white">
        <Link href="/">
          <Image src={LogoImg} alt="Logo" />
        </Link>
      </div>

      <div className="w-full p-8 space-y-8">
        <Title type={type} step={step} />

        {type === "login" ? (
          <SupplierLoginForm />
        ) : (
          <RegisterSteps step={step} />
        )}

        <ExtraButtons type={type} />

        <div className="flex justify-between mt-4">
          <p className="text-sm text-gray-600">
            &copy; 2025 Todos os direitos reservados.
          </p>
          <div className="flex gap-1">
            <Button className="bg-transparent text-gray-600 py-0 hover:bg-gray-200/70 text-xs h-8 normal-case">
              Termos
            </Button>
            <Button className="bg-transparent text-gray-600 py-0 hover:bg-gray-200/70 text-xs h-8 normal-case">
              Privacidade
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExtraButtons({ type }: { type: "register" | "login" }) {
  if (type === "register")
    return (
      <>
        {/* <p className="text-center text-sm text-gray-700">
          Você já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-medium text-gray-400 hover:text-gray-500"
          >
            Faça login
          </Link>
        </p>
        <p className="text-center text-sm text-gray-700 rounded-sm">
          Faça o seu Login com a google
        </p> */}
      </>
    );

  if (type === "login")
    return (
      <>
        <p className="text-center text-sm text-gray-700">
          Não tem uma conta?{" "}
          <Link
            href="/cadastro/provedor/steps/nome"
            className="font-medium text-gray-400 hover:text-gray-500"
          >
            Cadastre-se
          </Link>
        </p>
        <p className="text-center text-sm text-gray-700 rounded-sm">
          Faça o seu Login com a google
        </p>
      </>
    );
}

function Title({ type, step }: SignFormProps) {
  return (
    <div>
      <h1 className="text-center text-3xl font-extrabold text-gray-900">
        {type === "login"
          ? "Bem-vindo de volta!"
          : step === "name" || step === "basicInfo"
          ? "Informações Básicas"
          : step === "password"
          ? "Crie sua senha"
          : "Crie sua conta"}
      </h1>
      <p className="text-center text-lg font-normal text-gray-600">
        {type === "login"
          ? ""
          : step === "name"
          ? "Nos diga seu nome"
          : step === "email"
          ? "Insira seu email"
          : step === "basicInfo"
          ? "Nos diga mais sobre você"
          : "Crie sua conta"}
      </p>
    </div>
  );
}
