"use client";

import { registerSupplier } from "@/app/actions";
import { safeAsync } from "@/lib/utils";
import { createContext, useContext, useState } from "react";

interface RegisterContextProps {
  email?: string;
  password?: string;
  confirmPassword?: string;
  cnpj?: string;
  phoneNumber?: string;
  address?: string;
  name?: string;
  changeEmail?: (email: string) => void;
  changePassword?: (password: string) => void;
  changeConfirmPassword?: (confirmPassword: string) => void;
  changeCnpj?: (cnpj: string) => void;
  changePhoneNumber?: (phoneNumber: string) => void;
  changeAddress?: (address: string) => void;
  changeName?: (name: string) => void;
  handleRegisterSupplier?: () => Promise<boolean | void>;
}

const SupplierRegisterContext = createContext<RegisterContextProps>({});

export const useSupplierRegister = () => useContext(SupplierRegisterContext);

export function SupplierRegisterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");

  function changeEmail(value: string) {
    setEmail(value);
  }

  function changePassword(value: string) {
    setPassword(value);
  }

  function changeConfirmPassword(value: string) {
    setConfirmPassword(value);
  }

  function changeCnpj(value: string) {
    setCnpj(() =>
      value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1")
    );
  }

  function changePhoneNumber(value: string) {
    setPhoneNumber(() =>
      value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1")
    );
  }

  function changeAddress(value: string) {
    setAddress(value);
  }

  function changeName(value: string) {
    setName(value);
  }

  async function handleRegisterSupplier() {
    const formData: FormData = new FormData();

    formData.append("email", email);
    formData.append("password", password);
    formData.append("cnpj", cnpj);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("name", name);

    const [error, response] = await safeAsync(registerSupplier(formData));
    if (error) {
      console.log(error);
      return;
    }

    if (!response.success) return;

    return response.success;
  }

  return (
    <SupplierRegisterContext.Provider
      value={{
        email,
        password,
        confirmPassword,
        phoneNumber,
        address,
        name,
        cnpj,
        changeEmail,
        changePassword,
        changeConfirmPassword,
        changeCnpj,
        changePhoneNumber,
        changeAddress,
        changeName,
        handleRegisterSupplier,
      }}
    >
      {children}
    </SupplierRegisterContext.Provider>
  );
}
