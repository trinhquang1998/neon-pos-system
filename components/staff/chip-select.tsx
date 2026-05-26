"use client";

import { cn } from "@/lib/utils";

export function ChipSelect<T extends string | number>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "min-h-[44px] rounded-xl border px-4 py-2 text-sm font-medium",
            value === opt.value
              ? "border-black bg-black text-white"
              : "border-[var(--border)] bg-white",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
