import Image from "next/image";
import {
  Activity,
  Brain,
  Droplets,
  ShieldPlus,
  Sprout,
  type LucideIcon,
} from "lucide-react";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { benefits } from "@/lib/content";

const iconMap: Record<(typeof benefits)[number]["icon"], LucideIcon> = {
  sprout: Sprout,
  droplets: Droplets,
  brain: Brain,
  activity: Activity,
  "shield-plus": ShieldPlus,
};

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
      <div className="relative mx-auto mt-16 hidden aspect-square max-w-xl sm:block">
        <div className="absolute inset-[12%] rounded-full border border-dashed border-brand-coral/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex size-32 items-center justify-center rounded-full bg-card shadow-xl ring-4 ring-brand-cream lg:size-36">
            <Image
              src="/images/product-jar.webp"
              alt="মিল্কিমম জার"
              width={612}
              height={880}
              className="h-24 w-auto lg:h-28"
            />
          </div>
        </div>

        {benefits.map((benefit, index) => {
          const Icon = iconMap[benefit.icon];
          const position = polarPosition(index, benefits.length);
          return (
            <div
              key={benefit.title}
              style={position}
              className="absolute w-40 -translate-x-1/2 -translate-y-1/2 lg:w-44"
            >
              <Reveal delay={0.1 * index} y={12}>
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center shadow-sm">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-crimson/10 text-brand-crimson">
                    <Icon className="size-5" />
                  </span>
                  <p className="text-xs font-semibold leading-snug text-foreground sm:text-sm">
                    {benefit.title}
                  </p>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>

      {/* Stacked list — mobile */}
      <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:hidden">
        {benefits.map((benefit) => {
          const Icon = iconMap[benefit.icon];
          return (
            <RevealItem key={benefit.title}>
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-crimson/10 text-brand-crimson">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">{benefit.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
