import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";
import { ClarityAnalytics } from "@/components/clarity-analytics";
import { AttributionCapture } from "@/components/attribution-capture";
import { MetaPixel } from "@/components/meta-pixel";
import { LandingPageThemeProvider } from "@/components/landing-page-theme-provider";
import { LandingPageContentProvider } from "@/components/landing-page-content-provider";
import "./globals.css";

/**
 * Hind Siliguri is a static family, so next/font emits one .woff2 per weight
 * per subset and preloads every weight of every listed subset — this was ten
 * font files racing the first paint.
 *
 * `weight`: 300 is gone because nothing renders `font-light`. 400/500/600/700
 * all map to utilities in use. (`font-extrabold` and `font-black` appear in the
 * markup but have no face in this family, so they already resolve to 700.)
 *
 * `subsets`: only `bengali` is listed, because that is all the page renders
 * above the fold. The latin and latin-ext @font-face rules are still emitted
 * and still used — dropping them from this list only drops their preload, so
 * the browser fetches them on demand via unicode-range instead of ahead of the
 * Bengali text a visitor actually sees first.
 */
const bodyFont = Hind_Siliguri({
  variable: "--font-sans",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// The site serves from www; pointing metadata at the apex sends every social
// crawler and ad-platform prefetch through a redirect hop first.
const SITE_URL = "https://www.milkimom.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  title: "১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে! | মিল্কিমম™",
  description:
    "মিল্কিমম খেলে মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে, এবং ব্রেস্ট ফিডিং এর শেষ পর্যন্ত স্থায়ী হয়। এটি সম্পূর্ণ সাইডইফেক্ট মুক্ত ও ন্যাচারাল।",
  // Purpose-built icons rather than the full 900x593 / 44KB logo.webp. The
  // browser fetched that logo four times per load — once per rel — for tab
  // artwork that renders at 16-32px.
  icons: {
    icon: "/images/icon-96.webp",
    shortcut: "/images/icon-96.webp",
    apple: "/images/apple-icon-180.png",
  },
  openGraph: {
    title: "১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে! | মিল্কিমম™",
    description:
      "মিল্কিমম খেলে মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে, এবং ব্রেস্ট ফিডিং এর শেষ পর্যন্ত স্থায়ী হয়। এটি সম্পূর্ণ সাইডইফেক্ট মুক্ত ও ন্যাচারাল।",
    url: SITE_URL,
    siteName: "মিল্কিমম™",
    images: [
      {
        url: "/images/product-jar.webp",
        width: 1200,
        height: 630,
        alt: "মিল্কিমম™ - ১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে!",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে! | মিল্কিমম™",
    description:
      "মিল্কিমম খেলে মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে, এবং ব্রেস্ট ফিডিং এর শেষ পর্যন্ত স্থায়ী হয়। এটি সম্পূর্ণ সাইডইফেক্ট মুক্ত ও ন্যাচারাল।",
    images: ["/images/product-jar.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#BD0052",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Browser extensions (Grammarly, ColorZilla, dark-mode/translate add-ons)
    // stamp attributes on <html>/<body> before React hydrates, which React
    // reports as a hydration mismatch. suppressHydrationWarning only applies to
    // these two elements, so real mismatches inside the app still surface.
    <html
      lang="bn"
      className={`${bodyFont.variable} h-full w-full max-w-full overflow-x-clip antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      {/* No hand-written icon <link>s here: the `icons` metadata above already
          emits them, and declaring both had the browser fetching the same file
          four times on every first load. */}
      <body
        className="min-h-full w-full max-w-full overflow-x-clip flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <LandingPageThemeProvider productSlug="milkimom">
          <LandingPageContentProvider productSlug="milkimom" showLoader={false}>
            <AttributionCapture />
            <MetaPixel />
            <ClarityAnalytics />
            {children}
          </LandingPageContentProvider>
        </LandingPageThemeProvider>
      </body>
    </html>
  );
}
