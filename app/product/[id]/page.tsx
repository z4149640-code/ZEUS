"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";
import { products } from "@/lib/mockData";
import { useCartStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const addItem = useCartStore((s) => s.addItem);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Get 4 other products for "You may also like"
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    if (!product || !size) return;
    for (let i = 0; i < qty; i++) {
      addItem(product, size);
    }
    // Optionally open cart drawer here, but let's just reset or show feedback
    alert("تم الإضافة بنجاح");
  };

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Breadcrumb / Back button */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-display text-white/50 hover:text-white transition-colors uppercase tracking-widest">
          <ChevronRight size={16} className="ml-1" />
          العودة للرئيسية
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left column (Image Gallery) - Note: RTL makes this appear on the right naturally */}
        <div className="flex flex-col gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/5] w-full bg-neutral-900/40 rounded-sm border border-white/5 overflow-hidden flex items-center justify-center"
            style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 50%, transparent 80%)' }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={imagesList[activeImage]}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            </AnimatePresence>
          </motion.div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 rounded-sm border overflow-hidden transition-all ${activeImage === idx ? 'border-white bg-white/10' : 'border-white/10 bg-neutral-900/40 hover:border-white/40'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column (Product Details) */}
        <div className="flex flex-col pt-4 md:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="font-display text-xs uppercase tracking-[0.3em] text-white/40 bg-white/5 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl lg:text-5xl leading-tight">
              {product.name}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <p className="font-body text-2xl font-bold text-white">
                {product.price.toLocaleString()} ج.م
              </p>
              {/* Fake original price for sale items like the reference */}
              <p className="font-body text-lg text-white/30 line-through">
                {(product.price * 1.3).toLocaleString()} ج.م
              </p>
              <span className="bg-white text-black px-2 py-0.5 text-xs font-bold uppercase tracking-widest rounded-sm">Sale</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <p className="font-body text-base leading-relaxed text-white/70 max-w-lg">
              {product.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 border-t border-white/10 pt-8"
          >
            {/* Size selector */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-sm uppercase tracking-[0.2em] text-white/60">
                اختر المقاس
              </span>
              <button
                className="font-body text-xs text-white/40 underline hover:text-white transition-colors"
                onClick={() => alert("سيتم إضافة دليل المقاسات قريباً.")}
              >
                دليل المقاسات (Size Chart)
              </button>
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
          </motion.div>

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
                <span className="font-display text-base font-semibold text-white">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-full w-10 items-center justify-center text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 flex flex-col gap-4"
          >
            <button
              onClick={handleAdd}
              disabled={!size}
              className="w-full h-14 border border-white bg-transparent font-display text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-white/20 disabled:text-white/30 disabled:hover:bg-transparent"
            >
              {size ? "إضافة إلى العربة (ADD TO CART)" : "الرجاء اختيار مقاس"}
            </button>
            <button
              disabled={!size}
              className="w-full h-14 bg-white font-display text-sm font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50"
            >
              شراء الآن (BUY IT NOW)
            </button>
          </motion.div>

          {/* Dummy Shipping Info */}
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
    </main>
  );
}
