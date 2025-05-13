"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  UserRound,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Boxes,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onAddProductClick: () => void;
}

export function Sidebar({ collapsed, setCollapsed, onAddProductClick }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard");

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/provedor",
    },
    {
      id: "inventory",
      label: "Inventário",
      icon: Boxes,
      href: "/provedor/inventario",
    },
    {
      id: "orders",
      label: "Pedidos e Vendas",
      icon: ShoppingCart,
      href: "/provedor/pedidos",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "/provedor/analytics",
    },
    {
      id: "settings",
      label: "Configurações",
      icon: Settings,
      href: "/provedor/config",
    },
    {
      id: "profile",
      label: "Perfil",
      icon: UserRound,
      href: "/provedor/perfil",
    },
    {
      id: "help",
      label: "Suporte",
      icon: HelpCircle,
      href: "/provedor/suporte",
    },
  ];

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <Link href="/provedor" className="flex items-center gap-2">
            <Image
              src="/logopreta.png"
              width={40}
              height={40}
              alt="Logo"
              className="h-10 w-10"
            />
            <span className="font-semibold text-lg">Supplier</span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto">
            <Image
              src="/logopreta.png"
              width={32}
              height={32}
              alt="Logo"
              className="h-8 w-8"
            />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors",
                activeItem === item.id
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
          
          {/* Add Product Button */}
          <button
            onClick={onAddProductClick}
            className={cn(
              "flex items-center px-3 py-2 rounded-md transition-colors w-full text-left",
              "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            <PlusCircle size={20} />
            {!collapsed && <span className="ml-3">Adicionar produto</span>}
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className={cn(
            "flex items-center w-full text-red-500 hover:bg-red-50 hover:text-red-700",
            collapsed ? "justify-center px-2" : "justify-start px-3"
          )}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
}
