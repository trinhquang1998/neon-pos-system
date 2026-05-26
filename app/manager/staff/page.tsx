"use client";

import { useState } from "react";
import { staffMembers } from "@/lib/mock-data";
import { permissions } from "@/lib/manager-data";
import { formatCurrency, cn } from "@/lib/utils";
import {
  ManagerCard,
  ManagerToolbar,
  Badge,
  StatGrid,
  StatCard,
} from "@/components/manager/ui";
import { Mail, Phone, Shield } from "lucide-react";

export default function ManagerStaffPage() {
  const [selectedId, setSelectedId] = useState("1");
  const selected = staffMembers.find((s) => s.id === selectedId);

  return (
    <div className="space-y-6">
      <StatGrid>
        <StatCard label="Tổng nhân viên" value="12" />
        <StatCard label="Đang làm ca" value="8" variant="success" />
        <StatCard label="Vắng / nghỉ" value="1" variant="warning" />
        <StatCard label="Hiệu suất TB" value="91%" />
      </StatGrid>

      <ManagerToolbar searchPlaceholder="Tìm tên, mã NV..." />

      <div className="grid gap-6 lg:grid-cols-3">
        <ManagerCard className="lg:col-span-2 overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs text-[var(--manager-text-secondary)]">
              <tr>
                <th className="px-4 py-3">Nhân viên</th>
                <th className="px-4 py-3">Vai trò</th>
                <th className="px-4 py-3">Ca hôm nay</th>
                <th className="px-4 py-3">Đơn</th>
                <th className="px-4 py-3">Doanh thu</th>
                <th className="px-4 py-3">Hiệu suất</th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={cn(
                    "cursor-pointer border-t hover:bg-neutral-50",
                    selectedId === s.id && "bg-neutral-50",
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold">
                        {s.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(-2)}
                      </div>
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{s.role}</td>
                  <td className="px-4 py-3">{s.shift}</td>
                  <td className="px-4 py-3">{s.orders}</td>
                  <td className="px-4 py-3">{formatCurrency(s.revenue)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "font-semibold",
                        s.performance >= 90 ? "text-emerald-600" : "text-amber-600",
                      )}
                    >
                      {s.performance}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ManagerCard>

        {selected && (
          <div className="space-y-4">
            <ManagerCard>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-200 text-lg font-bold">
                  NA
                </div>
                <h3 className="mt-3 text-lg font-bold">{selected.name}</h3>
                <Badge variant="info">{selected.role}</Badge>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Phone className="h-4 w-4" /> 0901 000 001
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Mail className="h-4 w-4" /> {selected.name.split(" ").join(".").toLowerCase()}@neon.coffee
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-neutral-500">Loại lương</span>
                  <span>Theo giờ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Ca hôm nay</span>
                  <span>{selected.shift}</span>
                </div>
              </dl>
            </ManagerCard>

            <ManagerCard title="Hiệu suất tháng">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-neutral-50 p-3">
                  <p className="text-2xl font-bold">{selected.orders}</p>
                  <p className="text-xs text-neutral-500">Đơn xử lý</p>
                </div>
                <div className="rounded-lg bg-neutral-50 p-3">
                  <p className="text-2xl font-bold">{selected.performance}%</p>
                  <p className="text-xs text-neutral-500">Điểm</p>
                </div>
              </div>
            </ManagerCard>

            <ManagerCard title="Quyền hạn">
              <ul className="space-y-2">
                {permissions
                  .filter((p) => p.roles.includes(selected.role) || p.roles.includes("Manager"))
                  .map((p) => (
                    <li key={p.key} className="flex items-center gap-2 text-sm">
                      <Shield className="h-3.5 w-3.5 text-emerald-600" />
                      {p.label}
                    </li>
                  ))}
              </ul>
            </ManagerCard>
          </div>
        )}
      </div>
    </div>
  );
}
