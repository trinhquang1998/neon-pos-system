"use client";

import { useMemo, useState } from "react";
import { RefreshCw, Eye } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { useNeonStore, useLiveOrders } from "@/store/neon-store";
import { useOrderTicker } from "@/hooks/use-order-ticker";
import {
  ManagerCard,
  ManagerToolbar,
  StatGrid,
  StatCard,
  ManagerTabs,
} from "@/components/manager/ui";
import type { OrderStatus } from "@/lib/types";

const statusTabs: { id: OrderStatus | "all"; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "preparing", label: "Đang làm" },
  { id: "ready", label: "Sẵn sàng" },
  { id: "completed", label: "Hoàn thành" },
  { id: "cancelled", label: "Đã hủy" },
];

export default function ManagerOrdersPage() {
  useOrderTicker();
  const orders = useLiveOrders();
  const refundOrder = useNeonStore((s) => s.refundOrder);
  const resendToKitchen = useNeonStore((s) => s.resendToKitchen);
  const updateOrderStatus = useNeonStore((s) => s.updateOrderStatus);
  const stats = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status !== "cancelled");
    return {
      revenue: activeOrders.reduce((s, o) => s + o.total, 0),
      orders: activeOrders.length,
      completed: activeOrders.filter((o) => o.status === "completed").length,
      inProgress: activeOrders.filter((o) =>
        ["preparing", "almost_ready", "ready", "queued", "new"].includes(o.status),
      ).length,
    };
  }, [orders]);

  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchTab = tab === "all" || o.status === tab;
      const q = search.toLowerCase();
      return (
        matchTab &&
        (o.id.includes(q) || o.customer.toLowerCase().includes(q))
      );
    });
  }, [orders, tab, search]);

  const selected = orders.find((o) => o.id === selectedId) ?? filtered[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      <StatGrid>
        <StatCard label="Tổng đơn" value={String(stats.orders)} />
        <StatCard label="Doanh thu" value={formatCurrency(stats.revenue)} />
        <StatCard label="Đang xử lý" value={String(stats.inProgress)} variant="warning" />
        <StatCard label="Hoàn thành" value={String(stats.completed)} variant="success" />
      </StatGrid>

      <ManagerToolbar searchPlaceholder="Tìm đơn..." onSearch={setSearch} />

      <ManagerTabs
        tabs={statusTabs.map((t) => ({
          id: t.id,
          label: t.label,
          count: t.id === "all" ? orders.length : orders.filter((o) => o.status === t.id).length,
        }))}
        active={tab}
        onChange={(id) => setTab(id as OrderStatus | "all")}
      />

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        <ManagerCard className="lg:col-span-2 overflow-hidden p-0">
          <div className="responsive-table-wrap">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-neutral-50 text-left text-xs text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Mã</th>
                  <th className="px-4 py-3">Khách</th>
                  <th className="px-4 py-3">Tổng</th>
                  <th className="px-4 py-3">TT</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelectedId(o.id)}
                    className={cn(
                      "cursor-pointer border-t hover:bg-neutral-50",
                      selected?.id === o.id && "bg-neutral-50",
                    )}
                  >
                    <td className="px-4 py-3 font-mono font-semibold">#{o.id}</td>
                    <td className="px-4 py-3">{o.customer}</td>
                    <td className="px-4 py-3">{formatCurrency(o.total)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ManagerCard>

        {selected && (
          <ManagerCard title={`#${selected.id}`}>
            <StatusBadge status={selected.status} />
            <p className="mt-2 text-sm text-neutral-500">{selected.timer}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {selected.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <p className="mt-2 font-bold">{formatCurrency(selected.total)}</p>
            <ul className="mt-4 max-h-40 space-y-1 overflow-auto text-xs">
              {selected.timeline.map((t, index) => (
                <li key={`${t.time}-${t.message}-${index}`}>
                  {t.time} — {t.message}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs"
                onClick={() => resendToKitchen(selected.id)}
              >
                <RefreshCw className="h-3 w-3" /> Gửi lại bếp
              </button>
              <button
                type="button"
                className="rounded-lg border px-3 py-2 text-xs"
                onClick={() => updateOrderStatus(selected.id, "completed")}
              >
                Hoàn thành
              </button>
              <button
                type="button"
                className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600"
                onClick={() => refundOrder(selected.id)}
              >
                Hoàn tiền
              </button>
            </div>
          </ManagerCard>
        )}
      </div>
    </div>
  );
}
