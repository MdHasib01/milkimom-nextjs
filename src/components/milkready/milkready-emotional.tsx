"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { AlertCircle, HeartHandshake } from "lucide-react";

export function MilkreadyEmotional() {
  return (
    <section className="py-10 md:py-16 px-4 bg-white border-b border-slate-200/60">
      <div className="max-w-3xl mx-auto text-center">
        {/* Mother & Baby Caring Imagery */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-md mb-6 border border-slate-200"
        >
          <Image
            src="/images/milkready/emotional-mother.jpg"
            alt="Loving mother holding newborn baby"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-5 text-slate-800 leading-snug"
        >
          বুকের দুধ না হলে, সেই ক্ষতি <span className="text-rose-600">টাকা দিয়ে মাপা যায় না</span>।
        </motion.h2>

        <div className="flex flex-col gap-3 text-slate-700 text-xs sm:text-sm md:text-base px-3 leading-relaxed max-w-xl mx-auto">
          <div className="bg-rose-50 border border-rose-200/60 rounded-xl p-3.5 text-rose-900 font-semibold">
            Formula Milk-এর পেছনে খরচ হতে পারে ৮–১০ লাখ টাকা।
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
        </div>
      </div>
    </section>
  );
}
