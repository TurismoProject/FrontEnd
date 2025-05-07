import ProductPage from "@/components/pages/productPage";
import { IProduct } from "@/lib/interfaces";

export default async function Product({
  params,
}: {
  params: Promise<{ produtoId: string }>;
}) {
  const { produtoId } = await params;

  const response = await fetch(`http://localhost:3002/produto`, {
    method: "GET",
    headers: {
      uuid: produtoId,
    },
    cache: "no-store",
  });

  const data: IProduct = await response.json();

  return <ProductPage data={data} />;
}
