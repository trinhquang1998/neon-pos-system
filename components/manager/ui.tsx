"use client";

import { cn } from "@/lib/utils";
import { Search, Download, Plus, Filter } from "lucide-react";

export function ManagerCard({
  title,
  children,
  className,
  action,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-[var(--manager-border)] bg-[var(--manager-surface)] shadow-sm",
        className,
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-[var(--manager-border)] px-5 py-4">
          {title && (
            <h3 className="text-sm font-semibold text-[var(--manager-text)]">{title}</h3>
          )}
          {action}
        </div>
      )}
      <div className={title || action ? "p-5" : "p-5"}>{children}</div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  variant = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  variant?: "default" | "warning" | "danger" | "success";
}) {
  const valueColor = {
    default: "text-[var(--manager-text)]",
    warning: "text-amber-600",
    danger: "text-red-600",
    success: "text-emerald-600",
  }[variant];

  return (
    <div className="rounded-[var(--radius)] border border-[var(--manager-border)] bg-white p-4 shadow-sm">
      <p className="text-xs text-[var(--manager-text-secondary)]">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold", valueColor)}>{value}</p>
      {sub && (
        <p className="mt-0.5 text-xs text-[var(--manager-text-secondary)]">{sub}</p>
      )}
    </div>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {children}
    </div>
  );
}

export function ManagerToolbar({
  searchPlaceholder = "Tìm kiếm...",
  onSearch,
  filters,
  actions,
}: {
  searchPlaceholder?: string;
  onSearch?: (v: string) => void;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          placeholder={searchPlaceholder}
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full rounded-lg border border-[var(--manager-border)] py-2 pl-10 pr-4 text-sm outline-none focus:border-neutral-400"
        />
      </div>
      {filters}
      <div className="ml-auto flex flex-wrap gap-2">
        {actions ?? (
          <>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-[var(--manager-border)] px-3 py-2 text-sm hover:bg-neutral-50"
            >
              <Filter className="h-4 w-4" /> Lọc
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-[var(--manager-border)] px-3 py-2 text-sm hover:bg-neutral-50"
            >
              <Download className="h-4 w-4" /> Xuất
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-neutral-800"
            >
              <Plus className="h-4 w-4" /> Thêm mới
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function ManagerTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-[var(--manager-border)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "border-b-2 px-4 py-2.5 text-sm font-medium transition -mb-px",
            active === tab.id
              ? "border-black text-black"
              : "border-transparent text-[var(--manager-text-secondary)] hover:text-black",
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const styles = {
    default: "bg-neutral-100 text-neutral-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    info: "bg-blue-50 text-blue-700",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", styles[variant])}>
      {children}
    </span>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="py-12 text-center text-sm text-[var(--manager-text-secondary)]">
      {message}
    </p>
  );
}
