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
      className="group relative flex flex-col overflow-hidden text-left"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/5">
        {/* Badge */}
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 bg-white px-2 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-black">
            {product.badge}
          </span>
        )}

        <motion.img
          src={product.images?.[0] || product.image}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${product.images && product.images.length > 1 ? 'group-hover:opacity-0' : 'group-hover:opacity-80'}`}
        />
        {product.images && product.images.length > 1 && (
          <img
            src={product.images[1]}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-80"
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.25em] text-white">
            التفاصيل
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 pt-3">
        <span className="font-display text-sm font-medium uppercase tracking-widest text-white/90">
          {product.name}
        </span>
        <span className="font-body text-sm font-semibold text-white">
          {product.price.toLocaleString()} ج.م
        </span>
      </div>
    </motion.button>
  );
}
