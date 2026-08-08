"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    totalPrice,
    clearCart,
  } = useCartStore();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const total = totalPrice();


  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    const lines = items.map(
      (i) =>
        `• ${i.product.name} (مقاس: ${i.size}) x${i.quantity} = ${(
          i.product.price * i.quantity
        ).toLocaleString()} ج.م`
    );
    const message =
      `*ZEUS — طلب جديد*\n\n` +
      lines.join("\n") +
      `\n\n*الإجمالي: ${total.toLocaleString()} ج.م*\n\nيرجى تأكيد تفاصيل العميل والتوصيل.`;
    const phone = "201000000000"; // placeholder WhatsApp number
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      {isMounted && isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-black/90"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
            className="fixed right-0 top-0 z-[75] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-neutral-950"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="font-display text-lg font-bold uppercase tracking-[0.2em] text-white">
                عربة التسوق
              </span>
              <button
                onClick={closeCart}
                className="text-white/70 transition-colors hover:text-white"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <ShoppingBag size={40} className="text-white/20" />
                  <p className="font-body text-sm text-white/50">
                    عربة التسوق فارغة.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.li
                        key={`${i.product.id}-${i.size}`}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-3"
                      >
                        <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-transparent" style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 80%)' }}>
                          <img
                            src={i.product.image}
                            alt={i.product.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="font-display text-sm font-semibold uppercase tracking-wide text-white">
                              {i.product.name}
                            </p>
                            <p className="font-body text-xs text-white/50">
                              المقاس: {i.size}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-white/15">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    i.product.id,
                                    i.size,
                                    i.quantity - 1
                                  )
                                }
                                className="px-2 py-1 text-white/80 hover:bg-white/10"
                                aria-label="Decrease"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center font-display text-sm text-white">
                                {i.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    i.product.id,
                                    i.size,
                                    i.quantity + 1
                                  )
                                }
                                className="px-2 py-1 text-white/80 hover:bg-white/10"
                                aria-label="Increase"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-body text-sm font-semibold text-white">
                                {(i.product.price * i.quantity).toLocaleString()}
                              </span>
                              <button
                                onClick={() => removeItem(i.product.id, i.size)}
                                className="text-white/40 transition-colors hover:text-red-400"
                                aria-label="Remove item"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 px-5 py-5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-display text-xs uppercase tracking-[0.2em] text-white/50">
                    المجموع الفرعي
                  </span>
                  <span className="font-body text-sm text-white/70">
                    {total.toLocaleString()} ج.م
                  </span>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-display text-base font-bold uppercase tracking-[0.2em] text-white">
                    الإجمالي
                  </span>
                  <span className="font-display text-xl font-bold text-white">
                    {total.toLocaleString()} ج.م
                  </span>
                </div>
                <button
                  onClick={handleWhatsAppCheckout}
                  className="flex w-full items-center justify-center gap-2 bg-[#25D366] py-4 font-display text-sm font-bold uppercase tracking-[0.15em] text-black transition-all hover:bg-[#1ebe5a]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  تأكيد الطلب عبر واتساب
                </button>
                <button
                  onClick={clearCart}
                  className="mt-3 w-full font-body text-xs uppercase tracking-widest text-white/40 transition-colors hover:text-white/80"
                >
                  إفراغ العربة
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
