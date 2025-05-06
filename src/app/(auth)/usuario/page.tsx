"use client";
import { HeaderUsuario } from "@/components/HeaderUsuario";
import { PhoneIcon } from "@heroicons/react/24/solid";
import { Drawer } from "@/components/ui/drawer";

export default function Exemplo() {
  const handlePhoneInput = (e: React.FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value.replace(/\D/g, "");

    if (value.length <= 2) {
      value = `(${value}`;
    } else if (value.length <= 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(
        7,
        11
      )}`;
    }

    e.currentTarget.value = value;
  };

  const handleCepInput = (e: React.FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value.replace(/\D/g, "");

    if (value.length <= 5) {
      value = `${value.slice(0, 5)}`;
    } else {
      value = `${value.slice(0, 5)}-${value.slice(5, 8)}`;
    }

    e.currentTarget.value = value;
  };

  const handleSave = () => {
    alert("Informações salvas com sucesso!");
  };

  const handleChangePassword = () => {
    alert("Você solicitou a alteração de senha!");
  };

  const handleLogout = () => {
    alert("Você saiu da conta!");
  };

  const handleSupport = () => {
    alert("Entrando em contato com o suporte...");
  };

  return (
    <div>
      <Drawer>
        <div className="bg-black">
          <HeaderUsuario />
        </div>
      </Drawer>

      <form className="flex justify-center items-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl space-y-12 bg-white p-8 rounded-lg shadow-lg">
          {/* Seção de Informações Pessoais */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-lg font-semibold text-gray-900 text-center">
              Informações Pessoais
            </h2>
            <p className="mt-1 text-sm text-gray-600 text-center">
              Por favor, preencha os campos abaixo com suas informações
              pessoais.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Campo de Nome Completo */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="full-name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Nome Completo
                </label>
                <div className="mt-2">
                  <input
                    id="full-name"
                    name="full-name"
                    type="text"
                    placeholder="Digite seu nome completo"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* Campo de E-mail */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900"
                >
                  Endereço de E-mail
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="exemplo@dominio.com"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* Campo de Número de Telefone */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-900"
                >
                  Número de Telefone
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <PhoneIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    onInput={handlePhoneInput}
                    placeholder="(XX) XXXX-XXXX"
                    className="block w-full pl-10 pr-3 py-1.5 text-base text-gray-900 border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* Campo de CEP */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="cep"
                  className="block text-sm font-medium text-gray-900"
                >
                  CEP
                </label>
                <div className="mt-2">
                  <input
                    id="cep"
                    name="cep"
                    type="text"
                    onInput={handleCepInput}
                    placeholder="XXXXX-XXX"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* Campo de Estado */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-900"
                >
                  Estado
                </label>
                <div className="mt-2 relative">
                  <select
                    id="state"
                    name="state"
                    className="block w-full rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option>Selecione um Estado</option>
                    <option>Acre</option>
                    <option>Alagoas</option>
                    <option>Amazonas</option>
                    <option>Bahia</option>
                    <option>Ceará</option>
                    <option>Espírito Santo</option>
                    <option>Goiás</option>
                    <option>Maranhão</option>
                    <option>Minas Gerais</option>
                    <option>Pará</option>
                    <option>Paraíba</option>
                    <option>Paraná</option>
                    <option>Pernambuco</option>
                    <option>Piauí</option>
                    <option>Rio de Janeiro</option>
                    <option>Rio Grande do Norte</option>
                    <option>Rio Grande do Sul</option>
                    <option>Rondônia</option>
                    <option>Roraima</option>
                    <option>Santa Catarina</option>
                    <option>São Paulo</option>
                    <option>Sergipe</option>
                    <option>Tocantins</option>
                  </select>
                </div>
              </div>

              {/* Botão de Salvar */}
              <div className="sm:col-span-6 mt-6 text-center">
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full py-2 px-4 bg-slate-400 text-white rounded-md text-sm font-medium hover:bg-slate-500 focus:outline-none focus:ring-2 focus:bg-slate-500"
                >
                  Salvar Informações
                </button>
              </div>
            </div>
          </div>

          {/* Seção de Configurações da Conta */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-lg font-semibold text-gray-900 text-center">
              Configurações da Conta
            </h2>
            <p className="mt-1 text-sm text-gray-600 text-center">
              Atualize sua senha regularmente para manter sua conta segura.
            </p>

            <div className="mt-10 flex flex-col items-center gap-y-6">
              {/* Botão Alterar Senha */}
              <button
                type="button"
                onClick={handleChangePassword}
                className="w-2/4  py-2 px-4 bg-slate-400 text-white rounded-md text-sm font-medium hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                Alterar Senha
              </button>

              {/* Botão Sair da Conta */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-2/4 py-2 px-4 bg-slate-400 text-white rounded-md text-sm font-medium hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                Sair da Conta
              </button>

              {/* Botão Entrar em Contato com Suporte */}
              <button
                type="button"
                onClick={handleSupport}
                className="w-2/4 py-2 px-4full bg-slate-400 text-white rounded-md text-sm  font-medium hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                Entrar em Contato com o Suporte
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
