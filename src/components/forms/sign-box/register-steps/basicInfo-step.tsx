"use client";

import { checkCpfAvailability, checkPhoneAvailability } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/contexts/RegisterContext";
import { safeAsync } from "@/lib/utils";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BasicInfoStep() {
  const router = useRouter();
  const {
    cpf,
    phoneNumber,
    address,
    changeCpf,
    changePhoneNumber,
    changeAddress,
  } = useRegister();
  const [cpfError, setCpfError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  async function handleNextStep(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!cpf || !phoneNumber || !address) {
      return;
    }

    const [_, cpfResponse] = await safeAsync(checkCpfAvailability(cpf));

    if (cpfResponse.inUse) setCpfError(() => true);
    else setCpfError(() => false);

    const [_e, phoneResponse] = await safeAsync(
      checkPhoneAvailability(phoneNumber)
    );

    if (phoneResponse.inUse) setPhoneError(() => true);
    else setPhoneError(() => false);

    if (phoneResponse.inUse || cpfResponse.inUse) return;

    return router.push("/cadastro/steps/email");
  }

  return (
    <form className="space-y-6" onSubmit={handleNextStep}>
      <div className="space-y-4">
        <div className="relative w-sm">
          <TextField
            id="cpf"
            name="cpf"
            type="text"
            label="CPF"
            variant="outlined"
            className="w-full"
            value={cpf}
            error={cpfError}
            onChange={(e) => (changeCpf ? changeCpf(e.target.value) : null)}
          />
        </div>
        <div className="relative w-sm">
          <TextField
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            label="Telefone"
            variant="outlined"
            className="w-full"
            value={phoneNumber}
            error={phoneError}
            onChange={(e) =>
              changePhoneNumber ? changePhoneNumber(e.target.value) : null
            }
          />
        </div>
        <div className="relative w-sm">
          <TextField
            id="address"
            name="address"
            type="text"
            label="Endereço"
            variant="outlined"
            className="w-full"
            value={address}
            onChange={(e) =>
              changeAddress ? changeAddress(e.target.value) : null
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
          Próximo
        </Button>
      </div>
    </form>
  );
}
