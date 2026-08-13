"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { API_ENDPOINTS, API_BASE_URL } from "@/lib/api-config";
import { LandingPageLoader } from "@/components/landing-page-loader";

import { type CarouselItemData, type DoctorItemData, type BenefitItemData } from "@/lib/admin-api";

export interface LandingPageSectionContent {
  productSlug: string;
  productName: string;
  productNameEn: string;
  logoType?: "image" | "text";
  logoImage?: string;
  announcementText: string;
  heroBadge: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroSubtitleHighlight: string;
  heroCtaText: string;
  heroImage: string;
  doctorTitle: string;
  doctorName: string;
  doctorDegree: string;
  doctorQuote: string;
  doctorImage: string;
  orderHeadline: string;
  orderSubheadline: string;
  guaranteeTitle: string;
  guaranteeText: string;
  footerText: string;
  footerPhone: string;
  footerEmail: string;
  footerAddress: string;
  howItWorksBadge?: string;
  howItWorksTitle?: string;
  howItWorksSubtitle?: string;
  howItWorksImage?: string;
  benefitsItems?: BenefitItemData[];
  carouselItems?: CarouselItemData[];
  doctorItems?: DoctorItemData[];
}

const DEFAULT_CAROUSEL_ITEMS: CarouselItemData[] = [
  {
    id: "1",
    title: "মা ও শিশুর যত্নে একটুও ছাড় নয়!",
    description: "বিশেষজ্ঞ ডাক্তারের পরামর্শ ও ১০০% সঠিক পুষ্টিতে আপনার শিশুর সুস্থ বিকাশ নিশ্চিত করুন।",
    tag: "ডাক্তারের পরামর্শ",
    image: "/assets/carousel/doctor.webp",
    imageMobile: "/assets/carousel/doctor.webp",
    imageSide: "left",
    sortOrder: 1,
  },
  {
    id: "2",
    title: "মা ও শিশুর যত্নে একটুও ছাড় নয়!",
    description: "১০০% প্রাকৃতিক উপাদান সমৃদ্ধ যা মায়ের বুকের দুধ বাড়াতে শতভাগ কার্যকর।",
    tag: "প্রাকৃতিক সুরক্ষা",
    image: "/assets/carousel/pic2.webp",
    imageMobile: "/assets/carousel/pic2.webp",
    imageSide: "right",
    sortOrder: 2,
  },
  {
    id: "3",
    title: "মা ও শিশুর যত্নে একটুও ছাড় নয়!",
    description: "মায়েদের বিশ্বস্ততা ও শিশুর সঠিক পুষ্টির সাথে গড়ে উঠুক সুন্দর ভবিষ্যৎ।",
    tag: "বিশ্বস্ত পছন্দ",
    image: "/assets/carousel/pic3.webp",
    imageMobile: "/assets/carousel/pic3.webp",
    imageSide: "left",
    sortOrder: 3,
  },
];

const DEFAULT_DOCTOR_ITEMS: DoctorItemData[] = [
  {
    id: "saddam",
    name: "ডা. মোঃ সাদ্দাম",
    degree: "এমবিবিএস, এফসিপিএস",
    title: "",
    subtitle: "চিকিৎসকের তত্ত্বাবধানে তৈরি ফর্মুলা",
    description: "মিল্কিমম তৈরি হয়েছে গভর্নমেন্ট রেজিস্টার্ড চিকিৎসকদের তত্ত্বাবধানে, ৪৮০০+ বছরের প্রাচীন আয়ুর্বেদিক জ্ঞান ও আধুনিক বিজ্ঞানের গবেষণার সমন্বয়ে। প্রতিটি ব্যাচ ল্যাব টেস্টেড ও BSTI সার্টিফাইড, যাতে মা ও শিশু উভয়ের জন্যই এটি সম্পূর্ণ নিরাপদ থাকে।",
    image: "/assets/doctors/saddam.webp",
    sortOrder: 1,
  },
  {
    id: "nazmul",
    name: "ডা. মোঃ নাজমুল",
    degree: "এমবিবিএস, ডিজিইউ",
    title: "",
    subtitle: "চিকিৎসকের তত্ত্বাবধানে তৈরি ফর্মুলা",
    description: "মিল্কিমম তৈরি হয়েছে গভর্নমেন্ট রেজিস্টার্ড চিকিৎসকদের তত্ত্বাবধানে, ৪৮০০+ বছরের প্রাচীন আয়ুর্বেদিক জ্ঞান ও আধুনিক বিজ্ঞানের গবেষণার সমন্বয়ে। প্রতিটি ব্যাচ ল্যাব টেস্টেড ও BSTI সার্টিফাইড, যাতে মা ও শিশু উভয়ের জন্যই এটি সম্পূর্ণ নিরাপদ থাকে।",
    image: "/assets/doctors/nazmul.webp",
    sortOrder: 2,
  },
];

