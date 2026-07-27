"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/mockData";
import { useCartStore } from "@/lib/store";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const reset = () => {
    setSize(null);
    setQty(1);
  };

  const handleAdd = () => {
    if (!product || !size) return;
    for (let i = 0; i < qty; i++) addItem(product, size);
    onClose();
    reset();
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-sm border border-white/10 bg-neutral-950 md:grid-cols-2 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 z-10 text-white/70 transition-colors hover:text-white"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            {/* Image */}
            <div className="relative aspect-[3/4] w-full bg-white/5 md:aspect-auto">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-5 p-6 sm:p-8">
              <div>
                <span className="font-display text-xs uppercase tracking-[0.3em] text-white/40">
                  {product.category}
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                  {product.name}
                </h2>
                <p className="mt-2 font-body text-xl font-semibold text-white">
                  {product.price.toLocaleString()} ج.م
                </p>
              </div>

              <p className="font-body text-sm leading-relaxed text-white/60">
                {product.description}
              </p>

              {/* Size selector */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs uppercase tracking-[0.2em] text-white/50">
                    اختر المقاس
                  </span>
                  <button
                    className="font-body text-xs text-white/40 underline hover:text-white/80"
                    onClick={() => alert("سيتم إضافة دليل المقاسات قريباً.")}
                  >
                    دليل المقاسات
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-[48px] border px-3 py-2 font-display text-sm font-semibold uppercase tracking-wider transition-all ${
                        size === s
                          ? "border-white bg-white text-black"
                          : "border-white/20 text-white/80 hover:border-white/60"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <span className="font-display text-xs uppercase tracking-[0.2em] text-white/50">
                  الكمية
                </span>
                <div className="mt-3 flex w-fit items-center border border-white/20">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-white/80 transition-colors hover:bg-white/10"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-display text-base font-semibold text-white">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3 py-2 text-white/80 transition-colors hover:bg-white/10"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                disabled={!size}
                className="mt-2 w-full bg-white py-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-white/50"
              >
                {size ? "أضف إلى العربة" : "الرجاء اختيار مقاس"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
