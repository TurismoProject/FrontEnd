"use client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { useRouter } from "next/navigation";
import { useRegister } from "@/contexts/RegisterContext";

export function BirthdayStep() {
  const router = useRouter();
  const { birthday, changeBirthday } = useRegister();

  function handleNextStep(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!birthday) {
      return;
    }

    return router.push("/cadastro/steps/info");
  }

  return (
    <form className="space-y-6" onSubmit={handleNextStep}>
      <div className="space-y-4">
        <div className="relative w-sm">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Data de nascimento"
              views={["day", "month", "year"]}
              className="w-full"
              value={birthday}
              onChange={(value) =>
                changeBirthday ? changeBirthday(value) : null
              }
              format="DD/MM/YYYY"
            />
          </LocalizationProvider>
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
