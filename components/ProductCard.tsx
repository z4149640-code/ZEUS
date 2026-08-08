"use client";

import { motion } from "framer-motion";
import type { Product } from "@/lib/mockData";

type Props = {
  product: Product;
  onOpen: (p: Product) => void;
  index?: number;
};

export default function ProductCard({ product, onOpen, index = 0 }: Props) {
  return (
    <motion.button
      onClick={() => onOpen(product)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group relative flex flex-col text-left"
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
          <motion.img
            src={product.images?.[0] || product.image}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-contain transition-all duration-500 group-hover:scale-[1.04] ${
              product.images && product.images.length > 1
                ? "group-hover:opacity-0"
                : ""
            }`}
          />
          {product.images && product.images.length > 1 && (
            <img
              src={product.images[1]}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 z-10 h-full w-full object-contain opacity-0 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
            />
          )}
        </div>

        {/* Bottom CTA on hover */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-center pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="bg-white/10 px-4 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-sm">
            التفاصيل
          </span>
        </div>
      </div>

      {/* ── Card info ─────────────────────────────────────────────────────── */}
      <div className="mt-3 flex flex-col gap-1">
        <span className="font-display text-sm font-semibold uppercase tracking-widest text-white/90 transition-colors duration-300 group-hover:text-white">
          {product.name}
        </span>
        <span className="font-body text-sm font-semibold text-white/60 transition-colors duration-300 group-hover:text-white/90">
          {product.price.toLocaleString()} ج.م
        </span>
      </div>
    </motion.button>
  );
}
