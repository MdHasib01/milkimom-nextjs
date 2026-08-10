"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import {
  Palette,
  RotateCcw,
  Save,
  Loader2,
  Plus,
  ShieldAlert,
  Lock,
  Sparkles,
  Check,
  Globe,
  ExternalLink,
  Eye,
  FileText,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Smartphone,
  Monitor,
  LayoutGrid,
  Columns,
  EyeOff,
  Maximize2,
  ArrowUp,
  ArrowDown,
  Trash2,
  Layers,
  UserCheck,
  X as CloseIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api-config";
import {
  fetchCustomizationThemes,
  updateCustomizationTheme,
  resetCustomizationTheme,
  createCustomizationTheme,
  fetchCustomizationContent,
  updateCustomizationContent,
  resetCustomizationContent,
  uploadAssetImage,
  getStoredUser,
  type LandingPageTheme,
  type LandingPageContentData,
  type CarouselItemData,
  type DoctorItemData,
} from "@/lib/admin-api";

// Exact live site components for section previews
import { AnnouncementBar } from "@/components/announcement-bar";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { DoctorSection } from "@/components/doctor-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { OrderSection } from "@/components/order-section";
import { GuaranteeSection } from "@/components/guarantee-section";
import { SiteFooter } from "@/components/site-footer";

// Extra landing page components for full page preview modal
import { TrustBadgesBar } from "@/components/trust-badges";
import { HowItWorksSection } from "@/components/how-it-works";
import { SpecialtiesSection } from "@/components/specialties-section";
import { ComparisonSection } from "@/components/comparison-section";
import { FaqSection } from "@/components/faq-section";

import {
  LandingPageContentProvider,
  type LandingPageSectionContent,
} from "@/components/landing-page-content-provider";

type TabType = "theme" | "content";

const DEFAULT_CAROUSEL_SLIDES: CarouselItemData[] = [
  {
    id: "1",
    title: "মা ও শিশুর যত্নে একটুও ছাড় নয়!",
    description: "বিশেষজ্ঞ ডাক্তারের পরামর্শ ও ১০০% সঠিক পুষ্টিতে আপনার শিশুর সুস্থ বিকাশ নিশ্চিত করুন।",
    tag: "ডাক্তারের পরামর্শ",
    image: "/assets/carousel/doctor.webp",
    imageMobile: "/assets/carousel/doctor.webp",
    imageSide: "left",
    sortOrder: 1,
  },
  {
    id: "2",
    title: "মা ও শিশুর যত্নে একটুও ছাড় নয়!",
    description: "১০০% প্রাকৃতিক উপাদান সমৃদ্ধ যা মায়ের বুকের দুধ বাড়াতে শতভাগ কার্যকর।",
    tag: "প্রাকৃতিক সুরক্ষা",
    image: "/assets/carousel/pic2.webp",
    imageMobile: "/assets/carousel/pic2.webp",
    imageSide: "right",
    sortOrder: 2,
  },
  {
    id: "3",
    title: "মা ও শিশুর যত্নে একটুও ছাড় নয়!",
    description: "মায়েদের বিশ্বস্ততা ও শিশুর সঠিক পুষ্টির সাথে গড়ে উঠুক সুন্দর ভবিষ্যৎ।",
    tag: "বিশ্বস্ত পছন্দ",
    image: "/assets/carousel/pic3.webp",
    imageMobile: "/assets/carousel/pic3.webp",
    imageSide: "left",
    sortOrder: 3,
  },
];

const DEFAULT_DOCTORS_LIST: DoctorItemData[] = [
  {
    id: "saddam",
    name: "ডা. মোঃ সাদ্দাম",
    degree: "এমবিবিএস, এফসিপিএস (গাইনি এন্ড অব্স)",
    title: "মেডিকেল বোর্ড অনুমোদিত",
    subtitle: "চিকিৎসকের তত্ত্বাবধানে তৈরি ফর্মুলা",
    description: "মিল্কিমম তৈরি হয়েছে গভর্নমেন্ট রেজিস্টার্ড চিকিৎসকদের তত্ত্বাবধানে, ৪৮০০+ বছরের প্রাচীন আয়ুর্বেদিক জ্ঞান ও আধুনিক বিজ্ঞানের গবেষণার সমন্বয়ে। প্রতিটি ব্যাচ ল্যাব টেস্টেড ও BSTI সার্টিফাইড, যাতে মা ও শিশু উভয়ের জন্যই এটি সম্পূর্ণ নিরাপদ থাকে।",
    image: "/assets/doctors/saddam.webp",
    sortOrder: 1,
  },
  {
    id: "nazmul",
    name: "ডা. মোঃ নাজমুল",
    degree: "এমবিবিএস, ডিজিইউ, শিশু ও মাতৃ পুষ্টি বিশেষজ্ঞ",
    title: "মেডিকেল বোর্ড অনুমোদিত",
    subtitle: "চিকিৎসকের তত্ত্বাবধানে তৈরি ফর্মুলা",
    description: "মিল্কিমম তৈরি হয়েছে গভর্নমেন্ট রেজিস্টার্ড চিকিৎসকদের তত্ত্বাবধানে, ৪৮০০+ বছরের প্রাচীন আয়ুর্বেদিক জ্ঞান ও আধুনিক বিজ্ঞানের গবেষণার সমন্বয়ে। প্রতিটি ব্যাচ ল্যাব টেস্টেড ও BSTI সার্টিফাইড, যাতে মা ও শিশু উভয়ের জন্যই এটি সম্পূর্ণ নিরাপদ থাকে।",
    image: "/assets/doctors/nazmul.webp",
    sortOrder: 2,
  },
];

function LiveSectionFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-primary/30 bg-background overflow-hidden shadow-lg transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/60 px-4 py-2.5 border-b border-border/80 text-xs">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{title}</span>
          {subtitle && <span className="text-[11px] font-normal text-muted-foreground">({subtitle})</span>}
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-extrabold text-primary border border-primary/20">
          Live UI Component Preview
        </span>
      </div>
      <div className="relative overflow-x-auto max-w-full">
        {children}
      </div>
    </div>
  );
}

