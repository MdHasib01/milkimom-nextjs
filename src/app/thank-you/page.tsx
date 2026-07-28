"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowDown,
  CheckCircle2,
  Home,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { singleJarPrice, siteConfig } from "@/lib/content";

interface OrderData {
  _id?: string;
  customerName?: string;
  phone?: string;
  district?: string;
  thana?: string;
  address?: string;
  flavour?: string;
  paymentMethod?: string;
  price?: number;
  transactionId?: string;
  createdAt?: string;
  orderTime?: string;
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm font-semibold text-muted-foreground">
          অর্ডারের তথ্য লোড হচ্ছে...
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    // First, try loading from sessionStorage for instant rendering
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("milkimom_last_order");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setOrder(parsed);
        } catch {
          // Ignore JSON parse errors
        }
      }
    }

    // If orderId is in URL, fetch latest from server
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && resData.data) {
            setOrder(resData.data);
          }
        })
        .catch(() => {
          // Keep storage version if fetch fails
        });
    }
  }, [orderId]);

  // Format date: e.g. July 28, 2026
  const formattedDate = order?.createdAt || order?.orderTime
    ? new Date(order.createdAt || order.orderTime!).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const shortId = order?._id ? order._id.slice(-6).toUpperCase() : "7696";
  const flavourName = order?.flavour || "ডার্ক চকলেট";
  const totalPrice = order?.price || singleJarPrice.salePrice;

  const isBkash =
    order?.paymentMethod === "bKash" ||
    order?.paymentMethod === "Paid" ||
    Boolean(order?.transactionId);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Top Header Banner Section - Brand Crimson Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#8B1A2B] via-[#9E1B32] to-[#7A1323] text-white pt-10 pb-16 px-4 text-center">
        <div className="mx-auto max-w-xl">
          {/* White Circular Badge with Checkmark */}
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-white text-[#9E1B32] shadow-xl">
            <CheckCircle2 className="size-12 fill-[#9E1B32] text-white" />
          </div>

          <h1 className="mt-4 font-heading text-3xl font-extrabold text-white sm:text-4xl">
            অভিনন্দন!
          </h1>

          <p className="mt-2 text-base text-white/95 sm:text-lg font-medium">
            আমাদের টিম আপনার অর্ডারটি সফল ভাবে রিসিভ করেছে।
          </p>

          {/* White Instruction Card inside Header */}
          <div className="mt-6 rounded-2xl bg-white p-5 sm:p-6 text-foreground shadow-xl border border-white/20">
            <p className="text-sm sm:text-base font-bold text-[#C8102E] leading-relaxed">
              অতিশীঘ্রই আমাদের একজন প্রতিনিধি আপনাকে কল করে অর্ডারটি কনফার্ম করবেন।
            </p>

            <hr className="my-3.5 border-border/60" />

            <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
              আপনার যদি কোনো প্রশ্ন থেকে থাকে, তাহলে অনুগ্রহ করে আমাদের প্রতিনিধি কে প্রশ্ন করে নিশ্চিত হয়ে নিন।
            </p>
          </div>

          {/* Animated Down Arrow pointing to Order Details below */}
          <div className="mt-6 flex justify-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs text-white">
              <ArrowDown className="size-6 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Seamless SVG Curve Bottom Divider (No straight line stroke) */}
        <div className="absolute inset-x-0 bottom-0 overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-7 sm:h-9 fill-background text-background"
          >
            <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Main Order Details Container */}
      <main className="mx-auto max-w-xl px-4 pt-6 space-y-6">
        {/* Order Date & Payment Method Metadata */}
        <div className="space-y-3 rounded-2xl bg-card p-4 border border-border text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Order Date:
            </span>
            <span className="font-bold text-foreground">{formattedDate}</span>
          </div>

          <hr className="border-dashed border-border" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Payment method:
            </span>
            <span className="font-bold text-foreground">
              {isBkash
                ? `বিকাশ (TrxID: ${order?.transactionId || "N/A"})`
                : "ক্যাশ অন ডেলিভারি"}
            </span>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          {/* Box Header */}
          <div className="bg-muted/80 px-5 py-3.5 border-b border-border flex items-center justify-between">
            <span className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
              <Package className="size-5 text-primary" />
              <span>Order #{shortId}</span>
            </span>
            <span className="rounded-full bg-brand-green/10 px-2.5 py-0.5 text-xs font-bold text-brand-green">
              Processing
            </span>
          </div>

          {/* Table / List Items */}
          <div className="p-5 space-y-3 text-sm">
            <div className="flex items-center justify-between font-medium border-b border-border/50 pb-3">
              <span className="font-sans text-foreground">
                ১টি জার মিল্কিমম ({flavourName}) × 1
              </span>
              <span className="font-bold text-foreground font-sans">
                {totalPrice.toLocaleString("bn-BD")}৳
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span>Subtotal:</span>
              <span className="font-semibold text-foreground">
                {totalPrice.toLocaleString("bn-BD")}৳
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span>Shipping:</span>
              <span className="font-semibold text-brand-green">
                ০৳ <span className="text-xs text-muted-foreground font-normal">via সারাদেশে হোম ডেলিভারি চার্জ (ফ্রি)</span>
              </span>
            </div>

            <hr className="border-border" />

            <div className="flex items-center justify-between text-base font-bold">
              <span className="text-foreground">Total:</span>
              <span className="font-heading text-xl font-extrabold text-primary">
                {totalPrice.toLocaleString("bn-BD")}৳
              </span>
            </div>
          </div>
        </div>

        {/* Customer Details Box */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          <div className="bg-muted/80 px-5 py-3.5 border-b border-border">
            <h2 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
              <User className="size-4 text-primary" />
              <span>Customer Details</span>
            </h2>
          </div>

          <div className="p-5 space-y-2.5 text-sm">
            {order?.customerName && order.customerName !== "গ্রাহক" && (
              <div className="flex items-start gap-2">
                <User className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-muted-foreground">নাম:</span>
                  <span className="font-semibold text-foreground">{order.customerName}</span>
                </div>
              </div>
            )}

            {order?.phone && (
              <div className="flex items-start gap-2">
                <Phone className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-muted-foreground">মোবাইল নম্বর:</span>
                  <span className="font-semibold font-mono text-foreground">{order.phone}</span>
                </div>
              </div>
            )}

            {(order?.district || order?.thana || order?.address) && (
              <div className="flex items-start gap-2">
                <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-muted-foreground">ডেলিভারি ঠিকানা:</span>
                  <span className="font-medium text-foreground">
                    {[order?.address, order?.thana, order?.district]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Home CTA Button */}
        <div className="pt-4 text-center">
          <Button
            asChild
            className="h-12 w-full max-w-md gap-2 rounded-full bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90 shadow-md"
          >
            <Link href="/">
              <Home className="size-5" />
              <span>মেইন পেজে ফিরে যান</span>
            </Link>
          </Button>

          <p className="mt-3 text-xs text-muted-foreground">
            জরুরি প্রয়োজনে কল করুন:{" "}
            <a
              href={`tel:${siteConfig.phone}`}
              className="font-bold text-primary hover:underline"
            >
              {siteConfig.phoneDisplay}
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
