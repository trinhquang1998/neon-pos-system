"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { hourlyRevenue, categoryRevenue, topProducts } from "@/lib/mock-data";
import {
  revenueForecast,
  customerCohorts,
  paymentDistribution,
} from "@/lib/manager-data";
import { formatCurrency } from "@/lib/utils";
import { ManagerCard, ManagerTabs, StatGrid, StatCard } from "@/components/manager/ui";
import { useState } from "react";

const reportTabs = [
  { id: "revenue", label: "Doanh thu" },
  { id: "product", label: "Sản phẩm" },
  { id: "customer", label: "Khách hàng" },
  { id: "kitchen", label: "Bếp" },
  { id: "labor", label: "Nhân sự" },
];

const COLORS = ["#1a1a1a", "#FFB020", "#3DDC84", "#4A90D9", "#9A9A9A"];

export default function ManagerReportsPage() {
  const [tab, setTab] = useState("revenue");

  return (
    <div className="space-y-6">
      <StatGrid>
        <StatCard label="Doanh thu tháng" value={formatCurrency(285600000)} sub="+14.2%" />
        <StatCard label="Lợi nhuận gộp" value="62%" />
        <StatCard label="Đơn / ngày TB" value="238" />
        <StatCard label="Growth MoM" value="+8.4%" variant="success" />
      </StatGrid>

      <ManagerTabs tabs={reportTabs} active={tab} onChange={setTab} />

      {tab === "revenue" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ManagerCard title="Doanh thu theo giờ">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={hourlyRevenue}>
                <XAxis dataKey="hour" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ManagerCard>
          <ManagerCard title="Dự báo vs thực tế (tuần)">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueForecast}>
                <XAxis dataKey="day" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#1a1a1a" strokeWidth={2} name="Thực tế" />
                <Line type="monotone" dataKey="forecast" stroke="#9A9A9A" strokeDasharray="4 4" name="Dự báo" />
              </LineChart>
            </ResponsiveContainer>
          </ManagerCard>
          <ManagerCard title="Phân bổ thanh toán">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={paymentDistribution} dataKey="value" innerRadius={50} outerRadius={80} label>
                  {paymentDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ManagerCard>
          <ManagerCard title="Heatmap doanh thu">
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded"
                  style={{
                    backgroundColor: `rgba(26,26,26,${0.2 + (i % 7) * 0.12})`,
                  }}
                  title={`Ngày ${i + 1}`}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-500">Đậm = doanh thu cao hơn</p>
          </ManagerCard>
        </div>
      )}

      {tab === "product" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ManagerCard title="Top sản phẩm">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-neutral-500">
                <tr className="border-b">
                  <th className="pb-2">#</th>
                  <th className="pb-2">Sản phẩm</th>
                  <th className="pb-2">Đã bán</th>
                  <th className="pb-2">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={p.name} className="border-t">
                    <td className="py-2">{i + 1}</td>
                    <td className="py-2 font-medium">{p.name}</td>
                    <td className="py-2">{p.sold}</td>
                    <td className="py-2">{formatCurrency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ManagerCard>
          <ManagerCard title="Doanh thu danh mục">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryRevenue} dataKey="value" outerRadius={100} label>
                  {categoryRevenue.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ManagerCard>
          <ManagerCard title="Menu engineering" className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Star (bán chạy + lãi cao)", items: "Matcha Latte, Latte" },
                { label: "Plowhorse (bán chạy, lãi thấp)", items: "Americano" },
                { label: "Dog (bán ít)", items: "Tiramisu" },
              ].map((box) => (
                <div key={box.label} className="rounded-lg bg-neutral-50 p-4">
                  <p className="text-xs font-semibold text-neutral-500">{box.label}</p>
                  <p className="mt-2 text-sm">{box.items}</p>
                </div>
              ))}
            </div>
          </ManagerCard>
        </div>
      )}

      {tab === "customer" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ManagerCard title="Customer cohorts">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-neutral-500">
                <tr className="border-b">
                  <th className="pb-2">Nhóm</th>
                  <th className="pb-2">Số lượng</th>
                  <th className="pb-2">Retention</th>
                </tr>
              </thead>
              <tbody>
                {customerCohorts.map((c) => (
                  <tr key={c.name} className="border-t">
                    <td className="py-2 font-medium">{c.name}</td>
                    <td className="py-2">{c.count}</td>
                    <td className="py-2">{c.retention}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ManagerCard>
          <ManagerCard title="Churn risk">
            <p className="text-sm text-neutral-600">
              12 khách không quay lại trong 30 ngày — gợi ý gửi voucher WELCOME20.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {["Thảo Vy", "Quốc Bảo"].map((name) => (
                <li key={name} className="flex justify-between rounded-lg border px-3 py-2">
                  <span>{name}</span>
                  <span className="text-red-600">High risk</span>
                </li>
              ))}
            </ul>
          </ManagerCard>
        </div>
      )}

      {tab === "kitchen" && (
        <ManagerCard title="Kitchen Intelligence">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Prep speed TB", value: "4:12" },
              { label: "Đơn trễ SLA", value: "14" },
              { label: "Bottleneck", value: "STA-03" },
              { label: "Queue pressure", value: "Medium" },
            ].map((m) => (
              <div key={m.label} className="rounded-lg border p-4">
                <p className="text-xs text-neutral-500">{m.label}</p>
                <p className="mt-1 text-xl font-bold">{m.value}</p>
              </div>
            ))}
          </div>
        </ManagerCard>
      )}

      {tab === "labor" && (
        <ManagerCard title="Labor Intelligence">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Chi phí nhân sự / doanh thu", value: "22%" },
              { label: "Năng suất ca TB", value: "91%" },
              { label: "Giờ overtime tuần", value: "12h" },
            ].map((m) => (
              <div key={m.label} className="rounded-lg bg-neutral-50 p-4">
                <p className="text-xs text-neutral-500">{m.label}</p>
                <p className="mt-1 text-2xl font-bold">{m.value}</p>
              </div>
            ))}
          </div>
        </ManagerCard>
      )}
    </div>
  );
}
