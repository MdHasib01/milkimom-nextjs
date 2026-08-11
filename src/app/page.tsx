import { LandingPageContentProvider } from "@/components/landing-page-content-provider";
import { AnnouncementBar } from "@/components/announcement-bar";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { TrustBadgesBar } from "@/components/trust-badges";
import { HowItWorksSection } from "@/components/how-it-works";
import { FlavorsSection } from "@/components/flavors-section";
import { SpecialtiesSection } from "@/components/specialties-section";
import { ComparisonSection } from "@/components/comparison-section";
import { DoctorSection } from "@/components/doctor-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { OrderSection } from "@/components/order-section";
import { GuaranteeSection } from "@/components/guarantee-section";
import { FaqSection } from "@/components/faq-section";
import { SiteFooter } from "@/components/site-footer";
import { StickyMobileBar } from "@/components/sticky-mobile-bar";
import { FloatingActions } from "@/components/floating-actions";

export default function Home() {
  return (
    <LandingPageContentProvider productSlug="milkimom" showLoader={true}>
      <div className="relative min-h-screen w-full max-w-full overflow-x-clip">
        <AnnouncementBar />
        <SiteHeader />
        <main className="pb-24 sm:pb-0">
          <HeroSection />
          <TrustBadgesBar />
          <HowItWorksSection />
          <SpecialtiesSection />
          <FlavorsSection />
          <ComparisonSection />
          <DoctorSection />
          <TestimonialsSection />
          <OrderSection />
          <FaqSection />
          <GuaranteeSection />
        </main>
        <SiteFooter />
        <StickyMobileBar />
        <FloatingActions />
      </div>
    </LandingPageContentProvider>
  );
}

