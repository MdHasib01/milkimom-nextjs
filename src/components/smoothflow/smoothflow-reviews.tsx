"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Maximize2, ShoppingBag } from "lucide-react";

const reviewImages = [
  { id: 1, src: "/images/smoothflow-review/Review 1.jpg", alt: "Smoothflow Customer Review 1" },
  { id: 2, src: "/images/smoothflow-review/Review 2.jpg", alt: "Smoothflow Customer Review 2" },
  { id: 3, src: "/images/smoothflow-review/Review 3.jpg", alt: "Smoothflow Customer Review 3" },
  { id: 4, src: "/images/smoothflow-review/Review 4.jpg", alt: "Smoothflow Customer Review 4" },
  { id: 5, src: "/images/smoothflow-review/Review 5.jpg", alt: "Smoothflow Customer Review 5" },
];

export function SmoothflowReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviewImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviewImages.length) % reviewImages.length);
  };

  // Auto-play interval for carousel
  useEffect(() => {
    if (isPaused || selectedImage !== null) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviewImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, selectedImage]);

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
    <section className="py-16 md:py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headings */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight mb-4">
            “আপনার মতো অন্য মায়েরাও এই একই জায়গায় ছিলেন।”
          </h2>
          <p className="text-xl md:text-2xl text-[#1A1A1A]/80 font-medium">
            আর আজ তারা তাদের <span className="text-brand font-bold">Experience Share করছেন।</span>
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
            aria-label="Previous Review Image"
            className="absolute -left-2 sm:-left-6 md:-left-8 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center shadow-lg border border-brand/15 text-brand hover:bg-brand hover:text-white transition-all z-20 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Review Image"
            className="absolute -right-2 sm:-right-6 md:-right-8 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center shadow-lg border border-brand/15 text-brand hover:bg-brand hover:text-white transition-all z-20 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Responsive Image Carousel Slider */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto pb-4 pt-2 -mx-2 sm:mx-0 px-2 sm:px-0 gap-3 sm:gap-5 snap-x snap-mandatory hide-scrollbar items-center justify-start sm:justify-center"
          >
            {reviewImages.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`min-w-[70vw] sm:min-w-[320px] md:min-w-[380px] snap-center bg-white rounded-2xl p-2 shadow-[0_6px_25px_rgba(0,0,0,0.05)] border ${
                  idx === currentIndex
                    ? "border-brand/50 ring-2 ring-brand/20 shadow-brand/10"
                    : "border-brand/15 hover:border-brand/30"
                } flex-shrink-0 transition-all duration-300 relative group cursor-pointer`}
                onClick={() => {
                  setCurrentIndex(idx);
                  setSelectedImage(review.src);
                }}
              >
                <div className="relative overflow-hidden rounded-xl bg-brand-light/30 flex justify-center items-center">
                  <img
                    src={review.src}
                    alt={review.alt}
                    className="w-full h-auto max-h-[320px] sm:max-h-[380px] object-contain rounded-xl"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <span className="bg-white/90 text-[#1A1A1A] font-semibold text-xs px-3 py-1 rounded-full shadow flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-brand" /> বড় করে দেখতে ক্লিক করুন
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {reviewImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to review image slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? "w-8 bg-brand"
                    : "w-2.5 bg-brand/20 hover:bg-brand/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 md:mt-14 w-full flex justify-center"
        >
          <a
            href="#order-section"
            className="cta-shine w-full sm:w-auto bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark font-bold text-lg md:text-xl px-8 py-4 md:px-10 rounded-full shadow-lg shadow-brand-cta/40 text-center transition-transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="size-5" />
            <span>হ্যাঁ, আমিও Feeding-এ স্বস্তি চাই</span>
          </a>
        </motion.div>
      </div>

      {/* Lightbox Modal for Zooming Image */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
              <button
                onClick={() => setSelectedImage(null)}
                aria-label="Close Preview"
                className="absolute -top-10 right-0 text-white hover:text-brand transition-colors p-2 cursor-pointer bg-white/10 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedImage}
                alt="Review enlarged preview"
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
