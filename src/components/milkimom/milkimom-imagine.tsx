"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export function MilkimomImagine() {
  return (
    <section className="pt-2 pb-12 md:pt-4 md:pb-20 relative overflow-hidden bg-white">
      {/* Main Headline */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-[#1A1A1A] leading-tight text-center mb-8 md:mb-12 max-w-4xl"
        >
          প্রতিটা Feeding-এই যদি বাবু <span className="text-brand">পেট ভরে দুধ</span> পেত…
        </motion.h2>
      </div>

      {/* Lifestyle Image (Full bleed on mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full md:max-w-5xl mx-auto px-0 md:px-6 lg:px-8 mb-8 md:mb-16 flex justify-center"
      >
        <img
          src="/images/lifestyle-hands.webp"
          alt="মিল্কিমম খাওয়ানো মা ও শিশু"
          className="w-full h-auto max-w-full rounded-none md:rounded-3xl object-cover block border-0 shadow-none max-h-[420px] md:max-h-[520px]"
        />
      </motion.div>

      {/* Closing Line */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center w-full"
        >
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-[#1A1A1A] leading-tight max-w-4xl mx-auto">
            মিল্কিমম খেলে ৩ দিনের মধ্যেই <span className="text-brand">বুকের দুধ বৃদ্ধি</span> পাবে, যাতে আপনার বাচ্চা পরিপূর্ণ বুকের দুধ পায়।
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
            className="cta-shine w-full sm:w-auto bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark font-bold text-lg md:text-xl px-8 py-4 md:px-10 rounded-full shadow-lg shadow-brand-cta/40 text-center transition-transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="size-5" />
            <span>হ্যাঁ, আমি বুকের দুধ বাড়াতে চাই</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
