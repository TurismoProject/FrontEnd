import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoImg } from "@/components/cardImport";

function ForgotPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8 bg-neutral-100">
      <div className="grid grid-cols-2 bg-white shadow-md rounded-lg overflow-hidden w-4/5 max-w-5xl">
        {/* Coluna Esquerda com Logo */}
        <div className="hidden md:flex flex-col justify-center p-8 bg-white">
          <Link href="/">
            <Image src={LogoImg} alt="Logo" />
          </Link>
        </div>

        {/* Coluna Direita com Formulário */}
        <div className="w-full p-8 space-y-8">
          <div>
            <h1 className="text-center text-3xl font-extrabold text-gray-900">
              Recuperar Senha
            </h1>
            <p className="text-center text-lg font-normal text-gray-600">
              Insira seu e-mail para enviar o link de recuperação
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder=""
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Enviar Link de Recuperação
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-700">
            Lembrou da sua senha?{" "}
            <Link
              href="/login"
              className="font-medium text-gray-400 hover:text-gray-500"
            >
              Faça login
            </Link>
          </p>
          <p className="text-center text-sm text-gray-700 rounded-sm flex items-center justify-center gap-2">
            <span>Faça o seu Login com a </span>
            <Link
              href="http://localhost:3002/usuario/auth/google"
              className="flex items-center"
            >
              <img src="/google.png" alt="Google Logo" width={20} height={20} />
              oogle
            </Link>
          </p>
          <div className="flex justify-between mt-4">
            <p className="text-sm text-gray-600">
              &copy; 2025 Todos os direitos reservados.
            </p>
            <div className="flex gap-1">
              <Button
                className="bg-transparent text-gray-600 py-0 hover:bg-gray-200/70 text-xs h-8"
                size="sm"
              >
                Termos
              </Button>
              <Button
                className="bg-transparent text-gray-600 py-0 hover:bg-gray-200/70 text-xs h-8"
                size="sm"
              >
                Privacidade
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPage;
