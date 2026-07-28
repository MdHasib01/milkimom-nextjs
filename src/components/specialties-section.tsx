"use client";

import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionCta } from "@/components/section-cta";
import { GridPattern } from "@/components/grid-pattern";

type SpecialtyItem = {
  number: string;
  title: string;
  description?: ReactNode[];
  introText?: ReactNode;
  bullets?: ReactNode[];
  footerText?: ReactNode;
  bulletPoints?: boolean;
};

const specialties: SpecialtyItem[] = [
  {
    number: "১",
    title: "৩ দিনেই বুকের দুধ বাড়ে",
    description: [
      "মিল্কিমম খেলে ৩ দিনের মধ্যে বুকের দুধ বৃদ্ধি পাবে।",
      "ফলে, আপনার বাচ্চা পরিপূর্ণ বুকের দুধ পাবে।",
    ],
    bulletPoints: false,
  },
  {
    number: "২",
    title: "১ ডোজ-ই খেতে হয়",
    description: [
      "মিল্কিমম ১ ডোজ-ই খেতে হয়।",
      "বারবার খাওয়ার প্রয়োজন নেই।",
    ],
    bulletPoints: false,
  },
  {
    number: "৩",
    title: "১৫ দিনের কমপ্লিট ডোজ",
    description: [
      "বাবুর বয়স ০-২৪ মাসের মধ্যে যেকোনো সময়ে খেতে পারেন।",
    ],
    bulletPoints: false,
  },
  {
    number: "৪",
    title: "ডোজ শেষ হলে বুকের দুধ কমে না",
    description: [
      "মিল্কিমম এর একটি কমপ্লিট ডোজ শেষ হওয়ার পরেও বুকের দুধের ফ্লো কখনোই কমে যায় না।",
      "ব্রেস্টফিডিং এর শেষ পর্যন্ত পার্মানেন্ট হয়।",
    ],
    bulletPoints: false,
  },
  {
    number: "৫",
    title: "অনেক টাকা বেঁচে যায়",
    introText: "মিল্কিমম একবার খেলে,",
    bullets: [
      "বারবার খাওয়া লাগে না।",
      "ফর্মুলা দুধ কেনা লাগে না।",
    ],
    footerText: "এজন্য, অনেক টাকাও বেঁচে যায়।",
    bulletPoints: true,
  },
];

function SpecialtyCard({ item }: { item: SpecialtyItem }) {
  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md sm:hover:-translate-y-1">
      {/* Top Right Grid Pattern */}
      <GridPattern
        size={22}
        className="z-0 opacity-40 mix-blend-multiply dark:mix-blend-screen [mask-image:radial-gradient(circle_at_top_right,black_30%,transparent_75%)]"
      />

      {/* Subtle Top Accent Line */}
      <div className="absolute top-0 inset-x-8 h-1 rounded-b-full bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Header: Primary Color Circle with Numbering */}
        <div className="mb-4">
          <div className="flex size-10 sm:size-11 items-center justify-center rounded-full bg-primary font-heading text-base sm:text-lg font-bold text-primary-foreground shadow-md shadow-primary/25 transition-transform duration-300 group-hover:scale-110">
            {item.number}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-heading text-xl font-extrabold text-primary sm:text-2xl mb-3">
          {item.title}
        </h3>

        {/* Content */}
        {!item.bulletPoints ? (
          <div className="space-y-2 text-muted-foreground text-sm sm:text-base leading-relaxed">
            {item.description?.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        ) : (
          <div className="space-y-2 text-muted-foreground text-sm sm:text-base leading-relaxed">
            {item.introText && <p>{item.introText}</p>}
            {item.bullets && (
              <ul className="my-2 space-y-1.5 pl-1">
                {item.bullets.map((bText, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2 text-foreground font-medium">
                    <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                    <span>{bText}</span>
                  </li>
                ))}
              </ul>
            )}
            {item.footerText && <p className="font-medium text-foreground">{item.footerText}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export function SpecialtiesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % specialties.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + specialties.length) % specialties.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <section id="specialties" className="relative overflow-hidden py-16 sm:py-24 bg-card/40">
      <GridPattern size={28} className="opacity-40" />

      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-heading text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
            মিল্কিমম এর বিশেষত্ব
          </h2>
        </Reveal>

        {/* Mobile Automatic Loop Carousel */}
        <div
          className="relative mt-8 block sm:hidden px-4"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Card Container */}
          <div className="relative w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full"
              >
                <SpecialtyCard item={specialties[currentIndex]} />
              </motion.div>
            </AnimatePresence>

            {/* Left & Right Side Buttons (Middle of card outline border) */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 flex size-9 items-center justify-center rounded-full border border-primary/30 bg-card text-primary shadow-md backdrop-blur-md transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Slide"
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 flex size-9 items-center justify-center rounded-full border border-primary/30 bg-card text-primary shadow-md backdrop-blur-md transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* Bottom Indicators */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {specialties.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-7 bg-primary"
                    : "w-2.5 bg-primary/20 hover:bg-primary/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <RevealGroup stagger={0.1} className="mt-12 hidden sm:flex flex-wrap justify-center gap-6">
          {specialties.map((item, index) => (
            <RevealItem
              key={index}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex"
            >
              <SpecialtyCard item={item} />
            </RevealItem>
          ))}
        </RevealGroup>

        <SectionCta />
      </div>
    </section>
  );
}
