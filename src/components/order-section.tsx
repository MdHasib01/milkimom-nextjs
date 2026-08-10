"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowDown,
  CheckCircle2,
  KeyRound,
  Loader2,
  PhoneCall,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Truck,
  X,
} from "lucide-react";
import { singleJarPrice } from "@/lib/content";
import { useFlavors } from "@/lib/use-flavours";
import { saveOrder, checkIpAndFraud, sendFraudOtp, verifyFraudOtp } from "@/lib/api";
import { getFbBrowserIds, trackInitiateCheckout } from "@/lib/fbpixel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { GridPattern } from "@/components/grid-pattern";

import { useLandingPageContent } from "./landing-page-content-provider";

const PHONE_REGEX = /^01[3-9]\d{8}$/;

type FormState = {
  name: string;
  phone: string;
  district: string;
  thana: string;
  address: string;
  payment: "cod" | "bkash";
  trxId: string;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  district: "",
  thana: "",
  address: "",
  payment: "cod",
  trxId: "",
};

export function OrderSection() {
  const { content } = useLandingPageContent();
  const router = useRouter();
  // Admin-managed catalog; falls back to the hardcoded flavours until loaded.
  const flavors = useFlavors();
  const [selectedFlavorId, setSelectedFlavorId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [submitError, setSubmitError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState("");
  const checkoutTracked = useRef(false);

  // IP Tracking & Phone Fraud Check state
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [isIpAlreadyInDb, setIsIpAlreadyInDb] = useState<boolean | null>(null);
  const [lastCheckedPhone, setLastCheckedPhone] = useState("");
  const [showCheckingPopup, setShowCheckingPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"checking" | "tracked" | "clean">("checking");

  // OTP Modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpInfo, setOtpInfo] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [otpResendTimer, setOtpResendTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpResendTimer > 0) {
      interval = setInterval(() => {
        setOtpResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpResendTimer]);

  // null selection (initial, or the catalog was swapped under us after the
  // API load) resolves to the tagged/popular flavour.
  const selectedFlavor = useMemo(
    () =>
      flavors.find((flavor) => flavor.id === selectedFlavorId) ??
      flavors.find((flavor) => flavor.popular) ??
      flavors[0],
    [flavors, selectedFlavorId]
  );

  async function triggerPhoneIpCheck(phoneNum: string, overrideFlavor?: typeof selectedFlavor) {
    if (isCheckingPhone || phoneNum === lastCheckedPhone) return;

    const currentFlavor = overrideFlavor || selectedFlavor;

    setLastCheckedPhone(phoneNum);
    setIsCheckingPhone(true);
    setPopupType("checking");
    setPopupMessage("মোবাইল নম্বর যাচাই করা হচ্ছে...");
    setShowCheckingPopup(true);

    try {
      const res = await checkIpAndFraud(phoneNum, {
        flavour: currentFlavor ? (currentFlavor.nameEn || currentFlavor.name) : "Dark Chocolate",
        price: currentFlavor ? currentFlavor.salePrice : 4990,
        customerName: form.name.trim() || undefined,
        district: form.district || undefined,
        thana: form.thana.trim() || undefined,
        address: form.address.trim() || undefined,
      });
      if (res.success && res.data) {
        const inDb = res.data.isAlreadyInDb;
        setIsIpAlreadyInDb(inDb);

        if (inDb) {
          setPopupType("tracked");
          setPopupMessage("নিরাপত্তা ভেরিফিকেশন (OTP) প্রযোজ্য।");
        } else {
          setPopupType("clean");
          setPopupMessage("মোবাইল নম্বর সফলভাবে ভ্যালিডেট হয়েছে।");
        }
      } else {
        setIsIpAlreadyInDb(false);
        setPopupType("clean");
        setPopupMessage("মোবাইল নম্বর সফলভাবে ভ্যালিডেট হয়েছে।");
      }
    } catch (err) {
      console.error("Phone Check Error:", err);
      setIsIpAlreadyInDb(false);
      setPopupType("clean");
      setPopupMessage("মোবাইল নম্বর যাচাই করা হয়েছে।");
    } finally {
      setIsCheckingPhone(false);
      // Small alert pops up and automatically goes away after 2.5 seconds
      setTimeout(() => {
        setShowCheckingPopup(false);
      }, 2500);
    }
  }

  // Update unfinished order when flavor selection changes if phone number is valid
  useEffect(() => {
    const phoneTrimmed = form.phone.trim();
    if (phoneTrimmed.length === 11 && PHONE_REGEX.test(phoneTrimmed) && selectedFlavor) {
      checkIpAndFraud(phoneTrimmed, {
        flavour: selectedFlavor.nameEn || selectedFlavor.name,
        price: selectedFlavor.salePrice,
        customerName: form.name.trim() || undefined,
        district: form.district || undefined,
        thana: form.thana.trim() || undefined,
        address: form.address.trim() || undefined,
      }).catch(() => {});
    }
  }, [selectedFlavorId, selectedFlavor]);

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setForm((f) => ({ ...f, phone: val }));
    if (submitError) setSubmitError("");

    const phoneTrimmed = val.trim();

    if (phoneTrimmed !== verifiedPhone) {
      setIsOtpVerified(false);
    }

    if (phoneTrimmed.length === 11 && PHONE_REGEX.test(phoneTrimmed)) {
      triggerPhoneIpCheck(phoneTrimmed);
    } else {
      setLastCheckedPhone("");
      if (isIpAlreadyInDb !== null) {
        setIsIpAlreadyInDb(null);
      }
    }

    if (val.startsWith("+") || val.startsWith("88")) {
      setErrors((prev) => ({
        ...prev,
        phone: "মোবাইল নম্বরটি 01 দিয়ে শুরু করুন (+88 ছাড়া লিখুন)",
      }));
    } else if (val.length === 1 && val !== "0") {
      setErrors((prev) => ({
        ...prev,
        phone: "মোবাইল নম্বরটি 01 দিয়ে শুরু করুন",
      }));
    } else if (val.length >= 2 && !val.startsWith("01")) {
      setErrors((prev) => ({
        ...prev,
        phone: "মোবাইল নম্বরটি 01 দিয়ে শুরু করুন",
      }));
    } else if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  }

  async function handleSendOtp(phoneNum: string) {
    setIsSendingOtp(true);
    setOtpError("");
    setOtpInfo("ওটিপি (OTP) পাঠানো হচ্ছে...");
    try {
      const res = await sendFraudOtp(phoneNum);
      if (res.success) {
        let msg = "আপনার মোবাইলে ৪ ডিজিটের ওটিপি কোড পাঠানো হয়েছে।";
        if (res.data?.devCode) {
          msg += ` (Dev OTP: ${res.data.devCode})`;
        }
        setOtpInfo(msg);
        setOtpResendTimer(30);
      } else {
        setOtpError(
          typeof res.error === "string"
            ? res.error
            : "ওটিপি পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
        );
        setOtpInfo("");
      }
    } catch (err) {
      setOtpError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
      setOtpInfo("");
    } finally {
      setIsSendingOtp(false);
    }
  }

  async function handleVerifyOtpSubmit(e?: FormEvent) {
    if (e) e.preventDefault();
    const phoneVal = form.phone.trim();
    const codeVal = otpCode.trim();

    if (!codeVal || codeVal.length < 4) {
      setOtpError("অনুগ্রহ করে ৪ ডিজিটের সঠিক ওটিপি কোডটি লিখুন।");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError("");
    try {
      const res = await verifyFraudOtp(phoneVal, codeVal);
      const isVerified = Boolean(
        res.success &&
          (res.data?.verified || (res as unknown as { verified?: boolean })?.verified)
      );

      if (isVerified) {
        setIsOtpVerified(true);
        setVerifiedPhone(phoneVal);
        setShowOtpModal(false);
        setOtpCode("");
        executeSaveOrder();
      } else {
        setOtpError(
          typeof res.error === "string"
            ? res.error
            : "ভুল ওটিপি কোড। সঠিক কোড দিয়ে আবার চেষ্টা করুন।"
        );
      }
    } catch (err) {
      setOtpError("ওটিপি ভেরিফিকেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsVerifyingOtp(false);
    }
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    const phoneTrimmed = form.phone.trim();
    if (!phoneTrimmed) {
      nextErrors.phone = "মোবাইল নম্বর লিখুন";
    } else if (phoneTrimmed.startsWith("+") || phoneTrimmed.startsWith("88")) {
      nextErrors.phone = "মোবাইল নম্বরটি 01 দিয়ে শুরু করুন (+88 ছাড়া লিখুন)";
    } else if (!phoneTrimmed.startsWith("01")) {
      nextErrors.phone = "মোবাইল নম্বরটি 01 দিয়ে শুরু করুন";
    } else if (!PHONE_REGEX.test(phoneTrimmed)) {
      nextErrors.phone = "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function executeSaveOrder() {
    setStatus("submitting");

    const { fbp, fbc } = getFbBrowserIds();
    const result = await saveOrder({
      product: "Milkimom Complete Dose",
      customerName: form.name.trim() || "গ্রাহক",
      phone: form.phone.trim(),
      district: form.district || "",
      thana: form.thana.trim() || "",
      address: form.address.trim() || "",
      flavour: selectedFlavor.nameEn || selectedFlavor.name,
      paymentMethod: form.payment === "bkash" ? "bKash" : "COD",
      price: selectedFlavor.salePrice,
      transactionId: form.payment === "bkash" ? form.trxId.trim() : undefined,
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
      orderTime: new Date().toISOString(),
      fbp: fbp || undefined,
      fbc: fbc || undefined,
    });

    if (result.success && result.data) {
      // Purchase is NOT fired here — a just-placed order may be fake or get
      // cancelled. The server reports Purchase via the Conversions API when
      // the order is marked Delivered. The browser only signals checkout.
      if (result.status === 201 && !checkoutTracked.current) {
        checkoutTracked.current = true;
        trackInitiateCheckout({
          value: selectedFlavor.salePrice,
          currency: "BDT",
        });
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem("milkimom_last_order", JSON.stringify(result.data));
      }
      const orderObj = result.data as { _id?: string };
      const orderIdParam = orderObj._id ? `?orderId=${orderObj._id}` : "";
      router.push(`/thank-you${orderIdParam}`);
    } else {
      setStatus("idle");
      setSubmitError(
        typeof result.error === "string"
          ? result.error
          : "অর্ডারটি সাবমিট করা যায়নি। আবার চেষ্টা করুন।"
      );
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError("");

    const isValid = validate();
    if (!isValid) {
      const phoneVal = form.phone.trim();
      if (!phoneVal || !PHONE_REGEX.test(phoneVal)) {
        setModalErrorMessage(!phoneVal ? "empty" : "invalid");
        setShowErrorModal(true);
      } else {
        setSubmitError("অর্ডার সম্পূর্ণ করতে অনুগ্রহ করে সব প্রয়োজনীয় তথ্য সঠিকভাবে দিন।");
      }
      return;
    }

    const phoneVal = form.phone.trim();

    // Mandatory OTP validation for all orders with a mobile number
    if (!isOtpVerified || verifiedPhone !== phoneVal) {
      setShowOtpModal(true);
      handleSendOtp(phoneVal);
      return;
    }

    executeSaveOrder();
  }

  const headline = content.orderHeadline || "অর্ডার ফর্ম";
  const subheadline = content.orderSubheadline || "আপনার অর্ডারটি প্লেস করতে, অনুগ্রহ করে নিচের তথ্য গুলো দিয়ে সহযোগীতা করুন।";

  return (
    <section id="pricing" className="relative overflow-hidden mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <GridPattern patternType="lines" size={32} className="opacity-40" />
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-heading text-3xl font-extrabold text-primary sm:text-4xl flex items-center justify-center gap-3">
          <ShoppingCart className="size-8 sm:size-9 text-primary shrink-0" />
          <span>{headline}</span>
        </h2>
        <p className="mt-2.5 text-base font-medium text-muted-foreground sm:text-lg">
          {subheadline}
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mt-10">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start"
          noValidate
        >
          {/* Left Column: Product Flavors & Delivery Form */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-w-0">
            <div className="col-span-full">
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-crimson">
                স্বাদ বেছে নিন
              </span>
              <h3 className="mt-1 font-heading text-lg font-bold text-foreground">
                ৪টি সুস্বাদু ফ্লেভারে পাওয়া যাচ্ছে
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm font-medium text-brand-crimson flex items-start gap-1 lg:hidden">
                <span>পছন্দসই স্বাদ নির্বাচন করে নিচে আপনার ডেলিভারি তথ্য পূরণ করুন</span>
                <ArrowDown className="size-4 shrink-0 text-brand-crimson animate-bounce mt-0.5" />
              </p>
            </div>

            <RevealGroup className="col-span-full grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {flavors.map((flavor) => {
                const isSelected = flavor.id === selectedFlavor.id;
                return (
                  <RevealItem key={flavor.id} className="h-full">
                    <button
                      type="button"
                      onClick={() => setSelectedFlavorId(flavor.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        "group relative flex w-full h-full items-center gap-3.5 rounded-2xl border-2 p-3.5 text-left transition-all duration-200 min-h-[110px]",
                        isSelected
                          ? "border-primary bg-primary/[0.03] shadow-md shadow-brand-crimson/10 ring-1 ring-primary/20"
                          : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                      )}
                    >
                      {flavor.tag && (
                        <span
                          className={cn(
                            "absolute -top-2.5 right-3.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-xs z-10",
                            flavor.popular
                              ? "bg-brand-crimson text-white"
                              : "bg-muted border border-border text-foreground/80"
                          )}
                        >
                          {flavor.tag}
                        </span>
                      )}

                      {/* Product Image with Flavor-Specific Accent Color Background */}
                      <div
                        className={cn(
                          "relative flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-xl p-1 border transition-transform duration-200 group-hover:scale-105 overflow-hidden",
                          flavor.accentBg,
                          `bg-gradient-to-br ${flavor.accentGradient}`
                        )}
                      >
                        <img
                          src={flavor.image || "/images/product-jar.webp"}
                          alt={flavor.name}
                          className="h-full w-auto object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-110"
                        />
                      </div>

                      {/* Text Content Beside Product Image */}
                      <div className="flex flex-1 flex-col justify-center min-w-0 pr-6">
                        <span className="font-heading text-base font-bold text-foreground leading-tight">
                          {flavor.name}
                        </span>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed whitespace-pre-line">
                          {flavor.description}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="font-heading text-sm font-extrabold text-primary">
                            ৳{flavor.salePrice.toLocaleString("bn-BD")}
                          </span>
                          {flavor.regularPrice > flavor.salePrice && (
                            <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/70">
                              ৳{flavor.regularPrice.toLocaleString("bn-BD")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Radio / Selection Checkbox Indicator */}
                      <span
                        className={cn(
                          "absolute right-3 bottom-3 flex size-5 items-center justify-center rounded-full border-2 transition-all",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground scale-105"
                            : "border-muted-foreground/30 bg-background"
                        )}
                      >
                        {isSelected && <CheckCircle2 className="size-3.5 text-white" />}
                      </span>
                    </button>
                  </RevealItem>
                );
              })}
            </RevealGroup>

            <h3 className="col-span-full mt-2 font-heading text-lg font-bold text-foreground flex items-center gap-2">
              <Truck className="size-5 text-primary shrink-0" />
              <span>ডেলিভারি তথ্য</span>
            </h3>

            {/* Field 1: Full Name */}
            <div className="grid gap-1.5">
              <Label htmlFor="name">পূর্ণ নাম</Label>
              <Input
                id="name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="আপনার নাম লিখুন"
                className="h-11"
              />
            </div>

            {/* Field 2: Phone */}
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="phone">মোবাইল নম্বর *</Label>
                {isOtpVerified && verifiedPhone === form.phone.trim() && (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> ওটিপি ভেরিফাইড
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-sm font-semibold text-muted-foreground select-none pointer-events-none">
                  +88
                </span>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  aria-invalid={Boolean(errors.phone)}
                  placeholder="01XXXXXXXXX"
                  className={cn(
                    "h-11 pl-12 pr-10 transition-all duration-200",
                    isOtpVerified && verifiedPhone === form.phone.trim() && "border-emerald-500 ring-1 ring-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10",
                    !isOtpVerified && isCheckingPhone && "border-emerald-500 ring-2 ring-emerald-500/30",
                    !isOtpVerified && isIpAlreadyInDb === false && "border-emerald-500 ring-1 ring-emerald-500/20",
                    !isOtpVerified && isIpAlreadyInDb === true && "border-amber-500 ring-1 ring-amber-500/20"
                  )}
                />
                <div className="absolute right-3 flex items-center pointer-events-none">
                  {isCheckingPhone && (
                    <Loader2 className="size-5 animate-spin text-emerald-600" />
                  )}
                  {!isCheckingPhone && isOtpVerified && verifiedPhone === form.phone.trim() && (
                    <CheckCircle2 className="size-5 text-emerald-600 animate-in fade-in" />
                  )}
                  {!isCheckingPhone && (!isOtpVerified || verifiedPhone !== form.phone.trim()) && isIpAlreadyInDb === false && (
                    <CheckCircle2 className="size-5 text-emerald-600 animate-in fade-in" />
                  )}
                  {!isCheckingPhone && (!isOtpVerified || verifiedPhone !== form.phone.trim()) && isIpAlreadyInDb === true && (
                    <ShieldAlert className="size-5 text-amber-500 animate-in fade-in" />
                  )}
                </div>
              </div>
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            {/* Field 3: Full Address */}
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="address">বাসার পূর্ণ ঠিকানা (এলাকা, থানা, জেলা সহ লিখুন)</Label>
              <Input
                id="address"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="বাসা/হোল্ডিং নং, রোড, এলাকা, থানা, জেলা"
                className="h-11"
              />
            </div>
          </div>

          {/* Right Column: Order Summary + Payment Method + bKash Details + Confirm Button */}
          <div className="flex flex-col rounded-2xl bg-muted p-5 sm:p-6 min-w-0">
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">আপনার অর্ডার</h3>
              
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {singleJarPrice.label} মিল্কিমম ({selectedFlavor.name}) ·{" "}
                  {singleJarPrice.perJarDays} দিনের ডোজ
                </span>
                <div className="text-right">
                  <span className="block font-semibold text-foreground">
                    ৳{selectedFlavor.salePrice.toLocaleString("bn-BD")}
                  </span>
                  {selectedFlavor.regularPrice > selectedFlavor.salePrice && (
                    <span className="block text-xs text-muted-foreground line-through">
                      ৳{selectedFlavor.regularPrice.toLocaleString("bn-BD")}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-semibold text-brand-green">ফ্রি</span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="font-semibold text-foreground">সর্বমোট</span>
                <span className="font-heading text-xl font-extrabold text-primary">
                  ৳{selectedFlavor.salePrice.toLocaleString("bn-BD")}
                </span>
              </div>

              {/* Payment Method Section (Placed on the right side before order confirm) */}
              <div className="mt-6 border-t border-border pt-4">
                <span className="text-sm font-bold text-foreground">পেমেন্ট পদ্ধতি বেছে নিন</span>
                <div className="mt-2.5 flex gap-2">
                  {(
                    [
                      { id: "cod", label: "ক্যাশ অন ডেলিভারি" },
                      { id: "bkash", label: "বিকাশ" },
                    ] as const
                  ).map((option) => (
                    <label
                      key={option.id}
                      className={cn(
                        "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                        form.payment === option.id
                          ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                          : "border-border bg-card text-foreground/80 hover:border-brand-coral/40"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.id}
                        checked={form.payment === option.id}
                        onChange={() =>
                          setForm((f) => ({ ...f, payment: option.id as "cod" | "bkash" }))
                        }
                        className="sr-only"
                      />
                      {option.id === "bkash" && (
                        <img
                          src="/assets/bkash-logo.webp"
                          alt="bKash"
                          className="h-5 w-auto object-contain shrink-0"
                        />
                      )}
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>

                {/* Cash on Delivery Notice */}
                {form.payment === "cod" && (
                  <div className="mt-3.5 rounded-2xl border border-brand-green/30 bg-brand-green-light/80 p-3.5 text-xs text-foreground shadow-xs">
                    <p className="flex items-center gap-2 font-bold text-brand-green text-sm">
                      <Truck className="size-4 shrink-0 text-brand-green" />
                      <span>ক্যাশ অন ডেলিভারি</span>
                    </p>
                    <p className="mt-1 text-xs font-semibold text-brand-green leading-relaxed">
                      সাপ্লিমেন্ট হাতে পেয়ে মূল্য পরিশোধ করবো।
                    </p>
                  </div>
                )}

                {/* bKash Payment Box (Image, Instructions & TrxID Input) */}
                {form.payment === "bkash" && (
                  <div className="mt-4 space-y-3.5 rounded-2xl border border-brand-coral/40 bg-card p-4 text-foreground shadow-sm">
                    {/* bKash Cover Image Header */}
                    <div className="overflow-hidden rounded-xl border border-border bg-white p-2 text-center shadow-xs">
                      <img
                        src="/images/bkash.webp"
                        alt="bKash Payment"
                        className="mx-auto h-auto max-h-56 w-full rounded-lg object-contain"
                      />
                    </div>

                    {/* bKash Personal Number */}
                    <div className="rounded-xl border border-brand-crimson/20 bg-brand-cream/50 p-3 text-center">
                      <span className="block text-xs font-medium text-muted-foreground">
                        বিকাশ পার্সোনাল নম্বর (Send Money)
                      </span>
                      <span className="block font-mono text-lg font-bold tracking-wider text-brand-crimson select-all">
                        01926-344244
                      </span>
                    </div>

                    {/* Bangla Instructions */}
                    <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 p-3 text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                      <p className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 sm:text-sm">
                        <img
                          src="/assets/bkash-logo.webp"
                          alt="bKash"
                          className="h-4.5 w-auto object-contain shrink-0 inline-block"
                        />
                        <span>বিকাশ পেমেন্ট করার নির্দেশাবলী:</span>
                      </p>
                      <ol className="mt-1.5 list-decimal list-inside space-y-1.5 pl-1 text-xs font-medium leading-relaxed text-muted-foreground">
                        <li>
                          আপনার বিকাশ মোবাইল অ্যাপ অথবা{" "}
                          <span className="font-mono font-bold text-foreground">*247#</span> ডায়াল করুন।
                        </li>
                        <li>
                          <strong className="text-foreground">Send Money</strong> অপশনটি সিলেক্ট করুন।
                        </li>
                        <li>
                          প্রাপক নম্বর লিখুন:{" "}
                          <strong className="font-mono text-brand-crimson">01926-344244</strong>
                        </li>
                        <li>
                          মোট পরিমাণ:{" "}
                          <strong className="font-bold text-brand-crimson">
                            {selectedFlavor.salePrice}/=
                          </strong>{" "}
                          টাকা দিয়ে পিন দিন।
                        </li>
                        <li>
                          সেন্ড মানি সফল হওয়ার পর প্রাপ্ত{" "}
                          <strong className="text-foreground">Transaction ID (TrxID)</strong> নিচের ইনপুট বক্সে লিখুন।
                        </li>
                      </ol>
                    </div>

                    {/* Trx ID Field */}
                    <div className="grid gap-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trxId" className="text-xs font-bold text-foreground">
                          বিকাশ ট্রানজেকশন আইডি (TrxID) <span className="text-destructive">*</span>
                        </Label>
                        <span className="text-[10px] text-muted-foreground">উদাহরণ: 9AB12CD34E</span>
                      </div>
                      <Input
                        id="trxId"
                        value={form.trxId}
                        onChange={(e) => setForm((f) => ({ ...f, trxId: e.target.value }))}
                        aria-invalid={Boolean(errors.trxId)}
                        placeholder="bKash TrxID এখানে লিখুন (যেমন: 9AB12CD34E)"
                        className="h-11 font-mono uppercase text-sm bg-background"
                      />
                      {errors.trxId && (
                        <div className="flex items-center gap-1 text-xs font-semibold text-destructive mt-0.5">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>{errors.trxId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5">
              {submitError && (
                <div className="mb-3 flex items-center gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs sm:text-sm font-bold text-destructive shadow-xs">
                  <AlertCircle className="size-5 shrink-0 text-destructive" />
                  <span>{submitError}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={status === "submitting"}
                className="cta-shine h-12 w-full gap-2 rounded-full bg-brand-cta text-base text-brand-cta-foreground hover:bg-brand-cta-dark"
              >
                {status === "submitting" ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  "অর্ডার কনফার্ম করুন"
                )}
              </Button>

              <div className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-brand-green" /> নিরাপদ ও সুরক্ষিত অর্ডার
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="size-4 text-brand-green" /> সারাদেশে হোম ডেলিভারি
                </span>
              </div>
            </div>
          </div>
        </form>
      </Reveal>

      {/* Error Popup Modal */}
      {showErrorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setShowErrorModal(false);
            const phoneElem = document.getElementById("phone");
            if (phoneElem) {
              phoneElem.scrollIntoView({ behavior: "smooth", block: "center" });
              phoneElem.focus({ preventScroll: true });
            }
          }}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-brand-crimson/30 bg-card p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setShowErrorModal(false);
                const phoneElem = document.getElementById("phone");
                if (phoneElem) {
                  phoneElem.scrollIntoView({ behavior: "smooth", block: "center" });
                  phoneElem.focus({ preventScroll: true });
                }
              }}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="size-5" />
            </button>

            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-crimson/10 text-brand-crimson">
              <PhoneCall className="size-8 animate-bounce" />
            </div>

            <h3 className="mt-4 font-heading text-xl font-bold text-foreground">
              মোবাইল নম্বর প্রয়োজন
            </h3>

            <p className="mt-2.5 text-sm font-medium text-foreground leading-relaxed">
              {modalErrorMessage === "invalid" ? (
                <span>
                  অনুগ্রহ করে{" "}
                  <strong className="font-extrabold text-foreground">
                    ১১ ডিজিটের
                  </strong>{" "}
                  সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)।
                </span>
              ) : (
                <span>
                  অর্ডারটি সম্পূর্ণ করতে অনুগ্রহ করে আপনার{" "}
                  <strong className="font-extrabold text-foreground">
                    ১১ ডিজিটের
                  </strong>{" "}
                  মোবাইল নম্বর প্রদান করুন।
                </span>
              )}
            </p>

            <div className="mt-6">
              <Button
                type="button"
                onClick={() => {
                  setShowErrorModal(false);
                  const phoneElem = document.getElementById("phone");
                  if (phoneElem) {
                    phoneElem.scrollIntoView({ behavior: "smooth", block: "center" });
                    phoneElem.focus({ preventScroll: true });
                  }
                }}
                className="w-full rounded-full bg-brand-crimson text-white hover:bg-brand-crimson/90 font-bold h-11 text-sm shadow-md"
              >
                ঠিক আছে, নম্বর দিচ্ছি
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Small Alert Toast Popup at Bottom */}
      {showCheckingPopup && (
        <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[70] animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
          <div className="bg-slate-900/95 text-white backdrop-blur-md border border-slate-700/60 rounded-full shadow-2xl px-4 py-2.5 flex items-center gap-3 max-w-sm">
            {popupType === "checking" && (
              <div className="relative flex items-center justify-center size-6 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                <Loader2 className="size-4 animate-spin text-emerald-400" />
              </div>
            )}
            {popupType === "tracked" && (
              <div className="flex items-center justify-center size-6 rounded-full bg-amber-500/20 text-amber-400 shrink-0">
                <ShieldAlert className="size-4 text-amber-400" />
              </div>
            )}
            {popupType === "clean" && (
              <div className="flex items-center justify-center size-6 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                <CheckCircle2 className="size-4 text-emerald-400" />
              </div>
            )}
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs font-bold leading-tight">
                {popupMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCheckingPopup(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded-full transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification Modal Pop Up */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-background border border-primary/20 rounded-3xl shadow-2xl p-6 sm:p-8 text-center overflow-hidden">
            <button
              type="button"
              onClick={() => setShowOtpModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="size-5" />
            </button>

            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
              <KeyRound className="size-7 animate-pulse text-primary" />
            </div>

            <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-foreground">
              মোবাইল ওটিপি (OTP) ভেরিফিকেশন
            </h3>

            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              নিরাপত্তার স্বার্থে আপনার মোবাইল নম্বর{" "}
              <span className="font-bold text-foreground">{form.phone}</span>-এ ৪ ডিজিটের ভেরিফিকেশন কোড পাঠানো হয়েছে।
            </p>

            <form onSubmit={handleVerifyOtpSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => {
                    const converted = e.target.value
                      .replace(/[০-৯]/g, (w) => "০১২৩৪৫৬৭৮৯".indexOf(w).toString())
                      .replace(/[^0-9]/g, "");
                    setOtpCode(converted);
                  }}
                  placeholder="1 2 3 4"
                  className="h-14 text-center font-mono text-3xl font-extrabold tracking-[0.5em] rounded-2xl border-2 border-primary/30 focus-visible:ring-primary/40"
                  autoFocus
                />
              </div>

              {otpError && (
                <p className="text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-2.5">
                  {otpError}
                </p>
              )}

              {otpInfo && !otpError && (
                <p className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
                  {otpInfo}
                </p>
              )}

              <Button
                type="submit"
                disabled={isVerifyingOtp || !otpCode.trim()}
                className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/20"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="size-5 animate-spin mr-2" />
                    যাচাই করা হচ্ছে...
                  </>
                ) : (
                  "ওটিপি যাচাই ও অর্ডার কনফার্ম করুন"
                )}
              </Button>

              <div className="pt-2 text-xs text-muted-foreground flex items-center justify-between">
                <span>কোড পাননি?</span>
                {otpResendTimer > 0 ? (
                  <span className="font-medium text-muted-foreground">
                    {otpResendTimer} সেকেন্ড পর আবার পাঠানো যাবে
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={isSendingOtp}
                    onClick={() => handleSendOtp(form.phone.trim())}
                    className="font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={cn("size-3.5", isSendingOtp && "animate-spin")} />
                    পুনরায় ওটিপি পাঠান
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
