import { AnnouncementBar } from "@/components/announcement-bar";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { TrustBadgesBar } from "@/components/trust-badges";
import { HowItWorksSection } from "@/components/how-it-works";
import { ComparisonSection } from "@/components/comparison-section";
import { DoctorSection } from "@/components/doctor-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { OrderSection } from "@/components/order-section";
import { FaqSection } from "@/components/faq-section";
import { SiteFooter } from "@/components/site-footer";
import { StickyMobileBar } from "@/components/sticky-mobile-bar";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden">
      <AnnouncementBar />
      <SiteHeader />
      <main className="pb-24 sm:pb-0">
        <HeroSection />
        <TrustBadgesBar />
        <HowItWorksSection />
        <ComparisonSection />
        <DoctorSection />
        <TestimonialsSection />
        <FaqSection />
        <OrderSection />
      </main>
      <SiteFooter />
      <StickyMobileBar />
      <WhatsAppButton />
    </div>
  );
}
