"use client";

import LoadingScreen from "./LoadingScreen";
import Cursor from "./Cursor";
import AnimatedBackground from "./AnimatedBackground";
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";

export default function GlobalUI() {
  return (
    <>
      <LoadingScreen />
      <Cursor />
      <AnimatedBackground />
      <Navbar />
      <CartDrawer />
    </>
  );
}
