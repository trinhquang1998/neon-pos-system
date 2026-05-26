"use client";

import Link from "next/link";
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
      <h1 className="text-xl font-bold">Hàng đợi đơn</h1>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={cn("shrink-0 rounded-lg px-4 py-2 text-sm font-medium", tab === t.id ? "bg-black text-white" : "border")}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex-1 space-y-2 overflow-auto">
        {filtered.map((order) => (
          <Link key={order.id} href={`/staff/orders/${order.id}`} className="block rounded-[var(--radius)] border bg-[var(--surface)] p-4 hover:border-neutral-400">
            <div className="flex justify-between gap-2">
              <div>
                <span className="font-mono font-bold">#{order.id}</span>
                <StatusBadge status={order.status} className="ml-2" />
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{order.items.join(" · ")}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(order.total)}</p>
                <p className="font-mono text-sm">{order.timer}</p>
              </div>
            </div>
          </Link>
        ))}
        {!filtered.length && <p className="py-12 text-center text-[var(--text-secondary)]">Không có đơn {tab === "all" ? "" : orderStatusLabels[tab]}</p>}
      </div>
    </div>
  );
}
