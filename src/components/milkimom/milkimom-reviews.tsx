"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ShoppingBag, ShieldCheck } from "lucide-react";
import { testimonials } from "@/lib/content";

export function MilkimomReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

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
    <section className="py-16 md:py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headings */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight mb-4">
            সন্তুষ্ট মায়েদের রিভিউ
          </h2>
          <p className="text-xl md:text-2xl text-[#1A1A1A]/80 font-medium">
            <span className="text-brand font-bold">৩০,০০০+ মা</span> ইতিমধ্যেই মিল্কিমম দিয়ে উপকৃত হয়েছেন।
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative max-w-lg sm:max-w-xl md:max-w-2xl mx-auto px-2 sm:px-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            aria-label="Previous Review"
            className="absolute -left-2 sm:-left-6 md:-left-8 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center shadow-lg border border-brand/15 text-brand hover:bg-brand hover:text-white transition-all z-20 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Review"
            className="absolute -right-2 sm:-right-6 md:-right-8 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center shadow-lg border border-brand/15 text-brand hover:bg-brand hover:text-white transition-all z-20 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Review Cards Slider */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto pb-4 pt-2 -mx-2 sm:mx-0 px-2 sm:px-0 gap-3 sm:gap-5 snap-x snap-mandatory hide-scrollbar items-stretch justify-start sm:justify-center"
          >
            {testimonials.map((review, idx) => (
              <motion.div
                key={review.name + idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`min-w-[80vw] sm:min-w-[360px] md:min-w-[420px] snap-center bg-white rounded-2xl p-5 sm:p-7 shadow-[0_6px_25px_rgba(0,0,0,0.05)] border flex flex-col justify-between ${
                  idx === currentIndex
                    ? "border-brand/50 ring-2 ring-brand/20 shadow-brand/10"
                    : "border-brand/15 hover:border-brand/30"
                } flex-shrink-0 transition-all duration-300`}
                onClick={() => setCurrentIndex(idx)}
              >
                <div>
                  <div className="flex items-center gap-1 mb-3 text-amber-400">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[#1A1A1A]/90 text-sm sm:text-base leading-relaxed font-medium">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-brand/10 flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-brand/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-[#1A1A1A] text-sm truncate">{review.name}</p>
                    <p className="text-xs text-[#1A1A1A]/60 truncate">{review.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to review slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex ? "w-8 bg-brand" : "w-2.5 bg-brand/20 hover:bg-brand/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Verified badge */}
        <div className="mt-8 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-brand-crimson shadow-xs">
            <ShieldCheck className="size-4" />
            ভেরিফাইড কাস্টমার রিভিউ
          </span>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 md:mt-10 w-full flex justify-center"
        >
          <a
            href="#order-section"
            className="cta-shine w-full sm:w-auto bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark font-bold text-lg md:text-xl px-8 py-4 md:px-10 rounded-full shadow-lg shadow-brand-cta/40 text-center transition-transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="size-5" />
            <span>হ্যাঁ, আমিও মিল্কিমম নিতে চাই</span>
          </a>
        </motion.div>
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
