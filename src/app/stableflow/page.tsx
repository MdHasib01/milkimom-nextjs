import type { Metadata } from "next";
import { LandingPageThemeProvider } from "@/components/landing-page-theme-provider";
import { LandingPageContentProvider } from "@/components/landing-page-content-provider";
import { StableflowHero } from "@/components/stableflow/stableflow-hero";
import { StableflowImagine } from "@/components/stableflow/stableflow-imagine";
import { StableflowBenefits } from "@/components/stableflow/stableflow-benefits";
import { StableflowReviews } from "@/components/stableflow/stableflow-reviews";
import { StableflowCertifications } from "@/components/stableflow/stableflow-certifications";
import { StableflowFaq } from "@/components/stableflow/stableflow-faq";
import { StableflowComparison } from "@/components/stableflow/stableflow-comparison";
import { StableflowEmotional } from "@/components/stableflow/stableflow-emotional";
import { StableflowPricing } from "@/components/stableflow/stableflow-pricing";
import { StableflowGuarantee } from "@/components/stableflow/stableflow-guarantee";
import { StableflowOrder } from "@/components/stableflow/stableflow-order";
import { StableflowStickyCTA } from "@/components/stableflow/stableflow-sticky-cta";
import { SiteFooter } from "@/components/site-footer";
import { FloatingActions } from "@/components/floating-actions";

export const metadata: Metadata = {
  title: "বাচ্চাকে দুধ খাওয়াতে গেলেই বুকের ব্যথা? মাত্র ২৪ ঘন্টায় মুক্তি পান | SmoothFlow™",
  description:
    "বুকের শক্ত চাকার মতো অনুভূতি, চাপ, tenderness, আর Feed করানোর সময় অস্বস্তি থেকে মাত্র ২৪ ঘন্টায় স্বস্তি পান SmoothFlow™ দিয়ে।",
  openGraph: {
    title: "বাচ্চাকে দুধ খাওয়াতে গেলেই বুকের ব্যথা? মাত্র ২৪ ঘন্টায় মুক্তি পান | SmoothFlow™",
    description:
      "বুকের শক্ত চাকার মতো অনুভূতি, চাপ, tenderness, আর Feed করানোর সময় অস্বস্তি থেকে মাত্র ২৪ ঘন্টায় স্বস্তি পান SmoothFlow™ দিয়ে।",
    siteName: "SmoothFlow™",
    locale: "bn_BD",
    type: "website",
  },
};

export default function StableflowLandingPage() {
  return (
    <LandingPageThemeProvider productSlug="stableflow">
      <LandingPageContentProvider productSlug="stableflow">
        <div className="relative min-h-screen w-full max-w-full overflow-x-clip bg-white">
          <StableflowHero />
          <main>
            <StableflowImagine />
            <StableflowBenefits />
            <StableflowReviews />
            <StableflowCertifications />
            <StableflowFaq />
            <StableflowComparison />
            <StableflowEmotional />
            <StableflowPricing />
            <StableflowGuarantee />
            <StableflowOrder />
          </main>
          <SiteFooter />
          <StableflowStickyCTA />
          <FloatingActions />
        </div>
      </LandingPageContentProvider>
    </LandingPageThemeProvider>
  );
}
