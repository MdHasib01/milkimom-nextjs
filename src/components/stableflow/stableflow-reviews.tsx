"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviewData = [
  {
    id: 1,
    name: "নুসরাত জাহান",
    location: "ঢাকা",
    rating: 5,
    comment: "Feed করানোর সময় বুক শক্ত হয়ে অসম্ভব ব্যথা করতো। SmoothFlow ব্যবহার করার পর প্রথম দিনেই অলৌকিকভাবে স্বস্তি পেয়েছি!",
    time: "২ দিন আগে",
  },
  {
    id: 2,
    name: "মোসাম্মাৎ রাবেয়া",
    location: "চট্টগ্রাম",
    rating: 5,
    comment: "Clogged duct নিয়ে খুব দুঃশ্চিন্তায় ছিলাম। ২ দিনের মধ্যেই শক্ত চাকাটা নরম হয়ে যায় এবং ব্যথা পুরোপুরি চলে যায়।",
    time: "৪ দিন আগে",
  },
  {
    id: 3,
    name: "ফাতিমা আক্তার",
    location: "সিলেট",
    rating: 5,
    comment: "প্রত্যেকবার দুধ খাওয়াতে গেলে চোখে পানি চলে আসতো। স্মুথফ্লো নেওয়ার পর এখন খুব শান্তিতে বাচ্চাকে ফিড করাতে পারি।",
    time: "১ সপ্তাহ আগে",
  },
  {
    id: 4,
    name: "শারমিন সুলতানা",
    location: "রাজশাহী",
    rating: 5,
    comment: "ডাক্তারের পরামর্শে এটা খাওয়া শুরু করি। কোনো পার্শ্বপ্রতিক্রিয়া ছাড়াই খুব দ্রুত কাজ করেছে। সব নতুন মায়েদের জন্য রিকমেন্ডেড!",
    time: "১ সপ্তাহ আগে",
  },
];

export function StableflowReviews() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] leading-tight mb-4">
            “আপনার মতো অন্য মায়েরাও এই একই জায়গায় ছিলেন।”
          </h2>
          <p className="text-xl md:text-2xl text-[#1A1A1A]/80 font-medium">
            আর আজ তারা তাদের <span className="text-brand font-bold">Experience Share করছেন।</span>
          </p>
        </div>

        {/* Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="flex overflow-x-auto pb-8 md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:overflow-visible snap-x snap-mandatory hide-scrollbar">
          {reviewData.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-[80vw] sm:min-w-[320px] md:min-w-0 snap-center rounded-2xl overflow-hidden shadow-sm border border-brand/10 flex-shrink-0 bg-brand-light hover:border-brand/30 transition-all p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-brand/20" />
                </div>
                <p className="text-[#1A1A1A]/80 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-brand/10 flex items-center justify-between text-xs text-[#1A1A1A]/60">
                <div>
                  <span className="font-bold text-[#1A1A1A] block text-sm">{review.name}</span>
                  <span>{review.location}</span>
                </div>
                <span className="bg-white/80 px-2.5 py-1 rounded-full text-brand font-semibold border border-brand/10">
                  {review.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 md:mt-12 w-full flex justify-center"
        >
          <a
            href="#order-section"
            className="w-full sm:w-auto bg-brand text-white font-bold text-lg md:text-xl px-8 py-4 md:px-10 rounded-full shadow-[0_4px_20px_rgba(230,16,110,0.3)] text-center transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            হ্যাঁ, আমিও Feeding-এ স্বস্তি চাই
          </a>
        </motion.div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
