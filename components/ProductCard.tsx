"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/supabase";
import { useTranslations, useLocale } from "next-intl";

type Props = {
  product: Product;
  index?: number;
};

export default function ProductCard({ product, index = 0 }: Props) {
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const t = useTranslations("Storefront");
  const locale = useLocale();
  
  const activeVariant = product.variants?.[activeVariantIndex] || product.variants?.[0];

  return (
    <Link href={`/product/${product.id}`} className="group relative flex flex-col text-left">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
        className="w-full"
      >
        {/* ── Outer glow halo (matches reference: large white bloom behind product) ── */}
        <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
          {/* Large radial white glow — the main backlight bloom */}
          <div
            className="absolute inset-0 rounded-sm"
            style={{
              background:
                "radial-gradient(ellipse at 50% 55%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.22) 35%, rgba(255,255,255,0.06) 65%, transparent 85%)",
              filter: "blur(24px)",
              transform: "scale(1.18)",
            }}
          />

          {/* Hover: intensified bloom */}
          <div
            className="absolute inset-0 rounded-sm opacity-0 transition-all duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(ellipse at 50% 55%, rgba(255,255,255,0.70) 0%, rgba(255,255,255,0.35) 40%, rgba(255,255,255,0.08) 70%, transparent 90%)",
              filter: "blur(28px)",
              transform: "scale(1.22)",
            }}
          />

          {/* Badge */}
          {product.badge && (
            <span className="absolute left-2 top-2 z-20 bg-white px-2 py-1 font-display text-[9px] font-bold uppercase tracking-widest text-black shadow-md">
              {product.badge}
            </span>
          )}

          {/* Product image — rendered on top of glow */}
          <div className="relative z-10 h-full w-full overflow-hidden">
            <motion.div
              key={activeVariant?.images?.[0] || (activeVariant as any)?.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 h-full w-full transition-all duration-500 group-hover:scale-[1.04]"
            >
              <Image
                src={activeVariant?.images?.[0] || (activeVariant as any)?.imageUrl || "/placeholder.png"}
                alt={product.title}
                fill
                quality={100}
                className="object-contain"
              />
            </motion.div>
          </div>

          {/* Bottom CTA on hover */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-center pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="bg-white/10 px-4 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-sm">
              {t('details')}
            </span>
          </div>
        </div>

        {/* ── Card info ─────────────────────────────────────────────────────── */}
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2 text-start">
            <div className="flex flex-col gap-1">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-white/90 transition-colors duration-300 group-hover:text-white">
                {locale === 'en' && product.title_en ? product.title_en : product.title}
              </span>
              <span className="font-body text-sm font-semibold text-white/60 transition-colors duration-300 group-hover:text-white/90">
                {product.price.toLocaleString()} {locale === 'en' ? 'EGP' : 'ج.م'}
              </span>
            </div>
            
            {/* Color Swatches */}
            {product.variants && product.variants.length > 1 && (
              <div className="flex gap-2 flex-wrap justify-end relative z-30 pointer-events-auto">
                {product.variants.map((variant, idx) => (
                  <div
                    key={idx}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigating to product page
                      e.stopPropagation();
                      setActiveVariantIndex(idx);
                    }}
                    onMouseEnter={() => setActiveVariantIndex(idx)}
                    className={`h-6 w-6 cursor-pointer rounded-full border transition-all duration-300 ${
                      activeVariantIndex === idx ? "border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "border-white/20 hover:border-white/60"
                    }`}
                    style={{ backgroundColor: variant.colorHex }}
                    title={variant.colorName}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
