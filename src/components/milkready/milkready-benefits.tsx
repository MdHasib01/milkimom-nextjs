"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useLandingPageContent } from "@/components/landing-page-content-provider";

export function MilkreadyBenefits() {
  const { content } = useLandingPageContent();

  const benefitsList = content.benefitsItems && content.benefitsItems.length > 0
    ? content.benefitsItems.map((b) => `${b.accent} ${b.rest}`.trim())
    : [
        "Breastfeeding Preparation",
        "Maternal Nutrition Support",
        "Breast Tissue Support",
        "Milk Duct Preparation",
        "Post-Delivery Feeding Readiness",
      ];

  return (
    <section className="py-10 md:py-16 px-4 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-[#0284c7] mb-2.5">
            <Sparkles className="size-3.5" />
            <span>উপকারিতা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0284c7]">
            {content.howItWorksTitle || "MilkReady এর উপকারিতা"}
          </h2>
        </motion.div>

        {/* Benefits Display */}
        <div className="relative w-full max-w-2xl mx-auto flex flex-col md:block items-center md:h-[380px]">
          
          {/* Central Product Image Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:absolute top-1/2 left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 rounded-full p-3 shadow-lg shadow-sky-500/10 mb-6 md:mb-0 w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center border-4 border-[#0284c7]/30 bg-gradient-to-b from-sky-50 to-white relative"
          >
            {/* Radial Lines (desktop only) */}
            <div className="hidden md:block absolute w-[340px] h-[340px] rounded-full border-2 border-dashed border-sky-300/40 pointer-events-none -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_60s_linear_infinite]" />
            
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden">
              <Image 
                src="/images/milkready/product-jar.jpg" 
                alt="MilkReady Product" 
                fill
                className="object-contain p-1 rounded-full"
                sizes="200px"
              />
            </div>
          </motion.div>

          {/* Benefit Nodes - Stacked nicely on mobile, circular positioning on desktop */}
          <div className="flex flex-col gap-3 w-full max-w-sm md:max-w-none md:block relative z-20">
            {benefitsList.map((benefit, i) => {
              // 5 nodes surrounding product circle
              const angles = [-90, -18, 54, 126, 198];
              const angle = (angles[i] * Math.PI) / 180;
              const radius = 175; // pixels distance from center
              
              const left = `calc(50% + ${Math.cos(angle) * radius}px)`;
              const top = `calc(50% + ${Math.sin(angle) * radius}px)`;

              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="md:absolute md:-translate-x-1/2 md:-translate-y-1/2 bg-gradient-to-r from-sky-50 to-white px-4 py-2.5 rounded-xl border border-sky-200/80 flex items-center gap-2.5 shadow-sm hover:shadow-md hover:border-[#0284c7] transition-all"
                  style={{ 
                    '--md-left': left, 
                    '--md-top': top,
                  } as React.CSSProperties}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0284c7] shrink-0 ring-4 ring-sky-100" />
                  <span className="font-bold text-xs sm:text-sm text-slate-800 tracking-tight">{benefit}</span>
                </motion.div>
              );
            })}
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @media (min-width: 768px) {
              .md\\:absolute {
                left: var(--md-left) !important;
                top: var(--md-top) !important;
              }
            }
          `}} />

        </div>
      </div>
    </section>
  );
}
