"use client";

import { Float, Reveal } from "@/components/motion/reveal";
import { RotatingOrbit } from "@/components/rotating-orbit";
import { useLandingPageContent } from "@/components/landing-page-content-provider";

const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const RADIUS_X = 42;
const RADIUS_Y = 36;

function polarPosition(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const x = 50 + RADIUS_X * Math.cos(angle);
  const y = 50 + RADIUS_Y * Math.sin(angle);
  return { left: `${x}%`, top: `${y}%` };
}

function toBengaliNumber(num: number): string {
  return num.toString().replace(/\d/g, (d) => bengaliDigits[parseInt(d)] || d);
}

const defaultBenefits = [
  { accent: "Breast Pain", rest: "থেকে মুক্তি দেয়" },
  { accent: "শক্ত/চাকা-চাকা অনুভূতি", rest: "থেকে মুক্তি দেয়" },
  { accent: "Breast Pressure", rest: "কমায়" },
  { accent: "Clogged Duct", rest: "থেকে মুক্তি দেয়" },
  { accent: "Feeding-এর পরও", rest: "রিলিফ আসে" },
];

export function SmoothflowBenefits() {
  const { content, getImageUrl, replaceBrandName } = useLandingPageContent();
  const title = content.howItWorksTitle || "SmoothFlow-এর ৫টি উপকারিতা";

  const rawImg = content.howItWorksImage && content.howItWorksImage.trim()
    ? content.howItWorksImage
    : "/images/smoothflow.png";
  const jarImg = getImageUrl(rawImg, "/images/smoothflow.png");

  const benefitsList = Array.isArray(content.benefitsItems) && content.benefitsItems.length > 0 && content.benefitsItems[0]?.accent !== "বুকের দুধ"
    ? content.benefitsItems
    : defaultBenefits;

  return (
    <section className="pt-2 pb-0 md:pt-4 md:pb-0 mb-0 relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand leading-tight">
            {title}
          </h2>
        </div>

        {/* Radial orbit layout matching Milkimom design with Bengali number badges */}
        <div className="relative mx-auto mt-2 aspect-square w-full max-w-[420px] sm:mt-4 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <RotatingOrbit />
          <div className="absolute inset-0 flex items-center justify-center">
            <Float distance={8} duration={3.5}>
              <img
                src={jarImg}
                alt={content.productNameEn || "SmoothFlow"}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/smoothflow.png";
                }}
                className="h-28 w-auto object-contain drop-shadow-2xl sm:h-44 md:h-[228px] lg:h-64 xl:h-[300px]"
              />
            </Float>
          </div>

          {benefitsList.map((benefit: any, index: number) => {
            const accentText = benefit.accent !== undefined ? benefit.accent : defaultBenefits[index]?.accent || "";
            const restText = benefit.rest !== undefined ? benefit.rest : defaultBenefits[index]?.rest || "";

            const position = polarPosition(index, benefitsList.length);

            return (
              <div
                key={index}
                style={position}
                className="absolute w-28 -translate-x-1/2 -translate-y-1/2 sm:w-40 md:w-44 lg:w-48 xl:w-56"
              >
                <Reveal delay={0.1 * index} y={12}>
                  <div className="flex flex-col items-center gap-1 rounded-xl border border-brand/20 bg-white p-2 text-center shadow-md sm:gap-2 sm:rounded-2xl sm:p-3 hover:border-brand/40 transition-colors">
                    <span className="flex size-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white sm:size-9 sm:text-sm md:size-10 md:text-base shadow-sm">
                      {toBengaliNumber(index + 1)}
                    </span>
                    <p className="text-[11px] leading-tight sm:text-sm sm:leading-snug md:text-base lg:text-lg">
                      <span className="font-bold text-brand">{replaceBrandName(accentText)}</span>{" "}
                      <span className="font-normal text-[#1A1A1A]">{replaceBrandName(restText)}</span>
                    </p>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
