"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function MilkreadyStickyCTA() {
  const [scrolled, setScrolled] = useState(false);
  const countdown = useCountdown();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 150);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 w-full max-w-full overflow-hidden border-t border-sky-200/80 bg-white/95 px-4 py-2.5 backdrop-blur-md transition-all duration-300 shadow-[0_-8px_25px_rgba(0,0,0,0.08)]",
        scrolled
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 min-w-0">
        {/* Left: Price with discount & Countdown Box */}
        <div className="flex flex-col gap-0.5 min-w-0 flex-1 overflow-hidden">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="font-extrabold text-base sm:text-xl text-[#0284c7] leading-none whitespace-nowrap">
              ৳৩,৩৯৯
            </span>
            <span className="text-xs sm:text-sm text-slate-400 line-through decoration-1 leading-none whitespace-nowrap">
              ৳৫,৬৫০
            </span>
            <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[10px] sm:text-xs font-bold text-[#0284c7] leading-none whitespace-nowrap">
              ৪০% ছাড়
            </span>
          </div>

          {countdown && (
            <div className="inline-flex items-center gap-1 w-fit rounded border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[10px] sm:text-xs font-medium text-sky-800 min-w-0 mt-0.5">
              <Timer className="size-3 shrink-0 animate-pulse text-[#0284c7]" />
              <span className="font-mono font-bold tabular-nums text-[10px] sm:text-xs">
                {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
              </span>
            </div>
          )}
        </div>

        {/* Right: Order CTA Button */}
        <div className="flex items-center shrink-0">
          <button
            onClick={scrollToOrder}
            className="cta-shine h-10 sm:h-11 gap-2 rounded-full bg-brand-cta px-4 sm:px-6 text-xs sm:text-base font-extrabold text-brand-cta-foreground hover:bg-brand-cta-dark shadow-md whitespace-nowrap shrink-0 flex items-center justify-center transition-all cursor-pointer"
          >
            <ShoppingBag className="size-4 shrink-0" strokeWidth={2.5} />
            <span>অর্ডার করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
