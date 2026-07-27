"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableSelectProps {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export function SearchableSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder = "নির্বাচন করুন",
  searchPlaceholder = "খুঁজুন...",
  disabled = false,
  className,
  error = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const query = search.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(query));
  }, [options, search]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
            setSearch("");
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive text-destructive",
          className
        )}
      >
        <span className={cn("block truncate", !value && "text-muted-foreground")}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-border bg-popover text-popover-foreground shadow-lg animate-in fade-in-50 zoom-in-95 duration-100">
          <div className="p-2 border-b border-border">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto p-1 text-sm">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onValueChange(opt);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-primary/10 font-semibold text-primary"
                    )}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check className="size-4 text-primary" />}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-muted-foreground">
                কোনো ফলাফল পাওয়া যায়নি
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
