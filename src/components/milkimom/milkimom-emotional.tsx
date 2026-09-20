"use client";

import { motion } from "framer-motion";

export function MilkimomEmotional() {
  return (
    <section className="py-10 md:py-16 overflow-hidden relative bg-white">
      {/* Full bleed image on mobile, contained on desktop */}
      <div className="w-full md:max-w-3xl mx-auto md:px-6 lg:px-8 mb-8 md:mb-12 flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-sm md:max-w-md overflow-hidden md:rounded-3xl shadow-sm md:shadow-md"
        >
          <img
            src="/images/thinking-mother.png"
            alt="বুকের দুধ নিয়ে দুশ্চিন্তাগ্রস্ত মা"
            className="w-full h-auto object-cover object-center"
          />
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1A1A1A] leading-tight mb-6">
          বুকের দুধ কম হওয়ার দুশ্চিন্তাটা টাকা দিয়ে মাপা যায় না
        </h2>

        <div className="text-[#1A1A1A]/80 text-[15px] md:text-[17px] leading-[1.5] space-y-[10px] md:space-y-[12px] font-medium">
          <p>বাবু পেট ভরে দুধ পাচ্ছে কিনা, এই দুশ্চিন্তা।</p>
          <p>ফর্মুলা দুধের পেছনে প্রতি মাসে বাড়তি খরচ।</p>
          <p>রাতে বারবার উঠে ফর্মুলা বানানোর ঝামেলা।</p>
          <p>
            প্রতিবার মনে হওয়া, &ldquo;আমার বুকের দুধ কি যথেষ্ট?&rdquo;
            <span className="block mt-1.5 text-[28px] md:text-[32px] leading-none text-center">😔</span>
          </p>
        </div>
      </div>
    </section>
  );
}
