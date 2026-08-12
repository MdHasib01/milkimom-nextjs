"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useLandingPageContent } from "@/components/landing-page-content-provider";

export function SmoothflowGuarantee() {
  const { content } = useLandingPageContent();

  return (
    <section className="pt-2 pb-10 md:pt-4 md:pb-16 relative bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1A1A] mb-4">
          <span className="text-brand">100%</span> Satisfaction Guarantee
        </h2>

        <p className="text-base md:text-lg text-[#1A1A1A]/80 font-medium mb-8">
          আমরা জানি একজন মায়ের জন্য তার এবং তার বাচ্চার স্বাস্থ্য কতটা গুরুত্বপূর্ণ।
        </p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-brand-light rounded-2xl p-6 md:p-8 border border-brand/20 shadow-[0_4px_20px_rgba(230,16,110,0.03)] max-w-2xl mx-auto flex flex-col items-center"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-brand/10 shadow-sm mb-4">
            <ShieldCheck className="w-6 h-6 text-brand" />
          </div>

          <h3 className="text-lg md:text-xl font-bold text-[#1A1A1A] mb-3">
            {!content.guaranteeTitle || content.guaranteeTitle === "100% Satisfaction Guarantee" || content.guaranteeTitle.includes("১০০%")
              ? "৩ দিনের Money Back Guarantee"
              : content.guaranteeTitle}
          </h3>

          <p className="text-sm md:text-base text-[#1A1A1A]/70 leading-relaxed font-medium">
            {!content.guaranteeText || content.guaranteeText.includes("পণ্য হাতে পেয়ে")
              ? "যদি SmoothFlow ব্যবহার করে আপনি কোনো পরিবর্তন অনুভব না করেন, আমাদের জানান। আমরা আপনার সম্পূর্ণ টাকা রিফান্ড করে দেব। কোনো শর্ত প্রযোজ্য নয়।"
              : content.guaranteeText}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
