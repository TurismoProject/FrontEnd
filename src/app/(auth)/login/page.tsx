"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Resetando erro antes da requisição

    try {
      const response = await axios.post("http://localhost:3002/usuario/login", {
        email,
        password,
      });

      console.log("Usuário logado:", response.data);
      // Aqui você pode redirecionar ou salvar o token de autenticação
      router.push("/");
    } catch (err) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
      console.error("Erro no login", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8 bg-neutral-100">
      <div className="w-full max-w-md">
        <div>
          <div className="bg-white shadow-md rounded-lg p-8 space-y-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/logoinicio.png"
                alt="Logo"
                width={200}
                height={200}
              />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
              Entre na sua conta
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Endereço de e-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-100 text-gray-900 bg-white focus:outline-none focus:ring-gray-700 focus:border-gray-700 sm:text-sm"
                    placeholder=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Senha
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-100 text-gray-900 bg-white focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    href="/login/esqueci"
                    className="font-medium text-gray-500 hover:text-gray-400"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Login
                </button>
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
}
