"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, Instagram, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";
import Marquee from "@/components/Marquee";
import Cursor from "@/components/Cursor";
import { products, type Product } from "@/lib/mockData";

const LOGO = "/images/WhatsApp_Image_2026-07-18_at_3.42.36_AM-removebg-preview.png";

export default function Home() {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  return (
    <>
      <Cursor />
      <AnimatedBackground />
      <Navbar />
      <CartDrawer />
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
      />

      {/* Hero */}
      <section
        id="home"
        className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center"
      >
        {/* Brand logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.04 }}
          className="relative mx-auto w-[82vw] max-w-[560px] sm:max-w-[620px] md:max-w-[680px]"
          style={{ aspectRatio: "820/360" }}
        >
          <Image
            src={LOGO}
            alt="ZEUS — Premium Streetwear"
            fill
            priority
            className="object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.12)]"
            sizes="(max-width: 640px) 82vw, (max-width: 768px) 620px, 680px"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 max-w-md font-body text-sm leading-relaxed text-white/60 sm:text-base"
        >
          مصممة لأولئك الذين يتحركون بهدف. خامات ثقيلة، قصّات وحشية، وبدون أي تنازلات.
        </motion.p>
        <motion.a
          href="#catalog"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 inline-flex items-center gap-2 border border-white/30 px-8 py-3 font-display text-xs font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-white hover:text-black"
        >
          تسوق التشكيلة
          <ArrowDown size={14} />
        </motion.a>
      </section>

      <Marquee />

      {/* Catalog */}
      <section
        id="catalog"
        className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mb-12 flex flex-col gap-2">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-display text-xs uppercase tracking-[0.4em] text-white/40"
          >
            التشكيلة المميزة
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl"
          >
            الترسانة
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              onOpen={setActiveProduct}
            />
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6"
      >
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-xs uppercase tracking-[0.4em] text-white/40"
        >
          تواصل معنا
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl"
        >
          انضم إلى القطيع
        </motion.h2>
        <p className="mx-auto mt-4 max-w-md font-body text-sm text-white/60">
          أسئلة، تعاونات، أو طلبات خاصة — تواصل معنا مباشرة.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-12 w-12 items-center justify-center border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
          <a
            href="mailto:hello@zeus.com"
            className="flex h-12 w-12 items-center justify-center border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <span className="font-display text-xl font-bold uppercase tracking-[0.35em] text-white">
            زيوس
          </span>
          <p className="font-body text-xs uppercase tracking-widest text-white/40">
            © {new Date().getFullYear()} زيوس. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </>
  );
}
