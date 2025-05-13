import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LogoImg } from "@/components/cardImport";
import Button from "@mui/material/Button";
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8 bg-neutral-100">
      <div className="grid grid-cols-2 bg-white shadow-md rounded-lg overflow-hidden w-3/4">
        <div className="hidden md:flex flex-col justify-center p-8 bg-white">
          <Link href="/">
            <Image src={LogoImg} alt="Logo" />
          </Link>
        </div>

        <div className="w-full p-8 space-y-8">
          <div>
            <h1 className="text-center text-3xl font-extrabold text-gray-900">
              Quem você quer ser?
            </h1>
            <p className="text-center text-lg font-normal text-gray-600">
              Selecione a opção que melhor se encaixa em seu perfil.
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative w-sm">
              <Button
                variant="outlined"
                className="w-full bg-slate-100 border-gray-200 p-2 normal-case hover:bg-gray-200/70 text-black h-12 text-base font-medium"
              >
                <Link href="/cadastro/provedor" className="w-full">
                  <span className="text-black">Quero ser um Provedor</span>
                </Link>
              </Button>
            </div>
            <div className="relative w-sm">
              <Button
                variant="contained"
                className="w-full bg-slate-900 border-gray-200 p-2 normal-case text-white h-12 text-base font-medium"
              >
                <Link href="/cadastro/usuario" className="w-full">
                  <span>Quero ser um Usuário</span>
                </Link>
              </Button>
            </div>
          </div>

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
    </div>
  );
}
