"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { FloatingBadges } from "@/components/floating-badges";
import { GridPattern } from "@/components/grid-pattern";
import { siteConfig } from "@/lib/content";
import { fetchMotherCount } from "@/lib/api";
import { formatBengaliNumber } from "@/lib/number-utils";

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

export function HeroSection() {
  const [motherCount, setMotherCount] = useState<number>(89746);

  useEffect(() => {
    let isMounted = true;

    const loadCount = async () => {
      try {
        const result = await fetchMotherCount();
        if (isMounted && result?.success && typeof result.data?.count === "number" && result.data.count > 0) {
          setMotherCount(result.data.count);
        }
      } catch {
        // Keep initial fallback count 89746 on error
      }
    };

    // Initial fetch
    loadCount();

    // Sync count real-time every 30 seconds
    const interval = setInterval(loadCount, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="top" className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24">
      <GridPattern size={36} className="opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[32rem]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(227,122,105,0.18), transparent)",
        }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2 lg:gap-8">
        <div className="text-center lg:order-1 lg:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-green-light px-3.5 py-1.5 text-xs font-semibold text-brand-green sm:text-sm shadow-xs">
              <div className="flex -space-x-2 shrink-0">
                {[
                  "/assets/reviewer/girl1.jpeg",
                  "/assets/reviewer/girl2.jpeg",
                  "/assets/reviewer/girl3.jpeg",
                  "/assets/reviewer/girl4.jpeg",
                ].map((imgSrc, index) => (
                  <Image
                    key={index}
                    src={imgSrc}
                    alt={`রিভিউয়ার ${index + 1}`}
                    width={24}
                    height={24}
                    className="size-6 rounded-full border-2 border-white object-cover shadow-xs"
                  />
                ))}
              </div>
              <span>
                {formatBengaliNumber(motherCount)} জন মা ইতিমধ্যেই মিল্কিমম খেয়ে উপকৃত হয়েছেন
              </span>
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-4 text-balance font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
              ১ ডোজেই, পার্মানেন্টলি
              <br />
              বুকের দুধ বাড়াতে
              <br />
              <span className="text-primary">মিল্কিমম</span> খান নিশ্চিন্তে!
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mx-auto mt-4 max-w-xl text-balance text-base text-muted-foreground sm:text-lg lg:mx-0">
              মিল্কিমম খেলে <span className="font-bold text-primary">মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে</span>, এবং ব্রেস্ট ফিডিং এর
              শেষ পর্যন্ত স্থায়ী হয়। এটি সম্পূর্ণ সাইডইফেক্ট মুক্ত ও ন্যাচারাল।
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button
                asChild
                className="cta-shine h-12 gap-2 rounded-full bg-brand-cta px-6 text-base text-brand-cta-foreground shadow-lg shadow-brand-cta/40 hover:bg-brand-cta-dark"
              >
                <a href="#pricing">
                  <ShoppingBag className="size-5" />
                  এখনই অর্ডার করুন
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 gap-2 rounded-full border-brand-coral/40 px-6 text-base text-brand-crimson hover:bg-brand-coral/10"
              >
                <a href={siteConfig.messenger} target="_blank" rel="noopener noreferrer">
                  <MessengerIcon className="size-5" />
                  মেসেজ করুন
                </a>
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="lg:order-2">
          <Reveal delay={0.1} y={32}>
            <div className="relative mx-auto flex aspect-square max-w-md items-center justify-center">
              <div
                aria-hidden
                className="absolute inset-6 rounded-full blur-2xl"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(227,122,105,0.25), transparent)",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-10 rounded-full border border-brand-coral/20"
              />
              <Image
                src="/images/product-jar.webp"
                alt="মিল্কিমম ব্রেস্টফিডিং বুস্ট ব্লেন্ড জার"
                width={612}
                height={880}
                priority
                className="relative z-10 h-auto w-56 drop-shadow-2xl sm:w-72"
              />
              <FloatingBadges />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
