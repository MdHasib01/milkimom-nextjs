"use client";

import { motion } from "framer-motion";

export function SmoothflowEmotional() {
  return (
    <section className="py-10 md:py-16 overflow-hidden relative bg-white">
      {/* Full bleed image on mobile, contained on desktop */}
      <div className="w-full md:max-w-5xl mx-auto md:px-6 lg:px-8 mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[280px] sm:h-[350px] md:h-[450px] overflow-hidden md:rounded-3xl shadow-sm md:shadow-md"
        >
          <img
            src="https://images.unsplash.com/photo-1544214539-76191b2bfbb0?auto=format&fit=crop&w=1200&q=80"
            alt="Mother seeking comfort for her baby"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1A1A1A] leading-tight mb-6">
          একটা Painful Feeding-এর দাম টাকা দিয়ে মাপা যায় না।
        </h2>

        <div className="text-[#1A1A1A]/80 text-[15px] md:text-[17px] leading-[1.5] space-y-[10px] md:space-y-[12px] font-medium">
          <p>রাতের Disturbed Sleep।</p>
          <p>একটা Feed-এর আগে ভয়।</p>
          <p>বাচ্চাকে কোলে নিয়েও Breast Protect করে রাখা।</p>
          <p>
            প্রতিবার Feeding-এর আগে আবার সেই Pain-এর কথা মনে পড়া।
            <span className="block mt-1.5 text-[28px] md:text-[32px] leading-none text-center">😔</span>
          </p>
        </div>
      </div>
    </section>
  );
}
