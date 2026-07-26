import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

import { navLinks, siteConfig } from "@/lib/content";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <Image
              src="/images/logo.webp"
              alt={siteConfig.name}
              width={140}
              height={92}
              className="h-9 w-auto"
            />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {siteConfig.tagline} — মা ও শিশুর সুস্থতায় প্রকৃতির শক্তি।
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground/70 transition-colors hover:bg-brand-coral/15 hover:text-brand-crimson"
              >
                <FacebookIcon className="size-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground/70 transition-colors hover:bg-brand-coral/15 hover:text-brand-crimson"
              >
                <InstagramIcon className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold text-foreground">
              কুইক লিংক
            </h3>
            <ul className="mt-3 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold text-foreground">যোগাযোগ</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-primary">
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <a href="mailto:support@milkimom.com" className="hover:text-primary">
                  support@milkimom.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {year} {siteConfig.name}™. সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
}
