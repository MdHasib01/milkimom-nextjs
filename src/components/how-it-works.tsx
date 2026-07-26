import Image from "next/image";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { RotatingOrbit } from "@/components/rotating-orbit";
import { benefits } from "@/lib/content";

const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const RADIUS = 42;

function polarPosition(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const x = 50 + RADIUS * Math.cos(angle);
  const y = 50 + RADIUS * Math.sin(angle);
  return { left: `${x}%`, top: `${y}%` };
}

export function HowItWorksSection() {
  return (
    <section id="benefits" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-crimson">
          কি কাজ করে?
        </span>
        <h2 className="mt-2 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
          একটি ডোজে ৫টি উপকারিতা
        </h2>
        <p className="mt-3 text-balance text-muted-foreground">
          প্রকৃতি ও বিজ্ঞানের সমন্বয়ে তৈরি মিল্কিমম মা ও শিশু উভয়ের জন্যই সামগ্রিক
          উপকার নিয়ে আসে।
        </p>
      </Reveal>

      {/* Radial layout — desktop/tablet */}
      <div className="relative mx-auto mt-16 hidden aspect-square max-w-md sm:block md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <RotatingOrbit />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/images/product-jar.webp"
            alt="মিল্কিমম জার"
            width={612}
            height={880}
            className="h-44 w-auto drop-shadow-2xl md:h-[228px] lg:h-64 xl:h-[300px]"
          />
        </div>

        {benefits.map((benefit, index) => {
          const position = polarPosition(index, benefits.length);
          return (
            <div
              key={benefit.accent + benefit.rest}
              style={position}
              className="absolute w-40 -translate-x-1/2 -translate-y-1/2 md:w-44 lg:w-48 xl:w-56"
            >
              <Reveal delay={0.1 * index} y={12}>
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center shadow-sm">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-crimson text-sm font-bold text-white md:size-10 md:text-base">
                    {bengaliDigits[index + 1]}
                  </span>
                  <p className="text-sm font-semibold leading-snug sm:text-base lg:text-lg">
                    <span className="text-brand-crimson">{benefit.accent}</span>{" "}
                    <span className="text-foreground">{benefit.rest}</span>
                  </p>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>

      {/* Stacked list — mobile */}
      <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:hidden">
        {benefits.map((benefit, index) => {
          return (
            <RevealItem key={benefit.accent + benefit.rest}>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-crimson text-sm font-bold text-white">
                  {bengaliDigits[index + 1]}
                </span>
                <p className="text-lg font-semibold leading-snug">
                  <span className="text-brand-crimson">{benefit.accent}</span>{" "}
                  <span className="text-foreground">{benefit.rest}</span>
                </p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
