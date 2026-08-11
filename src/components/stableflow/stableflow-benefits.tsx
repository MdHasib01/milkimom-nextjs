"use client";

import { motion } from "framer-motion";
import { HeartPulse, Disc, Minimize, ShieldCheck, Smile } from "lucide-react";
import { useLandingPageContent } from "@/components/landing-page-content-provider";

const defaultBenefits = [
  {
    icon: HeartPulse,
    title: "Breast Pain থেকে মুক্তি দেয়",
    top: "0%",
    left: "50%",
    delay: 0.1,
  },
  {
    icon: Disc,
    title: "শক্ত/চাকা-চাকা অনুভূতি থেকে মুক্তি দেয়",
    top: "35%",
    left: "15%",
    delay: 0.2,
  },
  {
    icon: Minimize,
    title: "Breast Pressure কমায়",
    top: "35%",
    left: "85%",
    delay: 0.3,
  },
  {
    icon: ShieldCheck,
    title: "Clogged Duct থেকে মুক্তি দেয়",
    top: "85%",
    left: "22%",
    delay: 0.4,
  },
  {
    icon: Smile,
    title: "Feeding-এ স্বস্তি ফিরিয়ে আনে",
    top: "85%",
    left: "78%",
    delay: 0.5,
  },
];

export function StableflowBenefits() {
  const { content } = useLandingPageContent();
  const title = content.howItWorksTitle || "SmoothFlow এর উপকারিতা";

  return (
    <section className="pt-8 pb-16 md:pt-12 md:pb-24 relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand leading-tight">
            {title}
          </h2>
        </div>

        <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[500px] md:max-w-[700px] mx-auto my-12 md:my-16">
          {/* Circular Decorative Lines */}
          <div className="absolute inset-0 m-auto w-[85%] h-[85%] rounded-full border border-dashed border-brand/30 animate-[spin_60s_linear_infinite]"></div>
          <div className="absolute inset-0 m-auto w-[55%] h-[55%] rounded-full border border-dashed border-brand/20 animate-[spin_40s_linear_infinite_reverse]"></div>
          <div className="absolute inset-0 m-auto w-[100%] h-[100%] rounded-full border border-dashed border-brand/10"></div>

          {/* Center Product */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 m-auto z-10 w-[35%] aspect-[3/4] bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-brand/10 border-2 border-brand/10 flex flex-col items-center justify-center p-2 sm:p-4"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-brand-light rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4">
              <span className="text-brand font-black text-sm sm:text-xl md:text-2xl">SF</span>
            </div>
            <h4 className="font-black text-[#1A1A1A] text-[11px] sm:text-base md:text-xl text-center leading-tight">
              {content.productNameEn || "SmoothFlow"}
            </h4>
            <p className="text-[8px] sm:text-xs text-[#1A1A1A]/50 font-bold mt-1 uppercase tracking-widest text-center">
              Formula
            </p>
          </motion.div>

          {/* Surrounding Benefits */}
          {defaultBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const customItem = content.benefitsItems?.[index];
            const displayTitle = customItem
              ? `${customItem.accent} ${customItem.rest}`
              : benefit.title;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: benefit.delay }}
                className="absolute flex flex-col items-center w-[120px] sm:w-[150px] md:w-[200px] z-20"
                style={{ top: benefit.top, left: benefit.left, transform: "translate(-50%, -50%)" }}
              >
                <div className="bg-white p-2.5 sm:p-3 md:p-5 rounded-xl md:rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-brand/10 flex flex-col items-center gap-2 md:gap-3 w-full text-center hover:border-brand/30 transition-colors">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-brand-light text-brand rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-[11px] sm:text-sm md:text-base font-bold text-[#1A1A1A] leading-[1.3]">
                    {displayTitle}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
