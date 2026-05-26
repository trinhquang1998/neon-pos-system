"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { useNeonStore } from "@/store/neon-store";

const methods = [
  { id: "cash", label: "Tiền mặt" },
  { id: "card", label: "Thẻ ngân hàng" },
  { id: "qr", label: "QR Code" },
  { id: "ewallet", label: "Ví điện tử" },
  { id: "transfer", label: "Chuyển khoản" },
  { id: "split", label: "Thanh toán chia" },
];

export default function PaymentPage() {
  const router = useRouter();
  const cart = useNeonStore((s) => s.cart);
  const pagers = useNeonStore((s) => s.pagers);
  const selectedPager = useNeonStore((s) => s.selectedPager);
  const setPager = useNeonStore((s) => s.setPager);
  const total = useNeonStore((s) => s.cartTotal());
  const subtotal = useNeonStore((s) => s.cartSubtotal());
  const discount = useNeonStore((s) => s.cartDiscountAmount());
  const suggestPager = useNeonStore((s) => s.suggestPager);
  const confirmPayment = useNeonStore((s) => s.confirmPayment);
  const processing = useNeonStore((s) => s.paymentProcessing);
  const splitPayments = useNeonStore((s) => s.splitPayments);
  const addSplitLine = useNeonStore((s) => s.addSplitLine);
  const clearSplitPayments = useNeonStore((s) => s.clearSplitPayments);
  const isOffline = useNeonStore((s) => s.isOffline);

  const [method, setMethod] = useState("cash");
  const [amountGiven, setAmountGiven] = useState("");
  const [splitEqual, setSplitEqual] = useState(false);
  const [error, setError] = useState("");

  const given = Number(amountGiven) || 0;
  const change = Math.max(0, given - total);
  const splitPaid = splitPayments.reduce((s, l) => s + l.amount, 0);

  useEffect(() => {
    if (!selectedPager && suggestPager()) setPager(suggestPager());
  }, [selectedPager, suggestPager, setPager]);

  useEffect(() => {
    if (!cart.length) router.replace("/staff/cart");
  }, [cart.length, router]);

  async function pay() {
    setError("");
    if (method === "split") {
      router.push("/staff/payment/split");
      return;
    }
    const res = await confirmPayment({ method, amountGiven: method === "cash" ? given : total });
    if (!res.ok) {
      setError(res.error ?? "Lỗi");
      return;
    }
    router.push("/staff/kitchen");
  }

  function splitEvenly() {
    clearSplitPayments();
    const half = Math.floor(total / 2);
    addSplitLine({ method: "cash", amount: half });
    addSplitLine({ method: "card", amount: total - half });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b px-4 py-3">
        <Link href="/staff/cart" className="text-sm text-[var(--text-secondary)]">← Giỏ hàng</Link>
        <h1 className="text-xl font-bold">Thanh toán</h1>
        {isOffline && <span className="text-xs text-amber-700">Offline</span>}
      </div>
      {error && <p className="mx-4 mt-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-3">
        <div className="border-b p-4 lg:border-b-0 lg:border-r">
          <p className="font-mono text-4xl font-bold">{formatCurrency(total)}</p>
          <dl className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between"><dt>Tạm tính</dt><dd>{formatCurrency(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><dt>Giảm</dt><dd>-{formatCurrency(discount)}</dd></div>}
          </dl>
          {method === "cash" && (
            <div className="mt-4 space-y-2">
              <label className="text-sm">Khách đưa</label>
              <input type="number" value={amountGiven} onChange={(e) => setAmountGiven(e.target.value)} className="w-full rounded-xl border px-3 py-3 text-right text-lg" />
              <p className="text-sm">Tiền thừa: <strong className="text-green-600">{formatCurrency(change)}</strong></p>
            </div>
          )}
        </div>
        <div className="border-b p-4 lg:border-b-0 lg:border-r">
          {methods.map((m) => (
            <button key={m.id} type="button" onClick={() => { setMethod(m.id); if (m.id !== "split") clearSplitPayments(); }} className={cn("mb-2 flex min-h-[48px] w-full items-center rounded-xl border px-4 text-left font-medium", method === m.id && "bg-black text-white")}>
              {m.label}
            </button>
          ))}
          <Link href="/staff/payment/discount" className="mt-2 block text-xs underline">Giảm giá / KM</Link>
        </div>
        <div className="p-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={splitEqual} onChange={(e) => { setSplitEqual(e.target.checked); if (e.target.checked) { setMethod("split"); splitEvenly(); } else clearSplitPayments(); }} />
            Chia đều 2 người
          </label>
          {splitPayments.map((l, i) => (
            <p key={l.id} className="mt-2 text-sm">PT {i + 1}: {formatCurrency(l.amount)}</p>
          ))}
          {method === "split" && splitPaid < total && <p className="mt-2 text-sm text-amber-700">Còn {formatCurrency(total - splitPaid)}</p>}
          <p className="mt-6 text-sm font-semibold">Pager</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {pagers.slice(0, 12).map((p) => (
              <button key={p.id} type="button" disabled={p.state !== "ready"} onClick={() => setPager(p.physicalId)} className={cn("min-h-[40px] rounded-lg border font-bold", selectedPager === p.physicalId && "bg-blue-50", p.state !== "ready" && "opacity-30")}>
                {p.physicalId}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button type="button" disabled={processing} onClick={pay} className="m-4 min-h-[56px] rounded-xl bg-black font-bold text-white disabled:opacity-50">
        {processing ? "Đang xử lý..." : "XÁC NHẬN THANH TOÁN"}
      </button>
    </div>
  );
}
