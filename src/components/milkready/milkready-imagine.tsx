"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export function MilkreadyImagine() {
  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-8 md:py-14 overflow-hidden bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-slate-800 leading-snug px-2"
        >
          Delivery-এর পর বাচ্চাকে{" "}
          <span className="text-slate-500 font-semibold">Formula Milk</span> না দিয়ে, যদি{" "}
          <span className="text-[#0284c7] font-black">নিজের বুকের দুধ</span> খাওয়াতে পারেন—কেমন হয়?
        </motion.h2>
      </div>

      {/* Before Vs After Visual - Edge-to-edge full width on mobile, rounded with shadow on tablet/desktop */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.99 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl mx-auto px-0 sm:px-4 md:px-6"
      >
        <div className="overflow-hidden rounded-none sm:rounded-2xl md:rounded-3xl sm:shadow-lg sm:border sm:border-slate-200/80">
          <img
            src="/images/milkready/Before Vs After.jpg"
            alt="Delivery এর পর Formula Milk না দিয়ে নিজের বুকের দুধ খাওয়ানোর প্রস্তুতি - Before Vs After"
            className="w-full h-auto object-contain block rounded-none sm:rounded-2xl md:rounded-3xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/milkready/before-vs-after.jpg";
            }}
          />
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <p className="mt-6 mb-5 font-bold text-base sm:text-lg text-slate-800">
          সেই <span className="text-[#0284c7]">Happiness</span> পৃথিবীতে আর কোথাও নেই।
        </p>

        <div className="flex justify-center w-full">
          <button
            type="button"
            onClick={scrollToOrder}
            className="cta-shine w-full sm:w-auto min-h-[54px] sm:min-h-[58px] h-auto py-4 px-8 md:px-10 rounded-full bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark font-bold text-lg md:text-xl shadow-lg shadow-brand-cta/40 text-center transition-all hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2.5 cursor-pointer select-none"
          >
            <ShoppingBag className="size-5 sm:size-6 shrink-0" strokeWidth={2.5} />
            <span>হ্যাঁ, আমি Happy হতে চাই</span>
          </button>
        </div>
      </div>
    </section>
  );
}
