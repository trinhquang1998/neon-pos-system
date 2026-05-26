"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  DEFAULT_MODIFIERS,
  ICE_OPTIONS,
  SIZE_OPTIONS,
  SUGAR_LEVELS,
  TOPPINGS,
  calcItemUnitPrice,
  formatModifierLabels,
} from "@/lib/modifiers";
import { getProductImage } from "@/lib/product-images";
import type { ItemModifiers, Product } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { ChipSelect } from "./chip-select";

export function ModifierForm({
  product,
  onAdd,
  onCancel,
}: {
  product: Product;
  onAdd: (p: {
    quantity: number;
    modifiers: ItemModifiers;
    price: number;
    modifierLabels: string[];
  }) => void;
  onCancel: () => void;
}) {
  const [modifiers, setModifiers] = useState<ItemModifiers>({ ...DEFAULT_MODIFIERS });
  const [quantity, setQuantity] = useState(1);
  const unitPrice = useMemo(
    () => calcItemUnitPrice(product.price, modifiers),
    [product.price, modifiers],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-3">
        <div className="border-b p-4 lg:border-b-0 lg:border-r">
          <img
            src={product.image ?? getProductImage(product.id)}
            alt=""
            className="mx-auto aspect-square max-h-48 w-full max-w-[200px] rounded-2xl object-cover"
          />
          <h1 className="mt-4 text-center text-xl font-bold">{product.name}</h1>
          <p className="text-center font-semibold">{formatCurrency(product.price)}</p>
          <div className="mt-4 flex justify-center gap-3">
            <button type="button" className="flex h-11 w-11 items-center justify-center rounded-xl border" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
              <Minus className="h-4 w-4" />
            </button>
            <span className="flex w-10 items-center justify-center text-xl font-bold">{quantity}</span>
            <button type="button" className="flex h-11 w-11 items-center justify-center rounded-xl border" onClick={() => setQuantity((q) => q + 1)}>
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="overflow-auto border-b p-4 lg:border-b-0 lg:border-r">
          <p className="text-xs font-bold uppercase text-[var(--text-secondary)]">Size</p>
          <div className="mt-2 flex gap-2">
            {SIZE_OPTIONS.map((s) => (
              <button key={s.id} type="button" onClick={() => setModifiers((m) => ({ ...m, size: s.id }))} className={cn("flex-1 min-h-[44px] rounded-xl border text-sm font-medium", modifiers.size === s.id ? "bg-black text-white" : "")}>
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs font-bold uppercase text-[var(--text-secondary)]">Đá</p>
          <ChipSelect className="mt-2" value={modifiers.ice ?? 100} onChange={(v) => setModifiers((m) => ({ ...m, ice: v }))} options={ICE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
          <p className="mt-4 text-xs font-bold uppercase text-[var(--text-secondary)]">Đường</p>
          <ChipSelect className="mt-2" value={modifiers.sugar ?? 100} onChange={(v) => setModifiers((m) => ({ ...m, sugar: v }))} options={SUGAR_LEVELS.map((l) => ({ value: l, label: `${l}%` }))} />
          <p className="mt-4 text-xs font-bold uppercase text-[var(--text-secondary)]">Topping</p>
          <div className="mt-2 space-y-1">
            {TOPPINGS.map((t) => {
              const on = modifiers.toppings?.includes(t.id);
              return (
                <button key={t.id} type="button" onClick={() => setModifiers((m) => ({ ...m, toppings: on ? (m.toppings ?? []).filter((x) => x !== t.id) : [...(m.toppings ?? []), t.id] }))} className={cn("flex w-full min-h-[44px] items-center justify-between rounded-xl border px-3 text-sm", on && "border-black bg-neutral-50")}>
                  <span>{t.label}</span>
                  <span>+{formatCurrency(t.price)}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xs font-bold uppercase text-[var(--text-secondary)]">Ghi chú</p>
          <textarea value={modifiers.note ?? ""} onChange={(e) => setModifiers((m) => ({ ...m, note: e.target.value }))} rows={10} className="mt-2 flex-1 rounded-xl border p-3 text-sm outline-none focus:border-black" placeholder="Yêu cầu đặc biệt..." />
        </div>
      </div>
      <div className="flex gap-2 border-t p-4">
        <button type="button" onClick={onCancel} className="min-h-[52px] flex-1 rounded-xl border font-semibold">Hủy</button>
        <button type="button" onClick={() => onAdd({ quantity, modifiers, price: unitPrice, modifierLabels: formatModifierLabels(modifiers) })} className="min-h-[52px] flex-[2] rounded-xl bg-black font-bold text-white">
          Thêm vào giỏ · {formatCurrency(unitPrice * quantity)}
        </button>
      </div>
    </div>
  );
}
