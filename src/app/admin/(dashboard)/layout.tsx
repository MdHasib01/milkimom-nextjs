"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Package, Settings, Users, LogOut } from "lucide-react";

import { getToken, getStoredUser, logout } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/orders", label: "Orders", Icon: Package },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
  { href: "/admin/users", label: "Admin Users", Icon: Users },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = getStoredUser();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
    }
  }, [router]);

  if (!getToken()) return null;

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logo.png"
              alt="Milkimom"
              width={112}
              height={32}
              className="h-8 w-auto object-contain"
            />
            <span className="hidden font-bold text-foreground sm:inline">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            {user && <span className="hidden text-sm text-muted-foreground sm:inline">{user.name}</span>}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon size={16} /> {label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
