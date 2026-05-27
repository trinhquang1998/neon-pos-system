"use client";

import Link from "next/link";
import { useState } from "react";
import { CartLines, CartSummary } from "@/components/staff/cart-panel";
import { cn, formatCurrency } from "@/lib/utils";
import { useNeonStore } from "@/store/neon-store";

function PromoIcon({ type }: { type: string }) {
  if (type === "percent") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path d="M7 7L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="16.5" r="1.5" fill="currentColor" />
    </svg>
  );
  if (type === "fixed") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path d="M12 1v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  if (type === "bogo") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path d="M3 7h18M3 12h12M3 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  if (type === "points") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.9 7.82 20 9 12.91l-5-3.64 5.91-.99L12 2z" fill="currentColor" />
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function CartPage() {
  const cart = useNeonStore((s) => s.cart);
  const orderCounter = useNeonStore((s) => s.orderCounter);
  const customerName = useNeonStore((s) => s.customerName);
  const setCustomerName = useNeonStore((s) => s.setCustomerName);
  const setCartDiscount = useNeonStore((s) => s.setCartDiscount);
  const updateQuantity = useNeonStore((s) => s.updateQuantity);
  const removeFromCart = useNeonStore((s) => s.removeFromCart);
  const saveHeldOrder = useNeonStore((s) => s.saveHeldOrder);
  const vouchers = useNeonStore((s) => s.vouchers);
  const promotions = useNeonStore((s) => s.promotions);
  const cartDiscount = useNeonStore((s) => s.cartDiscount);
  const subtotal = useNeonStore((s) => s.cartSubtotal());
  const discount = useNeonStore((s) => s.cartDiscountAmount());
  const total = useNeonStore((s) => s.cartTotal());
  const [promo, setPromo] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  function applyPromo() {
    const code = promo.trim().toUpperCase();
    if (!code) {
      setPromoMessage("Nhập mã khuyến mãi.");
      return;
    }

    const voucher = vouchers.find((v) => v.code === code);
    if (!voucher) {
      setPromoMessage("Mã khuyến mãi không hợp lệ.");
      return;
    }

    if (voucher.status !== "active") {
      setPromoMessage("Mã đã dùng hoặc hết hạn.");
      return;
    }

    if (voucher.discount.endsWith("%")) {
      const value = Number(voucher.discount.replace("%", "")) || 0;
      setCartDiscount({ type: "percent", name: voucher.code, value });
    } else {
      const numberValue = Number(voucher.discount.replace(/[^0-9]/g, "")) || 0;
      if (numberValue <= 0) {
        setPromoMessage("Mã này hiện chưa được hỗ trợ.");
        return;
      }
      setCartDiscount({ type: "fixed", name: voucher.code, value: numberValue });
    }

    setPromoMessage(`Áp dụng ${voucher.code} - ${voucher.discount}`);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="border-b p-4">
          <p className="text-xs text-[var(--text-secondary)]">Đơn #{orderCounter}</p>
          <h1 className="text-xl font-bold">Giỏ hàng</h1>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Tên khách (tuỳ chọn)"
            className="mt-3 w-full min-h-[44px] rounded-xl border px-3 text-sm"
          />
        </header>
        <div className="flex-1 overflow-auto px-4">
          <CartLines cart={cart} onUpdateQty={updateQuantity} onRemove={removeFromCart} />
        </div>
      </div>
      <aside className="w-full border-t p-4 lg:w-80 lg:border-l lg:border-t-0">
        <CartSummary
          subtotal={subtotal}
          discount={discount}
          discountLabel={cartDiscount?.name}
          total={total}
          promoSlot={
            <div className="pt-3">
              <div className="flex gap-2">
                <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Mã KM" className="flex-1 rounded-lg border px-3 py-2 text-sm" />
                <button type="button" onClick={applyPromo} className="rounded-lg border px-3 text-xs font-semibold">Áp dụng</button>
              </div>
              {promoMessage ? <p className="mt-2 text-xs text-[var(--text-secondary)]">{promoMessage}</p> : null}
              <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                <Link href="/staff/payment/discount" className="text-[var(--info)] underline">Giảm giá nâng cao</Link>
                {cartDiscount ? (
                  <button type="button" onClick={() => { setCartDiscount(null); setPromoMessage("Đã xóa khuyến mãi."); }} className="text-[var(--danger)] underline">Xóa KM</button>
                ) : null}
              </div>
              {promotions.length > 0 ? (
                <div className="mt-4 rounded-2xl border bg-[var(--surface)] p-3 text-xs">
                  <p className="mb-2 font-semibold">Khuyến mãi đang chạy</p>
                  <ul className="space-y-2">
                    {promotions.filter((p) => p.status === "active").map((p) => (
                      <li key={p.id} className="rounded-xl border bg-white px-3 py-2 flex items-center justify-between">
                            <div>
                              <p className="font-semibold"><span className="mr-2 text-[var(--text-secondary)] relative inline-block group"><PromoIcon type={p.type} /><span className="pointer-events-none absolute -top-10 left-0 hidden group-hover:inline-block rounded bg-black text-white text-xs px-2 py-1 whitespace-nowrap">{p.type === 'bogo' ? 'Mua X tặng Y' : p.type === 'percent' ? '% Giảm' : p.type === 'fixed' ? 'Số tiền' : 'Khuyến mãi'}</span></span>{p.name}</p>
                              <p className="text-[var(--text-secondary)]">{p.value}</p>
                            </div>
                        <div className="flex items-center gap-2">
                          {(p.type === "percent" || p.type === "fixed") ? (
                            <button
                              type="button"
                              onClick={() => {
                                if (p.type === "percent") {
                                  const amount = Number(p.value.replace("%", "")) || 0;
                                  setCartDiscount({ type: "percent", name: p.name, value: amount });
                                  setPromoMessage(`Áp dụng ${p.name} - ${p.value}`);
                                } else {
                                  const amount = Number(p.value.replace(/[^0-9]/g, "")) || 0;
                                  setCartDiscount({ type: "fixed", name: p.name, value: amount });
                                  setPromoMessage(`Áp dụng ${p.name} - ${p.value}`);
                                }
                              }}
                              className="rounded-lg border px-3 py-1 text-xs font-semibold"
                            >Áp dụng</button>
                          ) : (
                            <button type="button" onClick={() => window.location.href = '/staff/payment/discount'} className="rounded-lg border px-3 py-1 text-xs">Chi tiết</button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          }
        />
        <div className="mt-4 grid gap-2">
          <Link href="/staff/pos" className="flex min-h-[44px] items-center justify-center rounded-xl border text-sm font-medium">+ Thêm món</Link>
          <button type="button" onClick={() => saveHeldOrder()} disabled={!cart.length} className="min-h-[44px] rounded-xl border text-sm disabled:opacity-40">Lưu đơn</button>
          <button type="button" onClick={() => window.print()} disabled={!cart.length} className="min-h-[44px] rounded-xl border text-sm disabled:opacity-40">In bill tạm</button>
          <Link href={cart.length ? "/staff/payment" : "#"} className={cn("flex min-h-[52px] items-center justify-center rounded-xl bg-black text-sm font-bold text-white", !cart.length && "pointer-events-none opacity-40")}>
            THANH TOÁN · {formatCurrency(total)}
          </Link>
        </div>
      </aside>
    </div>
  );
}
