import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoImg } from "@/components/cardImport";

function RotaPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8 bg-neutral-100">
      <div className="grid grid-cols-2 bg-white shadow-md rounded-lg overflow-hidden max-w-4xl w-full">
        <div className="hidden md:flex flex-col p-8 bg-white">
          <Link href="/">
            <Image src={LogoImg} alt="Logo" />
          </Link>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Cadastre a sua conta
          </h2>
        </div>

        <div className="w-full p-8 space-y-8">
          <form className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="CPF"
                  className="block text-sm font-medium text-gray-700"
                >
                  CPF
                </label>
                <input
                  id="CPF"
                  name="CPF"
                  type="CPF"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="andress"
                  className="block text-sm font-medium text-gray-700"
                >
                  Endereço
                </label>
                <input
                  id="adress"
                  name="adress"
                  type="adress"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="birthday"
                  className="block text-sm font-medium text-gray-700"
                >
                  Data de Nascimento
                </label>
                <input
                  id="birthday"
                  name="birthday"
                  type="birthday"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Registrar
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-700">
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
          </p>
          <div className="flex justify-between mt-4">
            <p className="text-sm text-gray-600">
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
}

export default RotaPage;
