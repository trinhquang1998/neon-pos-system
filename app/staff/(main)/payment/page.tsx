"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { useNeonStore } from "@/store/neon-store";

const paymentMethods = [
  { id: "cash", label: "Tiền mặt" },
  { id: "qr", label: "QR Code" },
  { id: "card", label: "Thẻ ngân hàng" },
  { id: "ewallet", label: "Ví điện tử" },
];

export default function PaymentPage() {
  const router = useRouter();
  const cart = useNeonStore((s) => s.cart);
  const pagers = useNeonStore((s) => s.pagers);
  const selectedPager = useNeonStore((s) => s.selectedPager);
  const setPager = useNeonStore((s) => s.setPager);
  const subtotal = useNeonStore((s) => s.subtotal);
  const suggestPager = useNeonStore((s) => s.suggestPager);
  const confirmPayment = useNeonStore((s) => s.confirmPayment);
  const processing = useNeonStore((s) => s.paymentProcessing);

  const [method, setMethod] = useState("cash");
  const [amountGiven, setAmountGiven] = useState("");
  const [error, setError] = useState("");

  const total = subtotal();
  const given = Number(amountGiven) || 0;
  const change = Math.max(0, given - total);
  const suggested = suggestPager();

  useEffect(() => {
    if (!selectedPager && suggested) setPager(suggested);
  }, [selectedPager, suggested, setPager]);

  useEffect(() => {
    if (cart.length === 0) router.replace("/staff/pos");
  }, [cart.length, router]);

  async function handleConfirm() {
    setError("");
    const res = await confirmPayment({
      method,
      amountGiven: method === "cash" ? given : total,
    });
    if (!res.ok) {
      setError(res.error ?? "Thanh toán thất bại");
      return;
    }
    router.push("/staff/kitchen");
  }

  const readyPagers = pagers.filter((p) => p.state === "ready");

  return (
    <div className="flex flex-1 flex-col overflow-auto p-4 sm:p-6">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href="/staff/pos"
          className="text-sm text-[var(--text-secondary)] hover:text-black"
        >
          ← Quay lại POS
        </Link>

        {error && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
            <h2 className="text-lg font-bold">Thông tin đơn</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--text-secondary)]">Tổng tiền</dt>
                <dd className="text-xl font-bold text-[var(--accent-red)]">
                  {formatCurrency(total)}
                </dd>
              </div>
              {method === "cash" && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <dt className="text-[var(--text-secondary)]">Khách đưa</dt>
                    <input
                      type="number"
                      value={amountGiven}
                      onChange={(e) => setAmountGiven(e.target.value)}
                      className="w-full max-w-[140px] rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-right text-base outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex justify-between border-t border-[var(--border)] pt-3">
                    <dt className="text-[var(--text-secondary)]">Tiền thừa</dt>
                    <dd className="font-semibold text-[var(--success)]">
                      {formatCurrency(change)}
                    </dd>
                  </div>
                </>
              )}
            </dl>
            <ul className="mt-4 space-y-1 border-t border-[var(--border)] pt-4 text-sm">
              {cart.map((item) => (
                <li key={item.productId}>
                  {item.name} x{item.quantity}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
              <h2 className="text-lg font-bold">Phương thức</h2>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {paymentMethods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      "min-h-[44px] rounded-xl border py-3 text-sm font-medium",
                      method === m.id
                        ? "border-black bg-black text-white"
                        : "border-[var(--border)] bg-white hover:border-neutral-300",
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
              <h2 className="text-lg font-bold">Gán Pager</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {readyPagers.length} pager trống
                {suggested ? ` · Gợi ý #${suggested}` : ""}
              </p>
              <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {pagers.slice(0, 12).map((p) => {
                  const disabled = p.state !== "ready";
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => setPager(p.physicalId)}
                      className={cn(
                        "min-h-[44px] rounded-xl border text-lg font-bold",
                        selectedPager === p.physicalId
                          ? "border-[var(--info)] bg-[var(--info)]/20"
                          : "border-[var(--border)]",
                        disabled && "opacity-30",
                      )}
                    >
                      {p.physicalId}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={processing || cart.length === 0}
          onClick={handleConfirm}
          className="mt-8 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-black py-4 text-sm font-bold text-white disabled:opacity-50"
        >
          {processing ? "Đang xử lý..." : "CONFIRM PAYMENT"}
        </button>
      </div>
    </div>
  );
}
