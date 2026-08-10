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
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
} from "@/lib/admin-api";

type TabType = "theme" | "content";

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
    announcementText: "",
    heroBadge: "",
    heroTitle: "",
    heroSubtitle: "",
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
      setContentData({
        productSlug: slug,
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

  async function handleSaveContent(e: FormEvent) {
    e.preventDefault();
    if (isModerator) return;

    setSaving(true);
    setMessage(null);

    const result = await updateCustomizationContent(selectedSlug, contentData);

    setSaving(false);

    if (result.success && result.data) {
      setMessage({ type: "success", text: `Section content for "${selectedSlug}" saved successfully!` });
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
      });
      setMessage({ type: "success", text: `Section content reset to default for "${selectedSlug}".` });
    } else {
      setMessage({
        type: "error",
        text: typeof result.error === "string" ? result.error : "Failed to reset section content",
      });
    }
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>, fieldName: "heroImage" | "doctorImage") {
    const file = e.target.files?.[0];
    if (!file || isModerator) return;

    setUploadingField(fieldName);
    setMessage(null);

    const result = await uploadAssetImage(selectedSlug, file);
    setUploadingField(null);

    if (result.success && result.data && result.data.url) {
      const uploadedUrl = result.data.url;
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
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_BASE_URL}${url}`;
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
            Customize theme colors, section copy, and server asset images independently for each product landing page.
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
                <form onSubmit={handleSaveContent} className="space-y-6">
                  {/* Announcement Bar Section */}
                  <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2 border-b border-border pb-3">
                      <Sparkles size={16} className="text-amber-500" />
                      Announcement Top Banner
                    </h3>
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
                  </div>

                  {/* Hero Section */}
                  <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2 border-b border-border pb-3">
                      <ImageIcon size={16} className="text-primary" />
                      Hero Section & Main Product Image
                    </h3>

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
                  </div>

                  {/* Doctor & Expert Section */}
                  <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2 border-b border-border pb-3">
                      <FileText size={16} className="text-emerald-600" />
                      Doctor & Expert Advisory Section
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">Section Title</label>
                        <input
                          type="text"
                          value={contentData.doctorTitle || ""}
                          onChange={(e) => setContentData({ ...contentData, doctorTitle: e.target.value })}
                          disabled={isModerator}
                          placeholder="e.g. বিশেষজ্ঞ ডাক্তারের পরামর্শ"
                          className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">Doctor Name</label>
                        <input
                          type="text"
                          value={contentData.doctorName || ""}
                          onChange={(e) => setContentData({ ...contentData, doctorName: e.target.value })}
                          disabled={isModerator}
                          placeholder="e.g. ডাঃ তানজিলা রহমান"
                          className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">Doctor Medical Degree / Title</label>
                      <input
                        type="text"
                        value={contentData.doctorDegree || ""}
                        onChange={(e) => setContentData({ ...contentData, doctorDegree: e.target.value })}
                        disabled={isModerator}
                        placeholder="e.g. এমবিবিএস, এফসিপিএস (গাইনি এন্ড অব্স)"
                        className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">Doctor Statement / Quote</label>
                      <textarea
                        rows={3}
                        value={contentData.doctorQuote || ""}
                        onChange={(e) => setContentData({ ...contentData, doctorQuote: e.target.value })}
                        disabled={isModerator}
                        placeholder="Doctor quote statement..."
                        className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                      />
                    </div>

                    {/* Doctor Photo Upload Box */}
                    <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                      <label className="block text-xs font-bold text-foreground">
                        Doctor Photo Image Upload (VPS Server Path)
                      </label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {contentData.doctorImage && (
                          <div className="relative size-20 rounded-xl border border-border bg-background overflow-hidden shrink-0 flex items-center justify-center">
                            <img
                              src={getFullImageUrl(contentData.doctorImage)}
                              alt="Doctor"
                              className="size-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={contentData.doctorImage || ""}
                              onChange={(e) => setContentData({ ...contentData, doctorImage: e.target.value })}
                              disabled={isModerator}
                              placeholder="/uploads/milkimom/doctor-photo.png"
                              className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 font-mono text-xs text-foreground outline-none focus:border-primary"
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition">
                              {uploadingField === "doctorImage" ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Upload size={14} />
                              )}
                              <span>
                                {uploadingField === "doctorImage" ? "Uploading to Server..." : "Upload Doctor Photo"}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                disabled={isModerator || uploadingField === "doctorImage"}
                                onChange={(e) => handleImageUpload(e, "doctorImage")}
                                className="hidden"
                              />
                            </label>

                            <span className="text-[11px] text-muted-foreground">
                              Saved to <code className="font-mono text-foreground">server/uploads/{selectedSlug}/</code>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order & Guarantee Section */}
                  <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2 border-b border-border pb-3">
                      <CheckCircle2 size={16} className="text-primary" />
                      Order Form & Guarantee Copy
                    </h3>

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
                  </div>

                  {/* Footer & Contact Section */}
                  <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2 border-b border-border pb-3">
                      <Globe size={16} className="text-blue-500" />
                      Footer & Contact Details
                    </h3>

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
                      <span>{saving ? "Saving Content..." : isModerator ? "Read-Only" : "Save Section Content"}</span>
                    </Button>
                  </div>
                </form>
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
    </div>
  );
}
