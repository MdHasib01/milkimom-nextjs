"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when scrolled down more than 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="উপরে ফিরে যান"
      title="উপরে ফিরে যান"
      className={cn(
        "fixed z-50 flex size-8 sm:size-9 items-center justify-center rounded-full bg-brand-crimson/10 border border-brand-crimson/30 text-brand-crimson shadow-md shadow-brand-crimson/15 backdrop-blur-md transition-all duration-300 hover:bg-brand-crimson hover:text-white hover:border-brand-crimson hover:scale-110 hover:shadow-brand-crimson/30 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-crimson",
        "bottom-36 right-4 sm:bottom-22 sm:right-6",
        isVisible
          ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
          : "translate-y-4 opacity-0 scale-75 pointer-events-none"
      )}
    >
      <ChevronUp className="size-4 sm:size-5 stroke-[2.5] transition-transform duration-200 hover:-translate-y-0.5" />
      <span className="sr-only">উপরে ফিরে যান</span>
    </button>
  );
}
