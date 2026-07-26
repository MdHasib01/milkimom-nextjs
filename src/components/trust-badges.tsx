import { HeartPulse, Leaf, ShieldCheck, Stethoscope, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionCta } from "@/components/section-cta";
import { trustBadges } from "@/lib/content";

const iconMap: Record<(typeof trustBadges)[number]["icon"], LucideIcon> = {
  leaf: Leaf,
  "shield-check": ShieldCheck,
  stethoscope: Stethoscope,
  "heart-pulse": HeartPulse,
};

export function TrustBadgesBar() {
  return (
    <section className="border-y border-border bg-card/60">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {trustBadges.map((badge) => {
              const Icon = iconMap[badge.icon];
              return (
                <div
                  key={badge.title}
                  className="flex items-center justify-center gap-2 text-center sm:justify-start"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-green-light text-brand-green">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-semibold text-foreground/90 sm:text-base">
                    {badge.title}
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>
        <SectionCta className="mt-6" />
      </div>
    </section>
  );
}
