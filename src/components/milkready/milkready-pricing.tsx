"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Timer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function getMidnightTarget() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(24, 0, 0, 0);
  return target;
}

function useCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = getMidnightTarget();
    const tick = () => setRemaining(Math.max(0, target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (remaining === null) return null;

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function MilkreadyPricing() {
  const countdown = useCountdown();

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-16 px-4 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-[#0284c7] mb-2.5">
            <Sparkles className="size-3.5" />
            <span>সীমিত সময়ের অফার</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-snug">
            বুকের দুধ সম্পর্কে নিশ্চিত হয়ে নিন <span className="text-[#0284c7]">Delivery-এর আগেই</span>।
          </h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-6 shadow-md border-2 border-sky-100 relative overflow-hidden"
        >
          {/* Sticker Ribbon */}
          <div className="absolute top-4 -right-[34px] bg-[#0284c7] text-white py-1 px-10 rotate-45 font-black text-[10px] sm:text-xs shadow-sm uppercase tracking-wider">
            40% OFF
          </div>

          {/* Product Jar Visual */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 relative flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image 
                src="/images/milkready/product-jar.png" 
                alt="MilkReady Complete Dose" 
                fill
                className="object-contain drop-shadow-xl"
                sizes="160px"
              />
            </div>
          </div>

          <h3 className="font-extrabold text-slate-900 text-lg mb-1">MilkReady™ Prenatal Dose</h3>
          <p className="text-xs text-slate-500 mb-4 font-medium">সম্পূর্ণ ডোজ · ৬০টি সার্ভিং</p>

          {/* Pricing Details */}
          <div className="mb-4 flex flex-col items-center gap-1">
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-slate-400 font-bold line-through text-base sm:text-lg">
                ৳৫,৬৫০
              </span>
              <span className="text-3xl sm:text-4xl font-black text-[#0284c7] tracking-tight">
                ৳৩,৩৯৯
              </span>
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
              আপনার সাশ্রয় ৳২,২৫১ (৪০% ছাড়)
            </div>
          </div>

          {/* Timer pill */}
          {countdown && (
            <div className="mb-5 py-2 px-3 bg-sky-50 rounded-xl border border-sky-200/80 flex items-center justify-center gap-2 text-xs text-slate-700 font-medium">
              <Timer className="size-4 text-[#0284c7] shrink-0" />
              <span>অফার শেষ হতে বাকি:</span>
              <span className="font-mono font-bold text-[#0284c7] text-sm">
                {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
              </span>
            </div>
          )}

          <Button
            onClick={scrollToOrder}
            className="cta-shine w-full bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark font-black text-lg py-4 px-6 rounded-full shadow-lg shadow-brand-cta/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="size-5 shrink-0" strokeWidth={2.5} />
            <span>এখনই MilkReady অর্ডার করুন</span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
