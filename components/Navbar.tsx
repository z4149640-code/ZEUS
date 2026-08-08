"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store";

const links = [
  { label: "الرئيسية", href: "/#home" },
  { label: "المنتجات", href: "/#catalog" },
  { label: "تواصل معنا", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => {
    setIsMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-black/60 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
          }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: nav links (desktop) */}
          <div className="hidden flex-1 items-center gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="group relative font-display text-sm font-medium uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex-1 text-white md:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Center: logo */}
          <Link
            href="/"
            className="flex flex-1 items-center justify-center"
          >
            <span className="font-display text-sm font-medium uppercase tracking-[0.3em] text-white/60 transition-colors hover:text-white">
              Zeus
            </span>
          </Link>

          {/* Right: cart */}
          <div className="flex flex-1 items-center justify-end">
            <button
              onClick={openCart}
              className="relative text-white transition-transform hover:scale-110"
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              <AnimatePresence>
                {isMounted && totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black md:hidden"
          >
            <div className="flex h-16 items-center justify-end px-4">
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-6 px-8 pt-8">
              {links.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-3xl font-bold uppercase tracking-[0.15em] text-white"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
