"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
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

export function StableflowFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 4);

  return (
    <section className="py-16 md:py-24 relative bg-white">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1A1A] leading-tight">
            <span className="text-brand">SmoothFlow</span> নিয়ে আপনার প্রশ্নের উত্তর।
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="border-t border-black/10">
          <AnimatePresence initial={false}>
            {visibleFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b border-black/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full py-5 md:py-6 text-left flex justify-between items-center focus:outline-none gap-4 hover:bg-black/[0.01] px-2 md:px-4 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-base md:text-lg text-[#1A1A1A] pr-4">{faq.q}</span>
                  <div className="flex-shrink-0 text-brand">
                    {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="pb-6 px-2 md:px-4 text-[#1A1A1A]/70 leading-relaxed text-sm md:text-base font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA Button */}
        <div className="mt-10 text-center flex flex-col items-center gap-5">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center justify-center font-bold text-[#1A1A1A] hover:text-brand transition-colors bg-brand-light px-6 py-3 rounded-full border border-brand/10 hover:border-brand/30 cursor-pointer"
          >
            {showAll ? "See Less ↑" : "See More ↓"}
          </button>
          <a
            href="#order-section"
            className="w-full sm:w-auto bg-brand text-white font-bold text-lg md:text-xl px-8 py-4 md:px-10 rounded-full shadow-[0_4px_20px_rgba(230,16,110,0.3)] text-center transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            হ্যাঁ, আমিও মুক্তি পেতে চাই
          </a>
        </div>
      </div>
    </section>
  );
}
