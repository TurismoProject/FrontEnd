"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FooterComponent } from "@/components/Footer";
import { Drawer } from "@/components/ui/drawer";
import { HeaderProduto } from "@/components/Header";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } =
    useCart();

  if (items.length === 0) {
    return (
      <>
        <Drawer>
          <HeaderProduto />
        </Drawer>
        <div className="min-h-screen pt-32 pb-16 px-4 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">
              Parece que você ainda não adicionou nenhum item ao seu carrinho.
            </p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </div>
        <FooterComponent />
      </>
    );
  }

  return (
    <>
      <Drawer>
        <HeaderProduto />
      </Drawer>
      <div className="min-h-screen pt-32 pb-16 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedDate.getTime()}`}
                  className="border-b border-gray-200 p-6 flex flex-col md:flex-row gap-4"
                >
                  <div className="w-full md:w-1/4">
                    <div className="aspect-video relative rounded-md overflow-hidden">
                      <img
                        src={item.product.images[0] || "/placeholder.jpg"}
                        alt={item.product.name}
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-3/4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        Data:{" "}
                        {format(item.selectedDate, "d 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        Horário:{" "}
                        {format(item.selectedDate, "HH:mm", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        Pessoas: {item.adults}{" "}
                        {item.adults === 1 ? "adulto" : "adultos"}
                        {item.children > 0 &&
                          `, ${item.children} ${
                            item.children === 1 ? "criança" : "crianças"
                          }`}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Duração: {item.product.duration}{" "}
                        {item.product.duration === 1 ? "hora" : "horas"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              );
                            }
                          }}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-semibold">
                          R${" "}
                          {(Number(item.product.price) * item.quantity).toFixed(
                            2
                          )}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "itens"}
                    )
                  </span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de serviço</span>
                  <span>R$ 0.00</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Finalizar Compra
              </Button>

              <div className="mt-4">
                <Link
                  href="/"
                  className="text-blue-600 hover:underline text-sm block text-center"
                >
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
}
