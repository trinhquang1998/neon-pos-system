"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { staffNav } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { NavIcon } from "@/components/shared/icon-map";
import { Menu, X } from "lucide-react";

export function StaffShell({
  children,
  fullscreen = false,
}: {
  children: React.ReactNode;
  fullscreen?: boolean;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (fullscreen) {
    return (
      <div className="min-h-[100dvh] bg-[var(--surface)] text-[var(--text)] safe-area-pb">
        {children}
      </div>
    );
  }

  const navLink = (item: (typeof staffNav)[number], mobile = false) => {
    const active = pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => mobile && setMobileOpen(false)}
        title={item.label}
        className={cn(
          mobile
            ? "flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
            : "flex h-11 w-11 items-center justify-center rounded-xl md:h-11 md:w-11",
          active
            ? "bg-white text-black"
            : "text-neutral-400 hover:bg-neutral-900 hover:text-white",
        )}
      >
        <NavIcon name={item.icon} className="h-5 w-5 shrink-0" />
        {mobile && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--bg)] text-[var(--text)] md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-16 shrink-0 flex-col items-center bg-[#0a0a0a] py-4 text-white md:flex">
        <Link href="/staff/pos" className="mb-6 px-2 text-center">
          <span className="text-[9px] font-bold tracking-widest text-white">
            NEON
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">{staffNav.map((i) => navLink(i))}</nav>
        <Link
          href="/staff/login"
          className="mt-auto text-[10px] text-neutral-500 hover:text-white"
        >
          Exit
        </Link>
      </aside>

      {/* Mobile header */}
      <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 md:hidden">
        <Link href="/staff/pos" className="text-xs font-bold tracking-widest text-[var(--text)]">
          NEON COFFEE
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 hover:bg-neutral-100"
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-label="Đóng"
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(280px,85vw)] flex-col bg-[#0a0a0a] p-4 text-white shadow-xl">
            <div className="mb-4 flex justify-end">
              <button type="button" onClick={() => setMobileOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">{staffNav.map((i) => navLink(i, true))}</nav>
            <Link
              href="/staff/login"
              className="mt-auto rounded-xl border border-neutral-800 py-3 text-center text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Đăng xuất
            </Link>
          </div>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-[4.5rem] md:pb-0">
        {children}
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-[var(--border)] bg-[var(--surface)] px-1 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] safe-area-pb md:hidden">
        {staffNav.slice(0, 5).map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-[3rem] flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px]",
                active ? "bg-black text-white" : "text-[var(--text-secondary)]",
              )}
            >
              <NavIcon name={item.icon} className="h-5 w-5" />
              <span className="truncate max-w-[4rem]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
