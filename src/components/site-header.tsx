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
import { useLandingPageContent } from "./landing-page-content-provider";

import { API_BASE_URL } from "@/lib/api-config";

function getFullImageUrl(url?: string) {
  if (!url || !url.trim()) return "/images/logo.webp";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) return trimmed;
  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    const base = API_BASE_URL || "http://localhost:5000";
    return `${base}${cleanPath}`;
  }
  return trimmed;
}

export function SiteHeader() {
  const { content } = useLandingPageContent();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displayPhone = content.footerPhone || siteConfig.phoneDisplay;
  const rawPhone = displayPhone.replace(/[^0-9]/g, "");
  const brandTitle = content.productName ? `${content.productName}™` : siteConfig.name;

  const logoType = content.logoType || (content.productSlug === "smoothflow" ? "text" : "image");
  const logoUrl = getFullImageUrl(content.logoImage || "/images/logo.webp");

  return (
    <header
      className={cn(
        "relative w-full border-b border-transparent bg-background/80 backdrop-blur-md transition-shadow",
        scrolled && "border-border shadow-sm"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="#top" className="flex shrink-0 items-center gap-2">
          {logoType === "text" ? (
            <span className="font-heading text-2xl font-extrabold text-primary tracking-tight">
              {brandTitle}
            </span>
          ) : (
            <img
              src={logoUrl}
              alt={brandTitle}
              className="h-14 w-auto sm:h-16 object-contain max-h-16"
            />
          )}
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
            className="hidden h-10 gap-2 rounded-full border-brand-coral/40 px-4 text-brand-crimson hover:bg-brand-coral/10 sm:inline-flex"
          >
            <a href={`tel:${rawPhone}`}>
              <Phone className="size-4" />
              {displayPhone}
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
              <Button variant="ghost" size="icon-lg" className="hidden sm:inline-flex lg:hidden" aria-label="মেনু খুলুন">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-4/5">
              <SheetHeader>
                <SheetTitle>{brandTitle}</SheetTitle>
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
