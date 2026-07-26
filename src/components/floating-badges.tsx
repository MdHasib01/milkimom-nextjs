"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Stethoscope } from "lucide-react";

export function FloatingBadges() {
  return (
    <>
      <motion.div
        className="absolute -left-2 top-6 z-20 flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-brand-green shadow-md sm:-left-4 sm:text-sm"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <ShieldCheck className="size-4" />
        BSTI সার্টিফাইড
      </motion.div>

      <motion.div
        className="absolute -right-2 bottom-10 z-20 flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-brand-crimson shadow-md sm:-right-4 sm:text-sm"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Stethoscope className="size-4" />
        ডাক্তার সুপারিশকৃত
      </motion.div>
    </>
  );
}
