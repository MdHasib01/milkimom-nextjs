"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { API_ENDPOINTS, API_BASE_URL } from "@/lib/api-config";

import { type CarouselItemData, type DoctorItemData } from "@/lib/admin-api";

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
    degree: "এমবিবিএস, এফসিপিএস (গাইনি এন্ড অব্স)",
    title: "মেডিকেল বোর্ড অনুমোদিত",
    subtitle: "চিকিৎসকের তত্ত্বাবধানে তৈরি ফর্মুলা",
    description: "মিল্কিমম তৈরি হয়েছে গভর্নমেন্ট রেজিস্টার্ড চিকিৎসকদের তত্ত্বাবধানে, ৪৮০০+ বছরের প্রাচীন আয়ুর্বেদিক জ্ঞান ও আধুনিক বিজ্ঞানের গবেষণার সমন্বয়ে। প্রতিটি ব্যাচ ল্যাব টেস্টেড ও BSTI সার্টিফাইড, যাতে মা ও শিশু উভয়ের জন্যই এটি সম্পূর্ণ নিরাপদ থাকে।",
    image: "/assets/doctors/saddam.webp",
    sortOrder: 1,
  },
  {
    id: "nazmul",
    name: "ডা. মোঃ নাজমুল",
    degree: "এমবিবিএস, ডিজিইউ, শিশু ও মাতৃ পুষ্টি বিশেষজ্ঞ",
    title: "মেডিকেল বোর্ড অনুমোদিত",
    subtitle: "চিকিৎসকের তত্ত্বাবধানে তৈরি ফর্মুলা",
    description: "মিল্কিমম তৈরি হয়েছে গভর্নমেন্ট রেজিস্টার্ড চিকিৎসকদের তত্ত্বাবধানে, ৪৮০০+ বছরের প্রাচীন আয়ুর্বেদিক জ্ঞান ও আধুনিক বিজ্ঞানের গবেষণার সমন্বয়ে। প্রতিটি ব্যাচ ল্যাব টেস্টেড ও BSTI সার্টিফাইড, যাতে মা ও শিশু উভয়ের জন্যই এটি সম্পূর্ণ নিরাপদ থাকে।",
    image: "/assets/doctors/nazmul.webp",
    sortOrder: 2,
  },
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
    doctorDegree: "এমবিবিএস, এফসিপিএস (গাইনি এন্ড অব্স)",
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
    carouselItems: DEFAULT_CAROUSEL_ITEMS,
    doctorItems: DEFAULT_DOCTOR_ITEMS,
  },
  smoothflow: {
    productSlug: "smoothflow",
    productName: "স্মুথফ্লো",
    productNameEn: "SmoothFlow",
    logoType: "text",
    logoImage: "/images/logo.webp",
    announcementText: "⚡ স্মুথফ্লো বিশেষ অফার! সারাদেশে ফ্রি ডেলিভারি ও দ্রুত সার্ভিস!",
    heroBadge: "স্মুথফ্লো প্রিমিয়াম ন্যাচারাল ফর্মুলা",
    heroTitle: "স্মুথফ্লো - মা ও শিশুর পরিপূর্ণ পুষ্টির আধুনিক সমাধান!",
    heroTitleHighlight: "স্মুথফ্লো",
    heroSubtitle: "প্রাকৃতিক উপাদানের সমন্বয়ে তৈরি স্মুথফ্লো মা ও শিশুর জন্য নিয়ে এলো অতুলনীয় পুষ্টি সুরক্ষা ও স্থায়ী ফলাফল।",
    heroSubtitleHighlight: "অতুলনীয় পুষ্টি সুরক্ষা ও স্থায়ী ফলাফল",
    heroCtaText: "স্মুথফ্লো অর্ডার করতে ক্লিক করুন",
    heroImage: "/images/product-jar.webp",
    doctorTitle: "গাইনি ও নিউট্রিশন বিশেষজ্ঞ মত",
    doctorName: "ডাঃ ফারহানা ইসলাম",
    doctorDegree: "এমবিবিএস, ডিজিইউ, শিশু ও মাতৃ পুষ্টি বিশেষজ্ঞ",
    doctorQuote: "স্মুথফ্লোর ফর্মুলেশন আন্তর্জাতিক মান অনুযায়ী তৈরি, যা মায়েদের জন্য নিরাপদ এবং প্রতিদিনের কার্যকারিতায় প্রমাণিত।",
    doctorImage: "/assets/doctor/doctor.png",
    orderHeadline: "আজই স্মুথফ্লো™ অর্ডার করুন",
    orderSubheadline: "বিশেষ ছাড়ে এখনই আপনার ক্যাশ অন ডেলিভারি অর্ডার দিন",
    guaranteeTitle: "১০০% কোয়ালিটি নিশ্চিতকরণ গ্যারান্টি",
    guaranteeText: "আমাদের পণ্য সম্পূর্ণ পরীক্ষিত ও সার্টিফাইড। আমরা দিচ্ছি শতভাগ গুণগত মান ও সেবার নিশ্চয়তা।",
    footerText: "স্মুথফ্লো™ - মা ও সন্তানের স্বাস্থ্য সুরক্ষায় বিশ্বস্ত পার্টনার।",
    footerPhone: "01517-102603",
    footerEmail: "smoothflow@milkimom.com",
    footerAddress: "202-J, Road-6, Mohammadiya Housing society, Mohammadpur, Dhaka.",
    carouselItems: DEFAULT_CAROUSEL_ITEMS,
    doctorItems: DEFAULT_DOCTOR_ITEMS,
  },
};

