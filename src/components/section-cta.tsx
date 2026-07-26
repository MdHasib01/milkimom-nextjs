import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

interface SectionCtaProps {
  className?: string;
  ctaText?: string;
}

export function SectionCta({
  className = "",
  ctaText = "অর্ডার করুন",
}: SectionCtaProps) {
  return (
    <Reveal className={`mt-10 sm:mt-12 flex items-center justify-center text-center ${className}`}>
      <Button
        asChild
        size="lg"
        className="cta-shine h-12 gap-2 rounded-full bg-brand-cta px-8 text-base font-bold text-brand-cta-foreground shadow-lg shadow-brand-cta/35 transition-all hover:scale-105 hover:bg-brand-cta-dark active:scale-95"
      >
        <a href="#pricing">
          <ShoppingBag className="size-5" />
          {ctaText}
        </a>
      </Button>
    </Reveal>
  );
}
