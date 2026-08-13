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
import { singleJarPrice, smoothflowSingleJarPrice } from "@/lib/content";
import { useFlavors, applyProductPricing, type DisplayFlavor } from "@/lib/use-flavours";
import { saveOrder, checkIpAndFraud, sendFraudOtp, verifyFraudOtp } from "@/lib/api";
import { getFbBrowserIds, trackInitiateCheckout } from "@/lib/fbpixel";
import { getAttribution } from "@/lib/attribution";
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

  const isSmoothflow = content.productSlug === "smoothflow";

  const effectiveFlavors = useMemo(
    () => applyProductPricing(flavors, content.productSlug),
    [flavors, content.productSlug]
  );

  // null selection (initial, or the catalog was swapped under us after the
  // API load) resolves to the tagged/popular flavour.
  const selectedFlavor = useMemo(
    () =>
      effectiveFlavors.find((flavor) => flavor.id === selectedFlavorId) ??
      effectiveFlavors.find((flavor) => flavor.popular) ??
      effectiveFlavors[0],
    [effectiveFlavors, selectedFlavorId]
  );

  // Only reached before the catalog loads; applyProductPricing has already
  // resolved the right product's prices onto selectedFlavor by then.
  const productFallback = isSmoothflow ? smoothflowSingleJarPrice : singleJarPrice;

  const deliveryCharge = 0;
  const salePriceVal = selectedFlavor?.salePrice || productFallback.salePrice;
  const totalPrice = salePriceVal + deliveryCharge;
  const regularPriceVal = selectedFlavor?.regularPrice || productFallback.regularPrice;
  const savingsVal = regularPriceVal > salePriceVal ? regularPriceVal - salePriceVal : 0;
  const productNameEn = content.productNameEn || (isSmoothflow ? "SmoothFlow" : "Milkimom");

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
        price: currentFlavor ? currentFlavor.salePrice : (isSmoothflow ? 1999 : 4990),
        productSlug: content.productSlug,
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
          setPopupMessage("মোবাইল নম্বর যাচাই করা হয়েছে।");
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

    if (form.payment === "bkash" && !form.trxId.trim()) {
      nextErrors.trxId = "বিকাশ ট্রানজেকশন আইডি (TrxID) লিখুন";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function executeSaveOrder() {
    setStatus("submitting");

    const priceToSave = totalPrice;
    const { fbp, fbc } = getFbBrowserIds();
    const result = await saveOrder({
      product: `${productNameEn} Complete Dose`,
      productSlug: content.productSlug,
      customerName: form.name.trim() || "গ্রাহক",
      phone: form.phone.trim(),
      district: form.district || "",
      thana: form.thana.trim() || "",
      address: form.address.trim() || "",
      flavour: selectedFlavor.nameEn || selectedFlavor.name,
      paymentMethod: form.payment === "bkash" ? "bKash" : "COD",
      price: priceToSave,
      transactionId: form.payment === "bkash" ? form.trxId.trim() : undefined,
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
      orderTime: new Date().toISOString(),
      fbp: fbp || undefined,
      fbc: fbc || undefined,
      // Captured when the visitor landed. The Purchase is only reported once
      // an admin confirms this order, so the ad click has to travel with it.
      attribution: getAttribution(),
    });

    if (result.success && result.data) {
      // Purchase is NOT fired here — a just-placed order may be fake or get
      // cancelled. The server reports Purchase via the Conversions API once an
      // admin confirms the order. The browser only signals checkout.
      if (result.status === 201 && !checkoutTracked.current) {
        checkoutTracked.current = true;
        trackInitiateCheckout({
          value: priceToSave,
          currency: "BDT",
          content_ids: [content.productSlug],
          content_type: "product",
          content_name: productNameEn,
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

    // OTP verification turned off: execute order submission directly
    executeSaveOrder();
  }

  const headline = content.orderHeadline || (isSmoothflow ? "SmoothFlow অর্ডার করুন" : "অর্ডার ফর্ম");
  const subheadline = content.orderSubheadline || (isSmoothflow ? "Breast Pain নিয়ে আরেকটা Feeding-এর জন্য অপেক্ষা নয়।" : "আপনার অর্ডারটি প্লেস করতে, অনুগ্রহ করে নিচের তথ্য গুলো দিয়ে সহযোগীতা করুন।");

  return (
    <section id="pricing" className="relative overflow-hidden mx-auto max-w-6xl px-3 xs:px-4 sm:px-6 md:px-8 py-10 xs:py-12 sm:py-16 lg:py-24">
      <div id="order-section" className="absolute -top-24 pointer-events-none opacity-0" />
      <GridPattern patternType="lines" size={32} className="opacity-40" />
      <Reveal className="mx-auto max-w-2xl text-center px-2">
        <h2 className="text-balance font-heading text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary flex items-center justify-center gap-2 xs:gap-3 flex-wrap leading-tight text-center">
          <ShoppingCart className="size-6 xs:size-7 sm:size-8 md:size-9 text-primary shrink-0" />
          <span>{headline}</span>
        </h2>
        <p className="mt-2 sm:mt-3 text-xs xs:text-sm sm:text-base md:text-lg font-medium text-muted-foreground max-w-xl mx-auto leading-relaxed text-center">
          {subheadline}
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mt-6 sm:mt-10">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 rounded-2xl xs:rounded-3xl border border-border/80 bg-card p-3.5 xs:p-5 sm:p-7 md:p-8 shadow-sm sm:shadow-md lg:grid-cols-12 lg:items-start"
          noValidate
        >
          {/* Left Column: Delivery Form (7 cols on lg) */}
          <div className="space-y-6 lg:col-span-7 min-w-0">
            <div className="space-y-4">
              <h3 className="font-heading text-base xs:text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Truck className="size-4.5 xs:size-5 text-primary shrink-0" />
                <span>ডেলিভারি তথ্য</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 xs:gap-4">
                {/* Flavour Dropdown Selection */}
                <div className="grid gap-1.5 col-span-full">
                  <Label htmlFor="flavor-select" className="text-xs xs:text-sm font-semibold flex items-center justify-between">
                    <span>পছন্দসই ফ্লেভার সিলেক্ট করুন *</span>
                    <span className="text-[11px] text-primary font-bold">
                      ({effectiveFlavors.length}টি ফ্লেভারে পাওয়া যাচ্ছে)
                    </span>
                  </Label>
                  <select
                    id="flavor-select"
                    value={selectedFlavor.id}
                    onChange={(e) => setSelectedFlavorId(e.target.value)}
                    className="h-11 xs:h-12 w-full rounded-xl border-2 border-primary/40 bg-background px-3.5 text-xs xs:text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer shadow-xs"
                  >
                    {effectiveFlavors.map((flavor) => (
                      <option key={flavor.id} value={flavor.id}>
                        {flavor.name} {flavor.tag ? `(${flavor.tag})` : ""} — ৳{flavor.salePrice.toLocaleString("bn-BD")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field 1: Full Name */}
                <div className="grid gap-1.5 col-span-full sm:col-span-1">
                  <Label htmlFor="name" className="text-xs xs:text-sm font-medium">পূর্ণ নাম</Label>
                  <Input
                    id="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="আপনার নাম লিখুন"
                    className="h-10 xs:h-11 text-xs xs:text-sm rounded-xl"
                  />
                </div>

                {/* Field 2: Phone */}
                <div className="grid gap-1.5 col-span-full sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="phone" className="text-xs xs:text-sm font-medium">মোবাইল নম্বর *</Label>
                    {isOtpVerified && verifiedPhone === form.phone.trim() && (
                      <span className="text-[10px] xs:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="size-3 xs:size-3.5" /> ভেরিফাইড
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs xs:text-sm font-semibold text-muted-foreground select-none pointer-events-none">
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
                        "h-10 xs:h-11 pl-11 xs:pl-12 pr-9 xs:pr-10 text-xs xs:text-sm rounded-xl transition-all duration-200",
                        isOtpVerified && verifiedPhone === form.phone.trim() && "border-emerald-500 ring-1 ring-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10",
                        !isOtpVerified && isCheckingPhone && "border-emerald-500 ring-2 ring-emerald-500/30",
                        !isOtpVerified && isIpAlreadyInDb === false && "border-emerald-500 ring-1 ring-emerald-500/20",
                        !isOtpVerified && isIpAlreadyInDb === true && "border-amber-500 ring-1 ring-amber-500/20"
                      )}
                    />
                    <div className="absolute right-2.5 xs:right-3 flex items-center pointer-events-none">
                      {isCheckingPhone && (
                        <Loader2 className="size-4 xs:size-5 animate-spin text-emerald-600" />
                      )}
                      {!isCheckingPhone && isOtpVerified && verifiedPhone === form.phone.trim() && (
                        <CheckCircle2 className="size-4 xs:size-5 text-emerald-600 animate-in fade-in" />
                      )}
                      {!isCheckingPhone && (!isOtpVerified || verifiedPhone !== form.phone.trim()) && isIpAlreadyInDb === false && (
                        <CheckCircle2 className="size-4 xs:size-5 text-emerald-600 animate-in fade-in" />
                      )}
                      {!isCheckingPhone && (!isOtpVerified || verifiedPhone !== form.phone.trim()) && isIpAlreadyInDb === true && (
                        <ShieldAlert className="size-4 xs:size-5 text-amber-500 animate-in fade-in" />
                      )}
                    </div>
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                {/* Field 3: Full Address */}
                <div className="grid gap-1.5 col-span-full">
                  <Label htmlFor="address" className="text-xs xs:text-sm font-medium">বাসার পূর্ণ ঠিকানা (এলাকা, থানা, জেলা সহ লিখুন)</Label>
                  <Input
                    id="address"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="বাসা/হোল্ডিং নং, রোড, এলাকা, থানা, জেলা"
                    className="h-10 xs:h-11 text-xs xs:text-sm rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary + Payment Method + Confirm Button (5 cols on lg) */}
          {isSmoothflow ? (
            /* --- SMOOTHFLOW ORDER SUMMARY COLUMN --- */
            <div className="flex flex-col rounded-xl xs:rounded-2xl bg-muted/60 dark:bg-muted/30 p-4 xs:p-5 sm:p-6 min-w-0 border border-border/60 shadow-xs lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              <h3 className="font-heading text-base xs:text-lg font-bold text-foreground">
                Order Summary
              </h3>

              {/* Inner Card Container */}
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-3">
                {/* Product Row */}
                <div className="flex items-start justify-between gap-2 text-xs xs:text-sm">
                  <span className="font-bold text-foreground leading-snug">
                    {productNameEn} ({selectedFlavor.name}) × 1
                  </span>
                  <div className="text-right shrink-0">
                    {regularPriceVal > selectedFlavor.salePrice && (
                      <span className="block text-[11px] xs:text-xs text-muted-foreground line-through italic">
                        ৳{regularPriceVal.toLocaleString("bn-BD")}
                      </span>
                    )}
                    <span className="block font-bold text-foreground">
                      ৳{selectedFlavor.salePrice.toLocaleString("bn-BD")}
                    </span>
                  </div>
                </div>

                {/* Delivery Charge Row */}
                <div className="flex items-center justify-between text-xs xs:text-sm text-muted-foreground font-medium pt-0.5">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {deliveryCharge > 0 ? `৳${deliveryCharge.toLocaleString("bn-BD")}` : "ফ্রি (Free)"}
                  </span>
                </div>

                {/* Savings Pill Box */}
                {savingsVal > 0 && (
                  <div className="rounded-xl border border-primary/20 bg-primary/10 py-1.5 px-3 text-center text-xs font-bold text-primary">
                    আপনার Saving: ৳{savingsVal.toLocaleString("bn-BD")}
                  </div>
                )}

                {/* Total Row */}
                <div className="border-t border-border/80 pt-3 flex items-center justify-between">
                  <span className="font-semibold text-xs xs:text-sm text-foreground">
                    সর্বমোট
                  </span>
                  <span className="font-heading text-lg xs:text-xl sm:text-2xl font-extrabold text-primary">
                    ৳{totalPrice.toLocaleString("bn-BD")}
                  </span>
                </div>
              </div>

              {/* PAYMENT METHOD Section */}
              <div className="border-t border-border/80 pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2.5 block">
                  PAYMENT METHOD
                </span>
                
                <div className="flex gap-2">
                  {(
                    [
                      { id: "cod", label: "Cash on Delivery" },
                      { id: "bkash", label: "বিকাশ" },
                    ] as const
                  ).map((option) => (
                    <label
                      key={option.id}
                      className={cn(
                        "flex flex-1 cursor-pointer items-center justify-center gap-1.5 xs:gap-2 rounded-xl border px-2 xs:px-3 py-2.5 text-xs xs:text-sm font-medium transition-all duration-150 select-none",
                        form.payment === option.id
                          ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs ring-1 ring-primary/30"
                          : "border-border bg-card text-foreground/80 hover:border-primary/40"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment_smoothflow"
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
                          className="h-4 xs:h-5 w-auto object-contain shrink-0"
                        />
                      )}
                      <span className="whitespace-nowrap">{option.label}</span>
                    </label>
                  ))}
                </div>

                {/* Cash on Delivery Notice */}
                {form.payment === "cod" && (
                  <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs text-foreground shadow-xs">
                    <p className="flex items-center gap-1.5 font-bold text-primary text-xs xs:text-sm">
                      <Truck className="size-4 shrink-0 text-primary" />
                      <span>Cash on Delivery</span>
                    </p>
                    <p className="mt-1 text-[11px] xs:text-xs font-semibold text-muted-foreground leading-relaxed">
                      সাপ্লিমেন্ট হাতে পেয়ে মূল্য পরিশোধ করবো।
                    </p>
                  </div>
                )}

                {/* bKash Payment Box */}
                {form.payment === "bkash" && (
                  <div className="mt-3.5 space-y-3 rounded-xl border border-primary/30 bg-card p-3 xs:p-4 text-foreground shadow-xs">
                    <div className="overflow-hidden rounded-xl border border-border bg-white p-2 text-center shadow-xs">
                      <img
                        src="/images/bkash.webp"
                        alt="bKash Payment"
                        className="mx-auto h-auto max-h-36 xs:max-h-48 sm:max-h-56 w-full rounded-lg object-contain"
                      />
                    </div>

                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-2.5 xs:p-3 text-center">
                      <span className="block text-[11px] xs:text-xs font-medium text-muted-foreground">
                        বিকাশ পার্সোনাল নম্বর (Send Money)
                      </span>
                      <span className="block font-mono text-base xs:text-lg font-bold tracking-wider text-primary select-all mt-0.5">
                        01926-344244
                      </span>
                    </div>

                    <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 p-2.5 xs:p-3 text-[11px] xs:text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                      <p className="flex items-center gap-1.5 text-xs xs:text-sm font-bold text-amber-900 dark:text-amber-300">
                        <img
                          src="/assets/bkash-logo.webp"
                          alt="bKash"
                          className="h-4 w-auto object-contain shrink-0 inline-block"
                        />
                        <span>বিকাশ পেমেন্ট করার নির্দেশাবলী:</span>
                      </p>
                      <ol className="mt-1.5 list-decimal list-inside space-y-1 pl-0.5 text-[11px] xs:text-xs font-medium leading-relaxed text-muted-foreground">
                        <li>
                          আপনার বিকাশ মোবাইল অ্যাপ অথবা{" "}
                          <span className="font-mono font-bold text-foreground">*247#</span> ডায়াল করুন।
                        </li>
                        <li>
                          <strong className="text-foreground">Send Money</strong> অপশনটি সিলেক্ট করুন।
                        </li>
                        <li>
                          প্রাপক নম্বর লিখুন:{" "}
                          <strong className="font-mono text-primary font-bold">01926-344244</strong>
                        </li>
                        <li>
                          মোট পরিমাণ:{" "}
                          <strong className="font-bold text-primary">
                            ৳{totalPrice.toLocaleString("bn-BD")}/=
                          </strong>{" "}
                          টাকা দিয়ে পিন দিন।
                        </li>
                        <li>
                          সেন্ড মানি সফল হওয়ার পর প্রাপ্ত{" "}
                          <strong className="text-foreground">Transaction ID (TrxID)</strong> নিচের ইনপুট বক্সে লিখুন।
                        </li>
                      </ol>
                    </div>

                    <div className="grid gap-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="smoothflow-trxId" className="text-xs font-bold text-foreground">
                          বিকাশ ট্রানজেকশন আইডি (TrxID) <span className="text-destructive">*</span>
                        </Label>
                        <span className="text-[10px] text-muted-foreground">উদাহরণ: 9AB12CD34E</span>
                      </div>
                      <Input
                        id="smoothflow-trxId"
                        value={form.trxId}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, trxId: e.target.value }));
                          if (errors.trxId) setErrors((prev) => ({ ...prev, trxId: undefined }));
                        }}
                        aria-invalid={Boolean(errors.trxId)}
                        placeholder="bKash TrxID এখানে লিখুন (যেমন: 9AB12CD34E)"
                        className="h-10 xs:h-11 font-mono uppercase text-xs xs:text-sm bg-background rounded-xl"
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

              {/* Submit Button & Micro-copy & Social Proof Counter */}
              <div className="pt-2">
                {submitError && (
                  <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs xs:text-sm font-bold text-destructive shadow-xs">
                    <AlertCircle className="size-4.5 shrink-0 text-destructive" />
                    <span>{submitError}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={status === "submitting"}
                  className="cta-shine mt-2 h-12 xs:h-13 sm:h-14 w-full gap-2 rounded-full bg-brand-cta text-sm xs:text-base sm:text-lg font-bold text-brand-cta-foreground hover:bg-brand-cta-dark shadow-md shadow-brand-cta/20 active:scale-[0.99] transition-all cursor-pointer"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      <span>অর্ডার প্রসেস হচ্ছে...</span>
                    </>
                  ) : (
                    <span>অর্ডার Confirm করুন</span>
                  )}
                </Button>

                <div className="mt-3.5 flex items-center justify-center gap-4 text-xs font-semibold text-primary">
                  <span className="flex items-center gap-1">
                    ✓ Secure Order
                  </span>
                  <span className="flex items-center gap-1">
                    ✓ Cash on Delivery
                  </span>
                </div>

                <div className="mt-5 text-center pt-3 border-t border-border/60">
                  <div className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                    14,022+
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold mt-0.5">
                    Mother ইতোমধ্যে {productNameEn} অর্ডার করেছেন
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* --- MILKIMOM ORDER SUMMARY COLUMN (PREVIOUS DESIGN WITH BKASH) --- */
            <div className="flex flex-col rounded-xl xs:rounded-2xl bg-muted/60 dark:bg-muted/30 p-4 xs:p-5 sm:p-6 min-w-0 border border-border/60 shadow-xs lg:col-span-5 lg:sticky lg:top-24">
              <div>
                <h3 className="font-heading text-base xs:text-lg font-bold text-foreground">আপনার অর্ডার</h3>
                
                <div className="mt-3 flex items-start justify-between gap-2 text-xs xs:text-sm">
                  <span className="text-muted-foreground leading-snug">
                    {singleJarPrice.label} {content.productName || "মিল্কিমম"} ({selectedFlavor.name}) ·{" "}
                    {singleJarPrice.perJarDays} দিনের ডোজ
                  </span>
                  <div className="text-right shrink-0">
                    <span className="block font-semibold text-foreground">
                      ৳{selectedFlavor.salePrice.toLocaleString("bn-BD")}
                    </span>
                    {selectedFlavor.regularPrice > selectedFlavor.salePrice && (
                      <span className="block text-[11px] xs:text-xs text-muted-foreground line-through">
                        ৳{selectedFlavor.regularPrice.toLocaleString("bn-BD")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs xs:text-sm text-muted-foreground">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="font-semibold text-brand-green">ফ্রি</span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border/80 pt-3">
                  <span className="font-semibold text-xs xs:text-sm text-foreground">সর্বমোট</span>
                  <span className="font-heading text-lg xs:text-xl sm:text-2xl font-extrabold text-primary">
                    ৳{selectedFlavor.salePrice.toLocaleString("bn-BD")}
                  </span>
                </div>

                {/* Payment Method Section */}
                <div className="mt-5 border-t border-border/80 pt-4">
                  <span className="text-xs xs:text-sm font-bold text-foreground">পেমেন্ট পদ্ধতি বেছে নিন</span>
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
                          "flex flex-1 cursor-pointer items-center justify-center gap-1.5 xs:gap-2 rounded-xl border px-2 xs:px-3 py-2.5 text-xs xs:text-sm font-medium transition-all duration-150 select-none",
                          form.payment === option.id
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs ring-1 ring-primary/30"
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
                            className="h-4 xs:h-5 w-auto object-contain shrink-0"
                          />
                        )}
                        <span className="whitespace-nowrap">{option.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Cash on Delivery Notice */}
                  {form.payment === "cod" && (
                    <div className="mt-3 rounded-xl xs:rounded-2xl border border-brand-green/30 bg-brand-green-light/80 p-3 xs:p-3.5 text-xs text-foreground shadow-xs">
                      <p className="flex items-center gap-1.5 font-bold text-brand-green text-xs xs:text-sm">
                        <Truck className="size-4 shrink-0 text-brand-green" />
                        <span>ক্যাশ অন ডেলিভারি</span>
                      </p>
                      <p className="mt-1 text-[11px] xs:text-xs font-semibold text-brand-green leading-relaxed">
                        সাপ্লিমেন্ট হাতে পেয়ে মূল্য পরিশোধ করবো।
                      </p>
                    </div>
                  )}

                  {/* bKash Payment Box */}
                  {form.payment === "bkash" && (
                    <div className="mt-3.5 space-y-3 rounded-xl border border-brand-coral/40 bg-card p-3 xs:p-4 text-foreground shadow-xs">
                      <div className="overflow-hidden rounded-xl border border-border bg-white p-2 text-center shadow-xs">
                        <img
                          src="/images/bkash.webp"
                          alt="bKash Payment"
                          className="mx-auto h-auto max-h-36 xs:max-h-48 sm:max-h-56 w-full rounded-lg object-contain"
                        />
                      </div>

                      <div className="rounded-xl border border-brand-crimson/20 bg-brand-cream/50 p-2.5 xs:p-3 text-center">
                        <span className="block text-[11px] xs:text-xs font-medium text-muted-foreground">
                          বিকাশ পার্সোনাল নম্বর (Send Money)
                        </span>
                        <span className="block font-mono text-base xs:text-lg font-bold tracking-wider text-brand-crimson select-all mt-0.5">
                          01926-344244
                        </span>
                      </div>

                      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 p-2.5 xs:p-3 text-[11px] xs:text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                        <p className="flex items-center gap-1.5 text-xs xs:text-sm font-bold text-amber-900 dark:text-amber-300">
                          <img
                            src="/assets/bkash-logo.webp"
                            alt="bKash"
                            className="h-4 w-auto object-contain shrink-0 inline-block"
                          />
                          <span>বিকাশ পেমেন্ট করার নির্দেশাবলী:</span>
                        </p>
                        <ol className="mt-1.5 list-decimal list-inside space-y-1 pl-0.5 text-[11px] xs:text-xs font-medium leading-relaxed text-muted-foreground">
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
                              ৳{selectedFlavor.salePrice.toLocaleString("bn-BD")}/=
                            </strong>{" "}
                            টাকা দিয়ে পিন দিন।
                          </li>
                          <li>
                            সেন্ড মানি সফল হওয়ার পর প্রাপ্ত{" "}
                            <strong className="text-foreground">Transaction ID (TrxID)</strong> নিচের ইনপুট বক্সে লিখুন।
                          </li>
                        </ol>
                      </div>

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
                          className="h-10 xs:h-11 font-mono uppercase text-xs xs:text-sm bg-background rounded-xl"
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
                  <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs xs:text-sm font-bold text-destructive shadow-xs">
                    <AlertCircle className="size-4.5 shrink-0 text-destructive" />
                    <span>{submitError}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={status === "submitting"}
                  className="cta-shine mt-4 h-12 xs:h-13 sm:h-14 w-full gap-2 rounded-full bg-brand-cta text-sm xs:text-base sm:text-lg font-bold text-brand-cta-foreground hover:bg-brand-cta-dark shadow-md shadow-brand-cta/20 active:scale-[0.99] transition-all cursor-pointer"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      <span>অর্ডার প্রসেস হচ্ছে...</span>
                    </>
                  ) : (
                    <span>অর্ডার কনফার্ম করুন</span>
                  )}
                </Button>

                <div className="mt-3.5 flex flex-wrap items-center justify-around gap-2 text-[11px] xs:text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="size-3.5 text-brand-green shrink-0" /> নিরাপদ ও সুরক্ষিত অর্ডার
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="size-3.5 text-brand-green shrink-0" /> সারাদেশে হোম ডেলিভারি
                  </span>
                </div>
              </div>
            </div>
          )}
        </form>
      </Reveal>

      {/* Error Popup Modal */}
      {showErrorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 xs:p-4 backdrop-blur-sm animate-in fade-in duration-200"
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
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl xs:rounded-3xl border border-brand-crimson/30 bg-card p-5 xs:p-6 sm:p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200"
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
              className="absolute right-3.5 top-3.5 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="size-5" />
            </button>

            <div className="mx-auto flex size-14 xs:size-16 items-center justify-center rounded-full bg-brand-crimson/10 text-brand-crimson">
              <PhoneCall className="size-7 xs:size-8 animate-bounce" />
            </div>

            <h3 className="mt-3.5 font-heading text-lg xs:text-xl font-bold text-foreground">
              মোবাইল নম্বর প্রয়োজন
            </h3>

            <p className="mt-2 text-xs xs:text-sm font-medium text-foreground leading-relaxed">
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

            <div className="mt-5 xs:mt-6">
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
                className="w-full rounded-full bg-brand-crimson text-white hover:bg-brand-crimson/90 font-bold h-10 xs:h-11 text-xs xs:text-sm shadow-md cursor-pointer"
              >
                ঠিক আছে, নম্বর দিচ্ছি
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Small Alert Toast Popup at Bottom */}
      {showCheckingPopup && (
        <div className="fixed bottom-20 xs:bottom-24 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:translate-x-0 z-[70] animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto max-w-sm mx-auto sm:mx-0">
          <div className="bg-slate-900/95 text-white backdrop-blur-md border border-slate-700/60 rounded-full shadow-2xl px-3.5 py-2.5 flex items-center gap-2.5">
            {popupType === "checking" && (
              <div className="relative flex items-center justify-center size-5.5 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                <Loader2 className="size-3.5 animate-spin text-emerald-400" />
              </div>
            )}
            {popupType === "tracked" && (
              <div className="flex items-center justify-center size-5.5 rounded-full bg-amber-500/20 text-amber-400 shrink-0">
                <ShieldAlert className="size-3.5 text-amber-400" />
              </div>
            )}
            {popupType === "clean" && (
              <div className="flex items-center justify-center size-5.5 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                <CheckCircle2 className="size-3.5 text-emerald-400" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 xs:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-background border border-primary/20 rounded-2xl xs:rounded-3xl shadow-2xl p-5 xs:p-6 sm:p-8 text-center">
            <button
              type="button"
              onClick={() => setShowOtpModal(false)}
              className="absolute right-3.5 top-3.5 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="size-5" />
            </button>

            <div className="mx-auto flex size-12 xs:size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 xs:mb-4">
              <KeyRound className="size-6 xs:size-7 animate-pulse text-primary" />
            </div>

            <h3 className="font-heading text-lg xs:text-xl sm:text-2xl font-extrabold text-foreground">
              মোবাইল ওটিপি (OTP) ভেরিফিকেশন
            </h3>

            <p className="mt-2 text-xs xs:text-sm text-muted-foreground leading-relaxed">
              নিরাপত্তার স্বার্থে আপনার মোবাইল নম্বর{" "}
              <span className="font-bold text-foreground">{form.phone}</span>-এ ৪ ডিজিটের ভেরিফিকেশন কোড পাঠানো হয়েছে।
            </p>

            <form onSubmit={handleVerifyOtpSubmit} className="mt-5 space-y-3.5">
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
                  className="h-12 xs:h-14 text-center font-mono text-2xl xs:text-3xl font-extrabold tracking-[0.5em] rounded-2xl border-2 border-primary/30 focus-visible:ring-primary/40"
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
                className="w-full h-11 xs:h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs xs:text-sm sm:text-base shadow-lg shadow-primary/20 cursor-pointer"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="size-4 xs:size-5 animate-spin mr-2" />
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
                    className="font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
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
