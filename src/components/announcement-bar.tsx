"use client";

import { useEffect, useState } from "react";
import { PartyPopper, Timer } from "lucide-react";

import { useLandingPageContent } from "./landing-page-content-provider";

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

export function AnnouncementBar() {
  const countdown = useCountdown();
  const { content } = useLandingPageContent();

  const text = content.announcementText || "🎉 ১ম অর্ডারেই ১০০% ক্যাশ অন ডেলিভারি এবং সারাদেশে হোম ডেলিভারি ফ্রি!";

  return (
    <div className="sticky top-0 z-50 w-full shrink-0 bg-brand-crimson/95 backdrop-blur-md text-white shadow-md shadow-brand-crimson/20">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-1.5 px-2 py-1.5 text-center text-[11px] sm:text-xs md:text-sm whitespace-nowrap overflow-hidden sm:gap-2 sm:px-4 sm:py-2">
        <span className="inline-flex items-center gap-1 font-medium shrink-0 sm:gap-1.5">
          <PartyPopper className="size-3.5 shrink-0 sm:size-4" />
          <span>{text}</span>
        </span>
        {countdown && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 font-mono tabular-nums text-[10px] shrink-0 sm:px-2.5 sm:text-xs"
            aria-label={`অফার শেষ হতে বাকি ${countdown.hours} ঘণ্টা ${countdown.minutes} মিনিট`}
          >
            <Timer className="size-3 shrink-0 sm:size-3.5" />
            {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
          </span>
        )}
      </div>
    </div>
  );
}
