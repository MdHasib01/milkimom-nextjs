"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { navLinks, siteConfig } from "@/lib/content";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-transparent bg-background/80 backdrop-blur-md transition-shadow",
        scrolled && "border-border shadow-sm"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="#top" className="flex shrink-0 items-center gap-2">
          <Image
            src="/images/logo.webp"
            alt={siteConfig.name}
            width={140}
            height={92}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="icon-lg"
            className="rounded-full border-brand-coral/40 text-brand-crimson hover:bg-brand-coral/10 sm:hidden"
          >
            <a href={`tel:${siteConfig.phone}`} aria-label="কল করুন">
              <Phone className="size-4" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="hidden h-10 gap-2 rounded-full border-brand-coral/40 px-4 text-brand-crimson hover:bg-brand-coral/10 sm:inline-flex"
          >
            <a href={`tel:${siteConfig.phone}`}>
              <Phone className="size-4" />
              {siteConfig.phoneDisplay}
            </a>
          </Button>
          <Button
            asChild
            className="cta-shine h-10 gap-1.5 rounded-full bg-brand-cta px-4 text-brand-cta-foreground hover:bg-brand-cta-dark"
          >
            <a href="#pricing">
              <ShoppingBag className="size-4" />
              অর্ডার করুন
            </a>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="মেনু খুলুন">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-4/5">
              <SheetHeader>
                <SheetTitle>{siteConfig.name}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground/90 transition-colors hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