const DEFAULT_BENEFITS_MILKIMOM: BenefitItemData[] = [
  { id: "1", accent: "বুকের দুধ", rest: "স্থায়ীভাবে বাড়ায়", sortOrder: 1 },
  { id: "2", accent: "বন্ধ হয়ে যাওয়া", rest: "বুকের দুধ পুনরায় তৈরি করে", sortOrder: 2 },
  { id: "3", accent: "বুকের দুধের", rest: "সব পুষ্টিগুণ বজায় রাখে", sortOrder: 3 },
  { id: "4", accent: "বুকের দুধ", rest: "পাতলা হলে ঘন করে", sortOrder: 4 },
  { id: "5", accent: "ফর্মুলা দুধের", rest: "খরচ বাঁচায়", sortOrder: 5 },
];

const DEFAULT_BENEFITS_SMOOTHFLOW: BenefitItemData[] = [
  { id: "1", accent: "Breast Pain", rest: "থেকে মুক্তি দেয়", sortOrder: 1 },
  { id: "2", accent: "শক্ত/চাকা-চাকা অনুভূতি", rest: "থেকে মুক্তি দেয়", sortOrder: 2 },
  { id: "3", accent: "Breast Pressure", rest: "কমায়", sortOrder: 3 },
  { id: "4", accent: "Clogged Duct", rest: "থেকে মুক্তি দেয়", sortOrder: 4 },
  { id: "5", accent: "Feeding-এর পরও", rest: "রিলিফ আসে", sortOrder: 5 },
];

const DEFAULT_BENEFITS_MILKREADY: BenefitItemData[] = [
  { id: "1", accent: "Breastfeeding Preparation", rest: "নিশ্চিত করে", sortOrder: 1 },
  { id: "2", accent: "Maternal Nutrition Support", rest: "দেয়", sortOrder: 2 },
  { id: "3", accent: "Breast Tissue Support", rest: "দেয়", sortOrder: 3 },
  { id: "4", accent: "Milk Duct Preparation", rest: "প্রস্তুত করে", sortOrder: 4 },
  { id: "5", accent: "Post-Delivery Feeding Readiness", rest: "নিশ্চিত করে", sortOrder: 5 },
];

