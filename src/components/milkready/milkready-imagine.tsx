"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const IMAGES = [
  "/images/milkready/maternal-moment.jpg",
  "/images/lifestyle-grass.webp",
  "/images/lifestyle-window.webp",
];

export function MilkreadyImagine() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-8 md:py-12 px-4 overflow-hidden bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-lg xs:text-xl sm:text-2xl font-bold mb-5 text-slate-800 leading-snug px-2"
        >
          Delivery-এর পর বাচ্চাকে{" "}
          <span className="text-slate-500 font-semibold">Formula Milk</span> না দিয়ে, যদি{" "}
          <span className="text-[#0284c7] font-black">নিজের বুকের দুধ</span> খাওয়াতে পারেন—কেমন হয়?
        </motion.h2>

        {/* Maternal Visual Frame */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={IMAGES[index]}
                alt="Happy mother with newborn baby"
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === i ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </motion.div>

        <p className="mt-6 mb-5 font-bold text-base sm:text-lg text-slate-800">
          সেই <span className="text-[#0284c7]">Happiness</span> পৃথিবীতে আর কোথাও নেই।
        </p>

        <Button
          onClick={scrollToOrder}
          className="cta-shine w-full sm:w-auto px-8 py-3.5 h-auto rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm sm:text-base shadow-md shadow-sky-600/20 active:scale-95 transition-all cursor-pointer"
        >
          হ্যাঁ, আমি Happy হতে চাই
        </Button>
      </div>
    </section>
  );
}
