import React from "react";
import {
  House,
  User,
  Package,
  Bell,
  Search,
  LogOut,
  Settings,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import * as Tooltip from "@radix-ui/react-tooltip";

const Graficovendas = dynamic(() => import("./graficos"), { ssr: false });

export default function AdmPage() {
  return (
    <div className="flex h-screen">
      <div className="bg-gray-800 text-white w-25 flex-shrink-0 flex flex-col justify-between">
        <div>
          <div className="p-6">
            <div className="flex justify-center mb-4">
              <Image src="/iconebranco.png" alt="Logo" width={70} height={70} />
            </div>
          </div>

          <nav className="mt-12">
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <a
                    href="#"
                    className=" py-2.5 px-12 rounded transition duration-200 hover:bg-gray-700 flex flex-col items-center"
                  >
                    <House className="w-6 h-6 text-white mb-1" />
                  </a>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-white select-none rounded-[4px] bg-black px-[15px] py-[10px] text-[15px] leading-none shadow-md will-change-[transform,opacity]"
                    sideOffset={5}
                  >
                    Home
                    <Tooltip.Arrow className="fill-black" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <a
                    href="#"
                    className="py-2.5 px-12 rounded transition duration-200 hover:bg-gray-700 flex flex-col items-center"
                  >
                    <User className="w-6 h-6 text-white mb-1" />
                  </a>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-white select-none rounded-[4px] bg-black px-[15px] py-[10px] text-[15px] leading-none shadow-md will-change-[transform,opacity]"
                    sideOffset={5}
                  >
                    Perfil
                    <Tooltip.Arrow className="fill-black" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <a
                    href="#"
                    className=" py-2.5 px-12 rounded transition duration-200 hover:bg-gray-700 flex flex-col items-center"
                  >
                    <Package className="w-6 h-6 text-white mb-1" />
                  </a>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-white select-none rounded-[4px] bg-black px-[15px] py-[10px] text-[15px] leading-none shadow-md will-change-[transform,opacity]"
                    sideOffset={5}
                  >
                    Fornecedor
                    <Tooltip.Arrow className="fill-black" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </nav>
        </div>

        <div className="mb-6">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <a
                  href="#"
                  className=" py-2.5 px-12 rounded transition duration-200 hover:bg-gray-700 flex flex-col items-center"
                >
                  <Settings className="w-6 h-6 text-white mb-1" />
                </a>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-white select-none rounded-[4px] bg-black px-[15px] py-[10px] text-[15px] leading-none shadow-md will-change-[transform,opacity]"
                  sideOffset={5}
                >
                  Ajustes
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <a
                  href="#"
                  className="py-2.5 px-12 rounded transition duration-200 hover:bg-gray-700 flex flex-col items-center"
                >
                  <LogOut className="w-6 h-6 text-white mb-1" />
                </a>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-white select-none rounded-[4px] bg-black px-[15px] py-[10px] text-[15px] leading-none shadow-md will-change-[transform,opacity]"
                  sideOffset={5}
                >
                  Desconectar-se
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="flex items-center mb-6 relative">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Search className="text-black absolute left-4" />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-white select-none rounded-[4px] bg-black px-[15px] py-[10px] text-[15px] leading-none shadow-md will-change-[transform,opacity]"
                  sideOffset={5}
                >
                  Pesquisar
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>

          <Input
            type="text"
            placeholder="Pesquise por datas, vendas, membros..."
            className="w-full bg-white p-input input-bordered input-lg outline-none pl-12 flex items-center gap-2 shadow max-w-7xl min-w-96 text-black rounded-full"
          />

          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Bell className="text-black absolute right-4 cursor-pointer" />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-white select-none rounded-[4px] bg-black px-[15px] py-[10px] text-[15px] leading-none shadow-md will-change-[transform,opacity]"
                  sideOffset={5}
                >
                  Notificações
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>

        <div className="text-black ">
          <h2 className="text-2xl font-semibold mb-6">
            Página de Administração
          </h2>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Cadastrados</h3>
              <p>+10000</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Vendas</h3>
              <p>+10000</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Faturamento</h3>
              <p>+10000</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <Graficovendas />
        </div>
      </div>
    </div>
  );
}
