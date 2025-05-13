import { SupplierRegisterProvider } from "@/contexts/SupplierRegisterContext";

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SupplierRegisterProvider>{children}</SupplierRegisterProvider>;
}
