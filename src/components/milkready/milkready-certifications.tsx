"use client";

import { motion } from "framer-motion";
import { ShieldCheck, TestTube, Medal, FileCheck, CheckCircle2, Award, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function MilkreadyCertifications() {
  const certs = [
    { icon: <TestTube className="size-6 text-[#0284c7]" />, title: "Heavy Metal Tested" },
    { icon: <ShieldCheck className="size-6 text-[#0284c7]" />, title: "Microbiology Tested" },
    { icon: <Medal className="size-6 text-[#0284c7]" />, title: "GMP Certified" },
    { icon: <FileCheck className="size-6 text-[#0284c7]" />, title: "ISO 9001:2015" },
    { icon: <Award className="size-6 text-[#0284c7]" />, title: "Quality Tested" },
  ];

  const doctors = [
    {
      name: "ডা. ফারহানা শারমিন",
      qual: "এমবিবিএস, এফসিপিএস (OBGYN)",
      stmt: "প্রসবের পর বুকের দুধের স্বাভাবিক প্রবাহ বজায় রাখতে প্রসবপূর্ব পুষ্টি ও ব্রেস্ট টিস্যু প্রিপারেশন অত্যন্ত ফলপ্রসূ। MilkReady এই প্রক্রিয়ায় একটি চমৎকার বৈজ্ঞানিক সমাধান।",
      image: "/assets/doctor.png",
    },
    {
      name: "ডা. আনিকা তাবাসসুম",
      qual: "ক্লিনিক্যাল নিউট্রিশনিস্ট",
      stmt: "MilkReady-তে থাকা প্রাকৃতিক উপাদান ও পুষ্টি উপাদানগুলো মায়ের শরীরের ল্যাকটোজেনিক হরমোনের প্রাকৃতিক প্রস্তুতিতে অত্যন্ত কার্যকরী সহায়তা প্রদান করে।",
      image: "/assets/doctors/saddam.webp",
    },
    {
      name: "ডা. সালমা খাতুন",
      qual: "শিশু বিশেষজ্ঞ ও পেডিয়াট্রিশিয়ান",
      stmt: "নবজাতকের জন্য প্রথম ৬ মাস মায়ের বুকের দুধের কোনো বিকল্প নেই। প্রসবের পর থেকেই পর্যাপ্ত বুকের দুধ নিশ্চিত করতে MilkReady একটি নিরাপদ প্রস্তুতি।",
      image: "/assets/doctors/nazmul.webp",
    },
  ];

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Trust Badges */}
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl font-extrabold text-[#0284c7] mb-6"
          >
            বিশ্বাস রাখার কারণসমূহ
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {certs.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-sky-50/70 hover:bg-sky-50 rounded-2xl border border-sky-100 min-w-[130px] sm:min-w-[160px] shadow-2xs hover:shadow-xs transition-all"
              >
                {c.icon}
                <span className="text-xs sm:text-sm font-bold text-slate-800 text-center leading-tight">
                  {c.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Doctor Recommendations */}
        <div className="mt-12">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 mb-2">
              <Stethoscope className="size-3.5" />
              <span>ডাক্তারদের মতামত</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              বিশেষজ্ঞ চিকিৎসকদের পরামর্শ ও পর্যালোচনা
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {doctors.map((doc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-sky-200 bg-sky-50 shrink-0">
                      <Image
                        src={doc.image}
                        alt={doc.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{doc.name}</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium">{doc.qual}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{doc.stmt}"
                  </p>
                </div>

                <div className="text-xs font-bold text-[#0284c7] flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-100">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Doctor Reviewed & Recommended</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={scrollToOrder}
              className="cta-shine w-full sm:w-auto px-8 py-3.5 h-auto rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm sm:text-base shadow-md shadow-sky-600/20 active:scale-95 transition-all cursor-pointer"
            >
              হ্যাঁ, আমিও MilkReady নিতে চাই
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
