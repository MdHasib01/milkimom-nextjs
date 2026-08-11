"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1555252834-311311028308?auto=format&fit=crop&w=1200&q=80",
];

export function StableflowImagine() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-white">
      {/* 1. Main Headline */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-[#1A1A1A] leading-tight text-center mb-10 md:mb-14 max-w-4xl"
        >
          পরের Feeding-টা যদি Breast Pain ছাড়া হতো…
        </motion.h2>
      </div>

      {/* 2. Fast Auto-Sliding Image Section */}
      <div className="w-full md:max-w-6xl md:mx-auto md:px-6 lg:px-8 mb-12 md:mb-20">
        <div className="w-full relative aspect-[16/10] md:aspect-[21/9] md:rounded-[24px] overflow-hidden bg-brand-light md:shadow-sm md:border md:border-brand/10">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt="Peaceful breastfeeding mother"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Closing Line */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center w-full"
        >
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-[#1A1A1A] leading-tight max-w-4xl mx-auto">
            শুধু স্বস্তিতে বাচ্চাকে Feed করানোর মুহূর্তটা থাকতো।
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 md:mt-12 w-full flex justify-center"
        >
          <a
            href="#order-section"
            className="w-full sm:w-auto bg-brand text-white font-bold text-lg md:text-xl px-8 py-4 md:px-10 rounded-full shadow-[0_4px_20px_rgba(230,16,110,0.3)] text-center transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            হ্যাঁ, আমি Breast Pain থেকে মুক্তি চাই
          </a>
        </motion.div>
      </div>
    </section>
  );
}
