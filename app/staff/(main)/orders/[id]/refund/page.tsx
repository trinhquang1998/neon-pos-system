"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { refundReasons } from "@/lib/mock-data";
import { cn, formatCurrency } from "@/lib/utils";
import { useLiveOrders, useNeonStore } from "@/store/neon-store";
import type { RefundType } from "@/lib/types";

export default function RefundPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const order = useLiveOrders().find((o) => o.id === id);
  const refundOrder = useNeonStore((s) => s.refundOrder);
  const [type, setType] = useState<RefundType>("full");
  const [reason, setReason] = useState<string>(refundReasons[0]);
  const [lines, setLines] = useState<string[]>([]);

  if (!order) {
    return <div className="p-6"><Link href="/staff/orders">Quay lại</Link></div>;
  }

  const details = order.lineDetails ?? [];
  const refundTotal =
    type === "partial"
      ? details.filter((l) => lines.includes(l.lineId)).reduce((s, l) => s + l.unitPrice * l.quantity, 0)
      : order.total;

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-3">
      <div className="border-b p-4 lg:border-r">
        <Link href={`/staff/orders/${id}`} className="text-sm">← Đơn #{id}</Link>
        <p className="mt-4 font-mono text-2xl font-bold">{formatCurrency(order.total)}</p>
      </div>
      <div className="border-b p-4 lg:border-r">
        {(["partial", "full", "void"] as const).map((t) => (
          <label key={t} className={cn("mb-2 flex min-h-[48px] items-center gap-3 rounded-xl border px-4", type === t && "border-black bg-neutral-50")}>
            <input type="radio" checked={type === t} onChange={() => setType(t)} />
            <span>{t === "partial" ? "Hoàn một phần" : t === "full" ? "Hoàn toàn bộ" : "Hủy đơn"}</span>
          </label>
        ))}
      </div>
      <div className="p-4">
        <div className="rounded-2xl border bg-[var(--surface)] p-4 text-sm">
          <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Tổng đơn</span><span>{formatCurrency(order.total)}</span></div>
          {order.discount ? (
            <div className="flex justify-between text-green-600"><span>{order.discount.name}</span><span>-{formatCurrency(order.discount.type === "percent" ? Math.round((order.lineDetails?.reduce((s, l) => s + l.unitPrice * l.quantity, 0) ?? 0) * Math.min(100, order.discount.value) / 100) : Math.min(order.lineDetails?.reduce((s, l) => s + l.unitPrice * l.quantity, 0) ?? 0, order.discount.value))}</span></div>
          ) : null}
        </div>
        {type === "partial" && details.map((l) => (
          <label key={l.lineId} className="mb-2 flex items-center gap-3 rounded-xl border px-3 py-2 text-sm">
            <input type="checkbox" checked={lines.includes(l.lineId)} onChange={() => setLines((p) => p.includes(l.lineId) ? p.filter((x) => x !== l.lineId) : [...p, l.lineId])} />
            <span className="flex-1">{l.name} x{l.quantity}</span>
            <span>{formatCurrency(l.unitPrice * l.quantity)}</span>
          </label>
        ))}
        <select value={reason} onChange={(e) => setReason(e.target.value)} className="mt-4 w-full min-h-[44px] rounded-xl border px-3">
          {refundReasons.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <p className="mt-4 text-center text-2xl font-bold text-red-600">{formatCurrency(refundTotal)}</p>
        <button
          type="button"
          disabled={type === "partial" && lines.length === 0}
          onClick={() => {
            refundOrder(id, { type, lineIds: type === "partial" ? lines : undefined, reason });
            router.push("/staff/orders");
          }}
          className="mt-4 w-full min-h-[52px] rounded-xl bg-black font-bold text-white disabled:opacity-50"
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
}
