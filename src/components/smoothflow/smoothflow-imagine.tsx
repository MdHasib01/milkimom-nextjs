"use client";

import { motion } from "framer-motion";

export function SmoothflowImagine() {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden bg-white">
      {/* 1. Main Headline */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-[#1A1A1A] leading-tight text-center mb-8 md:mb-12 max-w-4xl"
        >
          পরের Feeding-টা যদি Breast Pain ছাড়া হতো…
        </motion.h2>
      </div>

      {/* 2. Before-After Image Section (No Carousel) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-16"
      >
        <div className="w-full rounded-2xl md:rounded-3xl overflow-hidden bg-white shadow-sm border border-brand/10">
          <img
            src="/images/smoothflow/Before-After.jpg"
            alt="Before vs After SmoothFlow"
            className="w-full h-auto object-contain block"
          />
        </div>
      </motion.div>

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
