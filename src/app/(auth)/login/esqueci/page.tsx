import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8 bg-neutral-100">
      <div className="w-full max-w-md">
        <div>
          <div className="shadow-md rounded-lg p-8 space-y-8 bg-white">
            <div className="flex justify-center mb-4">
              <Image src="/logopreta.png" alt="Logo" width={200} height={200} />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
              Esqueceu sua senha?
            </h2>
            <p className="text-center text-sm text-gray-700">
              Insira seu e-mail para resetar a senha.
            </p>

            <form className="space-y-6" action="#" method="POST">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Endereço de e-mail
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-gray-800 focus:border-gray-800 sm:text-sm"
                    placeholder=""
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                >
                  Enviar link de recuperação
                </button>
              </div>

              <div className="text-sm text-center">
                <Link
                  href="/login"
                  className="font-medium text-gray-500 hover:text-gray-400"
                >
                  Voltar para o login
                </Link>
              </div>
            </form>
          </div>
          <div className="flex mt-4 justify-between">
            <p className="text-center text-sm text-gray-600 flex items-center">
              &copy; 2024 Todos os direitos reservados.
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
};

export default ForgotPasswordPage;
