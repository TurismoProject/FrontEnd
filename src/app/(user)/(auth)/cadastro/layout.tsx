import { UserRegisterProvider } from "@/contexts/UserRegisterContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar conta | Conheça seu destino",
  description:
    "Crie sua conta para descobrir passeios e planejar sua próxima viagem.",
};

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserRegisterProvider>{children}</UserRegisterProvider>;
}
