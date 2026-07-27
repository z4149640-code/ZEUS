"use client";

import { motion } from "framer-motion";

const keywords = [
  "خامات ثقيلة",
  "جودة بدون تنازلات",
  "ملابس شارع فاخرة",
  "زيوس",
  "تصميم وحشي",
  "خامات ثقيلة",
  "جودة بدون تنازلات",
  "ملابس شارع فاخرة",
  "زيوس",
  "تصميم وحشي",
];

export default function Marquee() {
  return (
    <div className="flex w-full overflow-hidden border-y border-white/10 bg-white/5 py-4">
      <motion.div
        className="flex whitespace-nowrap w-max"
        animate={{ x: ["0%", "50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
      >
        {[...keywords, ...keywords, ...keywords, ...keywords].map((text, i) => (
          <div key={i} className="flex items-center gap-8 px-8">
            <span className="font-display text-sm font-bold uppercase tracking-widest text-white/70">
              {text}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
