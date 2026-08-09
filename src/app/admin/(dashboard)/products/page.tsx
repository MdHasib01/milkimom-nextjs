"use client";

import { ShieldAlert } from "lucide-react";
import { getStoredUser } from "@/lib/admin-api";
import { ProductsPanel } from "./products-panel";

export default function AdminProductsPage() {
  const currentUser = getStoredUser();
  const isModerator = currentUser?.role === "moderator";

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Products Management</h1>

      {isModerator && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm font-semibold text-amber-700 dark:text-amber-400">
          <ShieldAlert size={20} className="shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            You are logged in as a Moderator (View-Only). Products can be viewed, but creating, editing, and deleting are restricted to Admins.
          </span>
        </div>
      )}

      <ProductsPanel isModerator={isModerator} />
    </div>
  );
}
