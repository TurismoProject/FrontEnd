import { Search } from "lucide-react";
import { BannerComponent, BannerProgress } from "@/components/Banner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cardArr } from "@/components/cardImport";
import { ShoppingCard } from "@/components/ShoppingCard";

export default function MainPage() {
  return (
    <main>
      <Carousel opts={{ loop: true }} className="group">
        <BannerComponent />
        <BannerProgress />
        <CarouselNext className="h-full w-16 bg-transparent border-0 text-white rounded-none" />
        <CarouselPrevious className="h-full w-16 bg-transparent border-0 text-white rounded-none" />
      </Carousel>
      <div className="w-3/4 mx-auto flex flex-col mt-20">
        <div className="w-3/4 mx-auto gap-6 flex flex-col items-center">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl mb-4 text-center font-bold text-black tracking-tighter">
              Você procura, nós encontramos.
            </h1>
            <p className="text-lg text-center text-gray-500">
              Encontre o lugar perfeito para sua próxima viagem.
            </p>
          </div>
          <label className="input input-bordered input-lg bg-white flex items-center gap-2 max-w-7xl w-full rounded-full shadow-lg min-w-96 pr-0">
            <Input
              type="text"
              placeholder="Aonde você quer ir? Hotéis, Pousadas, Cidades..."
              className="grow"
            />
            <Button className="rounded-full h-full gap-2">
              <Search />
              <div>BUSCAR</div>
            </Button>
          </label>
        </div>
        <div className="my-32">
          <h2 className="mb-6 text-xl font-medium text-gray-950">
            Aventuras para a família
          </h2>
          <Carousel opts={{ loop: false, align: "start" }}>
            <CarouselContent>
              {cardArr.map((card, index) => (
                <CarouselItem
                  key={index}
                  className={`pl-6 md:basis-1/3 lg:basis-1/4`}
                >
                  <ShoppingCard
                    title={
                      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. "
                    }
                    image={card}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="translate-x-1/2 rounded-full border-2 text-black hover:bg-gray-200 disabled:invisible transition-all" />
            <CarouselPrevious className="-translate-x-1/2 rounded-full border-2 text-black hover:bg-gray-200 disabled:invisible transition-all" />
          </Carousel>
        </div>
      </div>
    </main>
  );
}
