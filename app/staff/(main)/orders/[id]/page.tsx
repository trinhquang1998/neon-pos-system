"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLiveOrders, useNeonStore } from "@/store/neon-store";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";
import { getProductImage } from "@/lib/product-images";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const orders = useLiveOrders();
  const order = orders.find((o) => o.id === id);
  const resendToKitchen = useNeonStore((s) => s.resendToKitchen);
  const updateOrderStatus = useNeonStore((s) => s.updateOrderStatus);

  if (!order) {
    return (
      <div className="p-6">
        <p>Không tìm thấy đơn</p>
        <Link href="/staff/orders">Quay lại</Link>
      </div>
    );
  }

  const actions = [
    { label: "In hóa đơn", onClick: () => window.print() },
    { label: "Thêm món", onClick: () => router.push("/staff/pos") },
    ...(!["cancelled", "completed"].includes(order.status)
      ? [{ label: "Gửi lại bếp", onClick: () => resendToKitchen(order.id) }]
      : []),
    { label: "Hoàn / Hủy", href: `/staff/orders/${order.id}/refund`, danger: true },
  ] as const;

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-3">
      <div className="border-b p-4 lg:border-r">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">CHI TIẾT ĐƠN HÀNG</p>
            <h1 className="mt-2 font-mono text-2xl font-bold">#{order.id}</h1>
          </div>
          <div className="text-right text-xs">
            <div>{order.time}</div>
            <div className="text-[var(--text-secondary)]">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : ""}</div>
          </div>
        </div>

        <StatusBadge status={order.status} className="mt-3" />

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Loại đơn</dt><dd>{order.paymentMethod ?? "—"}</dd></div>
          <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Nhân viên</dt><dd className="font-medium">{order.timeline?.[0]?.message ? order.timeline[0].message : "—"}</dd></div>
          <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Trạng thái</dt><dd>{order.status}</dd></div>
          <div><dt className="text-[var(--text-secondary)]">Ghi chú</dt><dd className="text-xs text-[var(--text-secondary)]">{order.notes ?? "—"}</dd></div>
        </dl>
      </div>

      <div className="border-b p-4 lg:border-r">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-[var(--text-secondary)]">
              <th className="pb-2">Món</th>
              <th className="pb-2">SL</th>
              <th className="pb-2">Giá</th>
              <th className="pb-2 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {(order.lineDetails ?? []).map((l) => (
              <tr key={l.lineId} className={`border-b ${l.refunded ? "opacity-50 line-through" : ""}`}>
                <td className="py-3">
                  <div className="flex items-start gap-3">
                    <img src={getProductImage(l.lineId.split("-")[0])} alt="" className="h-10 w-10 rounded-md object-cover" />
                    <div className="min-w-0">
                      <div className="font-semibold">{l.name}</div>
                      {l.modifierLabels?.length ? (
                        <div className="text-xs text-[var(--text-secondary)]">{l.modifierLabels.join(", ")}</div>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="align-middle">{l.quantity}</td>
                <td className="align-middle">{formatCurrency(l.unitPrice)}</td>
                <td className="text-right align-middle font-medium">{formatCurrency(l.unitPrice * l.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 space-y-2 text-sm text-right">
          {order.discount ? (
            <div className="flex justify-end gap-2 text-green-600">
              <span>{order.discount.name}</span>
              <span>-{formatCurrency(order.discount.type === "percent" ? Math.round((order.lineDetails?.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0) ?? 0) * Math.min(100, order.discount.value) / 100) : Math.min(order.lineDetails?.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0) ?? 0, order.discount.value))}</span>
            </div>
          ) : null}
          <div className="flex justify-end items-center gap-3">
            <span className="text-[var(--text-secondary)]">Tổng cộng</span>
            <span className="text-lg font-bold">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs font-bold uppercase text-[var(--text-secondary)]">Thao tác</p>
        <div className="mt-3 flex flex-col gap-3">
          <button type="button" onClick={() => window.print()} className="min-h-[44px] rounded-xl border px-4 py-3 text-left text-sm font-medium">In lại hoá đơn</button>
          {/* Đã loại bỏ chức năng đổi bàn theo yêu cầu */}
          <button type="button" onClick={() => router.push('/staff/pos')} className="min-h-[44px] rounded-xl border px-4 py-3 text-left text-sm font-medium">Thêm món</button>
          <button type="button" onClick={() => alert('Hủy món')} className="min-h-[44px] rounded-xl border px-4 py-3 text-left text-sm font-medium">Huỷ món</button>
          <button type="button" onClick={() => router.push(`/staff/orders/${order.id}/refund`)} className="min-h-[44px] rounded-xl border bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-700">Hoàn tiền</button>
          <button type="button" onClick={() => { updateOrderStatus(order.id, 'cancelled'); router.push('/staff/orders'); }} className="min-h-[44px] rounded-xl border px-4 py-3 text-left text-sm font-medium">Huỷ đơn</button>
        </div>
        {order.status === "ready" && (
          <button type="button" className="mt-4 w-full min-h-[44px] rounded-xl bg-black text-sm font-bold text-white" onClick={() => updateOrderStatus(order.id, "picked_up")}>
            Khách đã lấy
          </button>
        )}
      </div>
    </div>
  );
}
