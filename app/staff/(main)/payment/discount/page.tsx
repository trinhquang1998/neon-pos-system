"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { useNeonStore } from "@/store/neon-store";
import type { DiscountType } from "@/lib/types";

const types: { id: DiscountType; label: string }[] = [
  { id: "percent", label: "% Giảm" },
  { id: "fixed", label: "Số tiền" },
  { id: "buy_x_get_y", label: "Mua X tặng Y" },
  { id: "combo", label: "Combo" },
  { id: "other", label: "Khác" },
];

export default function DiscountPage() {
  const router = useRouter();
  const subtotal = useNeonStore((s) => s.cartSubtotal());
  const setCartDiscount = useNeonStore((s) => s.setCartDiscount);
  const [type, setType] = useState<DiscountType>("percent");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const preview = type === "percent" ? Math.round((subtotal * Math.min(100, Number(value) || 0)) / 100) : Math.min(subtotal, Number(value) || 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b p-4">
        <Link href="/staff/payment" className="text-sm">← Thanh toán</Link>
        <h1 className="text-xl font-bold">Giảm giá & KM</h1>
      </div>
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-3">
        <div className="border-b p-4 lg:border-r">
          {types.map((t) => (
            <button key={t.id} type="button" onClick={() => setType(t.id)} className={cn("mb-2 block w-full min-h-[44px] rounded-xl border px-4 text-left", type === t.id && "bg-black text-white")}>{t.label}</button>
          ))}
        </div>
        <div className="border-b p-4 lg:border-r">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên KM" className="mb-3 w-full min-h-[44px] rounded-xl border px-3" />
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder={type === "percent" ? "%" : "Số tiền"} className="w-full min-h-[44px] rounded-xl border px-3" />
        </div>
        <div className="p-4">
          <p>Trước: {formatCurrency(subtotal)}</p>
          <p className="text-green-600">Giảm: -{formatCurrency(preview)}</p>
          <p className="font-bold">Sau: {formatCurrency(subtotal - preview)}</p>
          <button type="button" onClick={() => { setCartDiscount({ type, name: name || "KM", value: Number(value) }); router.push("/staff/payment"); }} className="mt-4 w-full min-h-[48px] rounded-xl bg-black font-bold text-white">Áp dụng</button>
        </div>
      </div>
    </div>
  );
}
