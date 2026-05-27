"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { getProductImage } from "@/lib/product-images";
import { formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

export function CartLines({
  cart,
  onUpdateQty,
  onRemove,
}: {
  cart: CartItem[];
  onUpdateQty: (lineId: string, qty: number) => void;
  onRemove: (lineId: string) => void;
}) {
  if (!cart.length) {
    return (
      <p className="py-12 text-center text-sm text-[var(--text-secondary)]">
        Chưa có món · <Link href="/staff/pos" className="underline">Mở POS</Link>
      </p>
    );
  }
  return (
    <ul className="divide-y">
      {cart.map((item) => (
        <li key={item.lineId} className="flex gap-3 py-4">
          <img src={getProductImage(item.productId)} alt="" className="h-16 w-16 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex justify-between">
              <p className="font-semibold">{item.name}</p>
              <button type="button" onClick={() => onRemove(item.lineId)}><Trash2 className="h-4 w-4 text-neutral-400" /></button>
            </div>
            {item.modifierLabels?.length ? (
              <p className="text-xs text-[var(--text-secondary)]">{item.modifierLabels.join(" · ")}</p>
            ) : null}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-2">
                <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg border" onClick={() => onUpdateQty(item.lineId, item.quantity - 1)}><Minus className="h-3 w-3" /></button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg border" onClick={() => onUpdateQty(item.lineId, item.quantity + 1)}><Plus className="h-3 w-3" /></button>
              </div>
              <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CartSummary({
  subtotal,
  discount,
  discountLabel,
  total,
  promoSlot,
}: {
  subtotal: number;
  discount: number;
  discountLabel?: string;
  total: number;
  promoSlot?: React.ReactNode;
}) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Tạm tính</span><span>{formatCurrency(subtotal)}</span></div>
      {discount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>{discountLabel ?? "Giảm giá"}</span>
          <span>-{formatCurrency(discount)}</span>
        </div>
      )}
      <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Tổng cộng</span><span>{formatCurrency(total)}</span></div>
      {promoSlot}
    </div>
  );
}
