"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { situationOptions } from "@/lib/content";
import { cn } from "@/lib/utils";

export function SituationSelector() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <p className="text-sm font-medium text-foreground/80">
        আপনার বর্তমান পরিস্থিতি কোনটি?
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {situationOptions.map((option) => {
          const isActive = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setSelected(option)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground/80 hover:border-brand-coral/40 hover:bg-brand-coral/5"
              )}
            >
              {isActive && <CheckCircle2 className="size-4" />}
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
