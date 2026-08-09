"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const LOGO = "/images/WhatsApp_Image_2026-07-18_at_3.42.36_AM-removebg-preview.png";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar from 0 → 100 over ~0.5s
    const start = performance.now();
    const duration = 500;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        // Small pause at 100% then fade out
        setTimeout(() => setVisible(false), 200);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black"
        >
          {/* Background radial glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(60,40,100,0.25) 0%, transparent 70%)",
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative w-[88vw] max-w-[560px]"
            style={{ aspectRatio: "820/360" }}
          >
            <Image
              src={LOGO}
              alt="ZEUS"
              fill
              priority
              className="object-contain drop-shadow-[0_0_70px_rgba(255,255,255,0.35)]"
              sizes="(max-width: 640px) 88vw, 560px"
            />
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-14 w-[180px]"
          >
            {/* Track */}
            <div className="h-px w-full bg-white/10">
              {/* Fill */}
              <motion.div
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Percentage */}
            <p className="mt-3 text-center font-display text-[10px] uppercase tracking-[0.35em] text-white/30">
              {Math.round(progress)}%
            </p>
          </motion.div>

          {/* Speed lines flying across on exit */}
          {[0.15, 0.38, 0.62, 0.82].map((pos, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute h-px"
              style={{
                top: `${pos * 100}%`,
                left: 0,
                width: "25%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
              }}
              animate={{ x: ["-100%", "500%"] }}
              transition={{
                duration: 2.2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
