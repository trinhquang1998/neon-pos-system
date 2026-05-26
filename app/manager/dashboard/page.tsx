"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { useMemo } from "react";
import { KpiCard, KpiCardCurrency } from "@/components/manager/kpi-card";
import {
  hourlyRevenue,
  categoryRevenue,
  branchRevenue,
  orderStatusBreakdown,
} from "@/lib/mock-data";
import { cn, formatCurrency } from "@/lib/utils";
import { useNeonStore } from "@/store/neon-store";

const CHART_COLORS = ["#1a1a1a", "#FFB020", "#3DDC84", "#4A90D9", "#9A9A9A"];

export default function ManagerDashboardPage() {
  const orders = useNeonStore((s) => s.orders);
  const pagers = useNeonStore((s) => s.pagers);
  const activities = useNeonStore((s) => s.activities);
  const staffMembers = useNeonStore((s) => s.staff);
  const inventoryItems = useNeonStore((s) => s.inventory);
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
  const alerts = useMemo(() => {
    const inventoryAlerts = inventoryItems
      .filter((i) => i.status !== "good")
      .map((i) => ({
        id: `inv-${i.id}`,
        title: i.name,
        message: `CÃ²n ${i.quantity}${i.unit}`,
        severity: i.status === "critical" ? ("critical" as const) : ("warning" as const),
      }));
    const pagerAlerts = pagers
      .filter((p) => p.battery < 25)
      .map((p) => ({
        id: `pg-${p.id}`,
        title: `Pager #${p.physicalId}`,
        message: `Pin ${p.battery}%`,
        severity: "warning" as const,
      }));
    const orderAlerts = orders
      .filter(
        (o) =>
          Date.now() - o.createdAt > 5 * 60000 &&
          ["preparing", "almost_ready", "queued"].includes(o.status),
      )
      .map((o) => ({
        id: `ord-${o.id}`,
        title: `ÄÆ¡n #${o.id}`,
        message: "VÆ°á»£t SLA 5 phÃºt",
        severity: "critical" as const,
      }));
    return [...inventoryAlerts, ...pagerAlerts, ...orderAlerts];
  }, [inventoryItems, orders, pagers]);
  const aov = stats.orders ? Math.round(stats.revenue / stats.orders) : 0;
  const completionPct =
    stats.orders > 0 ? Math.round((stats.completed / stats.orders) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCardCurrency title="Doanh thu hôm nay" amount={stats.revenue} trend={18.5} />
        <KpiCard title="Đơn hàng" value={String(stats.orders)} trend={12.3} />
        <KpiCard title="Đang xử lý" value={String(stats.inProgress)} trend={0} />
        <KpiCard title="AOV" value={formatCurrency(aov)} trend={5.2} />
        <KpiCard
          title="Tỷ lệ hoàn thành"
          value={`${completionPct}%`}
          variant="ring"
          ringValue={`${completionPct}%`}
          ringSub={`${stats.completed} / ${stats.orders} đơn`}
          trend={2.1}
        />
        <KpiCard title="Cảnh báo" value={String(alerts.length)} trend={0} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Doanh thu theo giờ" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourlyRevenue}>
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="revenue" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Doanh thu theo danh mục">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryRevenue}
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
              >
                {categoryRevenue.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-2 space-y-1 text-xs">
            {categoryRevenue.map((c) => (
              <li key={c.name} className="flex justify-between">
                <span>{c.name}</span>
                <span className="text-[var(--manager-text-secondary)]">
                  {c.value}% · {formatCurrency(c.amount)}
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>

        <ChartCard title="Doanh thu theo chi nhánh">
          <div className="space-y-3">
            {branchRevenue.map((b, i) => (
              <div key={b.name}>
                <div className="flex justify-between text-xs">
                  <span className="truncate pr-2">{b.name}</span>
                  <span className="font-medium">{formatCurrency(b.value)}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-neutral-800"
                    style={{ width: `${100 - i * 15}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Đơn hàng theo trạng thái">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={orderStatusBreakdown} dataKey="value" outerRadius={70}>
                {orderStatusBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-2 grid grid-cols-2 gap-1 text-xs">
            {orderStatusBreakdown.map((s) => (
              <li key={s.name} className="flex gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full mt-1"
                  style={{ background: s.color }}
                />
                {s.name}: {s.value}
              </li>
            ))}
          </ul>
        </ChartCard>

        <ChartCard title="Cảnh báo">
          <ul className="space-y-3">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="rounded-lg border border-[var(--manager-border)] p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-[var(--manager-text-secondary)]">
                      {a.message}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-[10px] font-bold",
                      a.severity === "critical"
                        ? "text-red-600"
                        : "text-amber-600",
                    )}
                  >
                    {a.severity === "critical" ? "!" : "?"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </ChartCard>

        <ChartCard title="Hoạt động gần đây">
          <ul className="space-y-3">
            {activities.map((a) => (
              <li key={a.id} className="flex gap-3 text-sm">
                <span className="shrink-0 font-mono text-xs text-[var(--manager-text-secondary)]">
                  {a.time}
                </span>
                <span>{a.message}</span>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Hiệu suất nhân viên" className="lg:col-span-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--manager-text-secondary)]">
                <th className="pb-2">Nhân viên</th>
                <th className="pb-2">Đơn</th>
                <th className="pb-2">%</th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((s) => (
                <tr key={s.id} className="border-t border-[var(--manager-border)]">
                  <td className="py-2">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-[var(--manager-text-secondary)]">
                      {s.role}
                    </p>
                  </td>
                  <td className="py-2">{s.orders}</td>
                  <td
                    className={cn(
                      "py-2 font-medium",
                      s.performance >= 90 ? "text-emerald-600" : "text-amber-600",
                    )}
                  >
                    {s.performance}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>

        <ChartCard title="Kho hàng tồn">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--manager-text-secondary)]">
                <th className="pb-2">Nguyên liệu</th>
                <th className="pb-2">SL</th>
                <th className="pb-2">TT</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => (
                <tr key={item.id} className="border-t border-[var(--manager-border)]">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">
                    {item.quantity}
                    {item.unit}
                  </td>
                  <td className="py-2 text-xs font-bold text-red-600">
                    {item.status === "critical"
                      ? "SẮP HẾT"
                      : item.status === "low"
                        ? "THẤP"
                        : "OK"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>

        <ChartCard title="Thiết bị & Hệ thống">
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Pager", total: 22, detail: "8 đang dùng · 2 pin yếu" },
              { name: "Máy in", total: 4, detail: "4 online" },
              { name: "KDS", total: 3, detail: "3 online" },
              { name: "Mạng", total: null, detail: "Ổn định · 85%" },
            ].map((d) => (
              <div
                key={d.name}
                className="rounded-lg border border-[var(--manager-border)] p-3"
              >
                <p className="text-xs text-[var(--manager-text-secondary)]">{d.name}</p>
                {d.total !== null && (
                  <p className="text-xl font-bold">{d.total}</p>
                )}
                <p className="mt-1 text-xs">{d.detail}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-[var(--manager-border)] bg-[var(--manager-surface)] p-5 shadow-sm",
        className,
      )}
    >
      <h3 className="mb-4 text-sm font-semibold text-[var(--manager-text)]">{title}</h3>
      {children}
    </div>
  );
}
