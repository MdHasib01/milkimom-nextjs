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
import { config } from "@/config";
import { siteConfig } from "@/lib/content";
import { OG_IMAGE, SEO_DESCRIPTION } from "@/lib/seo";

// Structured data is what Google reads to pick the thumbnail and summary for
// the search result. Invisible to visitors.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: siteConfig.name,
      alternateName: siteConfig.nameEn,
      url: config.siteUrl,
    },
    {
      "@type": "Product",
      name: `${siteConfig.name}™`,
      alternateName: siteConfig.nameEn,
      description: SEO_DESCRIPTION,
      image: [`${config.siteUrl}${OG_IMAGE.url}`, `${config.siteUrl}/images/product-jar.webp`],
      brand: { "@type": "Brand", name: siteConfig.nameEn },
      offers: {
        "@type": "Offer",
        url: config.siteUrl,
        price: config.pricing.salePrice,
        priceCurrency: "BDT",
        availability: "https://schema.org/InStock",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      {/* Outside the content provider: while it shows the loader, the server
          HTML contains none of its children, and this has to be in that HTML. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
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
    </>
  );
}
