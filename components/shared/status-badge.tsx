import { cn } from "@/lib/utils";
import { orderStatusLabels } from "@/lib/mock-data";
import type { OrderStatus } from "@/lib/types";

const statusStyles: Record<OrderStatus, string> = {
  new: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  queued: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  preparing: "bg-amber-50 text-amber-700 border border-amber-200",
  almost_ready: "bg-amber-50 text-amber-700 border border-amber-200",
  ready: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  picked_up: "bg-blue-50 text-blue-700 border border-blue-200",
  completed: "bg-blue-50 text-blue-700 border border-blue-200",
  cancelled: "bg-neutral-100 text-neutral-500 border border-neutral-200",
  overdue: "bg-red-50 text-red-700 border border-red-200",
};

export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      {orderStatusLabels[status]}
    </span>
  );
}
