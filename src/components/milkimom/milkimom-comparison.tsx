"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ShoppingBag } from "lucide-react";
import { comparisonRows } from "@/lib/content";
import { useLandingPageContent } from "@/components/landing-page-content-provider";

export function MilkimomComparison() {
  const { content } = useLandingPageContent();
  const brandName = content.productName || "মিল্কিমম";
  const rows = comparisonRows.slice(0, 6);

  return (
    <section className="pt-2 pb-10 md:pt-4 md:pb-16 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111111] rounded-[24px] p-6 md:p-10 lg:p-12 shadow-2xl text-white">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-2 text-white">
              আপনার সামনে এখন{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">২টা পথ</span>
                <svg
                  className="absolute w-[130%] h-[150%] -top-[25%] -left-[15%] z-0 text-brand pointer-events-none"
                  viewBox="0 0 120 60"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M15,35 C10,20 40,8 85,15 C115,20 115,45 85,52 C50,60 15,45 15,30 C15,20 30,12 40,10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="opacity-90"
                  />
                </svg>
              </span>{" "}
              খোলা আছে।
            </h2>
            <p className="text-lg md:text-xl text-white/70 font-medium">আপনি কোনটা বেছে নেবেন?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto mb-10">
            {/* OPTION 01: Without Milkimom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 text-white"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-5 text-white/90">
                {brandName} ছাড়া চালিয়ে যান
              </h3>

              <ul className="space-y-3 text-white/70">
                {rows.map((row, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <XCircle className="w-5 h-5 text-brand/60 flex-shrink-0 opacity-80 mt-0.5" />
                    <span className="font-medium text-base md:text-lg leading-snug">{row.other}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* OPTION 02: With Milkimom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#1A1A1A] rounded-2xl p-6 md:p-8 border-2 border-brand relative overflow-hidden text-white shadow-[0_0_30px_rgba(189,0,82,0.15)]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 rounded-bl-full blur-2xl -z-0"></div>

              <h3 className="text-xl md:text-2xl font-bold mb-5 relative z-10 text-white">
                এখনই {brandName} খান
              </h3>

              <ul className="space-y-3 mb-6 relative z-10 text-white/95">
                {rows.map((row, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-base md:text-lg leading-snug">{row.milkimom}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-brand/20 relative z-10">
                <p className="font-bold text-lg text-brand text-center">বাচ্চা পাবে পরিপূর্ণ বুকের দুধ।</p>
              </div>
            </motion.div>
          </div>

          <div className="text-center space-y-4 mt-6">
            <p className="text-lg md:text-xl text-brand font-bold">সিদ্ধান্তটা আপনার।</p>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-6">আপনি কোনটা বেছে নেবেন?</h3>
            <div className="flex justify-center pt-2">
              <a
                href="#order-section"
                className="cta-shine inline-flex items-center justify-center gap-2 bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark font-bold text-base md:text-lg px-8 py-3.5 rounded-full shadow-lg shadow-brand-cta/40 text-center transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <ShoppingBag className="size-5" />
                <span>হ্যাঁ, আমি {brandName} নিতে চাই</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
