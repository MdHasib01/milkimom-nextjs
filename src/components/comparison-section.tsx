"use client";

import Image from "next/image";
import { Check } from "lucide-react";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionCta } from "@/components/section-cta";
import { GridPattern } from "@/components/grid-pattern";
import { siteConfig } from "@/lib/content";
import { useLandingPageContent } from "./landing-page-content-provider";

const comparisonPoints = [
  "মিল্কিমম একটি পার্মানেন্ট সলিউশন।",
  "এর একটি ডোজই খেতে হয়।",
  "এটি ডক্টর সাজেস্টেড, ডক্টর প্রুভেন ও ডক্টর ইউসড।",
  "এবং বিশ্ব ব্যাপী স্বীকৃত।",
  "এটি 6+ বছর গবেষণার দ্বারা প্রুভড।",
  "মিল্কিমম ভিন্ন ৪ টি ফ্লেভারে পাওয়া যায়, ফলে খেতে খুব মজা লাগে।",
];

const smoothflowComparisonPoints = [
  "স্মুথফ্লো সরাসরি ল্যাকটিফেরাস ডাক্টের জমাট ব্লক দূর করে মূল সমস্যার সমাধান করে।",
  "সাধারণ পেইন কিলারের মতো সাময়িক না, এটি সম্পূর্ণ প্রাকৃতিক উপায়ে স্থায়ী আরাম দেয়।",
  "অ্যান্টিবায়োটিকের মতো কোনো পার্শ্বপ্রতিক্রিয়া বা পেটের অস্বস্তি তৈরি করে না।",
  "ফিডিং-এর সময়কার অসহ্য যন্ত্রণা থেকে মাত্র ২৪ ঘন্টায় মুক্তি দেয়।",
  "গভর্নমেন্ট রেজিস্টার্ড চিকিৎসকদের সুপারিশকৃত ও ১০০% ল্যাব টেস্টেড সার্টিফাইড।",
  "ব্রেস্টের চাপ, চাকা ও ভারীভাব কমিয়ে ফিডিং স্বাভাবিক ও আনন্দদায়ক করে।",
];

export function ComparisonSection() {
  const { content, replaceBrandName } = useLandingPageContent();
  const brandName = content.productName || siteConfig.name;

  const pointsList = content.productSlug === "smoothflow" ? smoothflowComparisonPoints : comparisonPoints;

  return (
    <section id="compare" className="relative overflow-hidden py-16 sm:py-24">
      <GridPattern size={28} className="opacity-50" />
      <Image
        src="/images/lifestyle-window.webp"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-[0.06]"
      />
      <div className="mx-auto max-w-4xl px-4">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
            অন্যান্য মেডিসিন এবং <span className="text-primary">&quot;{brandName}&quot;</span> সম্পূর্ণ আলাদা।
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="relative overflow-hidden mt-8 rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-lg">
          <GridPattern size={28} className="z-0 opacity-45 [mask-image:radial-gradient(ellipse_at_top_right,black_30%,transparent_75%)]" />
          
          <div className="relative z-10">
            <p className="mb-6 font-heading text-lg font-bold text-primary sm:text-xl">
              কারন,
            </p>

            <RevealGroup stagger={0.1} className="space-y-4">
              {pointsList.map((point, index) => (
                <RevealItem key={index} className="flex items-start gap-3.5 text-base sm:text-lg font-medium text-foreground">
                  <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary shadow-sm bg-card">
                    <Check className="size-4 stroke-[3]" />
                  </div>
                  <span>{replaceBrandName(point)}</span>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.3} className="mt-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 p-4 sm:p-5 text-center backdrop-blur-[2px]">
              <p className="font-heading text-lg font-bold text-primary sm:text-xl">
                তাই নিশ্চিন্তে {brandName} এর উপর আস্থা রাখতে পারেন।
              </p>
            </Reveal>
          </div>
        </Reveal>

        <SectionCta />
      </div>
    </section>
  );
}