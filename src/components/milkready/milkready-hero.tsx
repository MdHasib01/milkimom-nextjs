"use client";

import { useState, useEffect } from "react";
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

export function MilkreadyHero() {
  const { content } = useLandingPageContent();
  const countdown = useCountdown();

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* 1. TOP URGENCY BAR */}
      <div className="w-full max-w-full bg-[#0284c7] text-white py-2.5 px-3 flex justify-center items-center text-sm font-medium z-[9999] fixed top-0 inset-x-0 shadow-sm overflow-hidden">
        <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-3 max-w-full">
          <span className="text-xs sm:text-sm tracking-wide text-center font-extrabold">
            {content.announcementText || "40% Offer শেষ হতে বাকি"}
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
      <section className="relative overflow-hidden pt-[70px] md:pt-[85px] pb-5 md:pb-8 flex flex-col items-center justify-center w-full max-w-full bg-gradient-to-b from-[#f0f9ff] via-[#f8fbff] to-white">
        <GridPattern size={32} className="opacity-20" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[32rem] max-w-full overflow-hidden"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, rgba(56,189,248,0.22), transparent)",
          }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center w-full max-w-full">
          {/* 2. MAIN HERO HEADLINE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl mx-auto w-full mb-3 md:mb-4"
          >
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.2] mb-2 tracking-tight text-center break-words max-w-full">
              {content.heroTitle ? content.heroTitle.split("?")[0] + "?" : "ডেলিভারির পর বুকের দুধ না হওয়ার ভয়?"}
            </h1>
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0284c7] leading-tight text-center break-words max-w-full">
              {content.heroTitleHighlight || "প্রস্তুতি নিন আগেই।"}
            </h2>
          </motion.div>

          {/* 3. SUPPORTING COPY PILL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto w-full mb-4 sm:mb-5 px-2"
          >
            <div className="relative overflow-hidden rounded-full border border-sky-300/60 bg-gradient-to-r from-sky-50 via-white to-sky-50 px-4 py-3 sm:px-6 sm:py-3.5 shadow-sm">
              <p className="text-xs xs:text-sm sm:text-base font-semibold text-slate-700 leading-relaxed text-center">
                {(() => {
                  const sub =
                    content.heroSubtitle ||
                    "Delivery-এর আগের শেষ ৩ মাসের মধ্যে ১ ডোজ MilkReady—ডেলিভারি এর পরে বুকের দুধ নিশ্চিত করে";
                  const parts = sub.split(/(১)/g);
                  return parts.map((part, idx) =>
                    part === "১" ? (
                      <strong key={idx} className="font-extrabold text-slate-950">
                        ১
                      </strong>
                    ) : (
                      part
                    )
                  );
                })()}
              </p>
            </div>
          </motion.div>

          {/* 4. PRIMARY CTA & SECONDARY CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-full px-2 sm:px-0"
          >
            <button
              type="button"
              onClick={scrollToOrder}
              className="cta-shine min-h-[54px] sm:min-h-[58px] h-auto py-4 px-6 sm:px-8 rounded-full bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark text-base sm:text-lg font-bold shadow-lg shadow-brand-cta/40 cursor-pointer justify-center text-center whitespace-normal sm:whitespace-nowrap transition-all hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2.5 w-full sm:w-auto select-none"
            >
              <ShoppingBag className="size-5 sm:size-6 shrink-0" strokeWidth={2.5} />
              <span>{content.heroCtaText || "MilkReady অর্ডার করতে ক্লিক করুন"}</span>
            </button>

            <Button
              asChild
              variant="outline"
              className="min-h-[48px] h-auto py-3 sm:py-0 sm:h-12 w-full sm:w-auto gap-2 rounded-full border-2 border-[#0284c7] px-6 sm:px-8 text-sm sm:text-base font-bold text-[#0284c7] hover:bg-sky-50 active:scale-95 transition-all justify-center text-center"
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
