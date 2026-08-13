"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    q: "MilkReady কী?",
    a: "MilkReady হলো Delivery-এর আগের শেষ ৩ মাসে Breastfeeding Preparation নেওয়ার জন্য তৈরি একটি বিশেষায়িত Prenatal Support Supplement।",
  },
  {
    q: "কখন থেকে MilkReady খাওয়া শুরু করতে হবে?",
    a: "ডেলিভারির আগের শেষ ৩ মাসের মধ্যে (যেমন: প্রেগন্যান্সির ৭ম, ৮ম বা ৯ম মাস) MilkReady ব্যবহার শুরু করা সবচেয়ে উত্তম।",
  },
  {
    q: "MilkReady কীভাবে কাজ করে?",
    a: "এটি গর্ভবতী মায়ের শরীরে ল্যাকটোজেনিক পুষ্টির যোগান দেয়, ব্রেস্ট টিস্যুকে উদ্দীপিত করে এবং মিল্ক ডাক্টকে সক্রিয় করে তোলে—যাতে প্রসবের সাথে সাথেই প্রাকৃতিক দুধের সরবরাহ স্বাভাবিকভাবে শুরু হতে পারে।",
  },
  {
    q: "কীভাবে MilkReady খেতে হবে?",
    a: "প্রতিদিন ১ চামচ MilkReady পাউডার ১ গ্লাস কুসুম গরম দুধ অথবা হালকা গরম পানির সাথে ভালোভাবে মিশিয়ে সহজে পান করা যায়।",
  },
  {
    q: "দিনে কতবার খেতে হবে?",
    a: "দিনে ১ থেকে ২ বার নিয়মিত সেবন করুন। খাবারের পরে বা চিকিৎসকের পরামর্শ অনুযায়ী খাওয়া যেতে পারে।",
  },
  {
    q: "Pregnancy-এর সময় খাওয়া নিরাপদ?",
    a: "হ্যাঁ, এটি সম্পূর্ণ নিরাপদ ও গর্ভাবস্থার শেষ ৩ মাসের জন্য বিশেষভাবে প্রস্তুতকৃত ১০০% ফুড-গ্রেড প্রাকৃতিক উপাদান সমৃদ্ধ।",
  },
  {
    q: "MilkReady-এর উপাদান কী কী?",
    a: "অ্যাভেনা স্যাটিভা, বোভাইন WPC, ডেট পাউডার, কোকোনাট, সানফ্লাওয়ার লেসিথিন এবং ন্যাচারাল ফ্লেভার।",
  },
  {
    q: "কোনো Side Effect বা পার্শ্বপ্রতিক্রিয়া আছে?",
    a: "না, MilkReady সম্পূর্ণ প্রাকৃতিক ও নিরাপদ উপাদানে তৈরি। এতে কোনো ক্ষতিকারক রাসায়নিক বা আর্টিফিশিয়াল প্রিজারভেটিভ নেই।",
  },
  {
    q: "Result না পেলে কী সুবিধা রয়েছে?",
    a: "MilkReady-তে রয়েছে শতভাগ ৩ দিনের মানি ব্যাক গ্যারান্টি পলিসি। ব্যবহার করে কোনো পরিবর্তন অনুভব না করলে সম্পূর্ণ টাকা রিফান্ড পেয়ে যাবেন।",
  },
];

export function MilkreadyFaq() {
  const [showAll, setShowAll] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const visibleFaqs = showAll ? FAQS : FAQS.slice(0, 4);

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-16 px-4 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-[#0284c7] mb-2.5">
            <HelpCircle className="size-3.5" />
            <span>সচরাচর জিজ্ঞাসা</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-800 leading-snug">
            <span className="text-[#0284c7]">MilkReady</span> নিয়ে আপনার প্রশ্নের উত্তর।
          </h2>
        </div>

        <div className="space-y-3 mb-6">
          <AnimatePresence initial={false}>
            {visibleFaqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs"
                >
                  <button
                    className="w-full text-left px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between font-bold text-slate-800 text-sm sm:text-base hover:text-[#0284c7] transition-colors"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <span className="text-[#0284c7] text-xl shrink-0 ml-3 font-semibold">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="text-slate-600 font-semibold text-xs sm:text-sm flex items-center gap-1.5 hover:text-[#0284c7] hover:bg-sky-50"
          >
            {showAll ? (
              <>কমিয়ে দেখুন <ChevronUp className="size-4" /></>
            ) : (
              <>আরও প্রশ্ন দেখুন <ChevronDown className="size-4" /></>
            )}
          </Button>

          <Button
            onClick={scrollToOrder}
            className="cta-shine w-full sm:w-auto bg-brand-cta text-brand-cta-foreground hover:bg-brand-cta-dark font-bold text-base md:text-lg px-8 py-3.5 md:px-10 rounded-full shadow-lg shadow-brand-cta/40 text-center transition-transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            হ্যাঁ, আমিও প্রস্তুতি নিতে চাই
          </Button>
        </div>
      </div>
    </section>
  );
}
