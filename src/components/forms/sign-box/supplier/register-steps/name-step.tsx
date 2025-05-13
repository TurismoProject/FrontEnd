"use client";

import { Button } from "@/components/ui/button";
import { useSupplierRegister } from "@/contexts/SupplierRegisterContext";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";

export function NameStep() {
  const router = useRouter();
  const { name, changeName } = useSupplierRegister();

  function handleNextStep(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name) {
      return;
    }

    return router.push("/cadastro/provedor/steps/info");
  }

  return (
    <form className="space-y-6" onSubmit={handleNextStep}>
      <div className="space-y-6">
        <div className="relative w-sm">
          <TextField
            id="name"
            name="name"
            type="text"
            label="Nome"
            value={name}
            onChange={(e) => (changeName ? changeName(e.target.value) : null)}
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
