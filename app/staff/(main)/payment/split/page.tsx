"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useNeonStore } from "@/store/neon-store";

export default function SplitPaymentPage() {
  const router = useRouter();
  const total = useNeonStore((s) => s.cartTotal());
  const lines = useNeonStore((s) => s.splitPayments);
  const addSplitLine = useNeonStore((s) => s.addSplitLine);
  const updateSplitLine = useNeonStore((s) => s.updateSplitLine);
  const removeSplitLine = useNeonStore((s) => s.removeSplitLine);
  const confirmPayment = useNeonStore((s) => s.confirmPayment);
  const paid = lines.reduce((s, l) => s + l.amount, 0);
  const [error, setError] = useState("");

  async function confirm() {
    setError("");
    const res = await confirmPayment({
      method: "split",
      splitLines: lines.map((l) => ({ method: l.method, amount: l.amount })),
    });
    if (!res.ok) {
      setError(res.error ?? "Lỗi");
      return;
    }
    router.push("/staff/kitchen");
  }

  return (
    <div className="mx-auto max-w-lg flex-1 p-4">
      <Link href="/staff/payment" className="text-sm">← Thanh toán</Link>
      <h1 className="mt-2 text-xl font-bold">Chia thanh toán</h1>
      <p className="mt-2 text-2xl font-bold">{formatCurrency(total)}</p>
      <p className="text-sm text-amber-700">Còn: {formatCurrency(Math.max(0, total - paid))}</p>
      {lines.map((l, i) => (
        <div key={l.id} className="mt-3 space-y-2 rounded-xl border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Phương thức {i + 1}</span>
            <button type="button" onClick={() => removeSplitLine(l.id)}><Trash2 className="h-4 w-4" /></button>
          </div>
          <select
            value={l.method}
            onChange={(e) => updateSplitLine(l.id, { method: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="cash">Tiền mặt</option>
            <option value="card">Thẻ</option>
            <option value="qr">QR</option>
            <option value="ewallet">Ví</option>
          </select>
          <input
            type="number"
            value={l.amount || ""}
            onChange={(e) => updateSplitLine(l.id, { amount: Number(e.target.value) || 0 })}
            className="w-full rounded-lg border px-3 py-2 text-right"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => addSplitLine({ method: "cash", amount: Math.max(0, total - paid) })}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3"
      >
        <Plus className="h-4 w-4" /> Thêm phương thức
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button
        type="button"
        disabled={paid < total || !lines.length}
        onClick={confirm}
        className="mt-6 w-full min-h-[52px] rounded-xl bg-black font-bold text-white disabled:opacity-40"
      >
        Xác nhận thanh toán
      </button>
    </div>
  );
}
