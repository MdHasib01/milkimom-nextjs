"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle2, ShoppingBag, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

const REVIEWS = [
  {
    id: 1,
    name: "তানিয়া সুলতানা",
    location: "মিরপুর, ঢাকা",
    review: "আলহামদুলিল্লাহ! ডেলিভারির ৩ সপ্তাহ আগে থেকেই MilkReady খাওয়া শুরু করেছিলাম। ডেলিভারির প্রথম দিন থেকেই পর্যাপ্ত বুকের দুধ হয়েছে, কোনো ফর্মুলা দুধের প্রয়োজন হয়নি!",
    rating: 5,
    avatar: "/images/milkready/reviewer-1.jpg",
    timeAgo: "২ দিন আগে",
  },
  {
    id: 2,
    name: "নুসরাত জাহান",
    location: "উত্তরা, ঢাকা",
    review: "প্রথম বাচ্চার সময় দুধ না হওয়ার কারণে অনেক কষ্ট পেতে হয়েছিল। তাই এবার ২য় প্রেগন্যান্সির ৮ম মাসে MilkReady নিই। ডেলিভারির পর এবার আর কোনো টেনশন করতে হয়নি।",
    rating: 5,
    avatar: "/images/milkready/reviewer-2.jpg",
    timeAgo: "৫ দিন আগে",
  },
  {
    id: 3,
    name: "শারমিন আক্তার",
    location: "ধানমন্ডি, ঢাকা",
    review: "আমার গাইনি ডাক্তারের পরামর্শে MilkReady ট্রাই করি। ডেলিভারির পর থেকেই দুধের ফ্লো খুব ভালো। টেস্টটাও খুব দারুণ!",
    rating: 5,
    avatar: "/images/milkready/reviewer-3.jpg",
    timeAgo: "১ সপ্তাহ আগে",
  },
  {
    id: 4,
    name: "ফারহানা রহমান",
    location: "চট্টগ্রাম",
    review: "অসাধারণ প্রোডাক্ট! নতুন মায়েদের ডেলিভারির আগে এই প্রস্তুতিটা নেওয়া কতটা জরুরি তা ব্যবহার না করলে বুঝতে পারতাম না। অনেক ধন্যবাদ MilkReady কে।",
    rating: 5,
    avatar: "/images/milkready/reviewer-4.jpg",
    timeAgo: "২ সপ্তাহ আগে",
  },
];

export function MilkreadyReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  // Auto-play interval for carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Scroll container when active index changes
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const card = container.children[currentIndex] as HTMLElement;
      if (card) {
        container.scrollTo({
          left: card.offsetLeft - container.offsetLeft - (container.clientWidth - card.clientWidth) / 2,
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex]);

  return (
    <section className="py-10 md:py-16 px-4 bg-slate-50 border-y border-slate-200/60 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 text-slate-800 leading-snug">
            আপনার মতো অন্য মায়েরাও <span className="text-[#0284c7]">Delivery-এর আগেই</span> প্রস্তুতি নিয়েছিলেন
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            আর আজ তারা তাদের Experience Share করছেন।
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div
          className="relative max-w-5xl mx-auto px-1 sm:px-4 mb-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            aria-label="Previous Review"
            className="absolute -left-2 sm:-left-5 md:-left-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center shadow-lg border border-sky-200/80 text-[#0284c7] hover:bg-[#0284c7] hover:text-white transition-all z-20 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Review"
            className="absolute -right-2 sm:-right-5 md:-right-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center shadow-lg border border-sky-200/80 text-[#0284c7] hover:bg-[#0284c7] hover:text-white transition-all z-20 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Slider */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto pb-4 pt-2 -mx-1 sm:mx-0 px-1 sm:px-0 gap-4 sm:gap-6 snap-x snap-mandatory hide-scrollbar"
          >
            {REVIEWS.map((rev, idx) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`min-w-[88vw] sm:min-w-[340px] md:min-w-[420px] lg:min-w-[460px] snap-center bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm border ${
                  idx === currentIndex
                    ? "border-sky-300 ring-2 ring-sky-100 shadow-md"
                    : "border-slate-200/80"
                } flex flex-col justify-between transition-all duration-300 relative`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-sky-200 bg-sky-50 shrink-0 shadow-xs">
                        <Image
                          src={rev.avatar}
                          alt={rev.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 48px, 56px"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight truncate">
                          {rev.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">{rev.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="size-4 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div className="relative pl-3 sm:pl-4 border-l-2 border-sky-200 my-2">
                    <Quote className="w-5 h-5 text-sky-200 absolute -top-1.5 -left-1 rotate-180 opacity-50" />
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic relative z-10">
                      "{rev.review}"
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="size-3.5" /> Verified Purchase
                  </span>
                  <span className="bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200/60 font-medium">
                    {rev.timeAgo}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dots Pagination */}
          <div className="flex justify-center items-center gap-2 mt-5">
            {REVIEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to review ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? "w-8 bg-[#0284c7]"
                    : "w-2.5 bg-sky-200 hover:bg-sky-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
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

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
