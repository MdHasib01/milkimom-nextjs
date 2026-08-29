"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  HeartPulse,
  Leaf,
  ShieldCheck,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Quote,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { trustBadges } from "@/lib/content";
import { useLandingPageContent } from "@/components/landing-page-content-provider";
import { type DoctorItemData } from "@/lib/admin-api";

const iconMap: Record<(typeof trustBadges)[number]["icon"], LucideIcon> = {
  leaf: Leaf,
  "shield-check": ShieldCheck,
  stethoscope: Stethoscope,
  "heart-pulse": HeartPulse,
};

const defaultDoctors = [
  {
    id: "saddam",
    name: "ডা. মোঃ সাদ্দাম",
    degree: "এমবিবিএস, এফসিপিএস",
    description:
      "মিল্কিমম তৈরি হয়েছে গভর্নমেন্ট রেজিস্টার্ড চিকিৎসকদের তত্ত্বাবধানে, ৪৮০০+ বছরের প্রাচীন আয়ুর্বেদিক জ্ঞান ও আধুনিক বিজ্ঞানের গবেষণার সমন্বয়ে। প্রতিটি ব্যাচ ল্যাব টেস্টেড ও BSTI সার্টিফাইড, যাতে মা ও শিশু উভয়ের জন্যই এটি সম্পূর্ণ নিরাপদ থাকে।",
    image: "/assets/doctors/saddam.webp",
  },
  {
    id: "nazmul",
    name: "ডা. মোঃ নাজমুল",
    degree: "এমবিবিএস, ডিজিইউ",
    description:
      "মিল্কিমম তৈরি হয়েছে গভর্নমেন্ট রেজিস্টার্ড চিকিৎসকদের তত্ত্বাবধানে, ৪৮০০+ বছরের প্রাচীন আয়ুর্বেদিক জ্ঞান ও আধুনিক বিজ্ঞানের গবেষণার সমন্বয়ে। প্রতিটি ব্যাচ ল্যাব টেস্টেড ও BSTI সার্টিফাইড, যাতে মা ও শিশু উভয়ের জন্যই এটি সম্পূর্ণ নিরাপদ থাকে।",
    image: "/assets/doctors/nazmul.webp",
  },
];

export function MilkimomCertifications() {
  const { content, getImageUrl, replaceBrandName } = useLandingPageContent();
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const doctorsList = (
    content.doctorItems && content.doctorItems.length > 0 ? content.doctorItems : defaultDoctors
  ).map((doc: DoctorItemData) => ({
    id: doc.id,
    name: doc.name,
    degree: doc.degree || "মেডিকেল বোর্ড অনুমোদিত",
    quote: replaceBrandName(doc.description || ""),
    img: getImageUrl(doc.image, "/assets/doctors/saddam.webp"),
  }));

  const nextDoc = () => {
    setCurrentDocIndex((prev) => (prev + 1) % doctorsList.length);
  };

  const prevDoc = () => {
    setCurrentDocIndex((prev) => (prev - 1 + doctorsList.length) % doctorsList.length);
  };

  useEffect(() => {
    if (isPaused || doctorsList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentDocIndex((prev) => (prev + 1) % doctorsList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, doctorsList.length]);

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const card = container.children[currentDocIndex] as HTMLElement;
      if (card) {
        container.scrollTo({
          left: card.offsetLeft - container.offsetLeft,
          behavior: "smooth",
        });
      }
    }
  }, [currentDocIndex]);

  return (
    <section className="py-8 md:py-20 relative bg-brand-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headings */}
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand leading-tight">
            {content.doctorTitle || "বিশেষজ্ঞ ডাক্তারের পরামর্শ"}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#1A1A1A]/70 font-medium">
            দেশের স্বনামধন্য চিকিৎসকদের সুপারিশকৃত ও ল্যাব-সার্টিফাইড সমাধান
          </p>
        </div>

        {/* Part 01: Trust Badges */}
        <div className="mb-6 md:mb-16">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-5 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            {trustBadges.map((badge) => {
              const Icon = iconMap[badge.icon];
              return (
                <div
                  key={badge.title}
                  className="w-[45%] sm:w-auto sm:flex-1 flex flex-col items-center text-center gap-2"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white border border-brand/10 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex items-center justify-center text-brand transition-transform hover:scale-105">
                    <Icon className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <h4 className="font-bold text-[#1A1A1A] text-[11px] sm:text-xs md:text-sm leading-tight px-1">
                    {badge.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Part 02: Doctor Recommendation Carousel */}
        <div
          className="relative max-w-5xl mx-auto px-1 sm:px-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {doctorsList.length > 1 && (
            <>
              <button
                onClick={prevDoc}
                aria-label="Previous Doctor"
                className="absolute -left-2 sm:-left-6 md:-left-12 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-brand/15 text-brand hover:bg-brand hover:text-white transition-all z-20 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <button
                onClick={nextDoc}
                aria-label="Next Doctor"
                className="absolute -right-2 sm:-right-6 md:-right-12 top-1/2 -translate-y-1/2 w-9 h-9 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-brand/15 text-brand hover:bg-brand hover:text-white transition-all z-20 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className="flex overflow-x-auto pb-4 pt-2 -mx-1 sm:mx-0 px-1 sm:px-0 gap-3 sm:gap-6 snap-x snap-mandatory hide-scrollbar"
          >
            {doctorsList.map((doc, idx) => (
              <motion.div
                key={doc.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`min-w-[92vw] sm:min-w-[360px] md:min-w-[420px] lg:min-w-[460px] snap-center bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.05)] border ${
                  idx === currentDocIndex ? "border-brand/40 ring-2 ring-brand/10" : "border-brand/10"
                } flex flex-col justify-between transition-all duration-300`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-3 sm:mb-5">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 bg-brand-light border-2 border-brand/20 shadow-sm">
                      <img
                        src={doc.img}
                        alt={doc.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/assets/doctor.png";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-[#1A1A1A] text-sm sm:text-lg leading-snug truncate">
                        {doc.name}
                      </h3>
                      <p className="text-[11px] sm:text-sm text-[#1A1A1A]/60 font-semibold truncate">
                        {doc.degree}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-brand/10 absolute -top-1 -left-1 rotate-180" />
                    <p className="text-[#1A1A1A]/85 text-xs sm:text-base leading-snug sm:leading-relaxed font-medium italic relative z-10 pl-3 sm:pl-4 border-l-2 border-brand/30">
                      &ldquo;{doc.quote}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 sm:mt-6 sm:pt-4 border-t border-brand/10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-brand font-bold text-[11px] sm:text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    চিকিৎসকের সুপারিশকৃত
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#1A1A1A]/50 bg-brand-light px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                    {content.productNameEn || "Milkimom"}™
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {doctorsList.length > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {doctorsList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentDocIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentDocIndex ? "w-8 bg-brand" : "w-2.5 bg-brand/20 hover:bg-brand/40"
                  }`}
                />
              ))}
            </div>
          )}
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
            className="cta-shine w-full sm:w-auto bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark font-black text-lg md:text-xl px-8 py-4 md:px-10 rounded-full shadow-lg shadow-brand-cta/40 text-center transition-all hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2 cursor-pointer"
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