const LandingPageContentContext = createContext<{
  content: LandingPageSectionContent;
  getImageUrl: (url?: string, fallbackUrl?: string) => string;
  replaceBrandName: (text: string) => string;
}>({
  content: DEFAULT_SECTION_CONTENTS.milkimom,
  getImageUrl: (url?: string, fallbackUrl: string = "/images/product-jar.webp") => url || fallbackUrl,
  replaceBrandName: (text: string) => text,
});

export function LandingPageContentProvider({
  productSlug = "milkimom",
  overrideContent,
  children,
}: {
  productSlug?: string;
  overrideContent?: LandingPageSectionContent;
  children: React.ReactNode;
}) {
  const initialContent = overrideContent || DEFAULT_SECTION_CONTENTS[productSlug] || DEFAULT_SECTION_CONTENTS.milkimom;
  const [content, setContent] = useState<LandingPageSectionContent>(initialContent);

  useEffect(() => {
    if (overrideContent) {
      setContent(overrideContent);
      return;
    }

    let isMounted = true;

    async function fetchContent() {
      try {
        const res = await fetch(API_ENDPOINTS.customizationPublicContent(productSlug));
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setContent({
              productSlug: json.data.productSlug || productSlug,
              productName: json.data.productName || initialContent.productName,
              productNameEn: json.data.productNameEn || initialContent.productNameEn,
              logoType: json.data.logoType || initialContent.logoType,
              logoImage: json.data.logoImage || initialContent.logoImage,
              announcementText: json.data.announcementText || initialContent.announcementText,
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
              guaranteeTitle: json.data.guaranteeTitle || initialContent.guaranteeTitle,
              guaranteeText: json.data.guaranteeText || initialContent.guaranteeText,
              footerText: json.data.footerText || initialContent.footerText,
              footerPhone: json.data.footerPhone || initialContent.footerPhone,
              footerEmail: json.data.footerEmail || initialContent.footerEmail,
              footerAddress: json.data.footerAddress || initialContent.footerAddress,
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
      }
    }

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, [productSlug, initialContent, overrideContent]);

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
    const targetBrand = content.productName || "স্মুথফ্লো";
    return text.replace(/মিল্কিমম/g, targetBrand).replace(/Milkimom/g, content.productNameEn || "SmoothFlow");
  }

  return (
    <LandingPageContentContext.Provider value={{ content, getImageUrl, replaceBrandName }}>
      {children}
    </LandingPageContentContext.Provider>
  );
}

export function useLandingPageContent() {
  return useContext(LandingPageContentContext);
}
