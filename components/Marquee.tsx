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

// Build two identical sets — animate from 0 to -50% for seamless loop
const items = [...keywords, ...keywords];

export default function Marquee() {
  return (
    <div className="flex w-full overflow-hidden border-y border-white/10 bg-white/[0.04] py-4">
      <motion.div
        className="flex whitespace-nowrap"
        style={{ width: "max-content" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 22,
        }}
      >
        {/* Two copies — when the first scrolls fully off, the second is identical
            so the animation loops invisibly */}
        {[...items, ...items].map((text, i) => (
          <div key={i} className="flex items-center gap-8 px-8">
            <span className="font-display text-sm font-bold uppercase tracking-widest text-white/60">
              {text}
            </span>
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/25" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
