"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, HeartHandshake } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { GridPattern } from "@/components/grid-pattern";
import { Button } from "@/components/ui/button";

export function MotherVisionSection() {
  const points = [
    "Feeding-এর সময় কোনো ব্যথা বা যন্ত্রণা না থাকতো",
    "বুকের শক্ত / চাকা-চাকা অস্বস্তিকর অনুভূতি না থাকতো",
    "Breast-এর অতিরিক্ত চাপ, টানটান ও ভারীভাব না থাকতো",
  ];

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 bg-gradient-to-b from-card via-background to-card">
      <GridPattern size={32} className="opacity-40" />

      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/90 p-6 sm:p-10 md:p-12 shadow-xl backdrop-blur-sm">
          {/* Subtle Accent Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full blur-3xl opacity-20 bg-primary"
          />

          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Mother Portrait */}
            <div className="lg:col-span-5">
              <Reveal delay={0.1}>
                <div className="relative mx-auto max-w-md">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-2 border-primary/30 shadow-2xl">
                    <Image
                      src="/images/thinking-mother.png"
                      alt="Thinking Mother holding baby"
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                      className="object-cover object-top transition-transform duration-500 hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -bottom-4 left-4 right-4 sm:left-6 sm:right-6 rounded-xl border border-white/40 bg-card/95 p-3.5 shadow-lg backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <HeartHandshake className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground sm:text-sm">
                          মায়ের ব্যথামুক্ত ব্রেস্টফিডিং
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          ২৪ ঘন্টায় ক্লগড ডাক্ট ও চাকা থেকে মুক্ত
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Text & Painless Vision List */}
            <div className="lg:col-span-7">
              <Reveal delay={0.15}>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3.5 py-1 text-xs font-extrabold text-primary shadow-xs">
                  <span>SmoothFlow কেয়ার সলিউশন</span>
                </span>

                <h2 className="mt-4 font-heading text-2xl font-black text-foreground sm:text-3xl lg:text-4xl leading-snug">
                  ভাবুন, পরের Feeding-টা যদি{" "}
                  <span className="text-primary">
                    ব্রেস্ট পেইন ছাড়া হতো…
                  </span>
                </h2>
              </Reveal>

              <Reveal delay={0.25}>
                <div className="mt-6 space-y-4">
                  {points.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-muted/40 p-4 shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-muted/80"
                    >
                      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                        <CheckCircle2 className="size-4 stroke-[2.5]" />
                      </div>
                      <span className="text-base font-semibold text-foreground sm:text-lg">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.35}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button
                    asChild
                    className="cta-shine h-12 rounded-full bg-primary px-7 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
                  >
                    <a href="#pricing">২৪ ঘন্টায় ব্যথামুক্ত স্বস্তি পান</a>
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
