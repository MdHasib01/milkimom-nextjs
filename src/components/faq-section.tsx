import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { SectionCta } from "@/components/section-cta";
import { faqs } from "@/lib/content";

export function FaqSection() {
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

      <Reveal delay={0.1} className="mt-8 rounded-3xl border border-border bg-card px-5 shadow-sm sm:px-8">
        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger className="py-4 text-base font-semibold text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>

      <SectionCta />
    </section>
  );
}
