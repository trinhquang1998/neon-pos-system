"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useNeonStore, useLiveOrders } from "@/store/neon-store";
import { useOrderTicker } from "@/hooks/use-order-ticker";

export default function KitchenPage() {
  useOrderTicker();
  const orders = useLiveOrders();
  const markKitchenDone = useNeonStore((s) => s.markKitchenDone);

  const active = useMemo(
    () =>
      orders.filter((o) =>
        ["preparing", "almost_ready", "overdue", "queued", "new"].includes(o.status),
      ),
    [orders],
  );

  const stats = {
    pending: orders.filter((o) => ["queued", "new"].includes(o.status)).length,
    preparing: orders.filter((o) => o.status === "preparing" || o.status === "overdue").length,
    almost: orders.filter((o) => o.status === "almost_ready").length,
    overdue: orders.filter((o) => o.status === "overdue").length,
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="shrink-0 flex-wrap gap-3 border-b border-[var(--border)] p-4 flex">
        <h1 className="text-lg font-bold sm:text-xl">Kitchen Display</h1>
        <div className="flex flex-wrap gap-3 text-xs sm:ml-auto sm:text-sm">
          <span>Chờ: <strong>{stats.pending}</strong></span>
          <span className="text-amber-600">Làm: <strong>{stats.preparing}</strong></span>
          <span>Sắp xong: <strong>{stats.almost}</strong></span>
          <span className="text-red-600">Trễ: <strong>{stats.overdue}</strong></span>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-3 overflow-auto p-3 sm:grid-cols-2 sm:gap-4 sm:p-4 xl:grid-cols-3">
        {active.map((order) => (
          <div
            key={order.id}
            className={cn(
              "flex flex-col rounded-[var(--radius)] border-2 p-4",
              order.status === "overdue"
                ? "border-red-500 bg-red-50"
                : order.status === "almost_ready"
                  ? "border-amber-400 bg-amber-50"
                  : "border-amber-300 bg-white",
            )}
          >
            <div className="flex justify-between">
              <span className="font-mono text-xl font-bold sm:text-2xl">#{order.id}</span>
              <span
                className={cn(
                  "font-mono text-lg",
                  order.status === "overdue" ? "text-red-600" : "text-amber-600",
                )}
              >
                {order.timer}
              </span>
            </div>
            <ul className="mt-3 flex-1 space-y-2 text-sm">
              {order.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {order.pagerId && (
              <p className="text-xs text-neutral-500">Pager #{order.pagerId}</p>
            )}
            <button
              type="button"
              onClick={() => markKitchenDone(order.id)}
              className="mt-4 min-h-[48px] w-full rounded-xl bg-black py-3 text-sm font-bold text-white"
            >
              {order.status === "almost_ready" ? "SẴN SÀNG" : "MARK DONE"}
            </button>
          </div>
        ))}
        {active.length === 0 && (
          <p className="col-span-full py-16 text-center text-neutral-500">
            Không có đơn trong bếp
          </p>
        )}
      </div>
    </div>
  );
}
