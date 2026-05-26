"use client";

import Link from "next/link";
import { kitchenStations, routingRules } from "@/lib/manager-data";
import { kitchenOrders } from "@/lib/mock-data";
import { cn, formatCurrency } from "@/lib/utils";
import {
  ManagerCard,
  StatGrid,
  StatCard,
  Badge,
} from "@/components/manager/ui";
import { ExternalLink } from "lucide-react";

export default function ManagerKitchenPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <StatGrid>
          <StatCard label="Chờ xử lý" value="12" variant="warning" />
          <StatCard label="Đang làm" value="6" />
          <StatCard label="Sắp xong" value="3" variant="success" />
          <StatCard label="Quá hạn" value="2" variant="danger" />
          <StatCard label="Thời gian TB" value="04:12" sub="SLA: 05:00" />
        </StatGrid>
        <Link
          href="/staff/kitchen"
          className="flex items-center gap-2 rounded-lg border border-[var(--manager-border)] bg-white px-4 py-2 text-sm hover:bg-neutral-50"
        >
          <ExternalLink className="h-4 w-4" /> Mở KDS Staff
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {kitchenStations.map((sta) => (
          <ManagerCard key={sta.id} title={`${sta.code} · ${sta.name}`}>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-2xl font-bold text-amber-600">{sta.pending}</p>
                <p className="text-[10px] text-neutral-500">Chờ</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{sta.inProgress}</p>
                <p className="text-[10px] text-neutral-500">Đang làm</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{sta.completed}</p>
                <p className="text-[10px] text-neutral-500">Xong</p>
              </div>
            </div>
          </ManagerCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ManagerCard title="Đơn realtime" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {kitchenOrders.map((order) => (
              <div
                key={order.id}
                className={cn(
                  "rounded-xl border-2 p-4",
                  order.status === "overdue"
                    ? "border-red-300 bg-red-50"
                    : order.status === "preparing"
                      ? "border-amber-300 bg-amber-50/50"
                      : "border-[var(--manager-border)]",
                )}
              >
                <div className="flex justify-between">
                  <span className="font-mono text-lg font-bold">#{order.id}</span>
                  <Badge
                    variant={
                      order.status === "overdue"
                        ? "danger"
                        : order.status === "almost_ready"
                          ? "warning"
                          : "default"
                    }
                  >
                    {order.timer}
                  </Badge>
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  {order.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-neutral-500">
                  Pager #{order.pagerId} · {formatCurrency(order.total)}
                </p>
              </div>
            ))}
          </div>
        </ManagerCard>

        <ManagerCard title="Kitchen Routing Rules">
          <ul className="space-y-3">
            {routingRules.map((rule) => (
              <li
                key={rule.id}
                className="rounded-lg border border-[var(--manager-border)] p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{rule.name}</p>
                    <p className="text-xs text-neutral-500">
                      → {rule.target} · Priority {rule.priority}
                    </p>
                  </div>
                  <Badge variant={rule.active ? "success" : "default"}>
                    {rule.active ? "ON" : "OFF"}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-4 w-full rounded-lg border border-dashed py-2 text-sm text-neutral-500 hover:border-black hover:text-black"
          >
            + Thêm rule
          </button>
          <Link
            href="/manager/settings"
            className="mt-2 block text-center text-xs text-blue-600 hover:underline"
          >
            Cấu hình routing trong Settings →
          </Link>
        </ManagerCard>
      </div>

      <ManagerCard title="Kitchen Analytics hôm nay">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Prep time TB", value: "4:12" },
            { label: "Bottleneck", value: "STA-03 Matcha" },
            { label: "Peak hour", value: "12:00 - 13:00" },
            { label: "Delay heatmap", value: "14 đơn > SLA" },
          ].map((m) => (
            <div key={m.label} className="rounded-lg bg-neutral-50 p-4">
              <p className="text-xs text-neutral-500">{m.label}</p>
              <p className="mt-1 font-semibold">{m.value}</p>
            </div>
          ))}
        </div>
      </ManagerCard>
    </div>
  );
}
