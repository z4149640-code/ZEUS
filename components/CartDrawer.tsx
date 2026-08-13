"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore, getItemLinePrice } from "@/lib/store";
import { useTranslations, useLocale } from "next-intl";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "يرجى إدخال الاسم الكامل"),
  phone1: z.string().min(10, "يرجى إدخال رقم هاتف صحيح"),
  phone2: z.string().optional(),
  address: z.string().min(10, "يرجى إدخال العنوان بالتفصيل"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    totalPrice,
    clearCart,
    isCheckoutMode,
    setCheckoutMode,
  } = useCartStore();

  const t = useTranslations("Storefront");
  const locale = useLocale();

  const [isMounted, setIsMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset checkout state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setCheckoutMode(false), 300);
      reset();
    }
  }, [isOpen, reset, setCheckoutMode]);

  const total = totalPrice();

  const generateWhatsAppMessage = (data: CheckoutFormData) => {
    const orderLines = items.map(
      (i) => `Product: ${i.product.title}
Size: ${i.size}
Color: ${i.color}
Quantity: ${i.quantity}
Link: ${window.location.origin}/product/${i.product.id}
------------------------`
    ).join("\n");

    const message = `*New Order - ZEUS Store* ⚡
------------------------
*Customer Details:*
Name: ${data.fullName}
Address: ${data.address}
Phone 1: ${data.phone1}
Phone 2: ${data.phone2 || "N/A"}

*Order Details:*
${orderLines}
*Total:* ${total.toLocaleString()} EGP`;

    return message;
  };

  const onSubmit = (data: CheckoutFormData) => {
    if (items.length === 0) return;
    const message = generateWhatsAppMessage(data);
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201551932049"; // Client's actual number
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    // Clear cart and close drawer after sending
    clearCart();
    setCheckoutMode(false);
    closeCart();
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
              <div className="flex items-center gap-3">
                {isCheckoutMode && (
                  <button
                    onClick={() => setCheckoutMode(false)}
                    className="text-white/70 hover:text-white"
                  >
                    <ArrowRight size={20} />
                  </button>
                )}
                <span className="font-display text-lg font-bold uppercase tracking-[0.2em] text-white">
                  {isCheckoutMode ? t('checkout') : t('cart')}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="text-white/70 transition-colors hover:text-white"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <ShoppingBag size={40} className="text-white/20" />
                  <p className="font-body text-sm text-white/50">
                    {t('emptyCart')}
                  </p>
                </div>
              ) : isCheckoutMode ? (
                <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-display text-xs uppercase tracking-widest text-white/60">
                      الاسم الكامل *
                    </label>
                    <input
                      {...register("fullName")}
                      className="bg-transparent border border-white/20 px-4 py-3 text-white focus:border-white outline-none transition-colors"
                      placeholder="الاسم الثلاثي"
                    />
                    {errors.fullName && <span className="text-red-400 text-xs">{errors.fullName.message}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-display text-xs uppercase tracking-widest text-white/60">
                      رقم الهاتف 1 *
                    </label>
                    <input
                      {...register("phone1")}
                      className="bg-transparent border border-white/20 px-4 py-3 text-white focus:border-white outline-none transition-colors"
                      placeholder="01xxxxxxxxx"
                    />
                    {errors.phone1 && <span className="text-red-400 text-xs">{errors.phone1.message}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-display text-xs uppercase tracking-widest text-white/60">
                      رقم الهاتف 2 (اختياري)
                    </label>
                    <input
                      {...register("phone2")}
                      className="bg-transparent border border-white/20 px-4 py-3 text-white focus:border-white outline-none transition-colors"
                      placeholder="01xxxxxxxxx"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-display text-xs uppercase tracking-widest text-white/60">
                      العنوان بالتفصيل *
                    </label>
                    <textarea
                      {...register("address")}
                      className="bg-transparent border border-white/20 px-4 py-3 text-white focus:border-white outline-none transition-colors resize-none h-24"
                      placeholder="المحافظة، المدينة، الشارع، رقم العمارة/الشقة"
                    />
                    {errors.address && <span className="text-red-400 text-xs">{errors.address.message}</span>}
                  </div>
                </form>
              ) : (
                <ul className="flex flex-col gap-4">
                  <AnimatePresence initial={false}>
                    {items.map((i) => {
                      const linePrice = getItemLinePrice(i, items);
                      return (
                        <motion.li
                          key={`${i.product.id}-${i.size}-${i.color}`}
                          layout
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className="flex gap-3"
                        >
                          <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-transparent" style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 80%)' }}>
                            <img
                              src={
                                i.product.variants?.find(v => v.colorName === i.color)?.images?.[0]
                                ?? (i.product.variants?.find(v => v.colorName === i.color) as any)?.imageUrl
                              }
                              alt={i.product.title}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="flex flex-col gap-1">
                              <h4 className="font-display text-sm font-bold tracking-widest text-white uppercase">
                                {locale === 'en' ? (i.product.title_en || i.product.title) : i.product.title}
                              </h4>
                              <p className="font-body text-xs text-white/50">
                                {locale === 'en' ? `Color: ${i.color} | Size: ${i.size}` : `اللون: ${i.color} | المقاس: ${i.size}`}
                              </p>
                              {/* Bundle discount badge */}
                              {linePrice.offerApplied && (
                                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/25 px-2 py-0.5 rounded-sm">
                                  🔥 {t('bundleApplied')}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-white/15">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      i.product.id,
                                      i.size,
                                      i.color,
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
                                      i.color,
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
                                {/* Price: strikethrough original + amber discounted if bundle applies */}
                                {linePrice.offerApplied ? (
                                  <div className="flex flex-col items-end gap-0.5">
                                    <span className="inline-block bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider mr-2">
                                      {t('bundleApplied')}
                                    </span>
                                    <span className="font-body text-sm font-bold text-amber-300 leading-none">
                                      {linePrice.effective.toLocaleString()}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="font-body text-sm font-semibold text-white">
                                    {linePrice.original.toLocaleString()}
                                  </span>
                                )}
                                <button
                                  onClick={() => removeItem(i.product.id, i.size, i.color)}
                                  className="text-white/40 transition-colors hover:text-red-400"
                                  aria-label="Remove item"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 px-5 py-5">
                {/* Savings summary if any bundle is active */}
                {(() => {
                  const originalTotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
                  const savings = originalTotal - total;
                  if (savings <= 0) return null;
                  return (
                    <div className="mb-3 flex items-center justify-between bg-amber-400/10 border border-amber-400/20 px-3 py-2 rounded-sm">
                      <span className="font-body text-xs font-bold text-amber-300">
                        -{savings.toLocaleString()} ج.م
                      </span>
                      <span className="font-display text-xs uppercase tracking-wider text-amber-300">
                        🔥 وفّرت
                      </span>
                    </div>
                  );
                })()}
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-display text-sm uppercase tracking-widest text-white/50">
                    {t('total')}
                  </span>
                  <span className="font-display text-lg font-bold text-white">
                    {total.toLocaleString()} EGP
                  </span>
                </div>

                {!isCheckoutMode && items.length > 0 && (
                  <button
                    onClick={() => setCheckoutMode(true)}
                    className="h-14 w-full bg-white font-display text-sm font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-white/90"
                  >
                    {t('checkout')}
                  </button>
                )}
                {isCheckoutMode && items.length > 0 && (
                  <button
                    form="checkout-form"
                    type="submit"
                    className="h-14 w-full flex items-center justify-center gap-2 bg-[#25D366] font-display text-sm font-bold uppercase tracking-[0.15em] text-black transition-all hover:bg-[#1ebe5a]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    إرسال الطلب عبر واتساب
                  </button>
                )}

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