const DEFAULT_SECTION_CONTENTS: Record<string, LandingPageSectionContent> = {
  milkimom: {
    productSlug: "milkimom",
    productName: "মিল্কিমম",
    productNameEn: "Milkimom",
    logoType: "image",
    logoImage: "/images/logo.webp",
    announcementText: "🎉 ১ম অর্ডারেই ১০০% ক্যাশ অন ডেলিভারি এবং সারাদেশে হোম ডেলিভারি ফ্রি!",
    heroBadge: "১০০% সাইডইফেক্ট মুক্ত ও ন্যাচারাল",
    heroTitle: "১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে!",
    heroTitleHighlight: "মিল্কিমম",
    heroSubtitle: "মিল্কিমম খেলে মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে, এবং ব্রেস্ট ফিডিং এর শেষ পর্যন্ত স্থায়ী হয়। এটি সম্পূর্ণ সাইডইফেক্ট মুক্ত ও ন্যাচারাল।",
    heroSubtitleHighlight: "মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে",
    heroCtaText: "অর্ডার করতে এখানে ক্লিক করুন",
    heroImage: "/images/product-jar.webp",
    doctorTitle: "বিশেষজ্ঞ ডাক্তারের পরামর্শ",
    doctorName: "ডাঃ তানজিলা রহমান",
    doctorDegree: "এমবিবিএস, এফসিপিএস",
    doctorQuote: "মায়ের বুকের দুধ নবজাতকের জন্য সর্বোত্তম পুষ্টি। মিল্কিমম সম্পূর্ণ প্রাকৃতিক উপাদানে তৈরি যা নিরাপদভাবে দুধ উৎপাদনে কার্যকর সাহায্য করে।",
    doctorImage: "/assets/doctor/doctor.png",
    orderHeadline: "আজই অর্ডার করুন মিল্কিমম™",
    orderSubheadline: "নিচে আপনার তথ্য দিয়ে অর্ডার সম্পন্ন করুন",
    guaranteeTitle: "১০০% স্যাটিসফ্যাকশন ও মানি-ব্যাক গ্যারান্টি",
    guaranteeText: "পণ্য হাতে পেয়ে পুরোপুরি সন্তুষ্ট না হলে বা কোনো সমস্যা থাকলে আমাদের সাপোর্ট টিমের সাথে সাথে যোগাযোগ করুন।",
    footerText: "মিল্কিমম™ - মা ও শিশুর সুস্থতায় প্রতিদিনের নির্ভরযোগ্য প্রাকৃতিক সমাধান।",
    footerPhone: "01517-102603",
    footerEmail: "milkimominfo@gmail.com",
    footerAddress: "202-J, Road-6, Mohammadiya Housing society, Mohammadpur, Dhaka.",
    howItWorksBadge: "কি কাজ করে?",
    howItWorksTitle: "একটি ডোজে ৫টি উপকারিতা",
    howItWorksSubtitle: "প্রকৃতি ও বিজ্ঞানের সমন্বয়ে তৈরি মিল্কিমম মা ও শিশু উভয়ের জন্যই সামগ্রিক উপকার নিয়ে আসে।",
    howItWorksImage: "",
    benefitsItems: DEFAULT_BENEFITS_MILKIMOM,
    carouselItems: DEFAULT_CAROUSEL_ITEMS,
    doctorItems: DEFAULT_DOCTOR_ITEMS,
  },
  smoothflow: {
    productSlug: "smoothflow",
    productName: "SmoothFlow",
    productNameEn: "SmoothFlow",
    logoType: "text",
    logoImage: "/images/logo.webp",
    announcementText: "42% Offer শেষ হতে বাকি",
    heroBadge: "১০০% সাইডইফেক্ট মুক্ত ও সেফ ফর্মুলা",
    heroTitle: "বাচ্চাকে দুধ খাওয়াতে গেলেই বুকের ব্যথা? মাত্র ২৪ ঘন্টায় মুক্তি পান।",
    heroTitleHighlight: "মাত্র ২৪ ঘন্টায় মুক্তি পান।",
    heroSubtitle: "বুকের এক পাশে শক্ত চাকার মতো অনুভূতি, চাপ, Tenderness, আর Feed করানোর সময় অস্বস্তি—এগুলো সবই Clogged-Duct Related।",
    heroSubtitleHighlight: "Clogged-Duct Related",
    heroCtaText: "SmoothFlow অর্ডার করতে এখানে ক্লিক করুন",
    heroImage: "/images/product-jar.webp",
    doctorTitle: "বিশ্বাস রাখার কারণসমূহ",
    doctorName: "Dr. Sarah Ahmed",
    doctorDegree: "MBBS, FCPS",
    doctorQuote: "SmoothFlow is formulated with safe, clinically proven ingredients that gently help relieve clogged ducts and breast tenderness.",
    doctorImage: "/assets/doctor/doctor.png",
    orderHeadline: "SmoothFlow অর্ডার করুন",
    orderSubheadline: "Breast Pain নিয়ে আরেকটা Feeding-এর জন্য অপেক্ষা নয়।",
    guaranteeTitle: "৩ দিনের Money Back Guarantee",
    guaranteeText: "যদি SmoothFlow ব্যবহার করে আপনি কোনো পরিবর্তন অনুভব না করেন, আমাদের জানান। আমরা আপনার সম্পূর্ণ টাকা রিফান্ড করে দেব। কোনো শর্ত প্রযোজ্য নয়।",
    footerText: "SmoothFlow™ - মা ও সন্তানের স্বাস্থ্য সুরক্ষায় বিশ্বস্ত পার্টনার।",
    footerPhone: "01517-102603",
    footerEmail: "milkimominfo@gmail.com",
    footerAddress: "202-J, Road-6, Mohammadiya Housing society, Mohammadpur, Dhaka.",
    howItWorksBadge: "কি কাজ করে?",
    howItWorksTitle: "SmoothFlow-এর ৫টি উপকারিতা",
    howItWorksSubtitle: "প্রকৃতি ও বিজ্ঞানের সমন্বয়ে তৈরি SmoothFlow মা ও শিশু উভয়ের জন্যই সামগ্রিক উপকার নিয়ে আসে।",
    howItWorksImage: "/images/smoothflow.png",
    benefitsItems: DEFAULT_BENEFITS_SMOOTHFLOW,
    carouselItems: DEFAULT_CAROUSEL_ITEMS,
    doctorItems: DEFAULT_DOCTOR_ITEMS,
  },
  milkready: {
    productSlug: "milkready",
    productName: "MilkReady",
    productNameEn: "MilkReady",
    logoType: "text",
    logoImage: "/images/logo.webp",
    announcementText: "40% Offer শেষ হতে বাকি",
    heroBadge: "ডেলিভারি পূর্ববর্তী প্রস্তুতি",
    heroTitle: "ডেলিভারির পর বুকের দুধ না হওয়ার ভয়? প্রস্তুতি নিন আগেই।",
    heroTitleHighlight: "প্রস্তুতি নিন আগেই।",
    heroSubtitle: "Delivery-এর আগের শেষ ৩ মাসের মধ্যে ১ ডোজ MilkReady—ডেলিভারি এর পরে বুকের দুধ নিশ্চিত করে",
    heroSubtitleHighlight: "১ ডোজ MilkReady",
    heroCtaText: "MilkReady অর্ডার করতে ক্লিক করুন",
    heroImage: "/images/milkready/product-jar.png",
    doctorTitle: "বিশ্বাস রাখার কারণসমূহ",
    doctorName: "Dr. Farhana",
    doctorDegree: "MBBS, FCPS (OBGYN)",
    doctorQuote: "Excellent prenatal choice for lactation prep.",
    doctorImage: "/assets/doctor/doctor.png",
    orderHeadline: "MilkReady অর্ডার করুন",
    orderSubheadline: "Delivery-এর আগেই Breastfeeding Preparation শুরু করুন।",
    guaranteeTitle: "৩ দিনের Money Back Guarantee",
    guaranteeText: "MilkReady ব্যবহার করে কোনো পরিবর্তন অনুভব না করলে আমাদের জানান। আমাদের Guarantee Policy অনুযায়ী আপনার সম্পূর্ণ টাকা রিফান্ড করে দেওয়া হবে।",
    footerText: "MilkReady™ - Delivery-এর আগের সুনির্দিষ্ট প্রেটাল প্রিপারেশন।",
    footerPhone: "01517-102603",
    footerEmail: "milkimominfo@gmail.com",
    footerAddress: "202-J, Road-6, Mohammadiya Housing society, Mohammadpur, Dhaka.",
    howItWorksBadge: "উপকারিতা",
    howItWorksTitle: "MilkReady এর উপকারিতা",
    howItWorksSubtitle: "Delivery-এর আগেই মা ও শিশুর সুস্বাস্থ্যে MilkReady নিয়ে আসে পূর্ণ প্রস্তুতি।",
    howItWorksImage: "/images/milkready/product-jar.png",
    benefitsItems: DEFAULT_BENEFITS_MILKREADY,
    carouselItems: DEFAULT_CAROUSEL_ITEMS,
    doctorItems: DEFAULT_DOCTOR_ITEMS,
  },
};

