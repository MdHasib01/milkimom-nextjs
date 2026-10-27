import Link from "next/link";
import Image from "next/image";
import { Home, Phone, ShoppingBag } from "lucide-react";
import { GridPattern } from "@/components/grid-pattern";
import { config } from "@/config";

// Handles every unmatched URL. Next.js sends the 404 status and adds
// `noindex` on its own, so this page never competes with the real one in search.
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-pink-50/60 via-white to-rose-50/40 px-4 py-16">
      <GridPattern size={32} className="opacity-40" />
      <div className="pointer-events-none absolute -top-32 left-1/2 size-[480px] -translate-x-1/2 rounded-full bg-brand-crimson/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center text-center">
        <div className="relative">
          <span className="block select-none font-heading text-[7rem] font-bold leading-none text-brand-crimson/15 sm:text-[9rem]">
            ৪০৪
          </span>
          <Image
            src="/images/product-jar.webp"
            alt="মিল্কিমম™ জার"
            width={612}
            height={880}
            priority
            className="absolute left-1/2 top-1/2 h-32 w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl sm:h-40"
          />
        </div>

        <h1 className="mt-8 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
          দুঃখিত, পেজটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="mt-3 text-balance text-muted-foreground">
          আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে অথবা লিংকটি সঠিক নয়।
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-crimson px-6 py-3 font-semibold text-white shadow-lg shadow-brand-crimson/25 transition-colors hover:bg-brand-crimson-dark"
          >
            <Home className="size-4" />
            হোমপেজে ফিরে যান
          </Link>
          <Link
            href="/#order-section"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-crimson/30 bg-white px-6 py-3 font-semibold text-brand-crimson transition-colors hover:bg-brand-cream"
          >
            <ShoppingBag className="size-4" />
            অর্ডার করুন
          </Link>
        </div>

        <a
          href={`tel:${config.contact.phone}`}
          className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand-crimson"
        >
          <Phone className="size-4" />
          সাহায্য প্রয়োজন? কল করুন {config.contact.phoneDisplay}
        </a>
      </div>
    </main>
  );
}
