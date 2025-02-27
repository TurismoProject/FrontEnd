"use client";

import { registerUser } from "@/app/actions";
import { safeAsync } from "@/lib/utils";
import { Dayjs } from "dayjs";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

interface RegisterContextProps {
  email?: string;
  password?: string;
  confirmPassword?: string;
  birthday?: Dayjs | null;
  cpf?: string;
  phoneNumber?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  changeEmail?: (email: string) => void;
  changePassword?: (password: string) => void;
  changeConfirmPassword?: (confirmPassword: string) => void;
  changeBirthday?: (birthday: Dayjs | null) => void;
  changeCpf?: (cpf: string) => void;
  changePhoneNumber?: (phoneNumber: string) => void;
  changeAddress?: (address: string) => void;
  changeFirstName?: (name: string) => void;
  changeLastName?: (name: string) => void;
  handleRegisterUser?: () => Promise<boolean | void>;
}

const RegisterContext = createContext<RegisterContextProps>({});

export const useRegister = () => useContext(RegisterContext);

export function RegisterProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState<Dayjs | null>(null);
  const [cpf, setCpf] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { setJWTAccessToken } = useAuth();

  function changeEmail(value: string) {
    setEmail(value);
  }

  function changePassword(value: string) {
    setPassword(value);
  }

  function changeConfirmPassword(value: string) {
    setConfirmPassword(value);
  }

  function changeBirthday(value: Dayjs | null) {
    setBirthday(value);
  }

  function changeCpf(value: string) {
    setCpf(() =>
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

  function changeFirstName(value: string) {
    setFirstName(value);
  }

  function changeLastName(value: string) {
    setLastName(value);
  }

  async function handleRegisterUser() {
    const formData: FormData = new FormData();

    formData.append("email", email);
    formData.append("password", password);
    formData.append("birthday", birthday?.toDate().toISOString() ?? "");
    formData.append("cpf", cpf);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("name", `${firstName} ${lastName}`);

    const [error, response] = await safeAsync(registerUser(formData));
    if (error) {
      console.log(error);
      return;
    }

    if (!response.success) return;

    if (setJWTAccessToken) {
      setJWTAccessToken(response.data?.accessToken);
    }

    return response.success;
  }

  return (
    <RegisterContext.Provider
      value={{
        email,
        password,
        confirmPassword,
        birthday,
        cpf,
        phoneNumber,
        address,
        firstName,
        lastName,
        changeEmail,
        changePassword,
        changeConfirmPassword,
        changeBirthday,
        changeCpf,
        changePhoneNumber,
        changeAddress,
        changeFirstName,
        changeLastName,
        handleRegisterUser,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
}
