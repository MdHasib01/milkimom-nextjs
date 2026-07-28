import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const bodyFont = Hind_Siliguri({
  variable: "--font-sans",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://milkimom.com"),
  title: "মিল্কিমম™ | Make Mother Great Again",
  description:
    "বুকের দুধ কম হওয়ার প্রাকৃতিক সমাধান। ১০০% প্রাকৃতিক উপাদান, BSTI সার্টিফাইড ও ডাক্তার সুপারিশকৃত মিল্কিমম ব্রেস্টফিডিং বুস্ট ব্লেন্ড — মাত্র ৩ দিনেই প্রথম সুফল।",
  openGraph: {
    title: "মিল্কিমম™ | Make Mother Great Again",
    description:
      "বুকের দুধ বৃদ্ধির প্রাকৃতিক ও নিরাপদ সমাধান — ১০০% প্রাকৃতিক উপাদান, BSTI সার্টিফাইড, ডাক্তার সুপারিশকৃত।",
    locale: "bn_BD",
    type: "website",
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
      <body className="min-h-full w-full max-w-full overflow-x-clip flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
