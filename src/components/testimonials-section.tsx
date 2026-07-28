"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Reveal } from "@/components/motion/reveal";
import { SectionCta } from "@/components/section-cta";
import { testimonials } from "@/lib/content";
import { fetchMotherCount } from "@/lib/api";
import { formatBengaliNumber } from "@/lib/number-utils";

function CareCarousel({ motherCount = 89746 }: { motherCount?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const formattedCount = `${formatBengaliNumber(motherCount)}`;

  const carouselItems = [
    {
      id: 1,
      image: "/assets/carousel/doctor.png",
      alt: "ডাক্তারের পরামর্শ ও মা ও শিশুর যত্ন",
      title: "মা ও শিশুর যত্নে একটুও ছাড় নয়!",
      description: "বিশেষজ্ঞ ডাক্তারের পরামর্শ ও ১০০% সঠিক পুষ্টিতে আপনার শিশুর সুস্থ বিকাশ নিশ্চিত করুন।",
      tag: "ডাক্তারের পরামর্শ",
    },
    {
      id: 2,
      image: "/assets/carousel/pic2.png",
      alt: "মায়ের স্বাস্থ্যে মিল্কিমম",
      title: "মা ও শিশুর যত্নে একটুও ছাড় নয়!",
      description: "১০০% প্রাকৃতিক উপাদান সমৃদ্ধ যা মায়ের বুকের দুধ বাড়াতে শতভাগ কার্যকর।",
      tag: "প্রাকৃতিক সুরক্ষা",
    },
    {
      id: 3,
      image: "/assets/carousel/pic3.png",
      alt: "শিশুর হাসি ও মায়ের তৃপ্তি",
      title: "মা ও শিশুর যত্নে একটুও ছাড় নয়!",
      description: `${formattedCount} মায়েদের বিশ্বস্ততা ও শিশুর সঠিক পুষ্টির সাথে গড়ে উঠুক সুন্দর ভবিষ্যৎ।`,
      tag: "বিশ্বস্ত পছন্দ",
    },
  ];

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, carouselItems.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  return (
    <div
      className="relative mt-10 overflow-hidden rounded-3xl shadow-xl border border-border/40 group bg-black/90"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-72 sm:h-96 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={carouselItems[currentIndex].image}
              alt={carouselItems[currentIndex].alt}
              fill
              priority={currentIndex === 0}
              className="object-cover object-center"
              sizes="(min-width: 1024px) 72rem, 100vw"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 text-white max-w-3xl">
              <span className="mb-2 inline-block w-fit rounded-full bg-brand-crimson/90 px-3 py-1 text-xs font-semibold tracking-wider text-white shadow-sm backdrop-blur-sm">
                {carouselItems[currentIndex].tag}
              </span>
              <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-md">
                &ldquo;{carouselItems[currentIndex].title}&rdquo;
              </h3>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2 sm:line-clamp-none max-w-2xl drop-shadow">
                {carouselItems[currentIndex].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-brand-crimson hover:scale-105 active:scale-95 cursor-pointer z-10 opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-brand-crimson hover:scale-105 active:scale-95 cursor-pointer z-10 opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 right-6 sm:right-10 z-10 flex items-center gap-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? "w-8 bg-brand-crimson"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const [showAll, setShowAll] = useState(false);
  const [motherCount, setMotherCount] = useState<number>(89746);

  useEffect(() => {
    let isMounted = true;
    const loadCount = async () => {
      try {
        const result = await fetchMotherCount();
        if (isMounted && result?.success && typeof result.data?.count === "number" && result.data.count > 0) {
          setMotherCount(result.data.count);
        }
      } catch {
        // Keep initial fallback count 89746 on error
      }
    };
    loadCount();

    const interval = setInterval(loadCount, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="reviews" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-crimson">
          মায়েদের অভিজ্ঞতা
        </span>
        <h2 className="mt-2 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
          সন্তুষ্ট মায়েদের রিভিউ
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
          <div className="flex -space-x-2 shrink-0">
            {[
              "/assets/reviewer/girl1.jpeg",
              "/assets/reviewer/girl2.jpeg",
              "/assets/reviewer/girl3.jpeg",
              "/assets/reviewer/girl4.jpeg",
            ].map((imgSrc, index) => (
              <Image
                key={index}
                src={imgSrc}
                alt={`রিভিউয়ার ${index + 1}`}
                width={36}
                height={36}
                className="size-8 rounded-full border-2 border-card object-cover shadow-sm"
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-foreground">
            {formatBengaliNumber(motherCount)} রিভিউ
          </span>
        </div>
      </Reveal>

      <div className="relative mt-10">
        <div
          className={`grid grid-cols-1 gap-5 sm:grid-cols-2 transition-all duration-500 ease-in-out ${
            !showAll ? "max-h-[460px] sm:max-h-[480px] overflow-hidden" : ""
          }`}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="flex items-center gap-1 text-brand-gold">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-4 fill-current text-brand-gold"
                  />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-coral/15 text-sm font-bold text-brand-crimson">
                  {testimonial.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient Overlay & Blended See More Button */}
        {!showAll && (
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/90 to-transparent z-10 flex items-end justify-center pb-4 pointer-events-none">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-brand-crimson/30 bg-card/90 backdrop-blur-md px-8 py-3 text-sm font-bold text-brand-crimson shadow-xl transition-all hover:scale-105 hover:bg-brand-crimson hover:text-white hover:shadow-2xl cursor-pointer"
            >
              <span>আরও রিভিউ দেখুন</span>
              <ChevronDown className="size-4 animate-bounce" />
            </button>
          </div>
        )}
      </div>

      {showAll && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(false)}
            aria-label="কম রিভিউ দেখুন"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card p-3 text-muted-foreground shadow-md transition-all hover:bg-muted hover:text-foreground hover:scale-110 cursor-pointer"
          >
            <ChevronUp className="size-5" />
          </button>
        </div>
      )}

      <Reveal delay={0.15}>
        <CareCarousel motherCount={motherCount} />
      </Reveal>
      <SectionCta />
    </section>
  );
}

