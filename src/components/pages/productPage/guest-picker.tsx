import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon, Minus, Plus } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { IProduct } from "@/lib/interfaces";
import { useBooking } from "../../../contexts/BookingContext";

export default function GuestPicker({ data }: { data: IProduct }) {
  const {
    adultsCount,
    setAdultsCount,
    childrenCount,
    setChildrenCount,
    totalGuests,
    selectedDateTime,
    getAvailableSpots,
  } = useBooking();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [availableSpots, setAvailableSpots] = useState<number | null>(null);

  // Update available spots when date/time changes
  useEffect(() => {
    if (selectedDateTime && data.availability) {
      const spots = getAvailableSpots(data.availability);
      setAvailableSpots(spots);
    } else {
      setAvailableSpots(null);
    }
  }, [selectedDateTime, data.availability, getAvailableSpots]);

  // Calculate max allowed guests based on available spots or product max group size
  const maxAllowedGuests =
    availableSpots !== null
      ? Math.min(availableSpots, data.maxGroupSize)
      : data.maxGroupSize;

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="mt-4 w-full flex justify-between p-6 border-gray-600 rounded-lg"
          disabled={!selectedDateTime}
        >
          <div className="flex-col items-start justify-start w-1/5">
            <label className="leading-3 text-xs">PESSOAS</label>
            <div className="text-sm">
              {totalGuests} {totalGuests === 1 ? "pessoa" : "pessoas"}
            </div>
          </div>
          <div>
            {availableSpots !== null && (
              <span className="text-xs mr-2 text-gray-500">
                {availableSpots}{" "}
                {availableSpots === 1 ? "vaga disponível" : "vagas disponíveis"}
              </span>
            )}
            {isOpen ? (
              <ChevronUpIcon
                className="h-5 w-5 text-slate-800"
                aria-hidden="true"
              />
            ) : (
              <ChevronDownIcon
                className="h-5 w-5 text-slate-800"
                aria-hidden="true"
              />
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="bg-white flex w-[340px] p-6 rounded-xl z-[70] relative">
        <div className="w-full">
          <div className="w-full grid grid-cols-2 items-center mb-6 mr-4">
            <div>
              <div className="text-base text-black font-bold">Adultos</div>
              <div className="text-sm text-black">Com 13 anos ou mais</div>
            </div>
            <div className="grid grid-cols-3 w-full">
              <Button
                disabled={adultsCount === 1}
                tabIndex={adultsCount === 1 ? -1 : undefined}
                variant="outline"
                size="icon"
                className={`border-gray-400 hover:border-gray-800 rounded-full m-auto ${
                  adultsCount === 1 ? "invisible" : ""
                }`}
                onClick={() => {
                  if (adultsCount > 1) {
                    setAdultsCount(adultsCount - 1);
                  }
                }}
              >
                <Minus className="h-5 w-5 text-slate-800" />
              </Button>

              <div className="text-sm flex text-black items-center justify-center">
                {adultsCount}
              </div>
              <Button
                disabled={totalGuests === maxAllowedGuests}
                tabIndex={totalGuests === maxAllowedGuests ? -1 : undefined}
                variant="outline"
                size="icon"
                className={`border-gray-400 hover:border-gray-800 rounded-full m-auto ${
                  totalGuests === maxAllowedGuests ? "invisible" : ""
                }`}
                onClick={() => {
                  if (totalGuests < maxAllowedGuests) {
                    setAdultsCount(adultsCount + 1);
                  }
                }}
              >
                <Plus className="h-5 w-5 text-slate-800" />
              </Button>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 items-center">
            <div>
              <div className="text-base text-black font-bold">Crianças</div>
            </div>
            <div className="grid grid-cols-3 w-full">
              <Button
                disabled={childrenCount === 0}
                tabIndex={childrenCount === 0 ? -1 : undefined}
                variant="outline"
                size="icon"
                className={`border-gray-400 hover:border-gray-800 rounded-full m-auto ${
                  childrenCount === 0 ? "invisible" : ""
                }`}
                onClick={() => {
                  if (childrenCount > 0) {
                    setChildrenCount(childrenCount - 1);
                  }
                }}
              >
                <Minus className="h-5 w-5 text-slate-800" />
              </Button>

              <div className="text-sm flex text-black items-center justify-center">
                {childrenCount}
              </div>
              <Button
                disabled={totalGuests === maxAllowedGuests}
                tabIndex={totalGuests === maxAllowedGuests ? -1 : undefined}
                variant="outline"
                size="icon"
                className={`border-gray-400 hover:border-gray-800 rounded-full m-auto ${
                  totalGuests === maxAllowedGuests ? "invisible" : ""
                }`}
                onClick={() => {
                  if (totalGuests < maxAllowedGuests) {
                    setChildrenCount(childrenCount + 1);
                  }
                }}
              >
                <Plus className="h-5 w-5 text-slate-800" />
              </Button>
            </div>
          </div>

          {availableSpots !== null && (
            <div className="mt-4 text-sm text-center text-gray-500">
              {availableSpots}{" "}
              {availableSpots === 1 ? "vaga disponível" : "vagas disponíveis"}{" "}
              para esta data e horário
            </div>
          )}

          <Button
            className="w-full mt-6 hover:bg-slate-700 active:scale-90 transition-all duration-100"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Fechar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
