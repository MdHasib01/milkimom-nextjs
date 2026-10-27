import type { Metadata } from "next";
import { LandingPageThemeProvider } from "@/components/landing-page-theme-provider";
import { LandingPageContentProvider } from "@/components/landing-page-content-provider";
import { MilkimomHero } from "@/components/milkimom/milkimom-hero";
import { MilkimomImagine } from "@/components/milkimom/milkimom-imagine";
import { MilkimomBenefits } from "@/components/milkimom/milkimom-benefits";
import { MilkimomReviews } from "@/components/milkimom/milkimom-reviews";
import { MilkimomCertifications } from "@/components/milkimom/milkimom-certifications";
import { MilkimomFaq } from "@/components/milkimom/milkimom-faq";
import { MilkimomComparison } from "@/components/milkimom/milkimom-comparison";
import { MilkimomEmotional } from "@/components/milkimom/milkimom-emotional";
import { MilkimomGuarantee } from "@/components/milkimom/milkimom-guarantee";
import { MilkimomPricing } from "@/components/milkimom/milkimom-pricing";
import { MilkimomOrder } from "@/components/milkimom/milkimom-order";
import { MilkimomStickyCTA } from "@/components/milkimom/milkimom-sticky-cta";
import { SiteFooter } from "@/components/site-footer";
import { FloatingActions } from "@/components/floating-actions";
import { OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে! | Milkimom™",
  description:
    "মিল্কিমম খেলে মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে, এবং ব্রেস্ট ফিডিং এর শেষ পর্যন্ত স্থায়ী হয়। এটি সম্পূর্ণ সাইডইফেক্ট মুক্ত ও ন্যাচারাল।",
  alternates: {
    canonical: "https://www.milkimom.com/milkimom",
  },
  openGraph: {
    title: "১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে! | Milkimom™",
    description:
      "মিল্কিমম খেলে মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে, এবং ব্রেস্ট ফিডিং এর শেষ পর্যন্ত স্থায়ী হয়। এটি সম্পূর্ণ সাইডইফেক্ট মুক্ত ও ন্যাচারাল।",
    url: "https://www.milkimom.com/milkimom",
    siteName: "Milkimom™",
    images: [OG_IMAGE],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে! | Milkimom™",
    description:
      "মিল্কিমম খেলে মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে, এবং ব্রেস্ট ফিডিং এর শেষ পর্যন্ত স্থায়ী হয়। এটি সম্পূর্ণ সাইডইফেক্ট মুক্ত ও ন্যাচারাল।",
    images: [OG_IMAGE.url],
  },
};

export default function MilkimomModernLandingPage() {
  return (
    <LandingPageThemeProvider productSlug="milkimom">
      <LandingPageContentProvider productSlug="milkimom" showLoader={true}>
        <div className="relative min-h-screen w-full max-w-full overflow-x-hidden">
          <MilkimomHero />
          <main className="w-full max-w-full overflow-x-hidden">
            <MilkimomImagine />
            <MilkimomBenefits />
            <MilkimomReviews />
            <MilkimomCertifications />
            <MilkimomFaq />
            <MilkimomComparison />
            <MilkimomEmotional />
            <MilkimomGuarantee />
            <MilkimomPricing />
            <MilkimomOrder />
          </main>
          <SiteFooter />
          <MilkimomStickyCTA />
          <FloatingActions />
        </div>
      </LandingPageContentProvider>
    </LandingPageThemeProvider>
  );
}