export default function AdminCustomizationPage() {
  const currentUser = getStoredUser();
  const isModerator = currentUser?.role === "moderator";

  const [activeTab, setActiveTab] = useState<TabType>("theme");
  const [themes, setThemes] = useState<LandingPageTheme[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("milkimom");

  // Editable theme colors state
  const [name, setName] = useState<string>("");
  const [themeColor, setThemeColor] = useState<string>("#bd0052");
  const [accentColor, setAccentColor] = useState<string>("#e37a69");
  const [ctaColor, setCtaColor] = useState<string>("#ffd666");
  const [ctaTextColor, setCtaTextColor] = useState<string>("#3a2600");
  const [backgroundColor, setBackgroundColor] = useState<string>("#fff9f6");

  // Editable content state
  const [contentData, setContentData] = useState<LandingPageContentData>({
    productSlug: "milkimom",
    productName: "",
    productNameEn: "",
    logoType: "image",
    logoImage: "/images/logo.webp",
    announcementText: "",
    heroBadge: "",
    heroTitle: "",
    heroTitleHighlight: "",
    heroSubtitle: "",
    heroSubtitleHighlight: "",
    heroCtaText: "",
    heroImage: "",
    doctorTitle: "",
    doctorName: "",
    doctorDegree: "",
    doctorQuote: "",
    doctorImage: "",
    orderHeadline: "",
    orderSubheadline: "",
    guaranteeTitle: "",
    guaranteeText: "",
    footerText: "",
    footerPhone: "",
    footerEmail: "",
    footerAddress: "",
    carouselItems: DEFAULT_CAROUSEL_SLIDES,
    doctorItems: DEFAULT_DOCTORS_LIST,
  });

  // Content Live Preview View State
  const [contentViewMode, setContentViewMode] = useState<"inline" | "split" | "form">("inline");
  const [showFullLiveModal, setShowFullLiveModal] = useState<boolean>(false);
  const [modalViewport, setModalViewport] = useState<"desktop" | "mobile">("desktop");
  const [sectionPreviewsToggle, setSectionPreviewsToggle] = useState<{ [key: string]: boolean }>({
    branding: true,
    hero: true,
    doctor: true,
    carousel: true,
    order: true,
    footer: true,
  });

  // Image upload state
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // New landing page modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newSlug, setNewSlug] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [creatingTheme, setCreatingTheme] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadThemes();
  }, []);

  useEffect(() => {
    if (activeTab === "content" && selectedSlug) {
      loadContent(selectedSlug);
    }
  }, [activeTab, selectedSlug]);

  async function loadThemes() {
    setLoading(true);
    const result = await fetchCustomizationThemes();
    if (result.success && result.data) {
      const themesList = Array.isArray(result.data) ? result.data : result.data.data || [];
      setThemes(themesList);
      
      const current = themesList.find((t) => t.productSlug === selectedSlug) || themesList[0];
      if (current) {
        setSelectedSlug(current.productSlug);
        populateThemeForm(current);
      }
    }
    setLoading(false);
  }

  async function loadContent(slug: string) {
    setLoadingContent(true);
    const result = await fetchCustomizationContent(slug);
    if (result.success && result.data) {
      const data = (result.data as any).data || result.data;
      const carouselData = Array.isArray(data.carouselItems) && data.carouselItems.length > 0
        ? data.carouselItems
        : DEFAULT_CAROUSEL_SLIDES;

      const doctorData = Array.isArray(data.doctorItems) && data.doctorItems.length > 0
        ? data.doctorItems
        : DEFAULT_DOCTORS_LIST;

      setContentData({
        productSlug: slug,
        productName: data.productName || "",
        productNameEn: data.productNameEn || "",
        logoType: data.logoType || (slug === "smoothflow" ? "text" : "image"),
        logoImage: data.logoImage || "/images/logo.webp",
        announcementText: data.announcementText || "",
        heroBadge: data.heroBadge || "",
        heroTitle: data.heroTitle || "",
        heroTitleHighlight: data.heroTitleHighlight || "",
        heroSubtitle: data.heroSubtitle || "",
        heroSubtitleHighlight: data.heroSubtitleHighlight || "",
        heroCtaText: data.heroCtaText || "",
        heroImage: data.heroImage || "",
        doctorTitle: data.doctorTitle || "",
        doctorName: data.doctorName || "",
        doctorDegree: data.doctorDegree || "",
        doctorQuote: data.doctorQuote || "",
        doctorImage: data.doctorImage || "",
        orderHeadline: data.orderHeadline || "",
        orderSubheadline: data.orderSubheadline || "",
        guaranteeTitle: data.guaranteeTitle || "",
        guaranteeText: data.guaranteeText || "",
        footerText: data.footerText || "",
        footerPhone: data.footerPhone || "",
        footerEmail: data.footerEmail || "",
        footerAddress: data.footerAddress || "",
        carouselItems: carouselData,
        doctorItems: doctorData,
      });
    }
    setLoadingContent(false);
  }

  function populateThemeForm(theme: LandingPageTheme) {
    setName(theme.name || "");
    setThemeColor(theme.themeColor || "#bd0052");
    setAccentColor(theme.accentColor || "#e37a69");
    setCtaColor(theme.ctaColor || "#ffd666");
    setCtaTextColor(theme.ctaTextColor || "#3a2600");
    setBackgroundColor(theme.backgroundColor || "#fff9f6");
    setMessage(null);
  }

  function handleSelectSlug(slug: string) {
    setSelectedSlug(slug);
    const found = themes.find((t) => t.productSlug === slug);
    if (found) {
      populateThemeForm(found);
    }
    if (activeTab === "content") {
      loadContent(slug);
    }
  }

  function toggleSectionPreview(sectionKey: string) {
    setSectionPreviewsToggle((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  }

  // Dynamic Carousel Item Handlers
  function handleAddCarouselSlide() {
    if (isModerator) return;
    const newSlide: CarouselItemData = {
      id: `slide_${Date.now()}`,
      title: "নতুন স্লাইড শিরোনাম",
      description: "আপনার পণ্যের বিশেষ সুবিধাসমূহ বর্ণনা করুন...",
      tag: "বিশেষ ফিচার",
      image: "/assets/carousel/doctor.webp",
      imageMobile: "/assets/carousel/doctor.webp",
      imageSide: "left",
      sortOrder: (contentData.carouselItems?.length || 0) + 1,
    };
    setContentData((prev) => ({
      ...prev,
      carouselItems: [...(prev.carouselItems || []), newSlide],
    }));
  }

  function handleUpdateCarouselSlide(index: number, updatedField: Partial<CarouselItemData>) {
    if (isModerator) return;
    setContentData((prev) => {
      const list = [...(prev.carouselItems || [])];
      list[index] = { ...list[index], ...updatedField };
      return { ...prev, carouselItems: list };
    });
  }

  function handleRemoveCarouselSlide(index: number) {
    if (isModerator) return;
    setContentData((prev) => {
      const list = [...(prev.carouselItems || [])];
      list.splice(index, 1);
      return { ...prev, carouselItems: list };
    });
  }

  function handleMoveCarouselSlide(index: number, direction: "up" | "down") {
    if (isModerator) return;
    setContentData((prev) => {
      const list = [...(prev.carouselItems || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;

      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;

      list.forEach((item, idx) => {
        item.sortOrder = idx + 1;
      });

      return { ...prev, carouselItems: list };
    });
  }

  async function handleCarouselImageUpload(
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    field: "image" | "imageMobile"
  ) {
    const file = e.target.files?.[0];
    if (!file || isModerator) return;

    const uploadKey = `carousel_${index}_${field}`;
    setUploadingField(uploadKey);
    setMessage(null);

    const result = await uploadAssetImage(selectedSlug, file);
    setUploadingField(null);

    const uploadedUrl = result.data?.url || (result as any).url;
    if (result.success && uploadedUrl) {
      handleUpdateCarouselSlide(index, { [field]: uploadedUrl });
      setMessage({
        type: "success",
        text: `Carousel slide image uploaded to VPS asset path: ${uploadedUrl}`,
      });
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Failed to upload carousel slide image",
      });
    }
  }

  // Dynamic Multi-Doctor Handlers
  function handleAddDoctor() {
    if (isModerator) return;
    const newDoc: DoctorItemData = {
      id: `doc_${Date.now()}`,
      name: "ডা. নতুন বিশেষজ্ঞ",
      degree: "এমবিবিএস, এফসিপিএস",
      title: "মেডিকেল বোর্ড অনুমোদিত",
      subtitle: "চিকিৎসকের তত্ত্বাবধানে তৈরি ফর্মুলা",
      description: "বিশেষজ্ঞ চিকিৎসকের পরামর্শ ও বিস্তারিত মতামত...",
      image: "/assets/doctors/saddam.webp",
      sortOrder: (contentData.doctorItems?.length || 0) + 1,
    };
    setContentData((prev) => ({
      ...prev,
      doctorItems: [...(prev.doctorItems || []), newDoc],
    }));
  }

  function handleUpdateDoctor(index: number, updatedField: Partial<DoctorItemData>) {
    if (isModerator) return;
    setContentData((prev) => {
      const list = [...(prev.doctorItems || [])];
      list[index] = { ...list[index], ...updatedField };
      return { ...prev, doctorItems: list };
    });
  }

  function handleRemoveDoctor(index: number) {
    if (isModerator) return;
    setContentData((prev) => {
      const list = [...(prev.doctorItems || [])];
      list.splice(index, 1);
      return { ...prev, doctorItems: list };
    });
  }

  function handleMoveDoctor(index: number, direction: "up" | "down") {
    if (isModerator) return;
    setContentData((prev) => {
      const list = [...(prev.doctorItems || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;

      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;

      list.forEach((item, idx) => {
        item.sortOrder = idx + 1;
      });

      return { ...prev, doctorItems: list };
    });
  }

  async function handleDoctorImageUpload(e: ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0];
    if (!file || isModerator) return;

    const uploadKey = `doctor_${index}`;
    setUploadingField(uploadKey);
    setMessage(null);

    const result = await uploadAssetImage(selectedSlug, file);
    setUploadingField(null);

    const uploadedUrl = result.data?.url || (result as any).url;
    if (result.success && uploadedUrl) {
      handleUpdateDoctor(index, { image: uploadedUrl });
      setMessage({
        type: "success",
        text: `Doctor photo uploaded to VPS asset path: ${uploadedUrl}`,
      });
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Failed to upload doctor photo",
      });
    }
  }

  async function handleSaveTheme(e: FormEvent) {
    e.preventDefault();
    if (isModerator) return;

    setSaving(true);
    setMessage(null);

    const result = await updateCustomizationTheme(selectedSlug, {
      name,
      themeColor,
      accentColor,
      ctaColor,
      ctaTextColor,
      backgroundColor,
    });

    setSaving(false);

    if (result.success && result.data) {
      setMessage({ type: "success", text: `Theme colors for "${result.data.name}" saved successfully!` });
      setThemes((prev) =>
        prev.map((t) => (t.productSlug === selectedSlug ? { ...t, ...result.data } : t))
      );
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Failed to save theme colors",
      });
    }
  }

  async function handleResetTheme() {
    if (isModerator) return;
    if (!confirm(`Are you sure you want to reset "${name}" colors to default?`)) return;

    setResetting(true);
    setMessage(null);

    const result = await resetCustomizationTheme(selectedSlug);
    setResetting(false);

    if (result.success && result.data) {
      populateThemeForm(result.data);
      setMessage({ type: "success", text: `Theme colors reset to default for "${result.data.name}".` });
      setThemes((prev) =>
        prev.map((t) => (t.productSlug === selectedSlug ? { ...t, ...result.data } : t))
      );
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Failed to reset theme colors",
      });
    }
  }

  async function handleSaveContent(e?: FormEvent, sectionName?: string) {
    if (e) e.preventDefault();
    if (isModerator) return;

    setSaving(true);
    setMessage(null);

    const result = await updateCustomizationContent(selectedSlug, contentData);

    setSaving(false);

    if (result.success && result.data) {
      const successText = sectionName
        ? `"${sectionName}" saved successfully for "${selectedSlug}"!`
        : `Section content, doctors list & carousel slides for "${selectedSlug}" saved successfully!`;
      setMessage({ type: "success", text: successText });
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Failed to save section content",
      });
    }
  }

  async function handleResetContent() {
    if (isModerator) return;
    if (!confirm(`Are you sure you want to reset section content for "${selectedSlug}" to default?`)) return;

    setResetting(true);
    setMessage(null);

    const result = await resetCustomizationContent(selectedSlug);
    setResetting(false);

    if (result.success && result.data) {
      const data = (result.data as any).data || result.data;
      setContentData({
        productSlug: selectedSlug,
        productName: data.productName || "",
        productNameEn: data.productNameEn || "",
        logoType: data.logoType || (selectedSlug === "smoothflow" ? "text" : "image"),
        logoImage: data.logoImage || "/images/logo.webp",
        announcementText: data.announcementText || "",
        heroBadge: data.heroBadge || "",
        heroTitle: data.heroTitle || "",
        heroTitleHighlight: data.heroTitleHighlight || "",
        heroSubtitle: data.heroSubtitle || "",
        heroSubtitleHighlight: data.heroSubtitleHighlight || "",
        heroCtaText: data.heroCtaText || "",
        heroImage: data.heroImage || "",
        doctorTitle: data.doctorTitle || "",
        doctorName: data.doctorName || "",
        doctorDegree: data.doctorDegree || "",
        doctorQuote: data.doctorQuote || "",
        doctorImage: data.doctorImage || "",
        orderHeadline: data.orderHeadline || "",
        orderSubheadline: data.orderSubheadline || "",
        guaranteeTitle: data.guaranteeTitle || "",
        guaranteeText: data.guaranteeText || "",
        footerText: data.footerText || "",
        footerPhone: data.footerPhone || "",
        footerEmail: data.footerEmail || "",
        footerAddress: data.footerAddress || "",
        carouselItems: Array.isArray(data.carouselItems) && data.carouselItems.length > 0
          ? data.carouselItems
          : DEFAULT_CAROUSEL_SLIDES,
        doctorItems: Array.isArray(data.doctorItems) && data.doctorItems.length > 0
          ? data.doctorItems
          : DEFAULT_DOCTORS_LIST,
      });
      setMessage({ type: "success", text: `Section content reset to default for "${selectedSlug}".` });
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Failed to reset section content",
      });
    }
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>, fieldName: "heroImage" | "doctorImage" | "logoImage") {
    const file = e.target.files?.[0];
    if (!file || isModerator) return;

    setUploadingField(fieldName);
    setMessage(null);

    const result = await uploadAssetImage(selectedSlug, file);
    setUploadingField(null);

    const uploadedUrl = result.data?.url || (result as any).url;
    if (result.success && uploadedUrl) {
      setContentData((prev) => ({ ...prev, [fieldName]: uploadedUrl }));
      setMessage({
        type: "success",
        text: `Image uploaded to server VPS asset path: ${uploadedUrl}`,
      });
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Failed to upload image",
      });
    }
  }

  async function handleCreateNewTheme(e: FormEvent) {
    e.preventDefault();
    if (isModerator || !newSlug.trim()) return;

    setCreatingTheme(true);
    setMessage(null);

    const result = await createCustomizationTheme({
      productSlug: newSlug.trim().toLowerCase(),
      name: newName.trim() || newSlug.trim().toLowerCase(),
    });

    setCreatingTheme(false);

    if (result.success && result.data) {
      setShowAddModal(false);
      setNewSlug("");
      setNewName("");
      const newTheme = result.data;
      setThemes((prev) => [...prev, newTheme]);
      setSelectedSlug(newTheme.productSlug);
      populateThemeForm(newTheme);
      setMessage({ type: "success", text: `Created new landing page theme configuration for "${newTheme.name}".` });
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Failed to create landing page theme",
      });
    }
  }

  const colorFields = [
    {
      id: "themeColor",
      label: "Theme / Primary Brand Color",
      description: "Main brand highlights, headers, badge borders, primary action highlights",
      value: themeColor,
      onChange: setThemeColor,
      presets: ["#bd0052", "#0284c7", "#7c3aed", "#059669", "#dc2626", "#ea580c"],
    },
    {
      id: "accentColor",
      label: "Accent / Secondary Color",
      description: "Secondary badges, icon highlights, subtle borders, card highlights",
      value: accentColor,
      onChange: setAccentColor,
      presets: ["#e37a69", "#38bdf8", "#a78bfa", "#34d399", "#f87171", "#fb923c"],
    },
    {
      id: "ctaColor",
      label: "CTA Button Background Color",
      description: "Main action buttons ('অর্ডার করুন' / 'Order Now'), call-to-action cards",
      value: ctaColor,
      onChange: setCtaColor,
      presets: ["#ffd666", "#f59e0b", "#10b981", "#ec4899", "#3b82f6", "#84cc16"],
    },
    {
      id: "ctaTextColor",
      label: "CTA Button Text Color",
      description: "Font color inside CTA buttons for optimal contrast & readability",
      value: ctaTextColor,
      onChange: setCtaTextColor,
      presets: ["#3a2600", "#1e293b", "#ffffff", "#000000", "#18181b"],
    },
    {
      id: "backgroundColor",
      label: "Page Background Color",
      description: "Primary canvas color for the product landing page background",
      value: backgroundColor,
      onChange: setBackgroundColor,
      presets: ["#fff9f6", "#f0f9ff", "#faf5ff", "#f0fdf4", "#fef2f2", "#ffffff"],
    },
  ];

  function getFullImageUrl(url?: string) {
    if (!url || !url.trim()) return "";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) return trimmed;
    if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
      const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
      const base = API_BASE_URL || "http://localhost:5000";
      return `${base}${cleanPath}`;
    }
    return trimmed;
  }

  // Active theme variables for live section component previews
  const activeTheme = themes.find((t) => t.productSlug === selectedSlug) || {
    productSlug: selectedSlug,
    themeColor: themeColor || "#bd0052",
    accentColor: accentColor || "#e37a69",
    ctaColor: ctaColor || "#ffd666",
    ctaTextColor: ctaTextColor || "#3a2600",
    backgroundColor: backgroundColor || "#fff9f6",
  };

  const previewCssVars = {
    "--brand-crimson": activeTheme.themeColor,
    "--brand-coral": activeTheme.accentColor,
    "--brand-cta": activeTheme.ctaColor,
    "--brand-cta-foreground": activeTheme.ctaTextColor,
    "--brand-cream": activeTheme.backgroundColor,
    "--primary": activeTheme.themeColor,
    "--secondary": activeTheme.accentColor,
    "--background": activeTheme.backgroundColor,
    "--ring": activeTheme.accentColor,
    "--sidebar-primary": activeTheme.themeColor,
  } as React.CSSProperties;

  // Render form sections helper for Content & Media Assets tab
  function renderContentFormSections() {
    const slides = contentData.carouselItems || DEFAULT_CAROUSEL_SLIDES;
    const doctors = contentData.doctorItems || DEFAULT_DOCTORS_LIST;

    return (
      <div className="space-y-6">
        {/* Product Branding & Announcement Bar Section */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              Product Branding & Announcement Top Banner
            </h3>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => handleSaveContent(undefined, "Product Branding & Banner")}
                disabled={isModerator || saving}
                size="sm"
                className="gap-1.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                <span>Save Branding</span>
              </Button>
              {contentViewMode === "inline" && (
                <button
                  type="button"
                  onClick={() => toggleSectionPreview("branding")}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition"
                >
                  <Eye size={13} />
                  <span>{sectionPreviewsToggle.branding ? "Hide UI Preview" : "Show UI Preview"}</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Product Name (Bangla)
              </label>
              <input
                type="text"
                value={contentData.productName || ""}
                onChange={(e) => setContentData({ ...contentData, productName: e.target.value })}
                disabled={isModerator}
                placeholder="e.g. স্মুথফ্লো"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Product Name (English)
              </label>
              <input
                type="text"
                value={contentData.productNameEn || ""}
                onChange={(e) => setContentData({ ...contentData, productNameEn: e.target.value })}
                disabled={isModerator}
                placeholder="e.g. SmoothFlow"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Logo Display Mode & Logo Upload Section */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-foreground">
                  Header Brand Logo Display Mode
                </label>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Choose whether to display the graphic logo image or stylized brand title text in the header and footer.
                </p>
              </div>

              {/* Segmented Toggle Control */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background p-1 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setContentData({ ...contentData, logoType: "image" })}
                  disabled={isModerator}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                    (contentData.logoType || "image") === "image"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ImageIcon size={14} />
                  <span>Show Logo Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContentData({ ...contentData, logoType: "text" })}
                  disabled={isModerator}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                    contentData.logoType === "text"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <FileText size={14} />
                  <span>Show Text Logo</span>
                </button>
              </div>
            </div>

            {/* Logo Image Upload Box */}
            <div className="pt-3 border-t border-border/60">
              <label className="block text-[11px] font-bold text-foreground mb-2">
                Brand Logo Image Upload (VPS Server Path)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative size-16 rounded-xl border border-border bg-background overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                  {contentData.logoImage ? (
                    <img
                      src={getFullImageUrl(contentData.logoImage)}
                      alt="Brand Logo Preview"
                      className="size-full object-contain"
                    />
                  ) : (
                    <ImageIcon size={24} className="text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={contentData.logoImage || ""}
                      onChange={(e) => setContentData({ ...contentData, logoImage: e.target.value })}
                      disabled={isModerator}
                      placeholder="/images/logo.webp"
                      className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 font-mono text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition">
                      {uploadingField === "logoImage" ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Upload size={14} />
                      )}
                      <span>
                        {uploadingField === "logoImage" ? "Uploading Logo..." : "Upload Logo Image"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isModerator || uploadingField === "logoImage"}
                        onChange={(e) => handleImageUpload(e, "logoImage")}
                        className="hidden"
                      />
                    </label>

                    <span className="text-[11px] text-muted-foreground">
                      Directly saved to <code className="font-mono text-foreground">server/uploads/{selectedSlug}/</code>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Banner Text Announcement
            </label>
            <input
              type="text"
              value={contentData.announcementText || ""}
              onChange={(e) => setContentData({ ...contentData, announcementText: e.target.value })}
              disabled={isModerator}
              placeholder="e.g. 🎉 ১ম অর্ডারেই ১০০% ক্যাশ অন ডেলিভারি এবং সারাদেশে হোম ডেলিভারি ফ্রি!"
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>

          {contentViewMode === "inline" && sectionPreviewsToggle.branding && (
            <LiveSectionFrame title="Live Announcement Bar & Header Component">
              <div style={previewCssVars} className="bg-background text-foreground">
                <LandingPageContentProvider productSlug={selectedSlug} overrideContent={contentData as LandingPageSectionContent}>
                  <AnnouncementBar />
                  <SiteHeader />
                </LandingPageContentProvider>
              </div>
            </LiveSectionFrame>
          )}
        </div>

        {/* Hero Section */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <ImageIcon size={16} className="text-primary" />
              Hero Section & Main Product Image
            </h3>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => handleSaveContent(undefined, "Hero Section")}
                disabled={isModerator || saving}
                size="sm"
                className="gap-1.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                <span>Save Hero Section</span>
              </Button>
              {contentViewMode === "inline" && (
                <button
                  type="button"
                  onClick={() => toggleSectionPreview("hero")}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition"
                >
                  <Eye size={13} />
                  <span>{sectionPreviewsToggle.hero ? "Hide UI Preview" : "Show UI Preview"}</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Hero Badge Text</label>
              <input
                type="text"
                value={contentData.heroBadge || ""}
                onChange={(e) => setContentData({ ...contentData, heroBadge: e.target.value })}
                disabled={isModerator}
                placeholder="e.g. ১০০% সাইডইফেক্ট মুক্ত ও ন্যাচারাল"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Hero CTA Button Text</label>
              <input
                type="text"
                value={contentData.heroCtaText || ""}
                onChange={(e) => setContentData({ ...contentData, heroCtaText: e.target.value })}
                disabled={isModerator}
                placeholder="e.g. অর্ডার করতে এখানে ক্লিক করুন"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Hero Main Title / Headline</label>
            <input
              type="text"
              value={contentData.heroTitle || ""}
              onChange={(e) => setContentData({ ...contentData, heroTitle: e.target.value })}
              disabled={isModerator}
              placeholder="e.g. ১ ডোজেই, পার্মানেন্টলি বুকের দুধ বাড়াতে মিল্কিমম খান নিশ্চিন্তে!"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-bold text-foreground outline-none focus:border-primary"
            />
            <div className="mt-1.5">
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Main Title Highlight Word/Phrase (Applies Accent/Primary Color)
              </label>
              <input
                type="text"
                value={contentData.heroTitleHighlight || ""}
                onChange={(e) => setContentData({ ...contentData, heroTitleHighlight: e.target.value })}
                disabled={isModerator}
                placeholder="e.g. মিল্কিমম"
                className="w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs text-foreground font-mono outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Hero Subtitle / Description</label>
            <textarea
              rows={3}
              value={contentData.heroSubtitle || ""}
              onChange={(e) => setContentData({ ...contentData, heroSubtitle: e.target.value })}
              disabled={isModerator}
              placeholder="e.g. মিল্কিমম খেলে মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে, এবং ব্রেস্ট ফিডিং এর শেষ পর্যন্ত স্থায়ী হয়..."
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
            />
            <div className="mt-1.5">
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Subtitle Highlight Word/Phrase (Applies Bold Accent Color)
              </label>
              <input
                type="text"
                value={contentData.heroSubtitleHighlight || ""}
                onChange={(e) => setContentData({ ...contentData, heroSubtitleHighlight: e.target.value })}
                disabled={isModerator}
                placeholder="e.g. মাত্র ৩ দিনের মধ্যেই বুকের দুধ বাড়ে"
                className="w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs text-foreground font-mono outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Hero Image Upload Box */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
            <label className="block text-xs font-bold text-foreground">
              Hero Product Image Asset Upload (VPS Server Path)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {contentData.heroImage && (
                <div className="relative size-20 rounded-xl border border-border bg-background overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={getFullImageUrl(contentData.heroImage)}
                    alt="Hero Product"
                    className="size-full object-contain p-1"
                  />
                </div>
              )}

              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={contentData.heroImage || ""}
                    onChange={(e) => setContentData({ ...contentData, heroImage: e.target.value })}
                    disabled={isModerator}
                    placeholder="/uploads/milkimom/hero-product.png"
                    className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 font-mono text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition">
                    {uploadingField === "heroImage" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    <span>
                      {uploadingField === "heroImage" ? "Uploading to Server..." : "Upload Image File"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isModerator || uploadingField === "heroImage"}
                      onChange={(e) => handleImageUpload(e, "heroImage")}
                      className="hidden"
                    />
                  </label>

                  <span className="text-[11px] text-muted-foreground">
                    Directly saved to <code className="font-mono text-foreground">server/uploads/{selectedSlug}/</code>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {contentViewMode === "inline" && sectionPreviewsToggle.hero && (
            <LiveSectionFrame title="Live Hero Section Component">
              <div style={previewCssVars} className="bg-background text-foreground">
                <LandingPageContentProvider productSlug={selectedSlug} overrideContent={contentData as LandingPageSectionContent}>
                  <HeroSection />
                </LandingPageContentProvider>
              </div>
            </LiveSectionFrame>
          )}
        </div>

        {/* Doctor & Expert Advisory Section (Dynamic Multi-Doctor Management) */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <UserCheck size={17} className="text-emerald-600 dark:text-emerald-400" />
                Doctor & Expert Advisory Section (Dynamic Doctors List)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add, edit text copy, upload custom photos, reorder, and remove doctors dynamically for each product page.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => handleSaveContent(undefined, "Doctor Advisory Section")}
                disabled={isModerator || saving}
                size="sm"
                className="gap-1.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                <span>Save Doctors</span>
              </Button>

              <Button
                type="button"
                onClick={handleAddDoctor}
                disabled={isModerator}
                size="sm"
                className="gap-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus size={15} />
                <span>Add Doctor</span>
              </Button>

              {contentViewMode === "inline" && (
                <button
                  type="button"
                  onClick={() => toggleSectionPreview("doctor")}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition"
                >
                  <Eye size={13} />
                  <span>{sectionPreviewsToggle.doctor ? "Hide UI Preview" : "Show UI Preview"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Doctors Cards List */}
          <div className="space-y-4">
            {doctors.map((doc, index) => {
              const uploadKey = `doctor_${index}`;

              return (
                <div
                  key={doc.id || index}
                  className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-4 transition-all hover:border-emerald-500/40 shadow-xs"
                >
                  {/* Doctor Card Header & Controls */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 font-bold text-xs">
                        #{index + 1}
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        {doc.name || `Doctor ${index + 1}`}
                      </span>
                      {doc.degree && (
                        <span className="text-[11px] font-medium text-muted-foreground bg-background px-2 py-0.5 rounded-md border border-border">
                          {doc.degree}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={() => handleMoveDoctor(index, "up")}
                        disabled={isModerator || index === 0}
                        title="Move Up"
                        className="flex size-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp size={14} />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={() => handleMoveDoctor(index, "down")}
                        disabled={isModerator || index === doctors.length - 1}
                        title="Move Down"
                        className="flex size-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown size={14} />
                      </button>

                      {/* Remove Doctor */}
                      <button
                        type="button"
                        onClick={() => handleRemoveDoctor(index)}
                        disabled={isModerator || doctors.length <= 1}
                        title="Delete Doctor"
                        className="flex size-7 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Form fields for doctor */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                      <label className="block text-[11px] font-bold text-foreground mb-1">Doctor Name</label>
                      <input
                        type="text"
                        value={doc.name || ""}
                        onChange={(e) => handleUpdateDoctor(index, { name: e.target.value })}
                        disabled={isModerator}
                        placeholder="e.g. ডা. মোঃ সাদ্দাম"
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-[11px] font-bold text-foreground mb-1">Medical Degree / Qualifications</label>
                      <input
                        type="text"
                        value={doc.degree || ""}
                        onChange={(e) => handleUpdateDoctor(index, { degree: e.target.value })}
                        disabled={isModerator}
                        placeholder="e.g. এমবিবিএস, এফসিপিএস (গাইনি এন্ড অব্স)"
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-[11px] font-bold text-foreground mb-1">Badge Title</label>
                      <input
                        type="text"
                        value={doc.title || ""}
                        onChange={(e) => handleUpdateDoctor(index, { title: e.target.value })}
                        disabled={isModerator}
                        placeholder="e.g. মেডিকেল বোর্ড অনুমোদিত"
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-foreground mb-1">Doctor Subtitle / Highlight</label>
                    <input
                      type="text"
                      value={doc.subtitle || ""}
                      onChange={(e) => handleUpdateDoctor(index, { subtitle: e.target.value })}
                      disabled={isModerator}
                      placeholder="e.g. চিকিৎসকের তত্ত্বাবধানে তৈরি ফর্মুলা"
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-foreground mb-1">Doctor Quote / Statement Description</label>
                    <textarea
                      rows={3}
                      value={doc.description || ""}
                      onChange={(e) => handleUpdateDoctor(index, { description: e.target.value })}
                      disabled={isModerator}
                      placeholder="Doctor quote and recommendation details..."
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  {/* Doctor Photo Asset Upload Box */}
                  <div className="rounded-xl border border-border/80 bg-background p-3.5 space-y-2">
                    <label className="block text-[11px] font-bold text-foreground">
                      Doctor Photo Upload (VPS Server Asset Path)
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      {doc.image && (
                        <div className="relative size-14 rounded-xl border border-border bg-muted overflow-hidden shrink-0">
                          <img
                            src={getFullImageUrl(doc.image)}
                            alt={doc.name}
                            className="size-full object-cover object-top"
                          />
                        </div>
                      )}

                      <div className="flex-1 space-y-2 w-full">
                        <input
                          type="text"
                          value={doc.image || ""}
                          onChange={(e) => handleUpdateDoctor(index, { image: e.target.value })}
                          disabled={isModerator}
                          placeholder="/assets/doctors/saddam.webp"
                          className="w-full rounded-xl border border-input bg-background px-3 py-1.5 font-mono text-[11px] text-foreground outline-none focus:border-primary"
                        />

                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 transition">
                            {uploadingField === uploadKey ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Upload size={13} />
                            )}
                            <span>
                              {uploadingField === uploadKey ? "Uploading Photo..." : "Upload Doctor Photo"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isModerator || uploadingField === uploadKey}
                              onChange={(e) => handleDoctorImageUpload(e, index)}
                              className="hidden"
                            />
                          </label>

                          <span className="text-[10px] text-muted-foreground">
                            Saved to <code className="font-mono text-foreground">server/uploads/{selectedSlug}/</code>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {contentViewMode === "inline" && sectionPreviewsToggle.doctor && (
            <LiveSectionFrame title="Live Doctor Advisory Component">
              <div style={previewCssVars} className="bg-background text-foreground">
                <LandingPageContentProvider productSlug={selectedSlug} overrideContent={contentData as LandingPageSectionContent}>
                  <DoctorSection />
                </LandingPageContentProvider>
              </div>
            </LiveSectionFrame>
          )}
        </div>

        {/* Carousel & Banner Slides Management Section */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Layers size={17} className="text-purple-600 dark:text-purple-400" />
                Care Carousel & Banner Slides Management
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload separate images for different device views (Desktop vs Mobile), adjust slide position alignment, and dynamically reorder/sort slides.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => handleSaveContent(undefined, "Care Carousel Section")}
                disabled={isModerator || saving}
                size="sm"
                className="gap-1.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                <span>Save Carousel</span>
              </Button>

              <Button
                type="button"
                onClick={handleAddCarouselSlide}
                disabled={isModerator}
                size="sm"
                className="gap-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus size={15} />
                <span>Add Carousel Slide</span>
              </Button>

              {contentViewMode === "inline" && (
                <button
                  type="button"
                  onClick={() => toggleSectionPreview("carousel")}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition"
                >
                  <Eye size={13} />
                  <span>{sectionPreviewsToggle.carousel ? "Hide UI Preview" : "Show UI Preview"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Carousel Slide Cards */}
          <div className="space-y-4">
            {slides.map((slide, index) => {
              const desktopKey = `carousel_${index}_image`;
              const mobileKey = `carousel_${index}_imageMobile`;

              return (
                <div
                  key={slide.id || index}
                  className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-4 transition-all hover:border-primary/40 shadow-xs"
                >
                  {/* Card Header & Controls */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                        #{index + 1}
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        {slide.tag ? `[${slide.tag}] ` : ""}{slide.title || `Slide ${index + 1}`}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground bg-background px-2 py-0.5 rounded-md border border-border">
                        Sort Order: {slide.sortOrder || index + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Sort Up */}
                      <button
                        type="button"
                        onClick={() => handleMoveCarouselSlide(index, "up")}
                        disabled={isModerator || index === 0}
                        title="Move Up"
                        className="flex size-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp size={14} />
                      </button>

                      {/* Sort Down */}
                      <button
                        type="button"
                        onClick={() => handleMoveCarouselSlide(index, "down")}
                        disabled={isModerator || index === slides.length - 1}
                        title="Move Down"
                        className="flex size-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown size={14} />
                      </button>

                      {/* Remove Slide */}
                      <button
                        type="button"
                        onClick={() => handleRemoveCarouselSlide(index)}
                        disabled={isModerator || slides.length <= 1}
                        title="Delete Slide"
                        className="flex size-7 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Form fields for slide */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                      <label className="block text-[11px] font-bold text-foreground mb-1">
                        Slide Tag / Category Badge
                      </label>
                      <input
                        type="text"
                        value={slide.tag || ""}
                        onChange={(e) => handleUpdateCarouselSlide(index, { tag: e.target.value })}
                        disabled={isModerator}
                        placeholder="e.g. ডাক্তারের পরামর্শ"
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                      />
                    </div>

                    <div className="md:col-span-5">
                      <label className="block text-[11px] font-bold text-foreground mb-1">
                        Slide Title / Headline
                      </label>
                      <input
                        type="text"
                        value={slide.title || ""}
                        onChange={(e) => handleUpdateCarouselSlide(index, { title: e.target.value })}
                        disabled={isModerator}
                        placeholder="e.g. মা ও শিশুর যত্নে একটুও ছাড় নয়!"
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground font-semibold outline-none focus:border-primary"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-bold text-foreground mb-1">
                        Text Overlay Side
                      </label>
                      <select
                        value={slide.imageSide || "left"}
                        onChange={(e) =>
                          handleUpdateCarouselSlide(index, {
                            imageSide: e.target.value as "left" | "right" | "center",
                          })
                        }
                        disabled={isModerator}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground font-medium outline-none focus:border-primary"
                      >
                        <option value="left">Left Side Align ⬅️</option>
                        <option value="center">Center Align ↔️</option>
                        <option value="right">Right Side Align ➡️</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-foreground mb-1">
                      Slide Subtitle / Description
                    </label>
                    <textarea
                      rows={2}
                      value={slide.description || ""}
                      onChange={(e) => handleUpdateCarouselSlide(index, { description: e.target.value })}
                      disabled={isModerator}
                      placeholder="Slide detailed description..."
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  {/* Responsive Dual Image Upload Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-border/60 bg-background p-3.5">
                    {/* Desktop Viewport Image */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-foreground flex items-center gap-1.5">
                          <Monitor size={13} className="text-primary" />
                          <span>Desktop View Banner Image (Wide)</span>
                        </label>
                        {slide.image && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            Path active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {slide.image && (
                          <div className="relative size-12 rounded-lg border border-border bg-muted overflow-hidden shrink-0">
                            <img
                              src={getFullImageUrl(slide.image)}
                              alt="Desktop preview"
                              className="size-full object-cover"
                            />
                          </div>
                        )}
                        <input
                          type="text"
                          value={slide.image || ""}
                          onChange={(e) => handleUpdateCarouselSlide(index, { image: e.target.value })}
                          disabled={isModerator}
                          placeholder="/assets/carousel/doctor.webp"
                          className="flex-1 rounded-xl border border-input bg-background px-3 py-1.5 font-mono text-[11px] text-foreground outline-none focus:border-primary"
                        />
                      </div>

                      <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-primary/90 px-3 py-1.5 text-[11px] font-bold text-primary-foreground hover:bg-primary transition">
                        {uploadingField === desktopKey ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Upload size={13} />
                        )}
                        <span>
                          {uploadingField === desktopKey ? "Uploading Desktop Img..." : "Upload Desktop Image"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isModerator || uploadingField === desktopKey}
                          onChange={(e) => handleCarouselImageUpload(e, index, "image")}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Mobile Viewport Image */}
                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0 md:pl-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-foreground flex items-center gap-1.5">
                          <Smartphone size={13} className="text-emerald-600" />
                          <span>Mobile View Image (Tall / Switch Side)</span>
                        </label>
                        {slide.imageMobile && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            Path active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {slide.imageMobile && (
                          <div className="relative size-12 rounded-lg border border-border bg-muted overflow-hidden shrink-0">
                            <img
                              src={getFullImageUrl(slide.imageMobile)}
                              alt="Mobile preview"
                              className="size-full object-cover"
                            />
                          </div>
                        )}
                        <input
                          type="text"
                          value={slide.imageMobile || ""}
                          onChange={(e) => handleUpdateCarouselSlide(index, { imageMobile: e.target.value })}
                          disabled={isModerator}
                          placeholder="/assets/carousel/doctor.webp"
                          className="flex-1 rounded-xl border border-input bg-background px-3 py-1.5 font-mono text-[11px] text-foreground outline-none focus:border-primary"
                        />
                      </div>

                      <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 transition">
                        {uploadingField === mobileKey ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Upload size={13} />
                        )}
                        <span>
                          {uploadingField === mobileKey ? "Uploading Mobile Img..." : "Upload Mobile Image"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isModerator || uploadingField === mobileKey}
                          onChange={(e) => handleCarouselImageUpload(e, index, "imageMobile")}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {contentViewMode === "inline" && sectionPreviewsToggle.carousel && (
            <LiveSectionFrame title="Live Care Carousel Component">
              <div style={previewCssVars} className="bg-background text-foreground p-4">
                <LandingPageContentProvider productSlug={selectedSlug} overrideContent={contentData as LandingPageSectionContent}>
                  <TestimonialsSection />
                </LandingPageContentProvider>
              </div>
            </LiveSectionFrame>
          )}
        </div>

        {/* Order & Guarantee Section */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <CheckCircle2 size={16} className="text-primary" />
              Order Form & Guarantee Copy
            </h3>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => handleSaveContent(undefined, "Order & Guarantee Section")}
                disabled={isModerator || saving}
                size="sm"
                className="gap-1.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                <span>Save Order Copy</span>
              </Button>
              {contentViewMode === "inline" && (
                <button
                  type="button"
                  onClick={() => toggleSectionPreview("order")}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition"
                >
                  <Eye size={13} />
                  <span>{sectionPreviewsToggle.order ? "Hide UI Preview" : "Show UI Preview"}</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Order Section Headline</label>
              <input
                type="text"
                value={contentData.orderHeadline || ""}
                onChange={(e) => setContentData({ ...contentData, orderHeadline: e.target.value })}
                disabled={isModerator}
                placeholder="e.g. আজই অর্ডার করুন মিল্কিমম™"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Offer Subheadline</label>
              <input
                type="text"
                value={contentData.orderSubheadline || ""}
                onChange={(e) => setContentData({ ...contentData, orderSubheadline: e.target.value })}
                disabled={isModerator}
                placeholder="e.g. নিচে আপনার তথ্য দিয়ে অর্ডার সম্পন্ন করুন"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Guarantee Badge Title</label>
            <input
              type="text"
              value={contentData.guaranteeTitle || ""}
              onChange={(e) => setContentData({ ...contentData, guaranteeTitle: e.target.value })}
              disabled={isModerator}
              placeholder="e.g. ১০০% স্যাটিসফ্যাকশন ও মানি-ব্যাক গ্যারান্টি"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Guarantee Description</label>
            <textarea
              rows={2}
              value={contentData.guaranteeText || ""}
              onChange={(e) => setContentData({ ...contentData, guaranteeText: e.target.value })}
              disabled={isModerator}
              placeholder="Guarantee text copy..."
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>

          {contentViewMode === "inline" && sectionPreviewsToggle.order && (
            <LiveSectionFrame title="Live Order Form & Guarantee Components">
              <div style={previewCssVars} className="bg-background text-foreground space-y-6">
                <LandingPageContentProvider productSlug={selectedSlug} overrideContent={contentData as LandingPageSectionContent}>
                  <OrderSection />
                  <GuaranteeSection />
                </LandingPageContentProvider>
              </div>
            </LiveSectionFrame>
          )}
        </div>

        {/* Footer & Contact Section */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Globe size={16} className="text-blue-500" />
              Footer & Contact Details
            </h3>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => handleSaveContent(undefined, "Footer & Contact Section")}
                disabled={isModerator || saving}
                size="sm"
                className="gap-1.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                <span>Save Footer</span>
              </Button>
              {contentViewMode === "inline" && (
                <button
                  type="button"
                  onClick={() => toggleSectionPreview("footer")}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition"
                >
                  <Eye size={13} />
                  <span>{sectionPreviewsToggle.footer ? "Hide UI Preview" : "Show UI Preview"}</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Footer Brand Tagline Text</label>
            <input
              type="text"
              value={contentData.footerText || ""}
              onChange={(e) => setContentData({ ...contentData, footerText: e.target.value })}
              disabled={isModerator}
              placeholder="e.g. মিল্কিমম™ - মা ও শিশুর সুস্থতায় প্রতিদিনের সেরা যত্ন"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Contact Phone</label>
              <input
                type="text"
                value={contentData.footerPhone || ""}
                onChange={(e) => setContentData({ ...contentData, footerPhone: e.target.value })}
                disabled={isModerator}
                placeholder="01517-102603"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-mono text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Contact Email</label>
              <input
                type="email"
                value={contentData.footerEmail || ""}
                onChange={(e) => setContentData({ ...contentData, footerEmail: e.target.value })}
                disabled={isModerator}
                placeholder="milkimominfo@gmail.com"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Contact Address</label>
              <input
                type="text"
                value={contentData.footerAddress || ""}
                onChange={(e) => setContentData({ ...contentData, footerAddress: e.target.value })}
                disabled={isModerator}
                placeholder="Mohammadpur, Dhaka"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          {contentViewMode === "inline" && sectionPreviewsToggle.footer && (
            <LiveSectionFrame title="Live Footer & Contact Component">
              <div style={previewCssVars} className="bg-background text-foreground">
                <LandingPageContentProvider productSlug={selectedSlug} overrideContent={contentData as LandingPageSectionContent}>
                  <SiteFooter />
                </LandingPageContentProvider>
              </div>
            </LiveSectionFrame>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
            <Palette className="text-primary" size={26} />
            Landing Page Customization
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Customize theme colors, section copy, doctors list, carousel slides, and server asset images independently with live UI component preview.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          disabled={isModerator}
          variant="outline"
          className="gap-2 rounded-xl text-xs font-bold self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Product Landing Page
        </Button>
      </div>

      {isModerator && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm font-semibold text-amber-700 dark:text-amber-400">
          <ShieldAlert size={20} className="shrink-0 text-amber-600 dark:text-amber-400" />
          <span>You are logged in as a Moderator (View-Only). Customization settings can be viewed, but editing and saving are restricted to Admins.</span>
        </div>
      )}

      {/* Main Tabs Header */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab("theme");
            setMessage(null);
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === "theme"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
              : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Palette size={16} />
          <span>🎨 Theme & Colors</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("content");
            setMessage(null);
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === "content"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
              : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <FileText size={16} />
          <span>📝 Content & Media Assets</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-border bg-card p-16">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Landing Page Selector */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Product Landing Page
            </label>
            <div className="flex flex-wrap gap-2">
              {themes.map((t) => (
                <button
                  key={t.productSlug}
                  type="button"
                  onClick={() => handleSelectSlug(t.productSlug)}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                    selectedSlug === t.productSlug
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "border border-border bg-muted/30 text-foreground hover:bg-muted"
                  }`}
                >
                  <span
                    className="size-3 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: t.themeColor }}
                  />
                  <span>{t.name}</span>
                  <span className="font-mono text-[11px] opacity-75">
                    ({t.productSlug === "milkimom" ? "/" : `/${t.productSlug}`})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: THEME & COLORS */}
          {activeTab === "theme" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Controls Column */}
              <div className="lg:col-span-7 space-y-6">
                <form onSubmit={handleSaveTheme} className="rounded-2xl border border-border bg-card p-6 space-y-6">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-foreground">
                      Landing Page Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isModerator}
                      placeholder="e.g. Milkimom Main Landing"
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                      Color Settings
                    </h3>

                    {colorFields.map((field) => (
                      <div key={field.id} className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <label className="block text-xs font-bold text-foreground">{field.label}</label>
                            <p className="text-[11px] text-muted-foreground">{field.description}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <input
                              type="color"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              disabled={isModerator}
                              className="size-9 rounded-lg border border-border cursor-pointer p-0.5 bg-background disabled:cursor-not-allowed"
                            />
                            <input
                              type="text"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              disabled={isModerator}
                              maxLength={7}
                              className="w-24 rounded-lg border border-input bg-background px-2.5 py-1.5 font-mono text-xs text-foreground uppercase outline-none focus:border-primary"
                            />
                          </div>
                        </div>

                        {/* Presets */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-semibold text-muted-foreground">Presets:</span>
                          {field.presets.map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => field.onChange(preset)}
                              disabled={isModerator}
                              title={preset}
                              className={`size-5 rounded-full border border-black/10 transition-transform hover:scale-110 ${
                                field.value.toLowerCase() === preset.toLowerCase()
                                  ? "ring-2 ring-primary ring-offset-1"
                                  : ""
                              }`}
                              style={{ backgroundColor: preset }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {message && (
                    <div
                      className={`rounded-xl border px-4 py-3 text-xs font-semibold ${
                        message.type === "success"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "border-destructive/20 bg-destructive/10 text-destructive"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetTheme}
                      disabled={resetting || isModerator}
                      className="gap-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                    >
                      {resetting ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw size={15} />}
                      <span>Reset to Default</span>
                    </Button>

                    <Button
                      type="submit"
                      disabled={saving || isModerator}
                      className="gap-2 rounded-xl px-6 py-2.5 text-xs font-bold"
                    >
                      {saving ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : isModerator ? (
                        <Lock size={15} />
                      ) : (
                        <Save size={15} />
                      )}
                      <span>{saving ? "Saving..." : isModerator ? "Read-Only" : "Save Changes"}</span>
                    </Button>
                  </div>
                </form>
              </div>

              {/* Live Preview Side Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="sticky top-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-2xs">
                        <Eye size={14} />
                      </span>
                      Live Theme Preview
                    </h3>
                    <a
                      href={selectedSlug === "milkimom" ? "/" : `/${selectedSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      View Page <ExternalLink size={13} />
                    </a>
                  </div>

                  {/* Simulated Landing Page Mockup Card */}
                  <div
                    className="rounded-3xl border border-border p-6 shadow-xl space-y-5 transition-colors duration-200"
                    style={{ backgroundColor }}
                  >
                    {/* Header Badge */}
                    <div className="flex justify-between items-center border-b border-black/10 pb-3">
                      <span className="font-extrabold text-sm tracking-tight" style={{ color: themeColor }}>
                        {name || "Milkimom"}
                      </span>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-bold border"
                        style={{
                          backgroundColor: `${accentColor}20`,
                          color: themeColor,
                          borderColor: `${accentColor}50`,
                        }}
                      >
                        100% natural formula
                      </span>
                    </div>

                    {/* Hero Section Mock */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-black leading-snug" style={{ color: themeColor }}>
                        মা ও শিশুর সুস্থতায় প্রতিদিনের সেরা যত্ন
                      </h4>
                      <p className="text-xs font-medium text-slate-700 leading-relaxed">
                        প্রিমিয়াম প্রাকৃতিক উপাদান দিয়ে তৈরি দুধের পুষ্টি বৃদ্ধিতে সহায়ক খাবার।
                      </p>
                    </div>

                    {/* Simulated Pricing Box */}
                    <div
                      className="rounded-2xl border p-4 space-y-2"
                      style={{
                        backgroundColor: "#ffffff",
                        borderColor: `${accentColor}40`,
                      }}
                    >
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-600">রেগুলার মূল্য:</span>
                        <span className="line-through text-slate-400">৳৮,৯৯০</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-extrabold">
                        <span style={{ color: themeColor }}>আজকের বিশেষ ছাড়:</span>
                        <span className="text-base font-black" style={{ color: themeColor }}>
                          ৳৪,৯৯০
                        </span>
                      </div>
                    </div>

                    {/* CTA Button Preview */}
                    <div>
                      <button
                        type="button"
                        className="w-full py-3.5 px-6 rounded-2xl font-black text-sm shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
                        style={{
                          backgroundColor: ctaColor,
                          color: ctaTextColor,
                          boxShadow: `0 8px 20px -4px ${ctaColor}80`,
                        }}
                      >
                        <Check size={18} />
                        <span>অর্ডার করতে এখানে ক্লিক করুন</span>
                      </button>
                      <p className="text-[10px] text-center font-bold text-slate-500 mt-2">
                        ক্যাশ অন ডেলিভারি সুবিধা (পণ্য হাতে পেয়ে টাকা দিন)
                      </p>
                    </div>

                    {/* Accent Tag Preview */}
                    <div className="flex items-center justify-center gap-2 pt-2 border-t border-black/10">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      />
                      <span className="text-[11px] font-bold text-slate-600">
                        সারাদেশে ফ্রি হোম ডেলিভারি
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT & MEDIA ASSETS */}
          {activeTab === "content" && (
            <div className="space-y-6">
              {loadingContent ? (
                <div className="flex justify-center rounded-2xl border border-border bg-card p-12">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Top Preview Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
                        Preview Mode:
                      </span>

                      <button
                        type="button"
                        onClick={() => setContentViewMode("inline")}
                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                          contentViewMode === "inline"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <LayoutGrid size={14} />
                        <span>Inline Previews</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setContentViewMode("split")}
                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                          contentViewMode === "split"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Columns size={14} />
                        <span>Split View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setContentViewMode("form")}
                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                          contentViewMode === "form"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <EyeOff size={14} />
                        <span>Form Only</span>
                      </button>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setShowFullLiveModal(true)}
                      variant="outline"
                      className="gap-2 rounded-xl text-xs font-bold border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <Maximize2 size={14} />
                      <span>Full Live Landing Page Preview</span>
                    </Button>
                  </div>

                  {/* Main Editing & Preview Content Area */}
                  {contentViewMode === "split" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left Side: Form Controls */}
                      <div className="lg:col-span-6 space-y-6">
                        {renderContentFormSections()}
                      </div>

                      {/* Right Side: Sticky Live Page Preview */}
                      <div className="lg:col-span-6 space-y-4">
                        <div className="sticky top-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                              <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-2xs">
                                <Eye size={14} />
                              </span>
                              Live Page Component Previews
                            </h3>
                            <a
                              href={selectedSlug === "milkimom" ? "/" : `/${selectedSlug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                            >
                              View Page <ExternalLink size={13} />
                            </a>
                          </div>

                          <div
                            className="max-h-[calc(100vh-8rem)] overflow-y-auto space-y-6 rounded-3xl border border-border bg-background p-4 shadow-xl text-foreground"
                            style={previewCssVars}
                          >
                            <LandingPageContentProvider productSlug={selectedSlug} overrideContent={contentData as LandingPageSectionContent}>
                              <div className="space-y-6">
                                <div className="rounded-2xl border border-border/80 overflow-hidden shadow-sm">
                                  <AnnouncementBar />
                                  <SiteHeader />
                                </div>
                                <div className="rounded-2xl border border-border/80 overflow-hidden shadow-sm">
                                  <HeroSection />
                                </div>
                                <div className="rounded-2xl border border-border/80 overflow-hidden shadow-sm">
                                  <DoctorSection />
                                </div>
                                <div className="rounded-2xl border border-border/80 overflow-hidden shadow-sm p-4 bg-background">
                                  <TestimonialsSection />
                                </div>
                                <div className="rounded-2xl border border-border/80 overflow-hidden shadow-sm">
                                  <OrderSection />
                                </div>
                                <div className="rounded-2xl border border-border/80 overflow-hidden shadow-sm">
                                  <GuaranteeSection />
                                </div>
                                <div className="rounded-2xl border border-border/80 overflow-hidden shadow-sm">
                                  <SiteFooter />
                                </div>
                              </div>
                            </LandingPageContentProvider>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>{renderContentFormSections()}</div>
                  )}

                  {message && (
                    <div
                      className={`rounded-xl border px-4 py-3 text-xs font-semibold ${
                        message.type === "success"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "border-destructive/20 bg-destructive/10 text-destructive"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  {/* Content Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetContent}
                      disabled={resetting || isModerator}
                      className="gap-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                    >
                      {resetting ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw size={15} />}
                      <span>Reset Content to Default</span>
                    </Button>

                    <Button
                      type="button"
                      onClick={() => handleSaveContent()}
                      disabled={saving || isModerator}
                      className="gap-2 rounded-xl px-6 py-2.5 text-xs font-bold"
                    >
                      {saving ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : isModerator ? (
                        <Lock size={15} />
                      ) : (
                        <Save size={15} />
                      )}
                      <span>{saving ? "Saving Content..." : isModerator ? "Read-Only" : "Save Section Content"}</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add New Landing Page Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Globe className="text-primary" size={18} />
                Add New Product Landing Page
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewTheme} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1">
                  Product Slug (URL Path) *
                </label>
                <input
                  type="text"
                  required
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="e.g. smoothflow"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground font-mono outline-none focus:border-primary"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  URL route for the product page (e.g. <span className="font-mono">/smoothflow</span>).
                </p>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">
                  Landing Page Display Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. SmoothFlow Landing"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creatingTheme || !newSlug.trim()}
                  className="gap-2 rounded-xl text-xs font-bold"
                >
                  {creatingTheme && <Loader2 size={14} className="animate-spin" />}
                  <span>Create Theme & Content</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Live Landing Page Preview Modal */}
      {showFullLiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative flex h-[94vh] w-full max-w-6xl flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/30 shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex size-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    Full Live Landing Page UI Preview
                    <span className="font-mono text-xs text-primary font-semibold">({selectedSlug})</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Live end-to-end preview updated in real-time as content, doctors list, carousel slides & media assets change
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Viewport Switcher */}
                <div className="flex items-center gap-1 bg-background rounded-xl border border-border p-1">
                  <button
                    type="button"
                    onClick={() => setModalViewport("desktop")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                      modalViewport === "desktop"
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Monitor size={14} /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalViewport("mobile")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                      modalViewport === "mobile"
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Smartphone size={14} /> Mobile
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFullLiveModal(false)}
                  className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground transition hover:bg-muted"
                >
                  <CloseIcon size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body Scroll Container */}
            <div className="flex-1 overflow-y-auto bg-muted/30 p-4 sm:p-6 flex justify-center">
              <div
                className={`transition-all duration-300 rounded-3xl border border-border bg-background shadow-2xl text-foreground ${
                  modalViewport === "mobile" ? "w-full max-w-sm" : "w-full max-w-5xl"
                }`}
                style={previewCssVars}
              >
                <LandingPageContentProvider productSlug={selectedSlug} overrideContent={contentData as LandingPageSectionContent}>
                  <div className="relative min-h-screen w-full max-w-full overflow-x-clip">
                    <AnnouncementBar />
                    <SiteHeader />
                    <main className="pb-24 sm:pb-0">
                      <HeroSection />
                      <TrustBadgesBar />
                      <HowItWorksSection />
                      <SpecialtiesSection />
                      <ComparisonSection />
                      <DoctorSection />
                      <TestimonialsSection />
                      <FaqSection />
                      <OrderSection />
                      <GuaranteeSection />
                    </main>
                    <SiteFooter />
                  </div>
                </LandingPageContentProvider>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
