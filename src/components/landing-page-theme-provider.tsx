"use client";

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/lib/api-config";

export interface ThemeColors {
  productSlug: string;
  themeColor: string;
  accentColor: string;
  ctaColor: string;
  ctaTextColor: string;
  backgroundColor: string;
}

const DEFAULT_THEME_COLORS: Record<string, ThemeColors> = {
  milkimom: {
    productSlug: "milkimom",
    themeColor: "#bd0052",
    accentColor: "#e37a69",
    ctaColor: "#ffd666",
    ctaTextColor: "#3a2600",
    backgroundColor: "#fff9f6",
  },
  smoothflow: {
    productSlug: "smoothflow",
    themeColor: "#E6106E",
    accentColor: "#f472b6",
    ctaColor: "#ffd666",
    ctaTextColor: "#3a2600",
    backgroundColor: "#FFF9FB",
  },
  milkready: {
    productSlug: "milkready",
    themeColor: "#0284c7",
    accentColor: "#38bdf8",
    ctaColor: "#ffd100",
    ctaTextColor: "#0f172a",
    backgroundColor: "#f8fbff",
  },
};

export function LandingPageThemeProvider({
  productSlug = "milkimom",
  children,
}: {
  productSlug?: string;
  children: React.ReactNode;
}) {
  const initialColors = DEFAULT_THEME_COLORS[productSlug] || DEFAULT_THEME_COLORS.milkimom;
  const [theme, setTheme] = useState<ThemeColors>(initialColors);

  useEffect(() => {
    let isMounted = true;

    async function fetchTheme() {
      try {
        const res = await fetch(API_ENDPOINTS.customizationPublic(productSlug));
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setTheme({
              productSlug: json.data.productSlug || productSlug,
              themeColor: productSlug === "smoothflow" ? "#E6106E" : (json.data.themeColor || initialColors.themeColor),
              accentColor: json.data.accentColor || initialColors.accentColor,
              ctaColor: json.data.ctaColor || initialColors.ctaColor,
              ctaTextColor: json.data.ctaTextColor || initialColors.ctaTextColor,
              backgroundColor: json.data.backgroundColor || initialColors.backgroundColor,
            });
          }
        }
      } catch (err) {
        console.warn(`[ThemeProvider] Could not fetch theme for ${productSlug}:`, err);
      }
    }

    fetchTheme();

    return () => {
      isMounted = false;
    };
  }, [productSlug, initialColors]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.style.setProperty("--brand-crimson", theme.themeColor);
    root.style.setProperty("--brand-coral", theme.accentColor);
    root.style.setProperty("--brand-cta", theme.ctaColor);
    root.style.setProperty("--brand-cta-foreground", theme.ctaTextColor);
    root.style.setProperty("--brand-cream", theme.backgroundColor);

    root.style.setProperty("--primary", theme.themeColor);
    root.style.setProperty("--secondary", theme.accentColor);
    root.style.setProperty("--background", theme.backgroundColor);
    root.style.setProperty("--ring", theme.accentColor);
    root.style.setProperty("--sidebar-primary", theme.themeColor);

    return () => {
      // Restore default milkimom theme properties when unmounting a non-default theme page
      if (productSlug !== "milkimom") {
        const defaultTheme = DEFAULT_THEME_COLORS.milkimom;
        root.style.setProperty("--brand-crimson", defaultTheme.themeColor);
        root.style.setProperty("--brand-coral", defaultTheme.accentColor);
        root.style.setProperty("--brand-cta", defaultTheme.ctaColor);
        root.style.setProperty("--brand-cta-foreground", defaultTheme.ctaTextColor);
        root.style.setProperty("--brand-cream", defaultTheme.backgroundColor);

        root.style.setProperty("--primary", defaultTheme.themeColor);
        root.style.setProperty("--secondary", defaultTheme.accentColor);
        root.style.setProperty("--background", defaultTheme.backgroundColor);
        root.style.setProperty("--ring", defaultTheme.accentColor);
        root.style.setProperty("--sidebar-primary", defaultTheme.themeColor);
      }
    };
  }, [theme, productSlug]);

  const containerStyle = {
    "--brand-crimson": theme.themeColor,
    "--brand-coral": theme.accentColor,
    "--brand-cta": theme.ctaColor,
    "--brand-cta-foreground": theme.ctaTextColor,
    "--brand-cream": theme.backgroundColor,
    "--primary": theme.themeColor,
    "--secondary": theme.accentColor,
    "--background": theme.backgroundColor,
    "--ring": theme.accentColor,
    "--sidebar-primary": theme.themeColor,
  } as React.CSSProperties;

  const dynamicCss = `
    :root, .theme-scope-${productSlug} {
      --brand-crimson: ${theme.themeColor};
      --brand-coral: ${theme.accentColor};
      --brand-cta: ${theme.ctaColor};
      --brand-cta-foreground: ${theme.ctaTextColor};
      --brand-cream: ${theme.backgroundColor};
      --primary: ${theme.themeColor};
      --secondary: ${theme.accentColor};
      --background: ${theme.backgroundColor};
      --ring: ${theme.accentColor};
      --sidebar-primary: ${theme.themeColor};
    }
  `;

  return (
    <div className={`theme-scope-${productSlug} min-h-screen w-full`} style={containerStyle}>
      <style dangerouslySetInnerHTML={{ __html: dynamicCss }} />
      {children}
    </div>
  );
}
