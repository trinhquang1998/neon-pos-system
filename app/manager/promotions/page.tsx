"use client";

import { useNeonStore } from "@/store/neon-store";
import {
  ManagerCard,
  ManagerToolbar,
  Badge,
  StatGrid,
  StatCard,
  ManagerTabs,
} from "@/components/manager/ui";
import { useState } from "react";

const tabs = [
  { id: "campaigns", label: "Chiến dịch" },
  { id: "vouchers", label: "Voucher" },
];

const statusVariant = {
  active: "success",
  scheduled: "info",
  ended: "default",
} as const;

export default function ManagerPromotionsPage() {
  const promotions = useNeonStore((s) => s.promotions);
  const vouchers = useNeonStore((s) => s.vouchers);
  const togglePromotion = useNeonStore((s) => s.togglePromotion);
  const [tab, setTab] = useState("campaigns");

  return (
    <div className="space-y-6">
      <StatGrid>
        <StatCard label="Chiến dịch đang chạy" value="2" variant="success" />
        <StatCard label="Voucher đã dùng" value="162" />
        <StatCard label="Doanh thu từ KM" value="2.840.000đ" />
        <StatCard label="Tỷ lệ dùng voucher" value="18.5%" />
      </StatGrid>

      <ManagerToolbar searchPlaceholder="Tìm chiến dịch, mã voucher..." />

      <ManagerTabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "campaigns" && (
        <div className="grid gap-4 md:grid-cols-2">
          {promotions.map((p) => (
            <ManagerCard key={p.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    {p.startDate} → {p.endDate}
                  </p>
                </div>
                <Badge variant={statusVariant[p.status]}>
                  {p.status === "active"
                    ? "Đang chạy"
                    : p.status === "scheduled"
                      ? "Sắp diễn ra"
                      : "Đã kết thúc"}
                </Badge>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="rounded-lg bg-neutral-100 px-4 py-2 text-lg font-bold">
                  {p.value}
                </div>
                <div className="text-sm">
                  <p>
                    Đã dùng: <strong>{p.used}</strong> / {p.limit}
                  </p>
                  <div className="mt-1 h-2 w-32 overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-full bg-black"
                      style={{ width: `${(p.used / p.limit) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="rounded-lg border px-3 py-1.5 text-sm"
                  onClick={() => togglePromotion(p.id)}
                >
                  {p.status === "active" ? "Tắt" : "Bật"}
                </button>
              </div>
            </ManagerCard>
          ))}
          <button
            type="button"
            className="flex min-h-[180px] items-center justify-center rounded-[var(--radius)] border-2 border-dashed text-neutral-400 hover:border-black hover:text-black"
          >
            + Tạo chiến dịch mới
          </button>
        </div>
      )}

      {tab === "vouchers" && (
        <ManagerCard>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-neutral-500">
              <tr className="border-b">
                <th className="pb-3">Mã</th>
                <th className="pb-3">Giảm giá</th>
                <th className="pb-3">Khách</th>
                <th className="pb-3">Hết hạn</th>
                <th className="pb-3">Trạng thái</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v) => (
                <tr key={v.id} className="border-t">
                  <td className="py-3 font-mono font-semibold">{v.code}</td>
                  <td className="py-3">{v.discount}</td>
                  <td className="py-3">{v.customer ?? "Tất cả"}</td>
                  <td className="py-3">{v.expires}</td>
                  <td className="py-3">
                    <Badge
                      variant={
                        v.status === "active"
                          ? "success"
                          : v.status === "used"
                            ? "default"
                            : "danger"
                      }
                    >
                      {v.status === "active"
                        ? "Hoạt động"
                        : v.status === "used"
                          ? "Đã dùng"
                          : "Hết hạn"}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <button type="button" className="text-xs text-blue-600">
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ManagerCard>
      )}

      <ManagerCard title="Phân khúc khách hàng">
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "Khách mới", count: 42, action: "Welcome 10%" },
            { label: "Khách thân thiết", count: 186, action: "Points x2" },
            { label: "VIP", count: 24, action: "Free upgrade" },
            { label: "Nguy cơ rời", count: 12, action: "Win-back 20%" },
          ].map((seg) => (
            <div key={seg.label} className="rounded-lg border p-4">
              <p className="font-medium">{seg.label}</p>
              <p className="text-2xl font-bold">{seg.count}</p>
              <p className="mt-2 text-xs text-blue-600">{seg.action}</p>
            </div>
          ))}
        </div>
      </ManagerCard>
    </div>
  );
}