const LandingPageContentContext = createContext<{
  content: LandingPageSectionContent;
  getImageUrl: (url?: string, fallbackUrl?: string) => string;
  replaceBrandName: (text: string) => string;
  isLoading: boolean;
}>({
  content: DEFAULT_SECTION_CONTENTS.milkimom,
  getImageUrl: (url?: string, fallbackUrl: string = "/images/product-jar.webp") => url || fallbackUrl,
  replaceBrandName: (text: string) => text,
  isLoading: false,
});

export function LandingPageContentProvider({
  productSlug = "milkimom",
  overrideContent,
  showLoader = true,
  children,
}: {
  productSlug?: string;
  overrideContent?: LandingPageSectionContent;
  showLoader?: boolean;
  children: React.ReactNode;
}) {
  const initialContent = overrideContent || DEFAULT_SECTION_CONTENTS[productSlug] || DEFAULT_SECTION_CONTENTS.milkimom;
  const isSmoothflow = productSlug === "smoothflow";
  const [content, setContent] = useState<LandingPageSectionContent>(initialContent);
  const [isLoading, setIsLoading] = useState<boolean>(!overrideContent && showLoader);

  useEffect(() => {
    if (overrideContent || !showLoader) {
      if (overrideContent) setContent(overrideContent);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let timerId: NodeJS.Timeout | null = null;

    async function fetchContent() {
      const startTime = Date.now();
      
      const timeoutPromise = new Promise<{ isTimeout: boolean }>((resolve) => {
        timerId = setTimeout(() => {
          resolve({ isTimeout: true });
        }, 3000);
      });

      try {
        const fetchPromise = fetch(API_ENDPOINTS.customizationPublicContent(productSlug));
        const res = await Promise.race([fetchPromise, timeoutPromise]);

        if ("isTimeout" in res && res.isTimeout) {
          console.warn(`[ContentProvider] Content fetch timed out for ${productSlug}, using default fallback.`);
        } else if ("ok" in res && res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setContent({
              productSlug: json.data.productSlug || productSlug,
              productName: json.data.productName || initialContent.productName,
              productNameEn: json.data.productNameEn || initialContent.productNameEn,
              logoType: json.data.logoType || initialContent.logoType,
              logoImage: json.data.logoImage || initialContent.logoImage,
              announcementText:
                isSmoothflow && (!json.data.announcementText || json.data.announcementText.includes("৩৯%") || json.data.announcementText.includes("--"))
                  ? "42% Offer শেষ হতে বাকি"
                  : json.data.announcementText || initialContent.announcementText,
              heroBadge: json.data.heroBadge || initialContent.heroBadge,
              heroTitle: json.data.heroTitle || initialContent.heroTitle,
              heroTitleHighlight: json.data.heroTitleHighlight !== undefined ? json.data.heroTitleHighlight : initialContent.heroTitleHighlight,
              heroSubtitle: json.data.heroSubtitle || initialContent.heroSubtitle,
              heroSubtitleHighlight: json.data.heroSubtitleHighlight !== undefined ? json.data.heroSubtitleHighlight : initialContent.heroSubtitleHighlight,
              heroCtaText: json.data.heroCtaText || initialContent.heroCtaText,
              heroImage: json.data.heroImage || initialContent.heroImage,
              doctorTitle: json.data.doctorTitle || initialContent.doctorTitle,
              doctorName: json.data.doctorName || initialContent.doctorName,
              doctorDegree: json.data.doctorDegree || initialContent.doctorDegree,
              doctorQuote: json.data.doctorQuote || initialContent.doctorQuote,
              doctorImage: json.data.doctorImage || initialContent.doctorImage,
              orderHeadline: json.data.orderHeadline || initialContent.orderHeadline,
              orderSubheadline: json.data.orderSubheadline || initialContent.orderSubheadline,
              guaranteeTitle:
                isSmoothflow && (!json.data.guaranteeTitle || json.data.guaranteeTitle === "100% Satisfaction Guarantee" || json.data.guaranteeTitle.includes("১০০%"))
                  ? "৩ দিনের Money Back Guarantee"
                  : json.data.guaranteeTitle || initialContent.guaranteeTitle,
              guaranteeText:
                isSmoothflow && (!json.data.guaranteeText || json.data.guaranteeText.includes("পণ্য হাতে পেয়ে"))
                  ? "যদি SmoothFlow ব্যবহার করে আপনি কোনো পরিবর্তন অনুভব না করেন, আমাদের জানান। আমরা আপনার সম্পূর্ণ টাকা রিফান্ড করে দেব। কোনো শর্ত প্রযোজ্য নয়।"
                  : json.data.guaranteeText || initialContent.guaranteeText,
              footerText: json.data.footerText || initialContent.footerText,
              footerPhone: json.data.footerPhone || initialContent.footerPhone,
              footerEmail: json.data.footerEmail || initialContent.footerEmail,
              footerAddress: json.data.footerAddress || initialContent.footerAddress,
              howItWorksBadge: json.data.howItWorksBadge || initialContent.howItWorksBadge,
              howItWorksTitle: json.data.howItWorksTitle || initialContent.howItWorksTitle,
              howItWorksSubtitle: json.data.howItWorksSubtitle || initialContent.howItWorksSubtitle,
              howItWorksImage: json.data.howItWorksImage || initialContent.howItWorksImage,
              benefitsItems: Array.isArray(json.data.benefitsItems) && json.data.benefitsItems.length > 0
                ? json.data.benefitsItems
                : initialContent.benefitsItems,
              carouselItems: Array.isArray(json.data.carouselItems) && json.data.carouselItems.length > 0
                ? json.data.carouselItems
                : initialContent.carouselItems,
              doctorItems: Array.isArray(json.data.doctorItems) && json.data.doctorItems.length > 0
                ? json.data.doctorItems
                : initialContent.doctorItems,
            });
          }
        }
      } catch (err) {
        console.warn(`[ContentProvider] Could not fetch content for ${productSlug}:`, err);
      } finally {
        if (timerId) clearTimeout(timerId);
        if (isMounted) {
          const elapsed = Date.now() - startTime;
          const minDelay = Math.max(0, 300 - elapsed);
          setTimeout(() => {
            if (isMounted) setIsLoading(false);
          }, minDelay);
        }
      }
    }

    fetchContent();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [productSlug, initialContent, overrideContent, showLoader]);

  function getImageUrl(url?: string, fallbackUrl: string = "/images/product-jar.webp"): string {
    if (!url || !url.trim()) return fallbackUrl;
    const trimmed = url.trim();
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("data:")
    ) {
      return trimmed;
    }
    if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
      const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
      const backendBase = API_BASE_URL || "http://localhost:5000";
      return `${backendBase}${cleanPath}`;
    }
    return trimmed;
  }

  function replaceBrandName(text: string): string {
    if (!text) return "";
    if (content.productSlug === "milkimom") return text;
    const targetBrand = content.productName || "SmoothFlow";
    return text.replace(/মিল্কিমম/g, targetBrand).replace(/Milkimom/g, content.productNameEn || "SmoothFlow");
  }

  return (
    <LandingPageContentContext.Provider value={{ content, getImageUrl, replaceBrandName, isLoading }}>
      {showLoader && isLoading ? (
        <LandingPageLoader productSlug={productSlug} />
      ) : (
        children
      )}
    </LandingPageContentContext.Provider>
  );
}

export function useLandingPageContent() {
  return useContext(LandingPageContentContext);
}

