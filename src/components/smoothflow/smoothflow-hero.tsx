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

export function SmoothflowHero() {
  const { content } = useLandingPageContent();
  const countdown = useCountdown();

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
                আজকের স্পেশাল অফার — <span className="font-extrabold">৩৯%</span> পর্যন্ত ছাড় + সারাদেশে ফ্রি ডেলিভারি
              </>
            )}
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
      <section className="relative overflow-hidden pt-[70px] md:pt-[86px] pb-14 md:pb-20 min-h-[70vh] flex flex-col items-center justify-center">
        <GridPattern size={36} className="opacity-50" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[32rem]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, rgba(227,122,105,0.18), transparent)",
          }}
        />

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
            className="max-w-xl mx-auto w-full mb-8"
          >
            <p className="mx-auto text-balance text-base text-muted-foreground sm:text-lg font-medium text-center">
              বুকের এক পাশে <span className="font-bold text-primary">শক্ত চাকার মতো অনুভূতি</span>, চাপ,{" "}
              <span className="font-bold text-primary">Tenderness</span>, আর Feed করানোর সময় অস্বস্তি—এগুলো সবই{" "}
              <span className="font-bold text-primary">Clogged-Duct Related</span>।
            </p>
          </motion.div>

          {/* 5. PRIMARY CTA & 6. SECONDARY CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              onClick={scrollToOrder}
              className="cta-shine h-12 gap-2 rounded-full bg-brand-cta px-6 text-base text-brand-cta-foreground shadow-lg shadow-brand-cta/40 hover:bg-brand-cta-dark cursor-pointer"
            >
              <ShoppingBag className="size-5" />
              <span>{content.heroCtaText || "SmoothFlow অর্ডার করতে এখানে ক্লিক করুন"}</span>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 gap-2 rounded-full border-brand-coral/40 px-6 text-base text-brand-crimson hover:bg-brand-coral/10"
            >
              <a href={siteConfig.messenger} target="_blank" rel="noopener noreferrer">
                <MessengerIcon className="size-5" />
                <span>মেসেজ করুন</span>
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
