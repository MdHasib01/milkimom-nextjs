"use client";

import { Phone, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/content";

export function StickyMobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-card/95 p-3 backdrop-blur-md sm:hidden">
      <Button
        asChild
        variant="outline"
        className="h-12 flex-1 gap-2 rounded-full border-brand-coral/40 text-brand-crimson"
      >
        <a href={`tel:${siteConfig.phone}`}>
          <Phone className="size-4" />
          কল করুন
        </a>
      </Button>
      <Button asChild className="cta-shine h-12 flex-1 gap-2 rounded-full bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark">
        <a href="#pricing">
          <ShoppingBag className="size-4" />
          অর্ডার করুন
        </a>
      </Button>
    </div>
  );
}
