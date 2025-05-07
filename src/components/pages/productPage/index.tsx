"use client";
import { useState } from "react";
import { FooterComponent } from "@/components/Footer";
import { HeaderProduto } from "@/components/HeaderProduto";
import { Drawer } from "@/components/ui/drawer";
import { IProduct } from "@/lib/interfaces";
import { Rating } from "@/components/ui/rating";
import { Paper } from "@mui/material";
import GuestPicker from "./guest-picker";
import DatePicker from "./date-picker";
import { Button } from "@/components/ui/button";

export default function ProductPage({ data }: { data: IProduct }) {
  const [rating, setRating] = useState<number>(Number.parseFloat(data.rating));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Handle submit
  };

  return (
    <div className="bg-white">
      <Drawer>
        <HeaderProduto />
      </Drawer>
      <div className="pt-6">
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={data.images[0]}
              className="h-full w-full object-cover object-center"
              alt="Logo"
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={data.images[1]}
                className="h-full w-full object-cover object-center"
                alt="Logo"
              />
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={data.images[2]}
                className="h-full w-full object-cover object-center"
                alt="Logo"
              />
            </div>
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={data.images[3]}
                className="h-full w-full object-cover object-center"
                alt="Logo"
              />
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={data.images[4]}
                className="h-full w-full object-cover object-center"
                alt="Logo"
              />
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {data.name}
            </h1>
          </div>

          {/* Options */}
          <Paper className="mt-4 lg:row-span-3 lg:mt-0 p-8" elevation={4}>
            <h2 className="sr-only">Informações do Produto</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              R${Number.parseFloat(data.price).toFixed(2)}
            </p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  <Rating
                    rating={rating}
                    totalStars={5}
                    size={24}
                    variant="yellow"
                    showText={false}
                    onRatingChange={(newRating) => setRating(newRating)}
                  />
                </div>
                <p className="sr-only">{data.rating} de 5 estrelas</p>
                <a
                  href="#"
                  className="ml-3 text-sm font-medium text-slate-800 hover:text-slate-500"
                >
                  {data.reviews.length}{" "}
                  {data.reviews.length !== 1 ? "reviews" : "review"}
                </a>
              </div>
            </div>

            <form className="mt-10" onSubmit={handleSubmit}>
              <div className="mt-10">
                <fieldset aria-label="Escolha uma quantia" className="mt-4">
                  <DatePicker data={data} />

                  <GuestPicker data={data} />
                </fieldset>
              </div>

              <Button
                type="submit"
                size="xl"
                className="w-full mt-6 hover:bg-slate-700 active:scale-90 transition-all duration-100 text-lg"
              >
                Reservar
              </Button>
            </form>
          </Paper>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Descrição</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{data.description}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">
                Incluso no Pacote
              </h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {data.includedItems.map((item) => (
                    <li key={item} className="text-gray-400">
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">
                Não Inclusos
              </h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {data.excludedItems.map((item) => (
                    <li key={item} className="text-gray-400">
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Itinerário</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{data.itinerary}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white text-white">
        <FooterComponent />
      </div>
    </div>
  );
}
