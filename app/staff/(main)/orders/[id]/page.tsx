"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLiveOrders, useNeonStore } from "@/store/neon-store";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";

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
        <Link href="/staff/orders" className="text-sm">← Đơn hàng</Link>
        <h1 className="mt-2 font-mono text-2xl font-bold">#{order.id}</h1>
        <StatusBadge status={order.status} className="mt-2" />
        <dl className="mt-4 space-y-2 text-sm">
          <div><dt className="text-[var(--text-secondary)]">Khách</dt><dd className="font-medium">{order.customer}</dd></div>
          <div><dt className="text-[var(--text-secondary)]">Pager</dt><dd>#{order.pagerId ?? "—"}</dd></div>
          <div><dt className="text-[var(--text-secondary)]">Timer</dt><dd className="font-mono">{order.timer}</dd></div>
        </dl>
      </div>
      <div className="border-b p-4 lg:border-r">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-[var(--text-secondary)]">
              <th className="pb-2">Món</th><th>SL</th><th className="text-right">TT</th>
            </tr>
          </thead>
          <tbody>
            {(order.lineDetails ?? []).map((l) => (
              <tr key={l.lineId} className="border-b">
                <td className="py-2">{l.name}{l.modifierLabels?.length ? <span className="block text-xs text-[var(--text-secondary)]">{l.modifierLabels.join(", ")}</span> : null}</td>
                <td>{l.quantity}</td>
                <td className="text-right">{formatCurrency(l.unitPrice * l.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-right text-lg font-bold">{formatCurrency(order.total)}</p>
      </div>
      <div className="p-4">
        <p className="text-xs font-bold uppercase text-[var(--text-secondary)]">Thao tác</p>
        <div className="mt-3 flex flex-col gap-2">
          {actions.map((a) =>
            "href" in a ? (
              <Link key={a.label} href={a.href} className="min-h-[44px] rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{a.label}</Link>
            ) : (
              <button key={a.label} type="button" onClick={a.onClick} className="min-h-[44px] rounded-xl border px-4 py-3 text-left text-sm font-medium">{a.label}</button>
            ),
          )}
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
