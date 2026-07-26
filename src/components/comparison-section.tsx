import Image from "next/image";
import { Check, X } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { comparisonRows, siteConfig } from "@/lib/content";

export function ComparisonSection() {
  return (
    <section id="compare" className="relative overflow-hidden py-16 sm:py-24">
      <Image
        src="/images/lifestyle-window.webp"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-[0.06]"
      />
      <div className="mx-auto max-w-5xl px-4">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-crimson">
            তুলনা করুন
          </span>
          <h2 className="mt-2 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
            কেন অন্যান্য মেডিসিন এবং &quot;{siteConfig.name}&quot; সম্পূর্ণ আলাদা?
          </h2>
          <p className="mt-3 text-balance text-muted-foreground">
            শুধু দাবি নয়, বাস্তব পার্থক্যটা নিজের চোখেই দেখুন।
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid grid-cols-2 divide-x divide-border border-b border-border text-center text-xs sm:text-sm">
            <div className="bg-gradient-to-b from-primary/10 to-transparent p-3 sm:p-4">
              <span className="font-heading font-bold text-primary">
                👑 {siteConfig.name}
              </span>
            </div>
            <div className="p-3 font-semibold text-muted-foreground sm:p-4">অন্যান্য</div>
          </div>
          {comparisonRows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-2 divide-x divide-border border-b border-border last:border-b-0"
            >
              <div className="flex items-start gap-1.5 bg-primary/5 p-3 text-xs font-medium text-foreground sm:gap-2 sm:p-4 sm:text-sm">
                <Check className="mt-0.5 size-3.5 shrink-0 text-brand-green sm:size-4" />
                <span>{row.milkimom}</span>
              </div>
              <div className="flex items-start gap-1.5 p-3 text-xs text-muted-foreground sm:gap-2 sm:p-4 sm:text-sm">
                <X className="mt-0.5 size-3.5 shrink-0 text-destructive/70 sm:size-4" />
                <span>{row.other}</span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
