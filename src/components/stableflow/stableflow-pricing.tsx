"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { useLandingPageContent } from "@/components/landing-page-content-provider";

export function StableflowPricing() {
  const { content } = useLandingPageContent();
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 45,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          return prev;
        }
        let newS = prev.seconds - 1;
        let newM = prev.minutes;
        let newH = prev.hours;

        if (newS < 0) {
          newS = 59;
          newM -= 1;
        }
        if (newM < 0) {
          newM = 59;
          newH -= 1;
        }
        return { hours: newH, minutes: newM, seconds: newS };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (val: number) => val.toString().padStart(2, "0");

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-16 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight">
            Breast Pain থেকে মুক্তির সিদ্ধান্তটা নিন আজই।
          </h2>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-brand/10 flex flex-col md:flex-row overflow-hidden">
          <div className="md:w-2/5 bg-brand-light relative p-6 md:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-brand/10">
            {/* Mega Offer Sticker */}
            <div className="absolute top-5 left-5 z-20 -rotate-[8deg] bg-brand text-white px-3 py-1.5 rounded-xl shadow-lg border border-white/20 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold tracking-widest leading-none mb-0.5">MEGA OFFER</span>
              <span className="text-sm font-black leading-none">42% OFF</span>
            </div>

            {/* Visual representation of product */}
            <div className="relative z-10 w-44 h-56 bg-white rounded-2xl shadow-sm border border-brand/10 flex flex-col items-center justify-center p-4">
              <div className="w-14 h-14 bg-brand-light rounded-xl flex items-center justify-center mb-3">
                <span className="text-brand font-bold text-lg">SF</span>
              </div>
              <h4 className="font-bold text-[#1A1A1A] text-lg text-center">
                {content.productNameEn || "SmoothFlow"}
              </h4>
              <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 text-center mt-1 font-bold">
                Formula
              </p>
            </div>
          </div>

          <div className="md:w-3/5 p-6 md:p-10 flex flex-col justify-center">
            <div className="flex flex-col items-center md:items-start mb-8 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start w-full">
                <span className="text-xl md:text-2xl text-[#1A1A1A]/40 line-through decoration-2 font-bold">
                  3450 TK
                </span>
                <span className="text-sm md:text-base text-[#1A1A1A]/70 font-semibold bg-brand-light px-3 py-1 rounded-full border border-brand/10">
                  বাঁচলো 1451 TK
                </span>
              </div>
              <div className="mt-1">
                <span className="text-5xl md:text-6xl font-black text-brand tracking-tighter">1999 TK</span>
              </div>
            </div>

            <div className="bg-brand-light border border-brand/10 rounded-2xl p-4 mb-6 text-center">
              <div className="flex items-center justify-center gap-2 text-brand font-bold mb-3">
                <Clock className="w-5 h-5" />
                <span className="text-[11px] uppercase tracking-widest">OFFER শেষ হতে বাকি</span>
              </div>
              <div className="flex justify-center gap-4 text-brand font-mono font-black text-3xl">
                <div className="flex flex-col items-center">
                  <span>{formatTime(timeLeft.hours)}</span>
                  <span className="text-[9px] font-sans text-brand/60 uppercase mt-1 tracking-widest">Hours</span>
                </div>
                <span className="text-brand/50">:</span>
                <div className="flex flex-col items-center">
                  <span>{formatTime(timeLeft.minutes)}</span>
                  <span className="text-[9px] font-sans text-brand/60 uppercase mt-1 tracking-widest">Mins</span>
                </div>
                <span className="text-brand/50">:</span>
                <div className="flex flex-col items-center">
                  <span>{formatTime(timeLeft.seconds)}</span>
                  <span className="text-[9px] font-sans text-brand/60 uppercase mt-1 tracking-widest">Secs</span>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={scrollToOrder}
                className="w-full bg-brand text-white font-black text-lg py-4 px-6 rounded-full shadow-[0_8px_25px_rgba(230,16,110,0.3)] hover:shadow-[0_12px_35px_rgba(230,16,110,0.4)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                এখনই SmoothFlow অর্ডার করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
