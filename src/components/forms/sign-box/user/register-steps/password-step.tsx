"use client";

import { Button } from "@/components/ui/button";
import { useUserRegister } from "@/contexts/UserRegisterContext";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";

export function PasswordStep() {
  const router = useRouter();
  const {
    password,
    confirmPassword,
    changePassword,
    changeConfirmPassword,
    handleRegisterUser,
  } = useUserRegister();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) return;

    const success = await handleRegisterUser?.();

    if (success) {
      router.push("/");
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="relative w-sm">
          <TextField
            id="password"
            name="password"
            type="password"
            label="Senha"
            variant="outlined"
            className="w-full"
            value={password}
            onChange={(e) =>
              changePassword ? changePassword(e.target.value) : null
            }
          />
        </div>
        <div className="relative w-sm">
          <TextField
            id="confirm-password"
            error={password !== confirmPassword}
            name="confirm-password"
            type="password"
            label="Confirmar senha"
            variant="outlined"
            className="w-full"
            value={confirmPassword}
            onChange={(e) =>
              changeConfirmPassword
                ? changeConfirmPassword(e.target.value)
                : null
            }
          />
        </div>
      </div>
      <div>
        <Button
          type="submit"
          size="xl"
          className="text-lg w-full text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Registrar
        </Button>
      </div>
    </form>
  );
}
