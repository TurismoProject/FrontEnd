import z from "zod";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).regex(strongPasswordRegex, {
    message:
      "Senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
  }),
});

export const registerUserSchema = z.object({
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

export const registerSupplierSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6).regex(strongPasswordRegex, {
    message:
      "Senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
  }),
  cnpj: z.string().min(14),
  phoneNumber: z.string().min(11),
  address: z.string().min(3),
});
