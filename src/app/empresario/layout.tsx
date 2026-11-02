import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Área do empresário | Conheça seu destino",
  description: "Gerencie saídas, reservas e participantes dos seus passeios.",
  robots: { index: false, follow: false },
};

export default function SupplierLayout({ children }: { children: ReactNode }) {
  return <div data-theme="light">{children}</div>;
}
