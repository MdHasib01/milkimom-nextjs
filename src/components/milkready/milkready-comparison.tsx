"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MilkreadyComparison() {
  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-12 md:py-20 px-4 bg-[#0f172a] text-white overflow-hidden relative">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm mb-2 text-sky-400 font-semibold tracking-wide uppercase">
            আপনার সামনে এখন
          </p>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 tracking-tight"
          >
            <span className="relative inline-block px-2 text-[#38bdf8]">
              ২টা পথ
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[140%] text-sky-400 pointer-events-none"
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <path
                  d="M15,32 C5,25 5,10 25,5 C60,-5 95,5 95,20 C95,35 60,40 30,38 C15,37 10,32 10,25"
                  vectorEffect="non-scaling-stroke"
                />
              </motion.svg>
            </span>{" "}
            খোলা আছে
          </motion.h2>
          <p className="text-base sm:text-lg text-slate-400 font-medium">
            আপনি কোনটা বেছে নেবেন?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mb-10">
          {/* Without Preparation (Negative) */}
          <div className="bg-slate-900/80 rounded-2xl p-5 sm:p-7 border border-rose-500/20 backdrop-blur-sm">
            <h3 className="text-sm sm:text-base font-bold text-rose-400 uppercase tracking-wider mb-4 border-b border-rose-500/20 pb-3 flex items-center justify-between">
              <span>আগে থেকে Preparation না নিলে</span>
              <span className="text-xs text-rose-400/70 font-normal">ঝুঁকিপূর্ণ</span>
            </h3>
            <ul className="space-y-3">
              {[
                "Delivery-এর পর বুকের দুধ নিয়ে অনিশ্চয়তা",
                "Formula Milk কেনার বিশাল খরচ",
                "Formula Milk-এর অপূরণীয় ক্ষতি",
                "বাচ্চার ঘন ঘন অসুস্থতা ও অপুষ্টি",
                "বাচ্চার ইমিউনিটি ও ব্রেইন গ্রোথে সারাজীবনের ঘাটতি",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
                  <X className="size-4.5 shrink-0 text-rose-400 mt-0.5" strokeWidth={2.5} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With MilkReady (Positive Highlighted) */}
          <div className="bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-900 rounded-2xl p-5 sm:p-7 border-2 border-sky-400/50 shadow-xl shadow-sky-500/10 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 bg-sky-500 text-slate-950 font-extrabold text-[10px] sm:text-xs px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              সেরা সিদ্ধান্ত
            </div>
            <h3 className="text-sm sm:text-base font-bold text-sky-400 uppercase tracking-wider mb-4 border-b border-sky-500/30 pb-3 flex items-center justify-between">
              <span>MilkReady নিয়ে আগেই Preparation নিন</span>
            </h3>
            <ul className="space-y-3">
              {[
                "Delivery-এর পর বুকের দুধ নিয়ে নিশ্চিন্ত থাকুন",
                "Formula Milk কেনার কোনো দরকার নেই",
                "বাচ্চা জন্ম থেকেই পর্যাপ্ত পুষ্টিকর বুকের দুধ পাবে",
                "বাচ্চার রোগ প্রতিরোধ ক্ষমতা শক্তিশালী থাকবে",
                "বাচ্চার স্বাভাবিক বৃদ্ধি ও ব্রেইন ডেভেলপমেন্ট নিশ্চিত হবে",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-sky-100 font-medium text-xs sm:text-sm leading-relaxed">
                  <Check className="size-4.5 shrink-0 text-sky-400 mt-0.5" strokeWidth={3} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center space-y-3">
          <p className="font-semibold text-base sm:text-lg text-slate-300">
            Preparation শুরু হোক Baby আসার আগেই।
          </p>
          <p className="text-sky-400 font-extrabold text-lg sm:text-xl">
            সিদ্ধান্তটা আপনার।
          </p>
          <p className="text-xs sm:text-sm text-slate-400 mb-4">
            আপনি কোন Feeding Journey-টা চান?
          </p>
          
          <Button
            onClick={scrollToOrder}
            className="cta-shine inline-flex items-center justify-center gap-2 bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark font-bold text-base md:text-lg px-8 py-3.5 md:px-10 rounded-full shadow-lg shadow-brand-cta/40 text-center transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            হ্যাঁ, আমি Delivery-এর আগেই প্রস্তুত হতে চাই
          </Button>
        </div>
      </div>
    </section>
  );
}
