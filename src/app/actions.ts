"use server";

import { cookies } from "next/headers";
import z from "zod";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).regex(strongPasswordRegex, {
    message:
      "Senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
  }),
});

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6).regex(strongPasswordRegex, {
    message:
      "Senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
  }),
  cpf: z.string().min(11),
  phoneNumber: z.string().min(11),
  address: z.string().min(3),
  birthday: z.string().min(10),
});

export async function loginUser(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    throw new Error(result.error.message);
  }

  const response = await fetch("http://localhost:3002/usuario/login", {
    method: "POST",
    body: JSON.stringify(result.data),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

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
  const refreshToken = cookieStore.get("refresh-token")?.value;

  if (!refreshToken) {
    return;
  }

  const response = await fetch("http://localhost:3002/usuario/relogar", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  return { accessToken: data.accessToken };
}

export async function getUserBasicInfo(accessToken: string) {
  const response = await fetch("http://localhost:3002/usuario/informacoes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data.user;
}

export async function logoutUser() {
  const cookieStore = cookies();
  cookieStore.delete("refresh-token");

  // TODO: Revogar o refresh token
  // const response = await fetch("http://localhost:3002/usuario/logout", {
  //   method: "POST",
  //   body: JSON.stringify({}),
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   cache: "no-store",
  // })

  return { success: true };
}

export async function checkEmailAvailability(email: string) {
  const response = await fetch("http://localhost:3002/usuario/check-email", {
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
  const response = await fetch("http://localhost:3002/usuario/check-phone", {
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
  const response = await fetch("http://localhost:3002/usuario/check-cpf", {
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

  const result = registerSchema.safeParse({
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

  const response = await fetch("http://localhost:3002/usuario/cadastro", {
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
