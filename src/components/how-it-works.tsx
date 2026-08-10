"use client";

import Image from "next/image";

import { Float, Reveal } from "@/components/motion/reveal";
import { RotatingOrbit } from "@/components/rotating-orbit";
import { SectionCta } from "@/components/section-cta";
import { GridPattern } from "@/components/grid-pattern";
import { benefits as defaultBenefits, smoothflowBenefits } from "@/lib/content";
import { useLandingPageContent } from "./landing-page-content-provider";

const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const RADIUS_X = 42;
const RADIUS_Y = 36;

function polarPosition(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const x = 50 + RADIUS_X * Math.cos(angle);
  const y = 50 + RADIUS_Y * Math.sin(angle);
  return { left: `${x}%`, top: `${y}%` };
}

export function HowItWorksSection() {
  const { content, getImageUrl, replaceBrandName } = useLandingPageContent();
  const brandName = content.productName || "মিল্কিমম";
  const heroImg = content.heroImage ? getImageUrl(content.heroImage) : "/images/product-jar.webp";

  const benefitsList = content.productSlug === "smoothflow" ? smoothflowBenefits : defaultBenefits;


  return (
    <section id="benefits" className="relative overflow-hidden mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <GridPattern patternType="dots" size={24} className="opacity-40" />
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-crimson">
          কি কাজ করে?
        </span>
        <h2 className="mt-2 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
          একটি ডোজে ৫টি উপকারিতা
        </h2>
        <p className="mt-3 text-balance text-muted-foreground">
          প্রকৃতি ও বিজ্ঞানের সমন্বয়ে তৈরি {brandName} মা ও শিশু উভয়ের জন্যই সামগ্রিক
          উপকার নিয়ে আসে।
        </p>
      </Reveal>

      {/* Radial layout */}
      <div className="relative mx-auto mt-8 aspect-square w-full max-w-[420px] sm:mt-16 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <RotatingOrbit />
        <div className="absolute inset-0 flex items-center justify-center">
          <Float distance={8} duration={3.5}>
            <Image
              src={heroImg}
              alt={`${brandName} জার`}
              width={612}
              height={880}
              className="h-28 w-auto drop-shadow-2xl sm:h-44 md:h-[228px] lg:h-64 xl:h-[300px]"
            />
          </Float>
        </div>

        {benefitsList.map((benefit, index) => {
          const position = polarPosition(index, benefitsList.length);
          return (
            <div
              key={benefit.accent + benefit.rest}
              style={position}
              className="absolute w-24 -translate-x-1/2 -translate-y-1/2 sm:w-40 md:w-44 lg:w-48 xl:w-56"
            >
              <Reveal delay={0.1 * index} y={12}>
                <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-2 text-center shadow-sm sm:gap-2 sm:rounded-2xl sm:p-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-brand-crimson text-xs font-bold text-white sm:size-9 sm:text-sm md:size-10 md:text-base">
                    {bengaliDigits[index + 1]}
                  </span>
                  <p className="text-[11px] leading-tight sm:text-sm sm:leading-snug md:text-base lg:text-lg">
                    <span className="font-bold text-brand-crimson">{replaceBrandName(benefit.accent)}</span>{" "}
                    <span className="font-normal text-foreground">{replaceBrandName(benefit.rest)}</span>
                  </p>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>
      <SectionCta />
    </section>
  );
}
