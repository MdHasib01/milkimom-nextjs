"use client";

import { useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { useFlavors, applyProductPricing, type DisplayFlavor } from "@/lib/use-flavours";
import { useLandingPageContent } from "@/components/landing-page-content-provider";
import { Reveal } from "@/components/motion/reveal";
import { GridPattern } from "@/components/grid-pattern";
import { cn } from "@/lib/utils";

export function FlavorsSection() {
  const { content } = useLandingPageContent();
  const rawFlavors = useFlavors();
  const isSmoothflow = content.productSlug === "smoothflow";
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const effectiveFlavors: DisplayFlavor[] = applyProductPricing(
    rawFlavors,
    content.productSlug
  );

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / (clientWidth * 0.7));
      setActiveIndex(Math.min(effectiveFlavors.length - 1, Math.max(0, index)));
    }
  };

  return (
    <section id="flavors" className="relative py-12 sm:py-16 md:py-20 bg-muted/20 overflow-hidden">
      <GridPattern patternType="dots" size={24} className="opacity-30" />
      <div className="mx-auto max-w-6xl px-3 xs:px-4 sm:px-6 md:px-8 relative z-10">
        <Reveal className="mx-auto max-w-2xl text-center px-2 mb-8 sm:mb-12">
          <span className="text-xs xs:text-sm font-extrabold uppercase tracking-wider text-brand-crimson bg-brand-crimson/10 px-3.5 py-1 rounded-full border border-brand-crimson/20 inline-block mb-2 shadow-xs">
            আমাদের ফ্লেভারসমূহ
          </span>
          <h2 className="font-heading text-2xl xs:text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
            ৪টি সুস্বাদু ফ্লেভারে পাওয়া যাচ্ছে
          </h2>
          <p className="mt-2 text-xs xs:text-sm sm:text-base text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
            {isSmoothflow
              ? "আপনার পছন্দ অনুযায়ী চমৎকার ৪টি ফ্লেভার থেকে বেছে নিতে পারেন।"
              : "মা ও শিশুর সুস্বাস্থ্য বজায় রাখতে প্রাকৃতিক উপাদানে তৈরি ৪টি আকর্ষণীয় ফ্লেভার।"}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground font-semibold sm:hidden">
            (ডানে-বামে সোয়াইপ করে সব ফ্লেভার দেখুন)
          </p>
        </Reveal>

        {/* Desktop Grid View */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {effectiveFlavors.map((flavor) => (
            <Reveal key={flavor.id} className="h-full">
              <div
                className={cn(
                  "group relative flex flex-col justify-between h-full rounded-2xl border border-border/80 bg-card p-5 text-left transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1"
                )}
              >
                {flavor.tag && (
                  <span
                    className={cn(
                      "absolute -top-3 right-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-xs z-10",
                      flavor.popular
                        ? "bg-brand-crimson text-white"
                        : "bg-muted border border-border text-foreground/80"
                    )}
                  >
                    {flavor.tag}
                  </span>
                )}

                <div>
                  <div
                    className={cn(
                      "relative flex h-36 w-full items-center justify-center rounded-xl p-2 border overflow-hidden mb-4 transition-transform duration-300 group-hover:scale-105",
                      flavor.accentBg,
                      `bg-gradient-to-br ${flavor.accentGradient}`
                    )}
                  >
                    <img
                      src={flavor.image || "/images/product-jar.webp"}
                      alt={flavor.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/product-jar.webp";
                      }}
                      className="h-full w-auto max-w-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  <h3 className="font-heading text-base xs:text-lg font-bold text-foreground leading-tight">
                    {flavor.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {flavor.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <span className="font-heading text-base font-extrabold text-primary block">
                      ৳{flavor.salePrice.toLocaleString("bn-BD")}
                    </span>
                    {flavor.regularPrice > flavor.salePrice && (
                      <span className="text-[11px] text-muted-foreground line-through">
                        ৳{flavor.regularPrice.toLocaleString("bn-BD")}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    ১০০% ন্যাচারাল
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mobile Swipeable Carousel */}
        <div className="sm:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3.5 py-3 px-1 -mx-3"
            style={{ scrollBehavior: "smooth" }}
          >
            {effectiveFlavors.map((flavor) => (
              <div
                key={flavor.id}
                className={cn(
                  "group relative flex w-[78vw] max-w-[285px] shrink-0 snap-center flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 text-left shadow-xs transition-all"
                )}
              >
                {flavor.tag && (
                  <span
                    className={cn(
                      "absolute -top-2.5 right-3 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-xs z-10",
                      flavor.popular
                        ? "bg-brand-crimson text-white"
                        : "bg-muted border border-border text-foreground/80"
                    )}
                  >
                    {flavor.tag}
                  </span>
                )}

                <div>
                  <div
                    className={cn(
                      "relative flex h-32 w-full items-center justify-center rounded-xl p-2 border overflow-hidden mb-3",
                      flavor.accentBg,
                      `bg-gradient-to-br ${flavor.accentGradient}`
                    )}
                  >
                    <img
                      src={flavor.image || "/images/product-jar.webp"}
                      alt={flavor.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/product-jar.webp";
                      }}
                      className="h-full w-auto max-w-full object-contain drop-shadow-md"
                    />
                  </div>

                  <h3 className="font-heading text-base font-bold text-foreground leading-tight">
                    {flavor.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {flavor.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <span className="font-heading text-sm font-extrabold text-primary block">
                      ৳{flavor.salePrice.toLocaleString("bn-BD")}
                    </span>
                    {flavor.regularPrice > flavor.salePrice && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        ৳{flavor.regularPrice.toLocaleString("bn-BD")}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    ১০০% ন্যাচারাল
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Indicators / Dots */}
          <div className="flex justify-center items-center gap-2 mt-3">
            {effectiveFlavors.map((flavor, idx) => (
              <button
                key={flavor.id}
                onClick={() => {
                  if (scrollRef.current) {
                    const targetScroll = idx * (scrollRef.current.clientWidth * 0.78);
                    scrollRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
                  }
                }}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  idx === activeIndex
                    ? "w-6 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to flavor ${flavor.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
