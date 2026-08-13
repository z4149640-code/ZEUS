"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Minus, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useCartStore, getBestOffer } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/supabase";

type Props = {
  product: Product;
  relatedProducts: Product[];
};

export default function ProductClient({ product, relatedProducts }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [size, setSize] = useState<string | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

  // Which color variant is active
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  // Which image within the active variant is shown in the main viewer
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [qty, setQty] = useState(1);

  const activeVariant = product.variants?.[activeVariantIndex];
  // All images for the currently selected color
  const legacyImageUrl = (activeVariant as any)?.imageUrl;
  const currentImages: string[] = activeVariant?.images?.length ? activeVariant.images : (legacyImageUrl ? [legacyImageUrl] : []);
  const currentImageUrl = currentImages[activeImageIndex] || null;

  // Reset the image index whenever the user switches color
  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeVariantIndex]);

  // Best offer that applies at the current quantity
  const activeOffer = getBestOffer(product.offers, qty);

  const handleAddToCart = () => {
    if (!product || !size || !activeVariant) return;
    for (let i = 0; i < qty; i++) {
      addItem(product, size, activeVariant.colorName);
    }
    useCartStore.getState().openCart();
  };

  const handleBuyNow = () => {
    if (!product || !size || !activeVariant) return;
    for (let i = 0; i < qty; i++) {
      addItem(product, size, activeVariant.colorName);
    }
    useCartStore.getState().setCheckoutMode(true);
    useCartStore.getState().openCart();
  };

  const goPrevImage = () =>
    setActiveImageIndex((i) => (i - 1 + currentImages.length) % currentImages.length);
  const goNextImage = () =>
    setActiveImageIndex((i) => (i + 1) % currentImages.length);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* Breadcrumb / Back button */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-display text-white/50 hover:text-white transition-colors uppercase tracking-widest"
        >
          <ChevronRight size={16} className="ml-1" />
          العودة للرئيسية
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

        {/* ── Left column: Image Gallery ── */}
        <div className="flex flex-col gap-4">

          {/* Main image viewer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/5] w-full bg-neutral-900/40 rounded-sm border border-white/5 overflow-hidden flex items-center justify-center"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 50%, transparent 80%)",
            }}
          >
            <AnimatePresence mode="wait">
              {currentImageUrl ? (
                <motion.div
                  key={`${activeVariantIndex}-${activeImageIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 w-full h-full p-4"
                >
                  <Image
                    src={currentImageUrl}
                    alt={product.title}
                    fill
                    quality={100}
                    className="object-contain"
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center w-full h-full"
                >
                  <span className="text-white/20 font-display text-xs uppercase tracking-widest">لا توجد صورة</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prev / Next arrows — shown only when variant has > 1 image */}
            {currentImages.length > 1 && (
              <>
                <button
                  onClick={goPrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all"
                  aria-label="الصورة السابقة"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={goNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all"
                  aria-label="الصورة التالية"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {currentImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i === activeImageIndex
                          ? "bg-white scale-125"
                          : "bg-white/30 hover:bg-white/60"
                      }`}
                      aria-label={`الصورة ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Thumbnail strip for the active variant's images */}
          {currentImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {currentImages.map((imgUrl, imgIdx) => (
                <button
                  key={imgIdx}
                  onClick={() => setActiveImageIndex(imgIdx)}
                  className={`relative w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 rounded-sm border overflow-hidden transition-all ${
                    activeImageIndex === imgIdx
                      ? "border-white bg-white/10 scale-105"
                      : "border-white/10 bg-neutral-900/40 hover:border-white/40"
                  }`}
                  title={`صورة ${imgIdx + 1}`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${activeVariant?.colorName} — صورة ${imgIdx + 1}`}
                    fill
                    quality={100}
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right column: Product Details ── */}
        <div className="flex flex-col pt-4 md:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="font-display text-xs uppercase tracking-[0.3em] text-white/40 bg-white/5 px-3 py-1 rounded-full">
              {product.category || "منتج"}
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl lg:text-5xl leading-tight">
              {product.title}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <p className="font-body text-2xl font-bold text-white">
                {product.price.toLocaleString()} ج.م
              </p>
              {product.badge && (
                <span className="bg-white text-black px-2 py-0.5 text-xs font-bold uppercase tracking-widest rounded-sm">
                  {product.badge}
                </span>
              )}
            </div>
          </motion.div>

          {product.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <p className="font-body text-base leading-relaxed text-white/70 max-w-lg whitespace-pre-wrap">
                {product.description}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 border-t border-white/10 pt-8"
          >
            {/* Color selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <span className="font-display text-sm uppercase tracking-[0.2em] text-white/60 block mb-3">
                  اختر اللون:{" "}
                  <span className="text-white ml-1 font-body">{activeVariant?.colorName}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveVariantIndex(idx)}
                      title={v.colorName}
                      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        activeVariantIndex === idx
                          ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110"
                          : "ring-1 ring-white/20 hover:ring-white/60"
                      }`}
                      style={{ backgroundColor: v.colorHex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-sm uppercase tracking-[0.2em] text-white/60">
                    اختر المقاس
                  </span>
                  {product.size_chart_url ? (
                    <button
                      className="font-body text-xs text-white/40 underline hover:text-white transition-colors"
                      onClick={() => setShowSizeChart(true)}
                    >
                      دليل المقاسات (Size Chart)
                    </button>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-[60px] h-12 flex items-center justify-center border font-display text-sm font-semibold uppercase tracking-wider transition-all ${
                        size === s
                          ? "border-white bg-white text-black scale-105"
                          : "border-white/20 text-white/80 hover:border-white/60 hover:bg-white/5"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Quantity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <span className="font-display text-sm uppercase tracking-[0.2em] text-white/60 block mb-4">
              الكمية
            </span>
            <div className="flex items-center gap-6">
              <div className="flex h-12 w-32 items-center justify-between border border-white/20 bg-transparent">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-full w-10 items-center justify-center text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Minus size={16} />
                </button>
                <span className="font-display text-base font-semibold text-white">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-full w-10 items-center justify-center text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Bundle Offers Display ── */}
          {product.offers && product.offers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-6"
            >
              <span className="font-display text-xs uppercase tracking-[0.2em] text-white/40 block mb-3">
                عروض خاصة
              </span>
              <div className="flex flex-col gap-2">
                {[...product.offers]
                  .sort((a, b) => a.quantity - b.quantity)
                  .map((offer, idx) => {
                    const isActive = qty >= offer.quantity;
                    return (
                      <motion.div
                        key={idx}
                        animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                        transition={{ duration: 0.4 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-sm border transition-all duration-300 ${
                          isActive
                            ? "border-amber-400/50 bg-amber-400/10"
                            : "border-white/10 bg-white/3 hover:border-white/20"
                        }`}
                      >
                        <span className="text-xl flex-shrink-0">🔥</span>
                        <div className="flex-1 text-right">
                          <span
                            className={`font-body text-sm leading-snug ${
                              isActive ? "text-amber-200" : "text-white/65"
                            }`}
                          >
                            اشتري{" "}
                            <strong className={isActive ? "text-amber-100" : "text-white"}>
                              {offer.quantity}
                            </strong>{" "}
                            قطع بسعر إجمالي{" "}
                            <strong className={isActive ? "text-amber-100" : "text-white"}>
                              {offer.price.toLocaleString()} ج.م
                            </strong>{" "}
                            فقط!
                          </span>
                        </div>
                        {isActive ? (
                          <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-1 rounded-sm">
                            ✓ مفعّل
                          </span>
                        ) : (
                          <span className="flex-shrink-0 text-[10px] text-white/30 uppercase tracking-wider">
                            {offer.quantity - qty} أكثر
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
              </div>
            </motion.div>
          )}

          {/* Add to cart / Buy now */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 flex flex-col gap-4"
          >
            <button
              onClick={handleAddToCart}
              disabled={!size || !activeVariant}
              className="w-full h-14 border border-white bg-transparent font-display text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-white/20 disabled:text-white/30 disabled:hover:bg-transparent"
            >
              {size && activeVariant
                ? activeOffer
                  ? `إضافة للعربة — 🔥 عرض ${activeOffer.quantity} قطع بـ ${activeOffer.price.toLocaleString()} ج.م`
                  : "إضافة إلى العربة (ADD TO CART)"
                : "الرجاء اختيار المقاس"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!size || !activeVariant}
              className="w-full h-14 bg-white font-display text-sm font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50"
            >
              شراء الآن (BUY IT NOW)
            </button>
          </motion.div>

          {/* Shipping Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-10 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-center"
          >
            <div>
              <span className="block font-display text-xs text-white/40 uppercase tracking-widest mb-1">تجهيز الطلب</span>
              <span className="font-body text-sm text-white/80">١-٢ أيام عمل</span>
            </div>
            <div>
              <span className="block font-display text-xs text-white/40 uppercase tracking-widest mb-1">التوصيل</span>
              <span className="font-body text-sm text-white/80">٣-٥ أيام عمل</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-32 pt-16 border-t border-white/10"
        >
          <h3 className="font-display text-2xl font-bold uppercase tracking-widest text-center text-white mb-12">
            قد يعجبك أيضاً
            <span className="block text-sm text-white/40 mt-2 tracking-[0.3em]">YOU MAY ALSO LIKE</span>
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Size Chart Modal */}
      <AnimatePresence>
        {showSizeChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md"
            onClick={() => setShowSizeChart(false)}
          >
            {/* Header */}
            <div
              className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSizeChart(false)}
                className="text-white/50 hover:text-white transition-colors p-1"
                aria-label="إغلاق"
              >
                <ChevronRight size={22} />
              </button>
              <div className="text-right">
                <h2 className="font-display text-sm font-bold uppercase tracking-[0.25em] text-white">دليل المقاسات</h2>
                <p className="text-xs text-white/40 font-body mt-0.5">SIZE CHART — {product.title}</p>
              </div>
            </div>

            {/* Image */}
            <div
              className="flex-1 flex items-center justify-center p-4 overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {product.size_chart_url ? (
                <div className="relative w-full h-full max-h-[80vh]">
                  <Image
                    src={product.size_chart_url}
                    alt={`دليل مقاسات ${product.title}`}
                    fill
                    quality={100}
                    className="object-contain"
                  />
                </div>
              ) : (
                <p className="text-white/30 font-display text-sm uppercase tracking-widest">لا تتوفر صورة دليل مقاسات</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
