import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon, Minus, Plus } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { IProduct } from "@/lib/interfaces";

export default function GuestPicker({ data }: { data: IProduct }) {
  const [adultsSize, setAdultsSize] = useState<number>(1); // Estado para o tamanh
  const [childrenSize, setChildrenSize] = useState<number>(0); // Estado para o tamanh
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const totalSize = adultsSize + childrenSize;

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
        >
          <div className="flex-col items-start justify-start w-1/5">
            <label className="leading-3 text-xs">PESSOAS</label>
            <div className="text-sm">
              {totalSize} {totalSize === 1 ? "pessoa" : "pessoas"}
            </div>
          </div>
          <div>
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
                disabled={adultsSize === 1}
                tabIndex={adultsSize === 1 ? -1 : undefined}
                variant="outline"
                size="icon"
                className={`border-gray-400 hover:border-gray-800 rounded-full m-auto ${
                  adultsSize === 1 ? "invisible" : ""
                }`}
                onClick={() => {
                  if (adultsSize > 1) {
                    setAdultsSize(adultsSize - 1);
                  }
                }}
              >
                <Minus className="h-5 w-5 text-slate-800" />
              </Button>

              <div className="text-sm flex text-black items-center justify-center">
                {adultsSize}
              </div>
              <Button
                disabled={totalSize === data.maxGroupSize}
                tabIndex={totalSize === data.maxGroupSize ? -1 : undefined}
                variant="outline"
                size="icon"
                className={`border-gray-400 hover:border-gray-800 rounded-full m-auto ${
                  totalSize === data.maxGroupSize ? "invisible" : ""
                }`}
                onClick={() => {
                  if (totalSize < data.maxGroupSize) {
                    setAdultsSize(adultsSize + 1);
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
                disabled={childrenSize === 0}
                tabIndex={childrenSize === 0 ? -1 : undefined}
                variant="outline"
                size="icon"
                className={`border-gray-400 hover:border-gray-800 rounded-full m-auto ${
                  childrenSize === 0 ? "invisible" : ""
                }`}
                onClick={() => {
                  if (childrenSize > 0) {
                    setChildrenSize(childrenSize - 1);
                  }
                }}
              >
                <Minus className="h-5 w-5 text-slate-800" />
              </Button>

              <div className="text-sm flex text-black items-center justify-center">
                {childrenSize}
              </div>
              <Button
                disabled={totalSize === data.maxGroupSize}
                tabIndex={totalSize === data.maxGroupSize ? -1 : undefined}
                variant="outline"
                size="icon"
                className={`border-gray-400 hover:border-gray-800 rounded-full m-auto ${
                  totalSize === data.maxGroupSize ? "invisible" : ""
                }`}
                onClick={() => {
                  if (totalSize < data.maxGroupSize) {
                    setChildrenSize(childrenSize + 1);
                  }
                }}
              >
                <Plus className="h-5 w-5 text-slate-800" />
              </Button>
            </div>
          </div>
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
