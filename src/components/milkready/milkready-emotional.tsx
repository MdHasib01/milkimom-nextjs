"use client";

import { motion } from "framer-motion";

export function MilkreadyEmotional() {
  return (
    <section className="py-8 md:py-16 overflow-hidden bg-white border-b border-slate-200/60">
      {/* Pain Vs Money Visual - Edge-to-edge on mobile, rounded with shadow on tablet/desktop */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.99 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl mx-auto px-0 sm:px-4 md:px-6 mb-6 md:mb-8"
      >
        <div className="overflow-hidden rounded-none sm:rounded-2xl md:rounded-3xl sm:shadow-lg sm:border sm:border-slate-200/80">
          <img
            src="/images/milkready/Pain Vs Money.jpg"
            alt="বুকের দুধ না হলে, সেই ক্ষতি টাকা দিয়ে মাপা যায় না - Pain Vs Money"
            className="w-full h-auto object-contain block rounded-none sm:rounded-2xl md:rounded-3xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/milkready/pain-vs-money.jpg";
            }}
          />
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-5 text-slate-800 leading-snug"
        >
          বুকের দুধ না হলে, সেই ক্ষতি <span className="text-rose-600">টাকা দিয়ে মাপা যায় না</span>।
        </motion.h2>

        <div className="flex flex-col gap-3 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          <div className="bg-rose-50 border border-rose-200/60 rounded-xl p-3.5 text-rose-900 font-medium">
            Formula Milk-এর পেছনে খরচ হতে পারে <span className="font-extrabold text-rose-950">৮–১০ লাখ টাকা</span>।
          </div>

          <p className="mt-1">
            বাচ্চার বিভিন্ন রোগব্যাধি, ঘন ঘন Doctor ভিজিট, Test আর Treatment-এর পেছনে চলে যেতে পারে আরও কয়েক লাখ টাকা।
          </p>

          <p className="text-slate-600 italic">
            বারবার বাচ্চার অসুস্থতা, আর দিন দিন দুর্বল হয়ে যাওয়া—
          </p>

          <p className="font-bold text-slate-900 mt-2 text-sm sm:text-base">
            এত কষ্টের পরেও একটা অসুস্থ আর অপুষ্ট বাচ্চার যন্ত্রণা কোনো মা-বাবার পক্ষেই মেনে নেওয়া সম্ভব নয়।
          </p>

          <div className="text-4xl mt-2 select-none">😔</div>
        </div>
      </div>
    </section>
  );
}
