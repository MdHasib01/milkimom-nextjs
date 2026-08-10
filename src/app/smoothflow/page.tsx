import type { Metadata } from "next";
import { LandingPageThemeProvider } from "@/components/landing-page-theme-provider";
import { LandingPageContentProvider } from "@/components/landing-page-content-provider";
import { AnnouncementBar } from "@/components/announcement-bar";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { MotherVisionSection } from "@/components/mother-vision-section";
import { TrustBadgesBar } from "@/components/trust-badges";
import { HowItWorksSection } from "@/components/how-it-works";
import { SpecialtiesSection } from "@/components/specialties-section";
import { ComparisonSection } from "@/components/comparison-section";
import { DoctorSection } from "@/components/doctor-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { PainEmpathyBanner } from "@/components/pain-empathy-banner";
import { OrderSection } from "@/components/order-section";
import { GuaranteeSection } from "@/components/guarantee-section";
import { FaqSection } from "@/components/faq-section";
import { SiteFooter } from "@/components/site-footer";
import { StickyMobileBar } from "@/components/sticky-mobile-bar";
import { FloatingActions } from "@/components/floating-actions";

export const metadata: Metadata = {
  title: "বাচ্চাকে দুধ খাওয়াতে গেলেই বুকের ব্যথা? মাত্র ২৪ ঘন্টায় মুক্তি পান | স্মুথফ্লো™",
  description:
    "বুকের শক্ত চাকার মতো অনুভূতি, চাপ, tenderness, আর Feed করানোর সময় অস্বস্তি থেকে মাত্র ২৪ ঘন্টায় স্বস্তি পান স্মুথফ্লো™ দিয়ে।",
  openGraph: {
    title: "বাচ্চাকে দুধ খাওয়াতে গেলেই বুকের ব্যথা? মাত্র ২৪ ঘন্টায় মুক্তি পান | স্মুথফ্লো™",
    description:
      "বুকের শক্ত চাকার মতো অনুভূতি, চাপ, tenderness, আর Feed করানোর সময় অস্বস্তি থেকে মাত্র ২৪ ঘন্টায় স্বস্তি পান স্মুথফ্লো™ দিয়ে।",
    siteName: "স্মুথফ্লো™",
    locale: "bn_BD",
    type: "website",
  },
};

export default function SmoothFlowLandingPage() {
  return (
    <LandingPageThemeProvider productSlug="smoothflow">
      <LandingPageContentProvider productSlug="smoothflow">
        <div className="relative min-h-screen w-full max-w-full overflow-x-clip">
          <AnnouncementBar />
          <SiteHeader />
          <main className="pb-24 sm:pb-0">
            <HeroSection />
            <MotherVisionSection />
            <TrustBadgesBar />
            <HowItWorksSection />
            <SpecialtiesSection />
            <ComparisonSection />
            <DoctorSection />
            <TestimonialsSection />
            <PainEmpathyBanner />
            <OrderSection />
            <FaqSection />
            <GuaranteeSection />
          </main>
          <SiteFooter />
          <StickyMobileBar />
          <FloatingActions />
        </div>
      </LandingPageContentProvider>
    </LandingPageThemeProvider>
  );
}
