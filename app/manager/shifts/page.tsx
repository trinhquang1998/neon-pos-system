"use client";

import { useState } from "react";
import { shiftSlots, weekDays } from "@/lib/manager-data";
import { staffMembers } from "@/lib/mock-data";
import {
  ManagerCard,
  ManagerToolbar,
  StatGrid,
  StatCard,
  Badge,
} from "@/components/manager/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ManagerShiftsPage() {
  const [weekLabel] = useState("Tuần 19 · 06/05 - 12/05/2024");

  return (
    <div className="space-y-6">
      <StatGrid>
        <StatCard label="Ca tuần này" value="42" />
        <StatCard label="Đã phân công" value="38" variant="success" />
        <StatCard label="Thiếu người" value="2" variant="warning" />
        <StatCard label="Yêu cầu nghỉ" value="3" />
      </StatGrid>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <ManagerToolbar searchPlaceholder="Tìm nhân viên..." actions={
          <div className="flex gap-2">
            <button type="button" className="rounded-lg border p-2 hover:bg-neutral-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="flex items-center px-3 text-sm font-medium">{weekLabel}</span>
            <button type="button" className="rounded-lg border p-2 hover:bg-neutral-50">
              <ChevronRight className="h-4 w-4" />
            </button>
            <button type="button" className="rounded-lg bg-black px-4 py-2 text-sm text-white">
              + Thêm ca
            </button>
          </div>
        } />
      </div>

      <ManagerCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b bg-neutral-50">
              <th className="sticky left-0 bg-neutral-50 px-4 py-3 text-left font-medium">
                Nhân viên
              </th>
              {weekDays.map((d) => (
                <th key={d} className="min-w-[120px] px-2 py-3 text-center font-medium">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((staff) => (
              <tr key={staff.id} className="border-t">
                <td className="sticky left-0 bg-white px-4 py-3">
                  <p className="font-medium">{staff.name}</p>
                  <p className="text-xs text-neutral-500">{staff.role}</p>
                </td>
                {weekDays.map((_, dayIndex) => {
                  const slot = shiftSlots.find(
                    (s) => s.staffId === staff.id && s.day === dayIndex,
                  );
                  return (
                    <td key={dayIndex} className="p-2 align-top">
                      {slot ? (
                        <div
                          className="rounded-lg px-2 py-2 text-xs text-white"
                          style={{ backgroundColor: slot.color }}
                        >
                          <p className="font-medium">
                            {slot.start}–{slot.end}
                          </p>
                          <p className="opacity-80">{slot.role}</p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="h-14 w-full rounded-lg border border-dashed text-neutral-300 hover:border-neutral-400 hover:text-neutral-500"
                        >
                          +
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </ManagerCard>

      <div className="grid gap-4 md:grid-cols-2">
        <ManagerCard title="Yêu cầu nghỉ phép">
          <ul className="space-y-3">
            {[
              { name: "Lê Văn C", date: "12/05", reason: "Việc riêng", status: "pending" },
              { name: "Trần Thị B", date: "15/05", reason: "Ốm", status: "approved" },
            ].map((req) => (
              <li
                key={req.name + req.date}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{req.name}</p>
                  <p className="text-xs text-neutral-500">
                    {req.date} · {req.reason}
                  </p>
                </div>
                <Badge variant={req.status === "approved" ? "success" : "warning"}>
                  {req.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                </Badge>
              </li>
            ))}
          </ul>
        </ManagerCard>

        <ManagerCard title="Dự báo nhân sự">
          <p className="text-sm text-neutral-600">
            Dựa trên lịch sử đơn hàng, khung giờ <strong>12:00–14:00</strong> cần thêm{" "}
            <strong>1 barista</strong> vào Thứ 7.
          </p>
          <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
            Overlap detection: Không có xung đột ca trong tuần này.
          </div>
        </ManagerCard>
      </div>
    </div>
  );
}
