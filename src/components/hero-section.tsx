import Image from "next/image";
import { Phone, ShoppingBag, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { FloatingBadges } from "@/components/floating-badges";
import { siteConfig } from "@/lib/content";

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[32rem]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(227,122,105,0.18), transparent)",
        }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2 lg:gap-8">
        <div className="order-2 lg:order-1">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-light px-3 py-1 text-xs font-semibold text-brand-green sm:text-sm">
              <Star className="size-3.5 fill-brand-green text-brand-green" />
              ১,০২,৮৯১+ জন মা ইতিমধ্যেই মিল্কিমম খেয়ে উপকৃত হয়েছেন
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
            <p className="mt-4 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
              মিল্কিমম খেলে মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে, এবং ব্রেস্ট ফিডিং এর
              শেষ পর্যন্ত স্থায়ী হয়। এটি সম্পূর্ণ সাইডইফেক্ট মুক্ত ও ন্যাচারাল।
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
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
                <a href={`tel:${siteConfig.phone}`}>
                  <Phone className="size-5" />
                  কল করুন
                </a>
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="order-1 lg:order-2">
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
