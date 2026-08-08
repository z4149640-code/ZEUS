"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ── Types ────────────────────────────────────────────────────────────────────
type Particle = {
  id: number;
  x: number; y: number;
  size: number; opacity: number;
  duration: number; delay: number;
  driftX: number; driftY: number;
};

type Bolt = {
  id: number;
  delay: number; duration: number;
  interval: number; x: number;
};

// ── Static data (no Math.random → no hydration mismatch) ───────────────────
const speedLines = [
  { top: "8%",  delay: 0,    duration: 4.0, width: "22%", opacity: 0.04 },
  { top: "19%", delay: 0.7,  duration: 3.2, width: "16%", opacity: 0.035 },
  { top: "31%", delay: 1.4,  duration: 4.8, width: "28%", opacity: 0.05 },
  { top: "43%", delay: 0.2,  duration: 3.6, width: "18%", opacity: 0.04 },
  { top: "56%", delay: 1.8,  duration: 4.2, width: "32%", opacity: 0.045 },
  { top: "67%", delay: 0.5,  duration: 3.4, width: "14%", opacity: 0.035 },
  { top: "79%", delay: 1.1,  duration: 4.5, width: "25%", opacity: 0.04 },
  { top: "89%", delay: 2.2,  duration: 3.8, width: "20%", opacity: 0.035 },
];

const clouds = [
  { x: "15%",  y: "20%", w: 600, h: 400, opacity: 0.04, delay: 0,  dur: 18 },
  { x: "65%",  y: "55%", w: 500, h: 350, opacity: 0.05, delay: 4,  dur: 22 },
  { x: "40%",  y: "75%", w: 700, h: 300, opacity: 0.035,delay: 8,  dur: 16 },
  { x: "-5%",  y: "60%", w: 450, h: 500, opacity: 0.04, delay: 12, dur: 20 },
];

// ── Seeded helpers (deterministic — same on server and client) ───────────────
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function buildParticles(): Particle[] {
  return Array.from({ length: 280 }, (_, i) => {
    // Spread across the FULL screen
    const x = seededRandom(i * 7 + 0) * 100;
    const y = seededRandom(i * 7 + 1) * 100;

    // Direction: each star flies AWAY from screen center (50%, 50%)
    // so stars on every corner and edge all radiate outward
    const fromCenterX = x - 50;   // negative = left side, positive = right side
    const fromCenterY = y - 50;   // negative = top, positive = bottom
    const speed = seededRandom(i * 7 + 6) * 1.4 + 0.6; // 0.6 – 2.0 multiplier

    return {
      id: i,
      x,
      y,
      size:     seededRandom(i * 7 + 2) * 1.5 + 0.4,
      opacity:  seededRandom(i * 7 + 3) * 0.65 + 0.1,
      duration: seededRandom(i * 7 + 4) * 5 + 3,   // 3–8s
      delay:    seededRandom(i * 7 + 5) * -8,
      driftX:   fromCenterX * speed * 3,
      driftY:   fromCenterY * speed * 3,
    };
  });
}

function buildBolts(): Bolt[] {
  return Array.from({ length: 4 }, (_, i) => ({
    id:       i,
    delay:    i * 3.5 + seededRandom(i * 3 + 0) * 2,
    duration: 0.18,
    interval: 7 + seededRandom(i * 3 + 1) * 5,
    x:        10 + i * 22 + seededRandom(i * 3 + 2) * 10,
  }));
}

// Pre-build deterministic data once at module level (same value every time)
const PARTICLES = buildParticles();
const BOLTS     = buildBolts();

// ── Component ────────────────────────────────────────────────────────────────
export default function AnimatedBackground() {
  // Only render animated particles on the client to avoid hydration issues
  const [mounted, setMounted] = useState(false);
  const [particleCount, setParticleCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Render fewer particles on mobile for performance (70 vs 280)
    setParticleCount(window.innerWidth < 768 ? 70 : 280);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#000000] pointer-events-none select-none">

      {/* ── Deep Space Base ─────────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(12,8,20,1) 0%, rgba(0,0,0,1) 60%)",
        }}
      />

      {/* ── Nebula / Smoke Clouds (static positions — hydration-safe) ────── */}
      {clouds.map((c) => (
        <motion.div
          key={c.x + c.y}
          className="absolute rounded-full"
          style={{
            left: c.x, top: c.y, width: c.w, height: c.h,
            background:
              "radial-gradient(ellipse at center, rgba(80,60,120,1) 0%, rgba(20,10,40,0.4) 50%, transparent 75%)",
            opacity: c.opacity,
            filter: "blur(60px)",
          }}
          animate={{
            scale:   [1, 1.12, 0.95, 1],
            opacity: [c.opacity, c.opacity * 1.6, c.opacity * 0.8, c.opacity],
          }}
          transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* ── Particles & Bolts — client-only (suppresses SSR mismatch) ─────── */}
      {mounted && (
        <>
          {PARTICLES.slice(0, particleCount).map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${p.x}%`,
                top:  `${p.y}%`,
                width:  p.size,
                height: p.size,
                opacity: p.opacity,
              }}
              animate={{
                // Fly outward from center + grow in size = hyperspace
                x:       [0, p.driftX],
                y:       [0, p.driftY],
                scale:   [0.2, 6],
                opacity: [0, p.opacity * 1.8, p.opacity * 0.5, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeIn",
              }}
            />
          ))}

          {BOLTS.map((bolt) => (
            <LightningBolt key={bolt.id} {...bolt} />
          ))}
        </>
      )}

      {/* ── Speed Lines (static positions — hydration-safe) ──────────────── */}
      {speedLines.map((line, i) => (
        <motion.div
          key={i}
          className="absolute h-px rounded-full"
          style={{
            top: line.top, left: 0, width: line.width,
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${line.opacity}) 45%, rgba(255,255,255,${line.opacity * 0.5}) 75%, transparent 100%)`,
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "110vw" }}
          transition={{ duration: line.duration, delay: line.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* ── Bottom atmospheric fog ────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64"
        style={{ background: "linear-gradient(to top, rgba(5,3,12,0.9) 0%, transparent 100%)" }}
      />

      {/* ── Vignette ─────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 15%, rgba(0,0,0,0.88) 100%)",
        }}
      />
    </div>
  );
}

// ── Lightning Bolt ────────────────────────────────────────────────────────────
function LightningBolt({ x, delay, duration, interval }: Bolt) {
  const segments = 8;
  const height   = 120 + seededRandom(x) * 80;

  let path = `M ${20 + seededRandom(x + 1) * 10} 0`;
  for (let i = 1; i <= segments; i++) {
    const xOff = (seededRandom(x + i * 0.7) - 0.5) * 30;
    const yPos = (height / segments) * i;
    path += ` L ${20 + xOff} ${yPos}`;
  }

  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: "5%", width: 40, height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 1, 0.6, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, repeatDelay: interval, ease: "linear" }}
    >
      <svg width="40" height={height} viewBox={`0 0 40 ${height}`}>
        <path d={path} stroke="rgba(180,140,255,0.3)" strokeWidth="6"   fill="none" strokeLinecap="round" filter="url(#gblur)" />
        <path d={path} stroke="rgba(220,200,255,0.9)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <defs>
          <filter id="gblur"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
      </svg>
    </motion.div>
  );
}
