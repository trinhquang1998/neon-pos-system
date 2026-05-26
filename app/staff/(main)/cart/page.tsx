"use client";

import Link from "next/link";
import { useState } from "react";
import { CartLines, CartSummary } from "@/components/staff/cart-panel";
import { cn, formatCurrency } from "@/lib/utils";
import { useNeonStore } from "@/store/neon-store";

export default function CartPage() {
  const cart = useNeonStore((s) => s.cart);
  const orderCounter = useNeonStore((s) => s.orderCounter);
  const customerName = useNeonStore((s) => s.customerName);
  const setCustomerName = useNeonStore((s) => s.setCustomerName);
  const setCartDiscount = useNeonStore((s) => s.setCartDiscount);
  const updateQuantity = useNeonStore((s) => s.updateQuantity);
  const removeFromCart = useNeonStore((s) => s.removeFromCart);
  const saveHeldOrder = useNeonStore((s) => s.saveHeldOrder);
  const subtotal = useNeonStore((s) => s.cartSubtotal());
  const discount = useNeonStore((s) => s.cartDiscountAmount());
  const total = useNeonStore((s) => s.cartTotal());
  const [promo, setPromo] = useState("");

  function applyPromo() {
    const c = promo.trim().toUpperCase();
    if (c === "NEON20") setCartDiscount({ type: "percent", name: "NEON20", value: 20 });
    if (c === "HAPPY10") setCartDiscount({ type: "percent", name: "HAPPY10", value: 10 });
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
          total={total}
          promoSlot={
            <div className="pt-3">
              <div className="flex gap-2">
                <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Mã KM" className="flex-1 rounded-lg border px-3 py-2 text-sm" />
                <button type="button" onClick={applyPromo} className="rounded-lg border px-3 text-xs font-semibold">Áp dụng</button>
              </div>
              <Link href="/staff/payment/discount" className="mt-2 block text-xs text-[var(--info)] underline">Giảm giá nâng cao</Link>
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
