import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";
import { MetaPixel } from "@/components/meta-pixel";
import "./globals.css";

const bodyFont = Hind_Siliguri({
  variable: "--font-sans",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://milkimom.com"),
  title: "১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে! | মিল্কিমম™",
  description:
    "মিল্কিমম খেলে মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে, এবং ব্রেস্ট ফিডিং এর শেষ পর্যন্ত স্থায়ী হয়। এটি সম্পূর্ণ সাইডইফেক্ট মুক্ত ও ন্যাচারাল।",
  icons: {
    icon: "/images/logo.webp",
    shortcut: "/images/logo.webp",
    apple: "/images/logo.webp",
  },
  openGraph: {
    title: "১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে! | মিল্কিমম™",
    description:
      "মিল্কিমম খেলে মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে, এবং ব্রেস্ট ফিডিং এর শেষ পর্যন্ত স্থায়ী হয়। এটি সম্পূর্ণ সাইডইফেক্ট মুক্ত ও ন্যাচারাল।",
    url: "https://milkimom.com",
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
    <html
      lang="bn"
      className={`${bodyFont.variable} h-full w-full max-w-full overflow-x-clip antialiased scroll-smooth`}
    >
      <head>
        <link rel="icon" href="/images/logo.webp" type="image/webp" />
        <link rel="shortcut icon" href="/images/logo.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/images/logo.webp" />
      </head>
      <body className="min-h-full w-full max-w-full overflow-x-clip flex flex-col bg-background text-foreground">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
