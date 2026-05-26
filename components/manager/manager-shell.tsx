"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { managerNav } from "@/lib/mock-data";
import { useNeonStore } from "@/store/neon-store";
import { cn } from "@/lib/utils";
import { NavIcon } from "@/components/shared/icon-map";
import { Bell, ChevronDown, Menu, X } from "lucide-react";

export function ManagerShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const branchName = useNeonStore((s) => s.settings.storeName);
  const inventoryItems = useNeonStore((s) => s.inventory);
  const orders = useNeonStore((s) => s.orders);
  const pagers = useNeonStore((s) => s.pagers);
  const alertCount = useMemo(() => {
    const inventoryCount = inventoryItems.filter((i) => i.status !== "good").length;
    const pagerCount = pagers.filter((p) => p.battery < 25).length;
    const orderCount = orders.filter(
      (o) =>
        Date.now() - o.createdAt > 5 * 60000 &&
        ["preparing", "almost_ready", "queued"].includes(o.status),
    ).length;
    return inventoryCount + pagerCount + orderCount;
  }, [inventoryItems, orders, pagers]);

  const sidebar = (
    <>
      <div className="border-b border-[var(--border)] px-4 py-5">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-neutral-500">
          NEON COFFEE
        </p>
        <p className="mt-1 text-xs font-medium leading-tight text-neutral-300">
          MANAGEMENT
          <br />
          SYSTEM
        </p>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {managerNav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white",
              )}
            >
              <NavIcon name={item.icon} className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[var(--border)] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-700 text-xs font-bold">
            NA
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Nguyễn Văn A</p>
            <p className="text-xs text-neutral-500">Quản lý cửa hàng</p>
          </div>
        </div>
        <p className="mt-3 truncate rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-neutral-400">
          {branchName}
        </p>
      </div>
    </>
  );

  return (
    <div className="flex min-h-[100dvh] bg-[var(--manager-bg)]">
      <aside className="hidden w-56 shrink-0 flex-col bg-[#0a0a0a] text-white lg:flex">
        {sidebar}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(16rem,85vw)] flex-col bg-[#0a0a0a] text-white shadow-xl">
            <button
              type="button"
              className="absolute right-3 top-3 p-2 text-neutral-400"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--manager-border)] bg-[var(--manager-surface)] px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-neutral-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-[var(--manager-text)] sm:text-xl">
              {title}
            </h1>
          </div>
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:gap-4">
            <select className="max-w-full rounded-lg border border-[var(--manager-border)] bg-white px-2 py-2 text-xs sm:px-3 sm:text-sm">
              <option>Hôm nay</option>
              <option>Hôm qua</option>
              <option>7 ngày</option>
            </select>
            <button
              type="button"
              className="relative rounded-lg p-2 hover:bg-neutral-100"
              aria-label="Thông báo"
            >
              <Bell className="h-5 w-5" />
              {alertCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent-red)] px-1 text-[10px] font-bold text-white">
                  {alertCount}
                </span>
              )}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
