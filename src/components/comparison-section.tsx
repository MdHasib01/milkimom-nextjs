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
            ফর্মুলা মিল্ক বনাম {siteConfig.name}
          </h2>
          <p className="mt-3 text-balance text-muted-foreground">
            প্রতি মাসে ফর্মুলার পেছনে খরচ করার বদলে, একবার প্রাকৃতিক বিনিয়োগেই স্থায়ী
            সমাধান।
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid grid-cols-[1fr_1.2fr_1.2fr] divide-x divide-border border-b border-border text-center text-xs sm:text-sm">
            <div className="p-3 sm:p-4" />
            <div className="p-3 font-semibold text-muted-foreground sm:p-4">ফর্মুলা মিল্ক</div>
            <div className="bg-primary/5 p-3 font-heading font-bold text-primary sm:p-4">
              {siteConfig.name}
            </div>
          </div>
          {comparisonRows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_1.2fr_1.2fr] divide-x divide-border border-b border-border last:border-b-0"
            >
              <div className="flex items-center p-3 text-xs font-semibold text-foreground sm:p-4 sm:text-sm">
                {row.label}
              </div>
              <div className="flex items-start gap-1.5 p-3 text-xs text-muted-foreground sm:gap-2 sm:p-4 sm:text-sm">
                <X className="mt-0.5 size-3.5 shrink-0 text-destructive/70 sm:size-4" />
                <span>{row.formula}</span>
              </div>
              <div className="flex items-start gap-1.5 bg-primary/5 p-3 text-xs font-medium text-foreground sm:gap-2 sm:p-4 sm:text-sm">
                <Check className="mt-0.5 size-3.5 shrink-0 text-brand-green sm:size-4" />
                <span>{row.milkimom}</span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
