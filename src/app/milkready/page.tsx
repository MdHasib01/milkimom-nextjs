import type { Metadata } from "next";
import { LandingPageThemeProvider } from "@/components/landing-page-theme-provider";
import { LandingPageContentProvider } from "@/components/landing-page-content-provider";
import { MilkreadyHero } from "@/components/milkready/milkready-hero";
import { MilkreadyImagine } from "@/components/milkready/milkready-imagine";
import { MilkreadyBenefits } from "@/components/milkready/milkready-benefits";
import { MilkreadyReviews } from "@/components/milkready/milkready-reviews";
import { MilkreadyCertifications } from "@/components/milkready/milkready-certifications";
import { MilkreadyFaq } from "@/components/milkready/milkready-faq";
import { MilkreadyComparison } from "@/components/milkready/milkready-comparison";
import { MilkreadyEmotional } from "@/components/milkready/milkready-emotional";
import { MilkreadyGuarantee } from "@/components/milkready/milkready-guarantee";
import { MilkreadyPricing } from "@/components/milkready/milkready-pricing";
import { MilkreadyOrder } from "@/components/milkready/milkready-order";
import { MilkreadyStickyCTA } from "@/components/milkready/milkready-sticky-cta";
import { SiteFooter } from "@/components/site-footer";
import { FloatingActions } from "@/components/floating-actions";

export const metadata: Metadata = {
  title: "ডেলিভারির পর বুকের দুধ না হওয়ার ভয়? প্রস্তুতি নিন আগেই | MilkReady™",
  description:
    "Delivery-এর আগের শেষ ৩ মাসের মধ্যে ১ ডোজ MilkReady—ডেলিভারি এর পরে বুকের দুধ নিশ্চিত করে।",
  openGraph: {
    title: "ডেলিভারির পর বুকের দুধ না হওয়ার ভয়? প্রস্তুতি নিন আগেই | MilkReady™",
    description:
      "Delivery-এর আগের শেষ ৩ মাসের মধ্যে ১ ডোজ MilkReady—ডেলিভারি এর পরে বুকের দুধ নিশ্চিত করে।",
    siteName: "MilkReady™",
    locale: "bn_BD",
    type: "website",
  },
};

export default function MilkReadyLandingPage() {
  return (
    <LandingPageThemeProvider productSlug="milkready">
      <LandingPageContentProvider productSlug="milkready" showLoader={true}>
        <div className="relative min-h-screen w-full max-w-full overflow-x-hidden">
          <MilkreadyHero />
          <main className="w-full max-w-full overflow-x-hidden">
            <MilkreadyImagine />
            <MilkreadyBenefits />
            <MilkreadyReviews />
            <MilkreadyCertifications />
            <MilkreadyFaq />
            <MilkreadyComparison />
            <MilkreadyEmotional />
            <MilkreadyGuarantee />
            <MilkreadyPricing />
            <MilkreadyOrder />
          </main>
          <SiteFooter />
          <MilkreadyStickyCTA />
          <FloatingActions />
        </div>
      </LandingPageContentProvider>
    </LandingPageThemeProvider>
  );
}
