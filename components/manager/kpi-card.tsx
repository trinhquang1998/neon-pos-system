import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  variant?: "default" | "ring";
  ringValue?: string;
  ringSub?: string;
}

export function KpiCard({
  title,
  value,
  trend,
  trendLabel = "so với hôm qua",
  variant = "default",
  ringValue,
  ringSub,
}: KpiCardProps) {
  const positive = trend !== undefined && trend >= 0;

  return (
    <div className="rounded-[var(--radius)] border border-[var(--manager-border)] bg-[var(--manager-surface)] p-5 shadow-sm">
      <p className="text-sm text-[var(--manager-text-secondary)]">{title}</p>
      {variant === "ring" ? (
        <div className="mt-3 flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-emerald-500">
            <span className="text-lg font-bold text-[var(--manager-text)]">
              {ringValue}
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--manager-text)]">{value}</p>
            {ringSub && (
              <p className="text-xs text-[var(--manager-text-secondary)]">{ringSub}</p>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--manager-text)]">
          {value}
        </p>
      )}
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          {positive ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          <span className={positive ? "text-emerald-600" : "text-red-500"}>
            {formatPercent(trend, positive)}
          </span>
          <span className="text-[var(--manager-text-secondary)]">{trendLabel}</span>
        </div>
      )}
      <div className="mt-4 h-8 rounded bg-gradient-to-r from-neutral-100 to-neutral-50" />
    </div>
  );
}

export function KpiCardCurrency({
  title,
  amount,
  trend,
}: {
  title: string;
  amount: number;
  trend: number;
}) {
  return <KpiCard title={title} value={formatCurrency(amount)} trend={trend} />;
}
