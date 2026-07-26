"use client";

import Image from "next/image";
import { Cookie, Flame, IceCreamCone, Leaf, type LucideIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/motion/reveal";
import { flavors } from "@/lib/content";

const iconMap: Record<(typeof flavors)[number]["icon"], LucideIcon> = {
  cookie: Cookie,
  "ice-cream-cone": IceCreamCone,
  leaf: Leaf,
  flame: Flame,
};

export function FlavorSelector() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <Image
        src="/images/lifestyle-grass.webp"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-[0.05]"
      />
      <div className="mx-auto max-w-6xl px-4">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-crimson">
          স্বাদ বেছে নিন
        </span>
        <h2 className="mt-2 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
          ৪টি সুস্বাদু ফ্লেভারে পাওয়া যাচ্ছে
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <Tabs defaultValue={flavors[0].id} className="mx-auto max-w-3xl">
          <TabsList className="mx-auto h-auto w-full flex-wrap justify-center gap-2 bg-transparent p-0">
            {flavors.map((flavor) => {
              const Icon = iconMap[flavor.icon];
              return (
                <TabsTrigger
                  key={flavor.id}
                  value={flavor.id}
                  className="h-auto rounded-full border border-border bg-card px-4 py-2 text-sm data-active:border-primary data-active:bg-primary/10 data-active:text-primary data-active:shadow-none"
                >
                  <Icon className="mr-1 size-4" />
                  {flavor.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {flavors.map((flavor) => {
            const Icon = iconMap[flavor.icon];
            return (
              <TabsContent key={flavor.id} value={flavor.id} className="mt-6">
                <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:p-8">
                  <div className="flex size-32 shrink-0 items-center justify-center rounded-2xl bg-brand-cream">
                    <Image
                      src="/images/product-jar.webp"
                      alt={`মিল্কিমম ${flavor.name}`}
                      width={612}
                      height={880}
                      className="h-24 w-auto"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="inline-flex items-center rounded-full bg-brand-gold/15 px-2.5 py-0.5 text-xs font-semibold text-brand-gold-dark">
                      {flavor.tag}
                    </span>
                    <h3 className="mt-2 flex items-center justify-center gap-2 font-heading text-xl font-bold text-foreground sm:justify-start">
                      <Icon className="size-5" />
                      {flavor.name}
                    </h3>
                    <p className="mt-2 text-muted-foreground">{flavor.description}</p>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </Reveal>
      </div>
    </section>
  );
}
