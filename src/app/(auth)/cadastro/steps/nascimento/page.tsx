import React from "react";
import { SignBox } from "@/components/forms/sign-box";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8 bg-neutral-100">
      <SignBox type="register" step="birthday" />
    </div>
  );
}
