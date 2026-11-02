import type { ReactNode } from "react";
import { SupplierShell } from "@/features/supplier/components/supplier-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <SupplierShell>{children}</SupplierShell>;
}
