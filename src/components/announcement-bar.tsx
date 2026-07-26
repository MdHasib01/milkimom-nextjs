"use client";

import { useEffect, useState } from "react";
import { PartyPopper, Timer } from "lucide-react";

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

  return (
    <div className="sticky top-0 z-40 bg-brand-crimson text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-2 text-center text-xs sm:text-sm">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <PartyPopper className="size-4 shrink-0" />
          আজকের স্পেশাল অফার — ৪৪% পর্যন্ত ছাড় + সারাদেশে ফ্রি ডেলিভারি
        </span>
        {countdown && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 font-mono tabular-nums"
            aria-label={`অফার শেষ হতে বাকি ${countdown.hours} ঘণ্টা ${countdown.minutes} মিনিট`}
          >
            <Timer className="size-3.5 shrink-0" />
            {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
          </span>
        )}
      </div>
    </div>
  );
}
