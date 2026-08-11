"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, MessageCircle, Clock } from "lucide-react";
import { useLandingPageContent } from "@/components/landing-page-content-provider";

export function StableflowHero() {
  const { content } = useLandingPageContent();
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 59, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) return prev;
        let s = prev.seconds - 1;
        let m = prev.minutes;
        let h = prev.hours;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        return { hours: h, minutes: m, seconds: s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, "0");

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* 1. TOP URGENCY BAR */}
      <div className="w-full bg-brand text-white py-2.5 px-3 flex justify-center items-center text-sm font-medium z-[9999] fixed top-0 left-0 shadow-sm">
        <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm tracking-wide text-center">
            {content.announcementText || (
              <>
                <span className="font-extrabold">42%</span> Offer শেষ হতে বাকি
              </>
            )}
          </span>
          <div className="flex items-center gap-1.5 bg-white/20 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold font-mono tracking-wider shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {format(timeLeft.hours)} : {format(timeLeft.minutes)} : {format(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>

      {/* HERO MAIN */}
      <section className="relative pt-[70px] md:pt-[86px] pb-14 md:pb-20 overflow-hidden bg-brand-light min-h-[70vh] flex flex-col items-center justify-center">
        {/* Subtle Grid Background */}
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-brand-border, #FCE7F3) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand-border, #FCE7F3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          {/* 2. MAIN HERO HEADLINE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-[850px] mx-auto w-full mb-5"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black text-[#1A1A1A] leading-[1.1] mb-3 md:mb-5 tracking-tight">
              বাচ্চাকে দুধ খাওয়াতে গেলেই<br className="hidden md:block" /> বুকের ব্যথা?
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1A1A1A] leading-tight">
              <span className="text-brand">মাত্র ২৪ ঘন্টায়</span> মুক্তি পান।
            </h2>
          </motion.div>

          {/* 4. SUPPORTING COPY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-[650px] mx-auto w-full mb-10 bg-white/70 border border-brand/20 rounded-[16px] px-5 py-5 sm:px-6 shadow-sm backdrop-blur-sm"
          >
            <p className="text-[#1A1A1A]/80 text-[14px] sm:text-[16px] md:text-[18px] leading-[1.6] font-medium text-center">
              বুকের এক পাশে <span className="text-brand font-bold">শক্ত চাকার মতো অনুভূতি</span>, চাপ,{" "}
              <span className="text-brand font-bold">Tenderness</span>, আর Feed করানোর সময় অস্বস্তি—এগুলো সবই{" "}
              <span className="text-brand font-bold">Clogged-Duct Related</span>।
            </p>
          </motion.div>

          {/* 5. PRIMARY CTA & 6. SECONDARY CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-4 w-full max-w-[420px] mx-auto"
          >
            <button
              onClick={scrollToOrder}
              className="w-full bg-brand text-white font-black text-base sm:text-lg py-4 sm:py-5 px-6 sm:px-8 rounded-full shadow-[0_8px_25px_rgba(230,16,110,0.3)] hover:shadow-[0_12px_35px_rgba(230,16,110,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 border border-brand cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>{content.heroCtaText || "SmoothFlow অর্ডার করতে এখানে ক্লিক করুন"}</span>
            </button>

            <a
              href="https://m.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white text-brand border-2 border-brand font-bold text-sm sm:text-base py-3 sm:py-3.5 px-8 rounded-full hover:bg-brand-light transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>মেসেজ করুন</span>
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
