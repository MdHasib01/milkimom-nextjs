"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  FlaskConical,
  Stethoscope,
  Award,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  ShoppingBag,
} from "lucide-react";
import { useLandingPageContent } from "@/components/landing-page-content-provider";

const certs = [
  { id: 1, title: "Heavy Metal Tested", icon: FlaskConical },
  { id: 2, title: "Microbiology Tested", icon: Stethoscope },
  { id: 3, title: "GMP Certified", icon: ShieldCheck },
  { id: 4, title: "ISO 9001:2015", icon: Award },
  { id: 5, title: "100% Natural", icon: Leaf },
];

const doctorsList = [
  {
    id: 1,
    name: "ডা. মোঃ সাদ্দাম",
    qualifications: "এমবিবিএস, এফসিপিএস (গাইনি এন্ড অব্স)",
    title: "গাইনি ও প্রসূতি রোগ বিশেষজ্ঞ",
    quote:
      "“SmoothFlow-এর নিরাপদ এবং প্রাকৃতিক উপাদানগুলো অত্যন্ত কার্যকরভাবে ব্রেস্টের Clogged Duct এবং ব্যথা উপশম করতে সাহায্য করে। দুধ খাওয়ানোর সময় অস্বস্তিতে ভোগা প্রতিটি মায়ের জন্য এটি একটি চমৎকার সমাধান।”",
    img: "/assets/doctors/saddam.webp",
  },
  {
    id: 2,
    name: "ডা. মোঃ নাজমুল",
    qualifications: "এমবিবিএস, ডিজিইউ, শিশু ও মাতৃ পুষ্টি বিশেষজ্ঞ",
    title: "শিশু ও মাতৃ পুষ্টি বিশেষজ্ঞ",
    quote:
      "“ব্রেস্ট এংগর্জমেন্ট এবং ফিডিংয়ের ব্যথায় মায়েরা যে কষ্টের মুখোমুখি হন, SmoothFlow তা প্রাকৃতিক উপায়ে সমাধান করে। মায়েরা যেন নির্বিঘ্নে সন্তানকে দুধ খাওয়াতে পারেন, তাতে এটি অত্যন্ত সহায়ক।”",
    img: "/assets/doctors/nazmul.webp",
  },
  {
    id: 3,
    name: "ডা. হাদিসুর রহমান",
    qualifications: "এমবিবিএস, শিশু ও মাতৃত্ব বিষয়ক বিশেষজ্ঞ",
    title: "মাতৃত্ব ও শিশু রোগ বিশেষজ্ঞ",
    quote:
      "“স্মুথফ্লো-এর সুষম ফর্মুলা মায়ের বুকের শক্ত চাকার অনুভূতি ও চাপ দূর করে দুধের স্বাভাবিক প্রবাহ নিশ্চিত করে। এটি শতভাগ নিরাপদ এবং পার্শ্বপ্রতিক্রিয়ামুক্ত।”",
    img: "/assets/doctors/hadis.webp",
  },
  {
    id: 4,
    name: "ডা. আব্দুল ওয়াহিদ",
    qualifications: "এমবিবিএস, এফসিপিএস",
    title: "মেডিকেল বোর্ড সদস্য",
    quote:
      "“ল্যাকটেশনাল অস্বস্তি ও ব্যথায় ভুগছেন এমন মায়েদের জন্য SmoothFlow একটি চিকিৎসাবিজ্ঞান সমর্থিত ও সম্পূর্ণ নির্ভরযোগ্য প্রাকৃতিক সমাধান।”",
    img: "/assets/doctors/wahid.webp",
  },
];

export function SmoothflowCertifications() {
  const { content } = useLandingPageContent();
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const nextDoc = () => {
    setCurrentDocIndex((prev) => (prev + 1) % doctorsList.length);
  };

  const prevDoc = () => {
    setCurrentDocIndex((prev) => (prev - 1 + doctorsList.length) % doctorsList.length);
  };

  // Auto-play interval for carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentDocIndex((prev) => (prev + 1) % doctorsList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Scroll container when active index changes
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
    <section className="py-12 md:py-20 relative bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headings */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand leading-tight">
            {content.doctorTitle || "বিশেষজ্ঞ ডাক্তারদের মতামত ও কারণসমূহ"}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#1A1A1A]/70 font-medium">
            দেশের স্বনামধন্য চিকিৎসকদের সুপারিশকৃত ও ল্যাব-সার্টিফাইড সমাধান
          </p>
        </div>

        {/* Part 01: Certifications */}
        <div className="mb-12 md:mb-16">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-5 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            {certs.map((cert) => {
              const Icon = cert.icon;
              return (
                <div
                  key={cert.id}
                  className="w-[30%] sm:w-auto sm:flex-1 flex flex-col items-center text-center gap-2"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white border border-brand/10 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex items-center justify-center text-brand transition-transform hover:scale-105">
                    <Icon className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <h4 className="font-bold text-[#1A1A1A] text-[11px] sm:text-xs md:text-sm leading-tight px-1">
                    {cert.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Part 02: Doctor Reviews Carousel */}
        <div
          className="relative max-w-5xl mx-auto px-2 sm:px-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevDoc}
            aria-label="Previous Doctor Review"
            className="absolute -left-2 sm:-left-6 md:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-brand/15 text-brand hover:bg-brand hover:text-white transition-all z-20 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextDoc}
            aria-label="Next Doctor Review"
            className="absolute -right-2 sm:-right-6 md:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-brand/15 text-brand hover:bg-brand hover:text-white transition-all z-20 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Desktop & Mobile Responsive Slider */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto pb-4 pt-2 -mx-2 sm:mx-0 px-2 sm:px-0 gap-5 sm:gap-6 snap-x snap-mandatory hide-scrollbar"
          >
            {doctorsList.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`min-w-[85vw] sm:min-w-[360px] md:min-w-[420px] lg:min-w-[460px] snap-center bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.05)] border ${
                  idx === currentDocIndex ? "border-brand/40 ring-2 ring-brand/10" : "border-brand/10"
                } flex flex-col justify-between transition-all duration-300`}
              >
                <div>
                  {/* Top Doctor Info Header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 bg-brand-light border-2 border-brand/20 shadow-md">
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
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="inline-flex items-center gap-1 bg-brand-light text-brand text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-brand/15">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {doc.title}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-[#1A1A1A] text-base sm:text-lg leading-snug truncate">
                        {doc.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#1A1A1A]/60 font-semibold truncate">
                        {doc.qualifications}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-3 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  {/* Doctor Review Quote */}
                  <div className="relative">
                    <Quote className="w-8 h-8 text-brand/10 absolute -top-2 -left-2 rotate-180" />
                    <p className="text-[#1A1A1A]/85 text-sm sm:text-base leading-relaxed font-medium italic relative z-10 pl-4 border-l-2 border-brand/30">
                      {doc.quote}
                    </p>
                  </div>
                </div>

                {/* Footer Badge */}
                <div className="mt-6 pt-4 border-t border-brand/10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-brand font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    চিকিৎসকের সুপারিশকৃত
                  </span>
                  <span className="text-[11px] font-semibold text-[#1A1A1A]/50 bg-brand-light px-2.5 py-1 rounded-full">
                    SmoothFlow™
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {doctorsList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentDocIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentDocIndex
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
            className="cta-shine w-full sm:w-auto bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark font-black text-lg md:text-xl px-8 py-4 md:px-10 rounded-full shadow-lg shadow-brand-cta/40 text-center transition-all hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="size-5" />
            <span>হ্যাঁ, আমিও SmoothFlow নিতে চাই</span>
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

