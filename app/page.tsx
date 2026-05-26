import Link from "next/link";
import { ArrowRight, ChefHat, LayoutDashboard } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-6 text-[var(--text)]">
      <div className="max-w-lg text-center">
        <p className="text-xs font-semibold tracking-[0.35em] text-[var(--accent-red)]">
          NEON COFFEE
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Operating System
        </h1>
        <p className="mt-3 text-[var(--text-secondary)]">
          Beverage POS + Operations Platform — Staff & Manager portals
        </p>
      </div>

      <div className="mt-12 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        <Link
          href="/staff/login"
          className="group rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-8 transition hover:border-[var(--accent-red)]"
        >
          <ChefHat className="h-8 w-8 text-[var(--text-secondary)] group-hover:text-white" />
          <h2 className="mt-4 text-xl font-semibold">Staff System</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            POS, KDS, Pager, Pickup — dark operational UI
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--accent-red)]">
            Vào hệ thống <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        <Link
          href="/manager/dashboard"
          className="group rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-8 transition hover:border-white"
        >
          <LayoutDashboard className="h-8 w-8 text-[var(--text-secondary)] group-hover:text-white" />
          <h2 className="mt-4 text-xl font-semibold">Manager Portal</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Dashboard, analytics, inventory, staff
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm text-white">
            Vào quản lý <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
