"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useLandingPageContent } from "@/components/landing-page-content-provider";

export function MilkreadyGuarantee() {
  const { content } = useLandingPageContent();

  return (
    <section className="py-8 md:py-12 px-4 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2 text-slate-800">
            <span className="text-[#0284c7]">100%</span> Satisfaction Guarantee
          </h2>
          <p className="text-slate-600 mb-6 text-xs sm:text-sm md:text-base font-medium">
            আমরা জানি একজন মায়ের জন্য Delivery-এর আগের Preparation কতটা গুরুত্বপূর্ণ।
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-b from-sky-50/80 to-white border-2 border-sky-200 rounded-2xl p-5 sm:p-7 shadow-sm max-w-lg mx-auto"
        >
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-[#0284c7]">
              <ShieldCheck className="size-7" />
            </div>
          </div>
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-2">
            {content.guaranteeTitle || "৩ দিনের Money Back Guarantee"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {content.guaranteeText || "MilkReady ব্যবহার করে কোনো পরিবর্তন অনুভব না করলে আমাদের জানান। আমাদের Guarantee Policy অনুযায়ী আপনার সম্পূর্ণ টাকা রিফান্ড করে দেওয়া হবে।"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
