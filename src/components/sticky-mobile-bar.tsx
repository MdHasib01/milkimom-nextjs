"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFlavors } from "@/lib/use-flavours";
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

export function StickyMobileBar() {
  const [scrolled, setScrolled] = useState(false);
  const countdown = useCountdown();
  // Price of the featured (tagged/popular) flavour from the dynamic catalog.
  const flavors = useFlavors();
  const featured = flavors.find((f) => f.popular) ?? flavors[0];
  const discountPct =
    featured.regularPrice > featured.salePrice
      ? Math.round((1 - featured.salePrice / featured.regularPrice) * 100)
      : 0;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 w-full max-w-full overflow-hidden border-t border-border bg-card/95 px-3 py-2 backdrop-blur-md transition-all duration-300 sm:hidden shadow-lg",
        scrolled
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="mx-auto flex w-full max-w-md items-center justify-between gap-2 min-w-0">
        {/* Left: Price with discount & Countdown Box */}
        <div className="flex flex-col gap-0.5 min-w-0 flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            <span className="font-heading text-sm xs:text-base font-bold text-brand-crimson leading-none whitespace-nowrap">
              ৳{featured.salePrice.toLocaleString("bn-BD")}
            </span>
            {featured.regularPrice > featured.salePrice && (
              <span className="text-[10px] xs:text-xs text-muted-foreground line-through decoration-muted-foreground/70 leading-none whitespace-nowrap">
                ৳{featured.regularPrice.toLocaleString("bn-BD")}
              </span>
            )}
            {discountPct > 0 && (
              <span className="rounded bg-brand-crimson/10 px-1 py-0.5 text-[9px] xs:text-[10px] font-bold text-brand-crimson leading-none whitespace-nowrap">
                {discountPct.toLocaleString("bn-BD")}% ছাড়
              </span>
            )}
          </div>

          {countdown && (
            <div className="inline-flex items-center gap-1 w-fit rounded border border-brand-crimson/20 bg-brand-crimson/5 px-1.5 py-0.5 text-[9.5px] xs:text-[10.5px] font-medium text-brand-crimson min-w-0">
              <Timer className="size-3 shrink-0 animate-pulse text-brand-crimson" />
              <span className="font-mono font-bold tabular-nums text-[9.5px] xs:text-[10.5px]">
                {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
              </span>
            </div>
          )}
        </div>

        {/* Right: Order CTA Button */}
        <div className="flex items-center shrink-0">
          <Button
            asChild
            className="cta-shine h-9 gap-1.5 rounded-full bg-brand-cta px-4 text-xs xs:text-sm font-bold text-brand-cta-foreground hover:bg-brand-cta-dark shadow-sm whitespace-nowrap shrink-0"
          >
            <a href="#pricing">
              <ShoppingBag className="size-3.5 shrink-0" />
              অর্ডার করুন
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
