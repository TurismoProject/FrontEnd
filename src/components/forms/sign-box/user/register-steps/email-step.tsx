"use client";

import { checkEmailAvailability } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useUserRegister } from "@/contexts/UserRegisterContext";
import { safeAsync } from "@/lib/utils";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function EmailStep() {
  const router = useRouter();
  const { email, changeEmail } = useUserRegister();
  const [error, setError] = useState(false);

  async function handleNextStep(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email) {
      return;
    }

    const [_, response] = await safeAsync(checkEmailAvailability(email));

    if (response.inUse) return setError(() => true);

    return router.push("/cadastro/steps/senha");
  }

  return (
    <form className="space-y-6" onSubmit={handleNextStep}>
      <div className="space-y-4">
        <div className="relative w-sm">
          <TextField
            id="email"
            name="email"
            type="email"
            label="Endereço de e-mail"
            variant="outlined"
            className="w-full"
            value={email}
            error={error}
            onChange={(e) => (changeEmail ? changeEmail(e.target.value) : null)}
          />
        </div>
      </div>
      <div>
        <Button
          type="submit"
          size="xl"
          className="text-lg w-full text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Próximo
        </Button>
      </div>
    </form>
  );
}
