import React from "react";
import { SupplierSignBox } from "@/components/forms/sign-box";

export default function LoginSupplierPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8 bg-neutral-100">
      <SupplierSignBox type="login" />
    </div>
  );
}
