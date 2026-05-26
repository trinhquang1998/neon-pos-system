"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Search, Minus, Plus, Trash2 } from "lucide-react";
import { categories } from "@/lib/mock-data";
import { getProductImage } from "@/lib/product-images";
import { cn, formatCurrency } from "@/lib/utils";
import { useNeonStore } from "@/store/neon-store";

export default function PosPage() {
  const router = useRouter();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const products = useNeonStore((s) => s.products);
  const cart = useNeonStore((s) => s.cart);
  const updateQuantity = useNeonStore((s) => s.updateQuantity);
  const removeFromCart = useNeonStore((s) => s.removeFromCart);
  const subtotal = useNeonStore((s) => s.subtotal);
  const total = useNeonStore((s) => s.cartTotal());

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        category === "all" ||
        (category === "favorites" ? p.popular : p.category === category);
      return matchCat && p.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [products, category, search]);

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="shrink-0 space-y-3 border-b border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
          <div className="flex gap-2">
            <Link href="/staff/cart" className={cn("rounded-lg px-3 py-1.5 text-xs font-bold", cart.length ? "bg-black text-white" : "border")}>
              Giỏ ({cart.length})
            </Link>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm đồ uống..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] py-2.5 pl-10 pr-4 text-base outline-none focus:border-black"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-xs font-medium",
                  category === cat.id ? "bg-black text-white" : "border border-[var(--border)]",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </header>
        <div className="flex-1 overflow-auto p-3 sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {filtered.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => router.push(`/staff/pos/modifier?productId=${product.id}`)}
                className="min-h-[168px] overflow-hidden rounded-[var(--radius)] border bg-[var(--surface)] text-left shadow-sm transition hover:border-neutral-300 active:scale-[0.98]"
              >
                <div className="h-24 bg-neutral-100 sm:h-28">
                  <img src={product.image ?? getProductImage(product.id)} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold">{product.name}</p>
                  <p className="mt-1 text-xs font-bold text-[var(--accent-red)]">{formatCurrency(product.price)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <aside className="hidden w-80 shrink-0 flex-col border-l lg:flex">
        <div className="border-b px-4 py-3">
          <h2 className="font-semibold">Đơn hiện tại</h2>
          <p className="text-xs text-[var(--text-secondary)]">{cart.length} món</p>
        </div>
        <div className="flex-1 overflow-auto p-3">
          {cart.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--text-secondary)]">Chưa có món</p>
          ) : (
            cart.map((item) => (
              <div key={item.lineId} className="mb-2 rounded-xl border p-3">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{item.name}</p>
                  <button type="button" onClick={() => removeFromCart(item.lineId)}><Trash2 className="h-4 w-4" /></button>
                </div>
                {item.modifierLabels?.length ? <p className="text-xs text-[var(--text-secondary)]">{item.modifierLabels.join(" · ")}</p> : null}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg border" onClick={() => updateQuantity(item.lineId, item.quantity - 1)}><Minus className="h-3 w-3" /></button>
                    <span>{item.quantity}</span>
                    <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg border" onClick={() => updateQuantity(item.lineId, item.quantity + 1)}><Plus className="h-3 w-3" /></button>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t p-4">
          <div className="flex justify-between text-sm">
            <span>Tổng</span>
            <span className="font-semibold">{formatCurrency(total)}</span>
          </div>
          <Link href={cart.length ? "/staff/payment" : "#"} className={cn("mt-4 flex min-h-[48px] items-center justify-center rounded-xl bg-black text-sm font-bold text-white", !cart.length && "pointer-events-none opacity-40")}>
            THANH TOÁN
          </Link>
        </div>
      </aside>
    </div>
  );
}
