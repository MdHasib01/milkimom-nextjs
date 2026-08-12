"use client";

import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";

import { navLinks, siteConfig } from "@/lib/content";
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

export function SiteFooter() {
  const { content } = useLandingPageContent();
  const year = new Date().getFullYear();
  const isSmoothflow = content.productSlug === "smoothflow";

  const footerText = content.footerText || `${siteConfig.tagline} — মা ও শিশুর সুস্থতায় প্রকৃতির শক্তি।`;
  const phoneDisplay = content.footerPhone || siteConfig.phoneDisplay;
  const email = content.footerEmail || siteConfig.email;
  const address = content.footerAddress || siteConfig.address;
  const brandName = content.productName ? `${content.productName}™` : siteConfig.name;

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className={`grid grid-cols-1 gap-8 items-center sm:items-start text-center sm:text-left ${
          isSmoothflow ? "sm:grid-cols-2" : "sm:grid-cols-3"
        }`}>
          {/* Brand Column */}
          <div className="flex flex-col items-center sm:items-start">
            <img
              src="/images/logo.webp"
              alt="Milkimom"
              className="h-12 sm:h-14 w-auto object-contain max-h-16 mx-auto sm:mx-0"
            />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground text-center sm:text-left">
              {footerText}
            </p>
            <div className="mt-4 flex items-center justify-center sm:justify-start gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground/70 transition-colors hover:bg-brand-coral/15 hover:text-brand-crimson"
              >
                <FaFacebookF className="size-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground/70 transition-colors hover:bg-brand-coral/15 hover:text-brand-crimson"
              >
                <FaInstagram className="size-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column - Hidden on SmoothFlow */}
          {!isSmoothflow && (
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="font-heading text-sm font-bold text-foreground">
                কুইক লিংক
              </h3>
              <ul className="mt-3 space-y-2 text-center sm:text-left">
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
          )}

          {/* Contact Column - Hidden on Mobile */}
          <div className="hidden sm:flex flex-col items-center sm:items-start">
            <h3 className="font-heading text-sm font-bold text-foreground">যোগাযোগ</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground flex flex-col items-center sm:items-start">
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <Phone className="size-4 shrink-0" />
                <a href={`tel:${phoneDisplay}`} className="hover:text-primary">
                  {phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <Mail className="size-4 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-primary">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2 justify-center sm:justify-start">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {year} {brandName}. সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
}
