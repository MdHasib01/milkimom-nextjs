"use client";

import React from "react";
import { Moon, ShieldAlert, HeartPulse, ArrowRight, Sparkles } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { GridPattern } from "@/components/grid-pattern";
import { Button } from "@/components/ui/button";

export function PainEmpathyBanner() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      {/* Background Decor */}
      <GridPattern patternType="dots" size={30} className="opacity-30" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-96 -translate-y-1/2 rounded-full blur-3xl opacity-20 bg-primary"
      />

      <div className="mx-auto max-w-5xl px-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-primary/5 p-7 sm:p-12 shadow-2xl backdrop-blur-md">
            {/* Top Decorative Ambient Glows */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-primary/15 blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -bottom-16 size-72 rounded-full bg-rose-500/10 blur-2xl"
            />

            <div className="relative z-10">
              {/* Header Badge */}
              <div className="flex justify-center sm:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1.5 text-xs sm:text-sm font-extrabold text-primary shadow-xs border border-primary/25">
                  <HeartPulse className="size-4 shrink-0 animate-pulse" />
                  <span>একজন মায়ের মানসিক ও শারীরিক স্বস্তি</span>
                </span>
              </div>

              {/* Main Quote Title */}
              <h3 className="mt-5 font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-snug text-center sm:text-left">
                “একটা{" "}
                <span className="bg-gradient-to-r from-primary via-rose-500 to-primary bg-clip-text text-transparent">
                  painful Feeding-এর দাম
                </span>{" "}
                টাকা দিয়ে মাপা যায় না”
              </h3>

              {/* Emotional Pain Point Cards Grid */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-card/90 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/80 rounded-l-2xl transition-all group-hover:w-2" />
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-xs">
                      <Moon className="size-5" />
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-bold text-foreground leading-snug">
                        একটা রাতের disturbed sleep
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground font-medium">
                        এবং প্রতিটা feed-এর আগের মানসিক ভয় ও উৎকণ্ঠা।
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-card/90 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/80 rounded-l-2xl transition-all group-hover:w-2" />
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-xs">
                      <ShieldAlert className="size-5" />
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-bold text-foreground leading-snug">
                        অনবরত ব্যথার উদ্বেগ
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground font-medium">
                        বাচ্চাকে কোলে নিয়েও ব্রেস্ট প্রটেক্ট করে রাখা।
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Reassurance Banner */}
              <div className="mt-8 rounded-2xl bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 border border-primary/25 p-5 sm:p-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
                <div>
                  <p className="text-base sm:text-lg font-extrabold text-foreground">
                    সারাদিন <span className="text-primary underline decoration-primary/30 underline-offset-4">&ldquo;আরও বাড়ছে না তো?&rdquo;</span> চিন্তা ছেড়ে
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground font-semibold mt-0.5">
                    আজই SmoothFlow দিয়ে দুশ্চিন্তামুক্ত থাকুন ও নিশ্চিন্তে ফিডিং করান।
                  </p>
                </div>

                <Button
                  asChild
                  className="cta-shine h-11 shrink-0 rounded-full bg-primary px-6 text-sm sm:text-base font-bold text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary/90"
                >
                  <a href="#pricing" className="flex items-center gap-2">
                    <span>আজই অর্ডার করুন</span>
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
