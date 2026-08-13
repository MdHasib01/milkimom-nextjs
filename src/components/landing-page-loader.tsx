"use client";

import React from "react";
import Image from "next/image";
import { GridPattern } from "@/components/grid-pattern";

interface LandingPageLoaderProps {
  productSlug?: string;
}

export function LandingPageLoader({ productSlug = "milkimom" }: LandingPageLoaderProps) {
  const isMilkimom = productSlug === "milkimom";
  const isMilkready = productSlug === "milkready";
  const brandColor = isMilkimom ? "#bd0052" : isMilkready ? "#0284c7" : "#E6106E";
  const brandName = isMilkimom ? "মিল্কিমম™" : isMilkready ? "MilkReady™" : "SmoothFlow™";
  const badgeText = isMilkimom
    ? "১০০% সাইডইফেক্ট মুক্ত ও ন্যাচারাল"
    : isMilkready
    ? "ডেলিভারি পূর্ববর্তী প্রস্তুতি"
    : "১০০% সাইডইফেক্ট মুক্ত ও সেফ ফর্মুলা";
  const productImage = isMilkimom
    ? "/images/product-jar.webp"
    : isMilkready
    ? "/images/milkready/product-jar.png"
    : "/images/smoothflow.png";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${
        isMilkready
          ? "bg-gradient-to-b from-sky-50/60 via-white to-sky-50/40"
          : "bg-gradient-to-b from-pink-50/40 via-white to-rose-50/30"
      } px-4 select-none transition-all duration-500 overflow-hidden`}
      style={{ minHeight: "100vh" }}
      aria-label="Product Reveal"
    >
      {/* Background Grid Pattern with soft fading opacity toward corners */}
      <GridPattern size={32} className="opacity-40" />

      {/* Top Ambient Radial Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[32rem]"
        style={{
          background: `radial-gradient(60% 60% at 50% 0%, ${brandColor}22, transparent)`,
        }}
      />

      <div className="relative flex flex-col items-center justify-center text-center max-w-sm mx-auto z-10">
        {/* Soft Center Background Aura */}
        <div
          className="absolute -z-10 h-64 w-64 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ backgroundColor: brandColor }}
        />

        {/* Product Image Reveal Container */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="relative h-48 w-48 transition-transform duration-700 ease-out transform hover:scale-105">
            <Image
              src={productImage}
              alt={brandName}
              fill
              sizes="192px"
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Brand Logo / Header */}
        <div className="mb-3 flex flex-col items-center">
          {isMilkimom ? (
            <div className="relative h-10 w-36 mb-1">
              <Image
                src="/images/logo.webp"
                alt="Milkimom Logo"
                fill
                sizes="144px"
                className="object-contain"
                priority
              />
            </div>
          ) : isMilkready ? (
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              <span style={{ color: brandColor }}>Milk</span>Ready™
            </h1>
          ) : (
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              <span style={{ color: brandColor }}>Smooth</span>Flow™
            </h1>
          )}
        </div>

        {/* Quality / Safety Badge */}
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm border"
          style={{
            backgroundColor: isMilkimom ? "#fff5f8" : isMilkready ? "#f0f9ff" : "#fff0f6",
            borderColor: `${brandColor}33`,
            color: brandColor,
          }}
        >
          <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: brandColor }} />
          <span>{badgeText}</span>
        </div>
      </div>
    </div>
  );
}
