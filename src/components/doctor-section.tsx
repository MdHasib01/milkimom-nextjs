import Image from "next/image";
import { BadgeCheck } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

export function DoctorSection() {
  return (
    <section id="ingredients" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="grid items-center gap-10 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <Reveal className="mx-auto w-full max-w-xs lg:max-w-sm">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/images/doctor.webp"
              alt="মিল্কিমম মেডিকেল বোর্ডের চিকিৎসক"
              width={1200}
              height={1500}
              className="h-auto w-full object-cover"
              sizes="(min-width: 1024px) 24rem, 90vw"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-light px-3 py-1 text-xs font-semibold text-brand-green sm:text-sm">
            <BadgeCheck className="size-4" />
            মেডিকেল বোর্ড অনুমোদিত
          </span>
          <h2 className="mt-3 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
            চিকিৎসকের তত্ত্বাবধানে তৈরি ফর্মুলা
          </h2>
          <p className="mt-2 font-heading text-lg font-semibold text-brand-crimson">
            ডা. [ডাক্তারের নাম বসবে]
          </p>
          <p className="text-sm text-muted-foreground">
            [ডিগ্রি ও রেজিস্ট্রেশন নম্বর বসবে]
          </p>
          <p className="mt-4 text-balance text-muted-foreground">
            মিল্কিমম তৈরি হয়েছে গভর্নমেন্ট রেজিস্টার্ড চিকিৎসকদের তত্ত্বাবধানে,
            ৪৮০০+ বছরের প্রাচীন আয়ুর্বেদিক জ্ঞান ও আধুনিক বিজ্ঞানের গবেষণার
            সমন্বয়ে। প্রতিটি ব্যাচ ল্যাব টেস্টেড ও BSTI সার্টিফাইড, যাতে মা ও
            শিশু উভয়ের জন্যই এটি সম্পূর্ণ নিরাপদ থাকে।
          </p>
        </Reveal>
      </div>
    </section>
  );
}
