import { supabase } from "@/lib/supabase";
import HomeClient from "@/components/HomeClient";

// Opt out of caching for now to always fetch fresh products
export const revalidate = 0;

export default async function HomePage() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true); // Optional filter

  return <HomeClient products={products || []} />;
}
