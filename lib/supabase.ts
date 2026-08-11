import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ProductVariant = {
  colorName: string;
  colorHex: string;
  imageUrl: string;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  sizes: string[];
  variants: ProductVariant[];
  is_available: boolean;
  category?: string;
  description?: string;
  badge?: string;
  size_chart_url?: string;
};

import imageCompression from 'browser-image-compression';

export async function uploadProductImage(file: File) {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  };
  
  let compressedFile = file;
  try {
    compressedFile = await imageCompression(file, options);
  } catch (error) {
    console.error("Error compressing image:", error);
    // Proceed with the original file if compression fails
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
  const { error } = await supabase.storage.from("product-images").upload(fileName, compressedFile, {
    cacheControl: "3600",
    upsert: false,
  });
  
  if (error) {
    throw error;
  }
  
  const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}
