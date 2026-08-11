"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useLandingPageContent } from "@/components/landing-page-content-provider";

export function SmoothflowStickyCTA() {
  const { content } = useLandingPageContent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const orderSection = document.getElementById("order-section");
      const orderSectionTop = orderSection ? orderSection.offsetTop : Infinity;

      const shouldShow = window.scrollY > 500 && window.scrollY < orderSectionTop - window.innerHeight;
      setIsVisible(shouldShow);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]"
        >
          <button
            onClick={scrollToOrder}
            className="cta-shine w-full bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark font-bold py-3.5 rounded-full shadow-lg shadow-brand-cta/40 flex items-center justify-center gap-3 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{content.productNameEn || "SmoothFlow"} — ৳1,999 | এখনই অর্ডার করুন</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
