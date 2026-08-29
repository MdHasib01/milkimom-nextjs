"use client";

import { useState, useEffect } from "react";
import { Timer, ShoppingBag } from "lucide-react";
import { useFlavors } from "@/lib/use-flavours";
import { useLandingPageContent } from "@/components/landing-page-content-provider";

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

export function MilkimomPricing() {
  const { content, getImageUrl } = useLandingPageContent();
  const countdown = useCountdown();
  const flavors = useFlavors();
  const featured = flavors.find((f) => f.popular) ?? flavors[0];

  const productImage = getImageUrl(content.heroImage, "/images/product-jar.webp");
  const discountPct =
    featured.regularPrice > featured.salePrice
      ? Math.round((1 - featured.salePrice / featured.regularPrice) * 100)
      : 0;
  const savings = featured.regularPrice - featured.salePrice;

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-16 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight">
            আজই সিদ্ধান্ত নিন, বুকের দুধ বাড়ান।
          </h2>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-brand/10 flex flex-col md:flex-row overflow-hidden">
          <div className="md:w-1/2 bg-brand-light relative min-h-[300px] sm:min-h-[360px] md:min-h-[420px] flex items-center justify-center border-b md:border-b-0 md:border-r border-brand/10 overflow-hidden">
            {discountPct > 0 && (
              <div className="absolute top-5 left-5 z-20 -rotate-[8deg] bg-brand text-white px-3 py-1.5 rounded-xl shadow-lg border border-white/20 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold tracking-widest leading-none mb-0.5">অফার</span>
                <span className="text-sm font-black leading-none">{discountPct}% OFF</span>
              </div>
            )}

            <img
              src={productImage}
              alt={content.productNameEn || "Milkimom"}
              className="w-full h-full object-contain p-8 md:p-10 min-h-[300px] md:min-h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/product-jar.webp";
              }}
            />
          </div>

          <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
            <div className="flex flex-col items-center md:items-start mb-8 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start w-full">
                {featured.regularPrice > featured.salePrice && (
                  <>
                    <span className="text-xl md:text-2xl text-[#1A1A1A]/40 line-through decoration-2 font-bold">
                      {featured.regularPrice.toLocaleString("bn-BD")} TK
                    </span>
                    <span className="text-sm md:text-base text-[#1A1A1A]/70 font-semibold bg-brand-light px-3 py-1 rounded-full border border-brand/10">
                      বাঁচলো {savings.toLocaleString("bn-BD")} TK
                    </span>
                  </>
                )}
              </div>
              <div className="mt-1">
                <span className="text-5xl md:text-6xl font-black text-brand tracking-tighter">
                  {featured.salePrice.toLocaleString("bn-BD")} TK
                </span>
              </div>
            </div>

            <div className="bg-brand-light border border-brand/10 rounded-2xl p-4 mb-6 text-center">
              <div className="flex items-center justify-center gap-2 text-brand-crimson font-bold mb-3">
                <Timer className="w-5 h-5 animate-pulse" />
                <span className="text-xs uppercase tracking-widest font-extrabold">অফার শেষ হতে বাকি</span>
              </div>
              {countdown && (
                <div className="flex justify-center gap-3 text-brand-crimson font-mono font-black text-3xl">
                  <div className="flex flex-col items-center">
                    <span>{pad(countdown.hours)}</span>
                    <span className="text-[9px] font-sans text-brand-crimson/60 uppercase mt-1 tracking-widest">Hours</span>
                  </div>
                  <span className="text-brand-crimson/50">:</span>
                  <div className="flex flex-col items-center">
                    <span>{pad(countdown.minutes)}</span>
                    <span className="text-[9px] font-sans text-brand-crimson/60 uppercase mt-1 tracking-widest">Mins</span>
                  </div>
                  <span className="text-brand-crimson/50">:</span>
                  <div className="flex flex-col items-center">
                    <span>{pad(countdown.seconds)}</span>
                    <span className="text-[9px] font-sans text-brand-crimson/60 uppercase mt-1 tracking-widest">Secs</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={scrollToOrder}
                className="cta-shine w-full bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark font-black text-lg py-4 px-6 rounded-full shadow-lg shadow-brand-cta/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>এখনই মিল্কিমম অর্ডার করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
