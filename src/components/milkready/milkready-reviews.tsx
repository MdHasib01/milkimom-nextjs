"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle2, Quote, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const REVIEWS = [
  {
    id: 1,
    name: "তানিয়া সুলতানা",
    location: "মিরপুর, ঢাকা",
    review: "আলহামদুলিল্লাহ! ডেলিভারির ৩ সপ্তাহ আগে থেকেই MilkReady খাওয়া শুরু করেছিলাম। ডেলিভারির প্রথম দিন থেকেই পর্যাপ্ত বুকের দুধ হয়েছে, কোনো ফর্মুলা দুধের প্রয়োজন হয়নি!",
    rating: 5,
    avatar: "/assets/reviewer/girl1.jpeg",
    timeAgo: "২ দিন আগে",
  },
  {
    id: 2,
    name: "নুসরাত জাহান",
    location: "উত্তরা, ঢাকা",
    review: "প্রথম বাচ্চার সময় দুধ না হওয়ার কারণে অনেক কষ্ট পেতে হয়েছিল। তাই এবার ২য় প্রেগন্যান্সির ৮ম মাসে MilkReady নিই। ডেলিভারির পর এবার আর কোনো টেনশন করতে হয়নি।",
    rating: 5,
    avatar: "/assets/reviewer/girl2.jpeg",
    timeAgo: "৫ দিন আগে",
  },
  {
    id: 3,
    name: "শারমিন আক্তার",
    location: "ধানমন্ডি, ঢাকা",
    review: "আমার গাইনি ডাক্তারের পরামর্শে MilkReady ট্রাই করি। ডেলিভারির পর থেকেই দুধের ফ্লো খুব ভালো। টেস্টটাও খুব দারুণ!",
    rating: 5,
    avatar: "/assets/reviewer/girl3.jpeg",
    timeAgo: "১ সপ্তাহ আগে",
  },
  {
    id: 4,
    name: "ফারহানা রহমান",
    location: "চট্টগ্রাম",
    review: "অসাধারণ প্রোডাক্ট! নতুন মায়েদের ডেলিভারির আগে এই প্রস্তুতিটা নেওয়া কতটা জরুরি তা ব্যবহার না করলে বুঝতে পারতাম না। অনেক ধন্যবাদ MilkReady কে।",
    rating: 5,
    avatar: "/assets/reviewer/girl4.jpeg",
    timeAgo: "২ সপ্তাহ আগে",
  },
];

export function MilkreadyReviews() {
  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-16 px-4 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 text-slate-800 leading-snug">
            আপনার মতো অন্য মায়েরাও <span className="text-[#0284c7]">Delivery-এর আগেই</span> প্রস্তুতি নিয়েছিলেন।
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            আর আজ তারা তাদের Experience Share করছেন।
          </p>
        </motion.div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {REVIEWS.map((rev, i) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-sky-200 bg-sky-50">
                      <Image
                        src={rev.avatar}
                        alt={rev.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base">{rev.name}</h4>
                      <p className="text-xs text-slate-500">{rev.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="size-4 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic relative">
                  "{rev.review}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="size-3.5" /> Verified Purchase
                </span>
                <span>{rev.timeAgo}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center flex justify-center w-full">
          <button
            type="button"
            onClick={scrollToOrder}
            className="cta-shine w-full sm:w-auto min-h-[54px] sm:min-h-[58px] h-auto py-4 px-8 md:px-10 rounded-full bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark font-bold text-lg md:text-xl shadow-lg shadow-brand-cta/40 text-center transition-all hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2.5 cursor-pointer select-none"
          >
            <ShoppingBag className="size-5 sm:size-6 shrink-0" strokeWidth={2.5} />
            <span>হ্যাঁ, আমিও Delivery-এর আগেই Ready হতে চাই</span>
          </button>
        </div>
      </div>
    </section>
  );
}
