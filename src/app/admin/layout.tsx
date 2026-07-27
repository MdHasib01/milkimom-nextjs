import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Milkimom",
  description: "Milkimom admin dashboard — orders, settings and admin users.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
