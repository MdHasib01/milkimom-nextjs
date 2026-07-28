import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionCta } from "@/components/section-cta";
import { GridPattern } from "@/components/grid-pattern";

const specialties = [
  {
    number: "১",
    title: "৩ দিনেই বুকের দুধ বাড়ে",
    description: [
      "মিল্কিমম খেলে ৩ দিনের মধ্যে বুকের দুধ বৃদ্ধি পাবে।",
      "ফলে, আপনার বাচ্চা পরিপূর্ণ বুকের দুধ পাবে।",
    ],
    bulletPoints: false,
  },
  {
    number: "২",
    title: "১ ডোজ-ই খেতে হয়",
    description: [
      "মিল্কিমম ১ ডোজ-ই খেতে হয়।",
      "বারবার খাওয়ার প্রয়োজন নেই।",
    ],
    bulletPoints: false,
  },
  {
    number: "৩",
    title: "১৫ দিনের কমপ্লিট ডোজ",
    description: [
      "বাবুর বয়স ০-২৪ মাসের মধ্যে যেকোনো সময়ে খেতে পারেন।",
    ],
    bulletPoints: false,
  },
  {
    number: "৪",
    title: "ডোজ শেষ হলে বুকের দুধ কমে না",
    description: [
      "মিল্কিমম এর একটি কমপ্লিট ডোজ শেষ হওয়ার পরেও বুকের দুধের ফ্লো কখনোই কমে যায় না।",
      "ব্রেস্টফিডিং এর শেষ পর্যন্ত পার্মানেন্ট হয়।",
    ],
    bulletPoints: false,
  },
  {
    number: "৫",
    title: "অনেক টাকা বেঁচে যায়",
    introText: "মিল্কিমম একবার খেলে,",
    bullets: [
      "বারবার খাওয়া লাগে না।",
      "ফর্মুলা দুধ কেনা লাগে না।",
    ],
    footerText: "এজন্য, অনেক টাকাও বেঁচে যায়।",
    bulletPoints: true,
  },
];

export function SpecialtiesSection() {
  return (
    <section id="specialties" className="relative overflow-hidden py-16 sm:py-24 bg-card/40">
      <GridPattern size={28} className="opacity-40" />

      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-primary">
            বিশেষত্ব
          </span>
          <h2 className="mt-2 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            মিল্কিমম এর বিশেষত্ব
          </h2>
          <p className="mt-3 text-balance text-muted-foreground text-sm sm:text-base">
            যে কারণে মিল্কিমম অন্যান্য সকল মাধ্যম থেকে সম্পূর্ণ আলাদা ও অনন্য।
          </p>
        </Reveal>

        <RevealGroup stagger={0.1} className="mt-12 flex flex-wrap justify-center gap-6">
          {specialties.map((item, index) => {
            return (
              <RevealItem
                key={index}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex"
              >
                <div className="group relative flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:-translate-y-1">
                  {/* Subtle Top Accent Line */}
                  <div className="absolute top-0 inset-x-8 h-1 rounded-b-full bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  <div>
                    {/* Header: Primary Color Circle with Numbering */}
                    <div className="mb-4">
                      <div className="flex size-10 sm:size-11 items-center justify-center rounded-full bg-primary font-heading text-base sm:text-lg font-bold text-primary-foreground shadow-md shadow-primary/25 transition-transform duration-300 group-hover:scale-110">
                        {item.number}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-lg font-bold text-foreground sm:text-xl mb-3">
                      {item.title}
                    </h3>

                    {/* Content */}
                    {!item.bulletPoints ? (
                      <div className="space-y-2 text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {item.description?.map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {item.introText && <p>{item.introText}</p>}
                        {item.bullets && (
                          <ul className="my-2 space-y-1.5 pl-1">
                            {item.bullets.map((bText, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2 text-foreground font-medium">
                                <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                                <span>{bText}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {item.footerText && <p className="font-medium text-foreground">{item.footerText}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <SectionCta />
      </div>
    </section>
  );
}
