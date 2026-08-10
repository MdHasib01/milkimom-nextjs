"use client";

import { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { SectionCta } from "@/components/section-cta";
import { useLandingPageContent } from "./landing-page-content-provider";

interface FaqItem {
  q: string;
  a: ReactNode;
}

const FAQS: FaqItem[] = [
  { q: "কত দিনে বুকের দুধ বাড়বে?", a: "মিল্কিমম খেলে ৩ দিনের মধ্যে বুকের দুধ বৃদ্ধি পাবে। ফলে আপনার বাচ্চা পরিপূর্ণ বুকের দুধ পাবে।" },
  { q: "বুকের দুধ কি পার্মানেন্টলি বাড়বে?", a: "মিল্কিমমের একটি কমপ্লিট ডোজ শেষ হওয়ার পরেও বুকের দুধের ফ্লো কমে যায় না। ব্রেস্টফিডিংয়ের শেষ পর্যন্ত স্থায়ী হয়।" },
  { q: "১ টাই ডোজ খেতে হবে?", a: "মিল্কিমম ১ ডোজই খেতে হয়। বারবার খাওয়ার প্রয়োজন নেই।" },
  { q: "কত দিনের ডোজ?", a: "১৫ দিনের কমপ্লিট ডোজ।" },
  { q: "খাওয়ার নিয়ম কী?", a: "সাথে দেওয়া চামচের ১ চামচ করে দিনে ২ বার, ১ গ্লাস দুধ বা পানিতে মিশিয়ে খাবেন। সাথে ইউজার ম্যানুয়াল দেওয়া হয়।" },
  { q: "বাবু সাক করে না, পাম্প ইউস করি, বাড়বে কি?", a: "জ্বী, পাম্প করলেও বুকের দুধ বাড়বে।" },
  { q: "বুকের দুধ একেবারেই বন্ধ হয়ে গেছে, তাও কি দুধ আসবে?", a: "জ্বী, মিল্কিমম খেয়ে একদম বুকের দুধ বন্ধ হয়ে যাওয়া মায়েদেরও বুকের দুধ আসে।" },
  { q: "টেস্ট কেমন?", a: "মিল্কিমম হালকা মিষ্টি স্বাদের, তাই খেতেও মজা লাগে।" },
  { q: "মিল্কিমম জিনিসটা কী?", a: "মিল্কিমম বুকের দুধ তৈরি, বৃদ্ধি ও বুকের দুধে পুষ্টি উপাদান বজায় রাখার জন্য একটি সেমি লিকুইড সাপ্লিমেন্ট।" },
  { q: "বাবুর বয়স ০-২৪ মাসের মধ্যে খাওয়া যাবে?", a: "বাবুর বয়স ০ দিন থেকে ২৪ মাসের মধ্যে যেকোনো সময়ে মিল্কিমম খাওয়া যায়।" },
  { q: "মিল্কিমমের উপাদান কী?", a: "মিল্কিমম তৈরি হয় ১০টি কার্যকরী উপাদানে। স্টারলিং নাইজেলা, চেস্ট হানি ও ৮টি সিক্রেট উপাদানসহ রেয়ার ইম্পোর্টেড উপাদানে তৈরি।" },
  { q: "সাইডইফেক্ট মুক্ত তো?", a: "মিল্কিমম সম্পূর্ণ সাইডইফেক্ট মুক্ত, ন্যাচারাল, ল্যাব টেস্টেড এবং সার্টিফাইড।" },
  { q: "দামটা একটু বেশি মনে হচ্ছে, এত দাম কেন?", a: "রেয়ার ও ইম্পোর্টেড উপাদান দিয়ে তৈরি হওয়ায় এর কার্যকারিতা বজায় রাখতে প্রিমিয়াম কোয়ালিটি রাখা হয়। সবচেয়ে বড় ব্যাপার, এটি ১ ডোজ খেলেই হয়।" },
  { q: "মিল্কিমম খেলে বাচ্চার গ্রোথ বাড়বে?", a: "মিল্কিমম বুকের দুধে সঠিক পুষ্টি বজায় রাখতে সাহায্য করে। যথাযথ পুষ্টি পেলে বাচ্চার গ্রোথ, ওয়েট গেইন ও ব্রেইন ডেভেলপমেন্ট সাপোর্ট পায়।" },
  { 
    q: "আমার থাইরয়েড, ডায়াবেটিস, ব্লাড প্রেশার, IBS বা অন্যান্য সমস্যা থাকলে কি মিল্কিমম খেতে পারবো?", 
    a: "জ্বী, থাইরয়েড, ডায়াবেটিস, ব্লাড প্রেশার, IBS (Irritable Bowel Syndrome) বা অন্যান্য শারীরিক সমস্যা থাকলেও আপনি নিশ্চিন্তে মিল্কিমম খেতে পারবেন। মিল্কিমম সম্পূর্ণ ন্যাচারাল, ল্যাব টেস্টেড, সাইডইফেক্ট মুক্ত এবং মায়েদের জন্য তৈরি একটি সেমি-লিকুইড সাপ্লিমেন্ট।"
  },
  { q: "বুকের দুধ পাতলা হলে মিল্কিমম কি ঘন করে?", a: "মিল্কিমম নিউট্রিশন ব্যালান্স করে বুকের দুধের গুণগত মান বজায় রাখতে সাহায্য করে।" },
];

export function FaqSection() {
  const { replaceBrandName } = useLandingPageContent();
  const [showAll, setShowAll] = useState(false);

  const formattedFaqs = FAQS.map((faq) => ({
    q: replaceBrandName(faq.q),
    a: typeof faq.a === "string" ? replaceBrandName(faq.a) : faq.a,
  }));

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Reveal className="text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-crimson">
          প্রশ্নোত্তর
        </span>
        <h2 className="mt-2 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
          আপনার মনে যা প্রশ্ন থাকতে পারে
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

      <SectionCta />
    </section>
  );
}
