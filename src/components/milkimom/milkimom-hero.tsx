"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/grid-pattern";
import { siteConfig } from "@/lib/content";
import { useLandingPageContent } from "@/components/landing-page-content-provider";

function MessengerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.51 3.734 7.214V22l3.425-1.881c.905.251 1.864.387 2.841.387 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.09 12.441l-2.55-2.72-4.976 2.72 5.474-5.81 2.597 2.72 4.929-2.72-5.474 5.81z" />
    </svg>
  );
}

function getMidnightTarget() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(24, 0, 0, 0);
  return target;
}

function useCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = getMidnightTarget();
    const tick = () => setRemaining(Math.max(0, target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (remaining === null) return null;

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function renderHighlightedText(text: string, highlight?: string, className: string = "text-brand") {
  if (!highlight || !highlight.trim() || !text.includes(highlight.trim())) {
    return text;
  }
  const needle = highlight.trim();
  const parts = text.split(needle);
  return parts.map((part, index) => (
    <React.Fragment key={index}>
      {part}
      {index < parts.length - 1 && <span className={className}>{needle}</span>}
    </React.Fragment>
  ));
}

export function MilkimomHero() {
  const { content } = useLandingPageContent();
  const countdown = useCountdown();

  const title = content.heroTitle || "১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে!";
  const titleHighlight = content.heroTitleHighlight !== undefined ? content.heroTitleHighlight : "মিল্কিমম";
  const subtitle = content.heroSubtitle || "মিল্কিমম খেলে মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে, এবং ব্রেস্ট ফিডিং এর শেষ পর্যন্ত স্থায়ী হয়। এটি সম্পূর্ণ সাইডইফেক্ট মুক্ত ও ন্যাচারাল।";
  const subtitleHighlight = content.heroSubtitleHighlight !== undefined ? content.heroSubtitleHighlight : "মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে";

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* TOP URGENCY BAR */}
      <div className="w-full max-w-full bg-brand text-white py-2.5 px-3 flex justify-center items-center text-sm font-medium z-[9999] fixed top-0 inset-x-0 shadow-sm overflow-hidden">
        <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-3 max-w-full">
          <span className="text-xs sm:text-sm tracking-wide text-center font-extrabold">
            {content.announcementText || "🎉 ১ম অর্ডারেই ১০০% ক্যাশ অন ডেলিভারি এবং সারাদেশে হোম ডেলিভারি ফ্রি!"}
          </span>
          {countdown && (
            <div className="flex items-center gap-1.5 bg-white/20 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold font-mono tracking-wider shadow-sm">
              <Timer className="w-3.5 h-3.5 shrink-0" />
              <span>
                {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* HERO MAIN */}
      <section className="relative overflow-hidden pt-[70px] md:pt-[86px] pb-12 md:pb-20 min-h-[70vh] flex flex-col items-center justify-center w-full max-w-full">
        <GridPattern size={36} className="opacity-15" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[32rem] max-w-full overflow-hidden"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, rgba(227,122,105,0.18), transparent)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center w-full max-w-full">
          {/* MAIN HERO HEADLINE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-[850px] mx-auto w-full mb-5"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-black text-[#1A1A1A] leading-[1.2] mb-3 md:mb-5 tracking-tight text-center break-words max-w-full">
              {renderHighlightedText(title, titleHighlight)}
            </h1>
          </motion.div>

          {/* SUPPORTING COPY BOX */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto w-full mb-6 sm:mb-8 px-1"
          >
            <div className="relative overflow-hidden rounded-2xl border border-brand-coral/30 bg-gradient-to-br from-white via-rose-50/40 to-orange-50/30 p-4 sm:p-6 shadow-md shadow-brand-coral/10 backdrop-blur-sm">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-coral via-brand-crimson to-brand-coral" />
              <p className="text-sm sm:text-base md:text-lg text-slate-800 leading-relaxed font-medium text-center">
                {renderHighlightedText(subtitle, subtitleHighlight, "font-bold text-brand-crimson")}
              </p>
            </div>
          </motion.div>

          {/* PRIMARY CTA & SECONDARY CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-2 sm:mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-full px-2 sm:px-0"
          >
            <Button
              onClick={scrollToOrder}
              className="cta-shine min-h-[48px] h-auto py-3 sm:py-0 sm:h-12 w-full sm:w-auto gap-2 rounded-full bg-brand-cta px-4 sm:px-6 text-sm sm:text-base text-brand-cta-foreground shadow-lg shadow-brand-cta/40 hover:bg-brand-cta-dark cursor-pointer justify-center text-center whitespace-normal sm:whitespace-nowrap"
            >
              <ShoppingBag className="size-5 shrink-0" />
              <span>{content.heroCtaText || "অর্ডার করতে এখানে ক্লিক করুন"}</span>
            </Button>

            <Button
              asChild
              variant="outline"
              className="min-h-[48px] h-auto py-3 sm:py-0 sm:h-12 w-full sm:w-auto gap-2 rounded-full border-brand-coral/40 px-4 sm:px-6 text-sm sm:text-base text-brand-crimson hover:bg-brand-coral/10 justify-center text-center"
            >
              <a href={siteConfig.messenger} target="_blank" rel="noopener noreferrer">
                <MessengerIcon className="size-5 shrink-0" />
                <span>মেসেজ করুন</span>
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
