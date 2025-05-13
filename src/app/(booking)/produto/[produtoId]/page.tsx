import ProductPage from "@/components/pages/productPage";
import { BookingProvider } from "@/contexts/BookingContext";
import { IProduct } from "@/lib/interfaces";

export default async function Product({
  params,
}: {
  params: Promise<{ produtoId: string }>;
}) {
  const { produtoId } = await params;

  const response = await fetch(`${process.env.API_URL}/produto`, {
    method: "GET",
    headers: {
      uuid: produtoId,
    },
    cache: "no-store",
  });

  const data: IProduct = await response.json();
  console.log(data); // Exibe os dados no console

  return (
    <BookingProvider>
      <ProductPage data={data} />;
    </BookingProvider>
  );
}
