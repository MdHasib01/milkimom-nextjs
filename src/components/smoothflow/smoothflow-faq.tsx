"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { useLandingPageContent } from "@/components/landing-page-content-provider";

const SMOOTHFLOW_FAQS = [
  {
    q: "SmoothFlow কী?",
    a: "SmoothFlow হলো Clogged-Duct Related Breast Pain, শক্ত/চাকা-চাকা অনুভূতি, Pressure ও Feeding Discomfort থেকে মুক্তি পাওয়ার জন্য তৈরি একটি বিশেষ Supplement।",
  },
  {
    q: "কত সময়ের মধ্যে ফলাফল পাব?",
    a: "মাত্র ২৪ ঘন্টার মধ্যে ফলাফল পাবেন, ইনশাআল্লাহ।",
  },
  {
    q: "কীভাবে SmoothFlow খেতে হবে?",
    a: "প্রতিদিন ২ চামচ করে ২ বার, খাবার পর গরম পানি অথবা গরম দুধের সাথে সেবন করুন।",
  },
  {
    q: "কতবার খেতে হবে?",
    a: "প্রতিদিন ২ চামচ করে ২ বার।",
  },
  {
    q: "Breastfeeding-এর সময় খাওয়া যাবে?",
    a: "জি, খাওয়া যাবে।",
  },
  {
    q: "SmoothFlow-এর উপাদান কী কী?",
    a: "সিড লেসিথিন, হেলিয়ানথাস অ্যানুয়াস, সেসামাম ইন্ডিকাম, অ্যাভেনা স্যাটিভা, নাস ডুলসিস, এপিস মেলিফেরা হানি, নাইজেলা স্যাটিভা, ফোনিকুলাম ভালগারে মিল ও আরও অন্যান্য উপাদান।",
  },
  {
    q: "কোনো Side Effect আছে?",
    a: "Lab Tested ও Multiple Certified হওয়ায় নিশ্চিন্তে খান। কোনো প্রকারের Side Effect নেই।",
  },
  {
    q: "Result না পেলে কী হবে?",
    a: "SmoothFlow ব্যবহার করে কোনো পরিবর্তন অনুভব না করলে আমাদের জানান। আমাদের ৩ দিনের Money Back Guarantee অনুযায়ী আপনার সম্পূর্ণ টাকা রিফান্ড করে দেওয়া হবে। কোনো শর্ত প্রযোজ্য নয়।",
  },
];

export function SmoothflowFaq() {
  const { replaceBrandName } = useLandingPageContent();
  const [showAll, setShowAll] = useState(false);

  const formattedFaqs = SMOOTHFLOW_FAQS.map((faq) => ({
    q: replaceBrandName(faq.q),
    a: replaceBrandName(faq.a),
  }));

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 pt-4 pb-12 sm:pt-6 sm:pb-16 overflow-hidden">
      <Reveal className="text-center">
        <h2 className="text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
          SmoothFlow নিয়ে আপনার প্রশ্নের উত্তর
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="relative mt-8 rounded-3xl border border-border bg-card px-5 shadow-sm sm:px-8 overflow-hidden">
        <div
          className={`transition-all duration-500 ease-in-out ${
            !showAll ? "max-h-[355px] overflow-hidden" : "pb-6"
          }`}
        >
          <Accordion type="single" collapsible>
            {formattedFaqs.map((faq, index) => (
              <AccordionItem key={faq.q} value={`item-${index}`}>
                <AccordionTrigger className="py-4 text-left text-base font-semibold text-foreground">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Gradient Overlay & Blended See More Button */}
        {!showAll && (
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-card via-card/95 to-transparent z-10 flex items-end justify-center pb-4 pointer-events-none rounded-b-3xl">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-brand-crimson/30 bg-card/90 backdrop-blur-md px-8 py-3 text-sm font-bold text-brand-crimson shadow-xl transition-all hover:scale-105 hover:bg-brand-crimson hover:text-white hover:shadow-2xl cursor-pointer"
            >
              <span>আরও প্রশ্ন দেখুন</span>
              <ChevronDown className="size-4 animate-bounce" />
            </button>
          </div>
        )}
      </Reveal>

      {showAll && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(false)}
            aria-label="কম প্রশ্ন দেখুন"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card p-3 text-muted-foreground shadow-md transition-all hover:bg-muted hover:text-foreground hover:scale-110 cursor-pointer"
          >
            <ChevronUp className="size-5" />
          </button>
        </div>
      )}

      {/* CTA Button */}
      <div className="mt-10 text-center flex justify-center">
        <a
          href="#order-section"
          className="cta-shine w-full sm:w-auto bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark font-bold text-lg md:text-xl px-8 py-4 md:px-10 rounded-full shadow-lg shadow-brand-cta/40 text-center transition-transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="size-5" />
          <span>হ্যাঁ, আমিও মুক্তি পেতে চাই</span>
        </a>
      </div>
    </section>
  );
}
