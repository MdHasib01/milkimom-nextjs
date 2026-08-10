"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Reveal } from "@/components/motion/reveal";
import { SectionCta } from "@/components/section-cta";
import { GridPattern } from "@/components/grid-pattern";
import { useLandingPageContent } from "./landing-page-content-provider";

const defaultDoctors = [
  {
    id: "saddam",
    name: "ডা. মোঃ সাদ্দাম",
    image: "/assets/doctors/saddam.webp",
    title: "মেডিকেল বোর্ড অনুমোদিত",
    subtitle: "চিকিৎসকের তত্ত্বাবধানে তৈরি ফর্মুলা",
    description:
      "মিল্কিমম তৈরি হয়েছে গভর্নমেন্ট রেজিস্টার্ড চিকিৎসকদের তত্ত্বাবধানে, ৪৮০০+ বছরের প্রাচীন আয়ুর্বেদিক জ্ঞান ও আধুনিক বিজ্ঞানের গবেষণার সমন্বয়ে। প্রতিটি ব্যাচ ল্যাব টেস্টেড ও BSTI সার্টিফাইড, যাতে মা ও শিশু উভয়ের জন্যই এটি সম্পূর্ণ নিরাপদ থাকে।",
  },
  {
    id: "nazmul",
    name: "ডা. মোঃ নাজমুল",
    image: "/assets/doctors/nazmul.webp",
    title: "মেডিকেল বোর্ড অনুমোদিত",
    subtitle: "চিকিৎসকের তত্ত্বাবধানে তৈরি ফর্মুলা",
    description:
      "মিল্কিমম তৈরি হয়েছে গভর্নমেন্ট রেজিস্টার্ড চিকিৎসকদের তত্ত্বাবধানে, ৪৮০০+ বছরের প্রাচীন আয়ুর্বেদিক জ্ঞান ও আধুনিক বিজ্ঞানের গবেষণার সমন্বয়ে। প্রতিটি ব্যাচ ল্যাব টেস্টেড ও BSTI সার্টিফাইড, যাতে মা ও শিশু উভয়ের জন্যই এটি সম্পূর্ণ নিরাপদ থাকে।",
  },
];

export function DoctorSection() {
  const { content, getImageUrl } = useLandingPageContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // If custom doctor data exists, integrate it into the list
  const doctorList = content.doctorName ? [
    {
      id: "custom-doctor",
      name: content.doctorName,
      image: getImageUrl(content.doctorImage || "/assets/doctor/doctor.png"),
      title: content.doctorDegree || "বিশেষজ্ঞ ডাক্তারের পরামর্শ",
      subtitle: content.doctorTitle || "চিকিৎসকের সুপারিশকৃত প্রোডাক্ট",
      description: content.doctorQuote || "মায়ের বুকের দুধ নবজাতকের জন্য সর্বোত্তম পুষ্টি। এটি সম্পূর্ণ প্রাকৃতিক উপাদানে তৈরি যা নিরাপদভাবে কার্যকর সাহায্য করে।",
    },
    ...defaultDoctors,
  ] : defaultDoctors;

  const nextDoctor = () => {
    setCurrentIndex((prev) => (prev + 1) % doctorList.length);
  };

  const prevDoctor = () => {
    setCurrentIndex((prev) => (prev - 1 + doctorList.length) % doctorList.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % doctorList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, doctorList.length]);

  const activeDoctor = doctorList[currentIndex] || doctorList[0];

  return (
    <section id="ingredients" className="relative overflow-hidden mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <GridPattern patternType="cross" size={32} className="opacity-45" />
      <Reveal className="mx-auto mb-10 max-w-3xl text-center">
        <h2 className="text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
          মিল্কিমমের উপর আস্থা রেখেছেন দেশের স্বনামধন্য হসপিটাল এবং{" "}
          <span className="text-primary">অসংখ্য ডাক্তার</span>
        </h2>
      </Reveal>

      <div
        className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Navigation Buttons */}
        <button
          onClick={prevDoctor}
          aria-label="পূর্ববর্তী চিকিৎসক"
          className="absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur transition-all hover:bg-primary hover:text-primary-foreground sm:left-4 sm:size-12"
        >
          <ChevronLeft className="size-6" />
        </button>

        <button
          onClick={nextDoctor}
          aria-label="পরবর্তী চিকিৎসক"
          className="absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur transition-all hover:bg-primary hover:text-primary-foreground sm:right-4 sm:size-12"
        >
          <ChevronRight className="size-6" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeDoctor.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid items-center gap-8 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12"
          >
            <div className="mx-auto w-full max-w-xs lg:max-w-sm">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/50 shadow-md">
                <Image
                  src={activeDoctor.image}
                  alt={activeDoctor.name}
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 1024px) 24rem, 90vw"
                  priority
                />
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-light px-3 py-1 text-xs font-semibold text-brand-green sm:text-sm">
                <BadgeCheck className="size-4" />
                {activeDoctor.title}
              </span>
              <h3 className="mt-3 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {activeDoctor.subtitle}
              </h3>
              <p className="mt-2 font-heading text-xl font-bold text-brand-crimson">
                {activeDoctor.name}
              </p>
              <p className="mt-4 text-balance text-muted-foreground leading-relaxed">
                {activeDoctor.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {doctorList.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`স্লাইড ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-primary"
                : "w-2.5 bg-border hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
      <SectionCta />
    </section>
  );
}
