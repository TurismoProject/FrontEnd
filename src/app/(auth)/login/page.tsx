import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8 bg-neutral-100">
      <div className="w-full max-w-md">
        <div>
          <div className="bg-white shadow-md rounded-lg p-8 space-y-8">
            <div className="flex justify-center mb-4">
              <Image src="/logopreta.png" alt="Logo" width={200} height={200} />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
              Entre na sua conta
            </h2>
            <LoginForm />
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

export default LoginPage;
