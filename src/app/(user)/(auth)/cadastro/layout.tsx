import { UserRegisterProvider } from "@/contexts/UserRegisterContext";

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserRegisterProvider>{children}</UserRegisterProvider>;
}
