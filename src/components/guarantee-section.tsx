"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, CheckCircle2, PhoneCall } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { GridPattern } from "@/components/grid-pattern";
import { fetchMotherCount } from "@/lib/api";
import { formatBengaliNumber } from "@/lib/number-utils";

export function GuaranteeSection() {
  const [motherCount, setMotherCount] = useState<number>(89746);

  useEffect(() => {
    let isMounted = true;

    const loadCount = async () => {
      try {
        const result = await fetchMotherCount();
        if (
          isMounted &&
          result?.success &&
          typeof result.data?.count === "number" &&
          result.data.count > 0
        ) {
          setMotherCount(result.data.count);
        }
      } catch {
        // Fallback count stays 89746
      }
    };

    loadCount();

    const interval = setInterval(loadCount, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const formattedMotherCount = formatBengaliNumber(motherCount);

  return (
    <section id="guarantee" className="relative overflow-hidden py-12 sm:py-16">
      <GridPattern size={28} className="opacity-40" />
      <div className="mx-auto max-w-4xl px-4">
        <Reveal className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-50/60 via-card to-card p-6 sm:p-10 shadow-xl dark:from-emerald-950/20">
          <GridPattern
            size={24}
            className="z-0 opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_80%)]"
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-emerald-700 font-semibold text-sm sm:text-base dark:text-emerald-400">
              <ShieldCheck className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>১০০% টাকা ফেরত গ্যারান্টি</span>
            </div>

            {/* Main Section Heading */}
            <h2 className="mt-4 font-heading text-2xl font-extrabold text-foreground sm:text-3xl lg:text-4xl">
              100% টাকা ফেরত গ্যারান্টি
            </h2>

            {/* Guarantee Details - Single Combined Box */}
            <div className="mt-6 w-full max-w-2xl rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 text-left dark:bg-emerald-950/20 space-y-4 shadow-sm">
              {/* Point 1: Main Guarantee & Phone Call */}
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 sm:size-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-foreground/90 leading-relaxed text-base sm:text-lg font-medium">
                  মিল্কিমম খাওয়ার 14 দিনের মধ্যেও আপনি যদি স্যাটিসফাইড না হন, তাহলে এই{" "}
                  <a
                    href={`https://wa.me/8801517102603?text=${encodeURIComponent(
                      "হ্যালো মিল্কিমম, আমি রিফান্ড সম্পর্কিত তথ্য জানতে চাই।"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 hover:underline bg-emerald-500/10 px-2.5 py-0.5 rounded-md transition-colors whitespace-nowrap align-middle"
                  >
                    <PhoneCall className="size-3.5 sm:size-4 shrink-0" />
                    (01517102603)
                  </a>{" "}
                  নাম্বারে জানালে আপনার সম্পূর্ণ টাকা টাই আপনি ফেরত পাবেন।
                </p>
              </div>

              {/* Point 2: No Question Asked */}
              <p className="pl-8 sm:pl-9 font-semibold text-muted-foreground text-sm sm:text-base">
                এমনকি, আপনাকে একটা প্রশ্নও করা হবে না। 🥰
              </p>

              {/* Subtle Divider */}
              <div className="border-t border-emerald-500/15" />

              {/* Point 3: Final Assurance */}
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 sm:size-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="font-bold text-emerald-700 dark:text-emerald-300 text-base sm:text-lg">
                  তবে, মিল্কিমম খেলে বুকের দুধ আসবেই ইনশাআল্লাহ।
                </p>
              </div>
            </div>

            {/* Dynamic Beneficiary Counter Banner from API */}
            <div className="mt-8 w-full max-w-xl rounded-2xl border border-red-500/20 bg-red-500/5 p-4 sm:p-5 text-center shadow-sm backdrop-blur-sm dark:bg-red-950/20">
              <div className="font-heading text-base sm:text-xl font-bold text-foreground flex items-center justify-center gap-2.5 flex-wrap">
                <div className="inline-flex items-center gap-1.5 shrink-0 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                  <span className="relative flex size-2.5 sm:size-3 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex size-2.5 sm:size-3 rounded-full bg-red-500" />
                  </span>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                    LIVE
                  </span>
                </div>
                <p className="text-center">
                  মিল্কিমম খেয়ে{" "}
                  <span className="text-primary font-black text-lg sm:text-2xl px-1">
                    {formattedMotherCount}
                  </span>{" "}
                  জন মা বুকের দুধের পূর্ণ সমাধান পেয়েছেন। 🥰
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
