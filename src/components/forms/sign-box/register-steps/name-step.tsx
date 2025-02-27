"use client";

import { Button } from "@/components/ui/button";
import { useRegister } from "@/contexts/RegisterContext";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";

export function NameStep() {
  const router = useRouter();
  const { firstName, changeFirstName, lastName, changeLastName } =
    useRegister();

  function handleNextStep(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!firstName || !lastName) {
      return;
    }

    return router.push("/cadastro/steps/nascimento");
  }

  return (
    <form className="space-y-6" onSubmit={handleNextStep}>
      <div className="space-y-6">
        <div className="relative w-sm">
          <TextField
            id="firstname"
            name="firstname"
            type="text"
            label="Nome"
            value={firstName}
            onChange={(e) =>
              changeFirstName ? changeFirstName(e.target.value) : null
            }
            variant="outlined"
            className="w-full"
          />
        </div>
        <div className="relative w-sm">
          <TextField
            id="lastname"
            name="lastname"
            type="text"
            label="Sobrenome"
            value={lastName}
            onChange={(e) =>
              changeLastName ? changeLastName(e.target.value) : null
            }
            variant="outlined"
            className="w-full"
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
