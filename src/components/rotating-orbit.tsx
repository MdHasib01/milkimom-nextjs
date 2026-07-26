"use client";

import { motion } from "framer-motion";

export function RotatingOrbit() {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-[12%] rounded-full border border-dashed border-brand-coral/40"
      animate={{ rotate: 360 }}
      transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
    />
  );
}
