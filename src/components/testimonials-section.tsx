"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronDown } from "lucide-react";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { testimonials } from "@/lib/content";

export function TestimonialsSection() {
  const [showAll, setShowAll] = useState(false);
  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 4);

  return (
    <section id="reviews" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-crimson">
          মায়েদের অভিজ্ঞতা
        </span>
        <h2 className="mt-2 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
          সন্তুষ্ট মায়েদের রিভিউ আমাদের প্রশান্তি দেয়
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
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
                width={36}
                height={36}
                className="size-8 rounded-full border-2 border-card object-cover shadow-sm"
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-foreground">
            ৩০,০০০+ সন্তুষ্ট মা
          </span>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {displayedTestimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="flex items-center gap-1 text-brand-gold">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="size-4 fill-current text-brand-gold"
                />
              ))}
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
              &ldquo;{testimonial.text}&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-coral/15 text-sm font-bold text-brand-crimson">
                {testimonial.name.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-xs text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Button for See More */}
      {!showAll && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 rounded-full border border-brand-crimson/30 bg-card px-8 py-3 text-sm font-bold text-brand-crimson shadow-md transition-all hover:bg-brand-crimson hover:text-white hover:shadow-lg cursor-pointer"
          >
            <span>আরও রিভিউ দেখুন</span>
            <ChevronDown className="size-4 animate-bounce" />
          </button>
        </div>
      )}

      <Reveal delay={0.15} className="mt-10 overflow-hidden rounded-3xl">
        <div className="relative flex items-center justify-center overflow-hidden rounded-3xl">
          <Image
            src="/images/lifestyle-hands.webp"
            alt="একজন মা মিল্কিমম জার হাতে নিয়ে আছেন"
            width={1400}
            height={1750}
            className="h-64 w-full object-cover sm:h-80"
            sizes="(min-width: 1024px) 72rem, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <p className="absolute bottom-5 left-5 right-5 text-balance font-heading text-lg font-semibold text-white sm:text-xl">
            &ldquo;মা ও শিশুর যত্নে একটুও ছাড় নয়!&rdquo;
          </p>
        </div>
      </Reveal>
    </section>
  );
}
