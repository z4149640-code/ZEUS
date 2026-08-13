import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProductClient from "@/components/ProductClient";

export const revalidate = 0;

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Fetch product
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch related products (just grab 4 other available products)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .neq("id", params.id)
    .limit(4);

  return <ProductClient product={product} relatedProducts={relatedProducts || []} />;
}
