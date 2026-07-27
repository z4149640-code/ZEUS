"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const LOGO = "/images/WhatsApp_Image_2026-07-18_at_3.42.36_AM-removebg-preview.png";

const speedLines = [
  { top: "8%",  delay: 0,    duration: 3.2, width: "28%", opacity: 0.07 },
  { top: "18%", delay: 0.6,  duration: 2.5, width: "18%", opacity: 0.05 },
  { top: "27%", delay: 1.1,  duration: 3.8, width: "35%", opacity: 0.09 },
  { top: "36%", delay: 0.3,  duration: 2.9, width: "22%", opacity: 0.06 },
  { top: "45%", delay: 1.6,  duration: 3.4, width: "40%", opacity: 0.08 },
  { top: "55%", delay: 0.9,  duration: 2.7, width: "15%", opacity: 0.05 },
  { top: "63%", delay: 0.2,  duration: 3.1, width: "30%", opacity: 0.07 },
  { top: "72%", delay: 1.4,  duration: 2.6, width: "20%", opacity: 0.06 },
  { top: "81%", delay: 0.7,  duration: 3.6, width: "32%", opacity: 0.09 },
  { top: "90%", delay: 1.9,  duration: 2.8, width: "24%", opacity: 0.05 },
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black pointer-events-none select-none">

      {/* ── Breathing Watermark Logo (massive background texture) ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            scale:   [1, 1.05, 1],
            opacity: [0.04, 0.07, 0.04],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-[150vw] max-w-none md:w-[100vw]"
          style={{ aspectRatio: "820/360" }}
        >
          <Image
            src={LOGO}
            alt=""
            fill
            priority
            className="object-contain"
            sizes="100vw"
            aria-hidden="true"
          />
        </motion.div>
      </motion.div>

      {/* ── Speed Lines (left → right) ── */}
      {speedLines.map((line, i) => (
        <motion.div
          key={i}
          className="absolute h-px rounded-full"
          style={{
            top: line.top,
            left: 0,
            width: line.width,
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${line.opacity}) 40%, rgba(255,255,255,${line.opacity * 0.6}) 70%, transparent 100%)`,
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "110vw" }}
          transition={{
            duration: line.duration,
            delay: line.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* ── Subtle diagonal accent slash ── */}
      <motion.div
        className="absolute h-px"
        style={{
          top: "42%",
          left: 0,
          width: "55%",
          transform: "rotate(15deg) translateY(-50%)",
          transformOrigin: "left center",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
        }}
        initial={{ x: "-110%" }}
        animate={{ x: "180%" }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* ── Deep radial vignette so edges stay pitch-black ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.88) 100%)",
        }}
      />
    </div>
  );
}
