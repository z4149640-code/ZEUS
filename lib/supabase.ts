import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Each color variant now carries an array of images (main shot, back, close-up, etc.)
export type ProductVariant = {
  colorName: string;
  colorName_en?: string;
  colorHex: string;
  images: string[];
  disabledSizes?: string[];
};

// A volume/bundle discount tier (e.g., Buy 2 for 700 EGP)
export type ProductOffer = {
  quantity: number;
  price: number; // total price for `quantity` units
};

export type Product = {
  id: string;
  title: string;
  title_en?: string;
  price: number;
  sizes: string[];
  variants: ProductVariant[];
  is_available: boolean;
  category?: string;
  description?: string;
  description_en?: string;
  badge?: string;
  size_chart_url?: string;
  offers?: ProductOffer[];
};

import imageCompression from 'browser-image-compression';

export async function uploadProductImage(file: File) {
  const options = {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.95,
  };
  
  let compressedFile = file;
  try {
    compressedFile = await imageCompression(file, options);
  } catch (error) {
    console.error("Error compressing image:", error);
    // Proceed with the original file if compression fails
  }

  const formData = new FormData();
  formData.append('file', compressedFile);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    throw new Error('Cloudinary cloud name is missing in environment variables.');
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error?.message || 'Failed to upload image to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
}
