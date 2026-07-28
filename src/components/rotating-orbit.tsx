"use client";

import { motion } from "framer-motion";

export function RotatingOrbit() {
  return (
    <>
      <motion.div
        aria-hidden
        className="absolute inset-[2%] rounded-full border border-dashed border-brand-crimson/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-[12%] rounded-full border-2 border-dashed border-brand-coral/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-[22%] rounded-full border-4 border-dashed border-brand-crimson/25"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
    </>
  );
}
