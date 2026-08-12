import type { Metadata } from "next";
import { LandingPageThemeProvider } from "@/components/landing-page-theme-provider";
import { LandingPageContentProvider } from "@/components/landing-page-content-provider";
import { SmoothflowHero } from "@/components/smoothflow/smoothflow-hero";
import { SmoothflowImagine } from "@/components/smoothflow/smoothflow-imagine";
import { SmoothflowBenefits } from "@/components/smoothflow/smoothflow-benefits";
import { SmoothflowReviews } from "@/components/smoothflow/smoothflow-reviews";
import { SmoothflowCertifications } from "@/components/smoothflow/smoothflow-certifications";
import { SmoothflowFaq } from "@/components/smoothflow/smoothflow-faq";
import { SmoothflowComparison } from "@/components/smoothflow/smoothflow-comparison";
import { SmoothflowEmotional } from "@/components/smoothflow/smoothflow-emotional";
import { SmoothflowPricing } from "@/components/smoothflow/smoothflow-pricing";
import { SmoothflowGuarantee } from "@/components/smoothflow/smoothflow-guarantee";
import { SmoothflowOrder } from "@/components/smoothflow/smoothflow-order";
import { SmoothflowStickyCTA } from "@/components/smoothflow/smoothflow-sticky-cta";
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

export default function SmoothFlowLandingPage() {
  return (
    <LandingPageThemeProvider productSlug="smoothflow">
      <LandingPageContentProvider productSlug="smoothflow" showLoader={true}>
        <div className="relative min-h-screen w-full max-w-full overflow-x-hidden">
          <SmoothflowHero />
          <main className="w-full max-w-full overflow-x-hidden">
            <SmoothflowImagine />
            <SmoothflowBenefits />
            <SmoothflowReviews />
            <SmoothflowCertifications />
            <SmoothflowFaq />
            <SmoothflowComparison />
            <SmoothflowEmotional />
            <SmoothflowGuarantee />
            <SmoothflowPricing />
            <SmoothflowOrder />
          </main>
          <SiteFooter />
          <SmoothflowStickyCTA />
          <FloatingActions />
        </div>
      </LandingPageContentProvider>
    </LandingPageThemeProvider>
  );
}
