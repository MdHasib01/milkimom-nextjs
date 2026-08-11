"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  FlaskConical,
  Stethoscope,
  Award,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLandingPageContent } from "@/components/landing-page-content-provider";

const certs = [
  { id: 1, title: "Heavy Metal Tested", icon: FlaskConical },
  { id: 2, title: "Microbiology Tested", icon: Stethoscope },
  { id: 3, title: "GMP Certified", icon: ShieldCheck },
  { id: 4, title: "ISO 9001:2015", icon: Award },
  { id: 5, title: "100% Natural", icon: Leaf },
];

const doctorsList = [
  {
    id: 1,
    name: "Dr. Sarah Ahmed",
    qualifications: "MBBS, FCPS (Gynecology & Obstetrics)",
    quote:
      "“SmoothFlow is formulated with safe, clinically proven ingredients that gently help relieve clogged ducts and breast tenderness. I highly recommend it for nursing mothers struggling with feeding discomfort.”",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    name: "Dr. Farhana Islam",
    qualifications: "MBBS, DGO, MCPS (Gynecology)",
    quote:
      "“I’ve seen many mothers suffer from breast engorgement. SmoothFlow offers a natural and gentle approach to easing this pain, helping mothers continue their breastfeeding journey smoothly.”",
    img: "https://images.unsplash.com/photo-1594824436998-058a231eb906?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    name: "Dr. Laila Rahman",
    qualifications: "MBBS, FCPS, Nutritionist",
    quote:
      "“The composition of SmoothFlow is highly beneficial for nursing mothers. It’s a well-balanced formula that not only eases discomfort but also supports overall lactation health.”",
    img: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=300&q=80",
  },
];

export function StableflowCertifications() {
  const { content } = useLandingPageContent();
  const [currentDocIndex, setCurrentDocIndex] = useState(0);

  const nextDoc = () => {
    setCurrentDocIndex((prev) => (prev + 1) % doctorsList.length);
  };

  const prevDoc = () => {
    setCurrentDocIndex((prev) => (prev - 1 + doctorsList.length) % doctorsList.length);
  };

  return (
    <section className="py-10 md:py-16 relative bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headings */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand leading-tight">
            {content.doctorTitle || "বিশ্বাস রাখার কারণসমূহ"}
          </h2>
        </div>

        {/* Part 01: Certifications */}
        <div className="mb-10 md:mb-16">
          <div className="flex flex-wrap justify-center gap-x-1 gap-y-5 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            {certs.map((cert) => {
              const Icon = cert.icon;
              return (
                <div
                  key={cert.id}
                  className="w-[31%] max-w-[100px] sm:max-w-none sm:w-auto sm:flex-1 flex flex-col items-center text-center gap-2"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-brand/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center text-brand">
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h4 className="font-semibold text-[#1A1A1A] text-[11px] md:text-[13px] leading-tight px-1">
                    {cert.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Part 02: Doctor Reviews */}
        <div className="relative max-w-5xl mx-auto">
          {/* Desktop Navigation Arrows */}
          <button
            onClick={prevDoc}
            className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full items-center justify-center shadow-md border border-brand/10 text-brand hover:bg-brand-light transition-colors z-10 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextDoc}
            className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full items-center justify-center shadow-md border border-brand/10 text-brand hover:bg-brand-light transition-colors z-10 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 sm:gap-6 snap-x snap-mandatory hide-scrollbar">
            {doctorsList.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="min-w-[85vw] sm:min-w-[320px] md:min-w-[380px] lg:min-w-[420px] snap-center bg-white rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-brand/10 flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 bg-brand-light border-2 border-white shadow-sm">
                    <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] text-sm sm:text-base leading-tight">{doc.name}</h3>
                    <p className="text-xs sm:text-sm text-[#1A1A1A]/50 font-medium mt-0.5">{doc.qualifications}</p>
                  </div>
                </div>

                <p className="text-[#1A1A1A]/70 text-sm leading-relaxed mb-6 flex-grow italic">
                  {doc.quote}
                </p>

                <div className="inline-flex items-center gap-1.5 self-start bg-brand-light px-3 py-1.5 rounded-full mt-auto">
                  <CheckCircle2 className="w-4 h-4 text-brand" />
                  <span className="font-bold text-brand text-[11px] sm:text-xs tracking-wide">Doctor Reviewed</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-4 md:hidden">
            {doctorsList.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentDocIndex ? "w-4 bg-brand" : "w-1.5 bg-brand/20"
                }`}
              ></div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 md:mt-12 w-full flex justify-center"
        >
          <a
            href="#order-section"
            className="w-full sm:w-auto bg-brand text-white font-bold text-lg md:text-xl px-8 py-4 md:px-10 rounded-full shadow-[0_4px_20px_rgba(230,16,110,0.3)] text-center transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            হ্যাঁ, আমিও SmoothFlow নিতে চাই
          </a>
        </motion.div>
      </div>
    </section>
  );
}
