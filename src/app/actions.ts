"use server";

import { SupplierDashboard } from "@/lib/interfaces";
import {
  loginSchema,
  registerUserSchema,
  registerSupplierSchema,
} from "@/schemas/auth-schema";
import { cookies } from "next/headers";

export async function loginUser(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    throw new Error(result.error.message);
  }

  const response = await fetch(`${process.env.API_URL}/usuario/login`, {
    method: "POST",
    body: JSON.stringify(result.data),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data: { accessToken: string; refreshToken: string; message: string } =
    await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  const cookieStore = cookies();
  cookieStore.set("refresh-token", data.refreshToken, {
    httpOnly: true,
  });

  return { accessToken: data.accessToken };
}

export async function loginSupplier(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    throw new Error(result.error.message);
  }

  const response = await fetch(`${process.env.API_URL}/provedor/login`, {
    method: "POST",
    body: JSON.stringify(result.data),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data: {
    accessToken: string;
    refreshToken: string;
    message: string;
  } = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  const cookieStore = cookies();
  cookieStore.set("refresh-token", data.refreshToken, {
    httpOnly: true,
  });

  return { accessToken: data.accessToken };
}

export async function recreateAccessToken() {
  const cookieStore = cookies();
  const refreshToken: string | undefined =
    cookieStore.get("refresh-token")?.value;

  if (!refreshToken) {
    console.log("No refresh token found");
    return;
  }

  const response = await fetch(`${process.env.API_URL}/usuario/relogar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    next: {
      revalidate: 15 * 60,
    },
  });

  const data = await response.json();

  return { accessToken: data.accessToken };
}

export async function getUserBasicInfo(accessToken: string) {
  const response = await fetch(`${process.env.API_URL}/usuario/informacoes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  console.log(data); // TODO: Remover depois do teste

  return data.user;
}

export async function logoutUser() {
  const cookieStore = cookies();
  const refreshToken: string | undefined =
    cookieStore.get("refresh-token")?.value;

  // TODO: Revogar o refresh token
  const response = await fetch(`${process.env.API_URL}/usuario/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    cache: "no-store",
  });

  cookieStore.delete("refresh-token");
  return { success: true };
}

export async function checkEmailAvailability(email: string) {
  const response = await fetch(`${process.env.API_URL}/usuario/check-email`, {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}

export async function checkPhoneAvailability(phoneNumber: string) {
  const response = await fetch(`${process.env.API_URL}/usuario/check-phone`, {
    method: "POST",
    body: JSON.stringify({
      phone: phoneNumber,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}

export async function checkCpfAvailability(cpf: string) {
  const response = await fetch(`${process.env.API_URL}/usuario/check-cpf`, {
    method: "POST",
    body: JSON.stringify({
      cpf,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const cpf = formData.get("cpf");
  const phoneNumber = formData.get("phoneNumber");
  const address = formData.get("address");
  const birthday = formData.get("birthday");

  console.log(cpf);

  const result = registerUserSchema.safeParse({
    name,
    email,
    password,
    cpf,
    phoneNumber,
    address,
    birthday,
  });

  if (!result.success)
    return {
      success: false,
      message: result.error.message,
    };

  const response = await fetch(`${process.env.API_URL}/usuario/cadastro`, {
    method: "POST",
    body: JSON.stringify(result.data),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
    };
  }

  const cookieStore = cookies();
  cookieStore.set("refresh-token", data.refreshToken, {
    httpOnly: true,
  });

  return {
    success: true,
    data,
  };
}

export async function registerSupplier(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const cnpj = formData.get("cnpj");
  const phoneNumber = formData.get("phoneNumber");
  const address = formData.get("address");

  const result = registerSupplierSchema.safeParse({
    name,
    email,
    password,
    cnpj,
    phoneNumber,
    address,
  });

  const response = await fetch(`${process.env.API_URL}/provedor/cadastro`, {
    method: "POST",
    body: JSON.stringify(result.data),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

export async function getSupplierDashboardData(accessToken: string) {
  const response = await fetch(`${process.env.API_URL}/provedor/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: SupplierDashboard = await response.json();

  console.log(data); // TODO: Remover depois do testek

  return data;
}
