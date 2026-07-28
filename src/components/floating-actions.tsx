"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

import { siteConfig } from "@/lib/content";
import { cn } from "@/lib/utils";

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.94 9.94 0 0 0 1.333 4.993L2 22l5.233-1.37a9.94 9.94 0 0 0 4.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.668-1.04-5.176-2.926-7.062A9.92 9.92 0 0 0 12.012 2zm5.71 13.627c-.244.688-1.42 1.316-1.954 1.376-.494.056-1.127.08-1.815-.14-.428-.137-.978-.318-1.684-.624-3.003-1.303-4.947-4.324-5.097-4.526-.149-.202-1.222-1.626-1.222-3.1 0-1.474.772-2.199 1.047-2.497.274-.298.6-.372.8-.372.2 0 .4 0 .573.008.184.009.43-.07.674.514.243.585.83 2.023.902 2.17.072.148.12.322.024.515-.096.192-.144.312-.288.481-.144.168-.303.376-.433.504-.144.145-.295.303-.127.592.169.288.75 1.238 1.61 2.006 1.107.987 2.04 1.294 2.328 1.438.288.144.456.12.624-.072.168-.192.72-.84.912-1.128.192-.288.384-.24.648-.144.264.096 1.68.792 1.968.936.288.144.48.216.552.336.072.12.072.696-.172 1.384z" />
    </svg>
  );
}

export function FloatingActions() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rawPhone = siteConfig.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    "হ্যালো মিল্কিমম, আমি বিস্তারিত জানতে চাই।"
  )}`;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-center gap-3 pointer-events-none">
      {/* Go to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="উপরে ফিরে যান"
        title="উপরে ফিরে যান"
        className={cn(
          "flex size-8 sm:size-9 items-center justify-center rounded-full bg-brand-crimson/10 border border-brand-crimson/30 text-brand-crimson shadow-md shadow-brand-crimson/15 backdrop-blur-md transition-all duration-300 hover:bg-brand-crimson hover:text-white hover:border-brand-crimson hover:scale-110 hover:shadow-brand-crimson/30 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-crimson",
          showTopBtn
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
            : "translate-y-4 opacity-0 scale-75 pointer-events-none"
        )}
      >
        <ChevronUp className="size-4 sm:size-5 stroke-[2.5] transition-transform duration-200 hover:-translate-y-0.5" />
        <span className="sr-only">উপরে ফিরে যান</span>
      </button>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp-এ যোগাযোগ করুন"
        className="flex size-13 sm:size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-900/30 transition-all duration-300 hover:bg-[#20bd5a] hover:scale-110 active:scale-95 group cursor-pointer pointer-events-auto"
      >
        <WhatsAppIcon className="size-7 sm:size-8 transition-transform group-hover:rotate-12" />
        <span className="sr-only">WhatsApp</span>
      </a>
    </div>
  );
}
