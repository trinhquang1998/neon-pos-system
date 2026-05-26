"use client";

import { useMemo, useState } from "react";
import { orderStatusLabels } from "@/lib/mock-data";
import { cn, formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { useNeonStore, useLiveOrders } from "@/store/neon-store";
import { useOrderTicker } from "@/hooks/use-order-ticker";
import type { OrderStatus } from "@/lib/types";

const tabs: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "preparing", label: "Đang làm" },
  { id: "almost_ready", label: "Sắp xong" },
  { id: "ready", label: "Sẵn sàng" },
  { id: "picked_up", label: "Đã lấy" },
  { id: "completed", label: "Hoàn thành" },
];

export default function StaffOrdersPage() {
  useOrderTicker();
  const orders = useLiveOrders();
  const updateOrderStatus = useNeonStore((s) => s.updateOrderStatus);
  const [tab, setTab] = useState<OrderStatus | "all">("preparing");

  const filtered = useMemo(() => {
    if (tab === "all") return orders;
    return orders.filter((o) => o.status === tab);
  }, [orders, tab]);

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-5">
      <h1 className="text-xl font-bold">Quản lý đơn hàng</h1>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2 text-sm font-medium",
              tab === t.id
                ? "bg-black text-white shadow-sm"
                : "border border-[var(--border)] bg-white text-[var(--text-secondary)]",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex-1 space-y-2 overflow-auto">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold">#{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {order.items.join(" · ")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(order.total)}</p>
                <p
                  className={cn(
                    "font-mono text-sm",
                    order.status === "overdue" ? "text-[var(--accent-red)]" : "text-[var(--warning)]",
                  )}
                >
                  {order.timer}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {order.status === "ready" && (
                <button
                  type="button"
                  className="rounded-lg bg-black px-3 py-2 text-xs font-bold text-white"
                  onClick={() => updateOrderStatus(order.id, "picked_up")}
                >
                  Khách đã lấy
                </button>
              )}
              {order.status === "picked_up" && (
                <button
                  type="button"
                  className="rounded-lg border px-3 py-2 text-xs"
                  onClick={() => updateOrderStatus(order.id, "completed")}
                >
                  Hoàn thành
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-[var(--text-secondary)]">
            Không có đơn {tab === "all" ? "" : orderStatusLabels[tab]}
          </p>
        )}
      </div>
    </div>
  );
}
