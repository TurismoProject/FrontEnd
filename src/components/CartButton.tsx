"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface CartButtonProps {
  color?: boolean;
}

export function CartButton({ color }: CartButtonProps) {
  const { totalItems } = useCart();

  return (
    <Link href="/carrinho">
      <button className="btn btn-ghost btn-circle hover:bg-gray-200/70 active:bg-gray-200 group">
        <div
          className={`indicator ${
            color ? "text-black" : "text-white"
          } group-hover:text-black relative`}
        >
          <ShoppingCart />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
              {totalItems}
            </Badge>
          )}
        </div>
      </button>
    </Link>
  );
}
