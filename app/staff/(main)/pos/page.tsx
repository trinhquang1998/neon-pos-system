"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Minus, Plus, Trash2 } from "lucide-react";
import { categories } from "@/lib/mock-data";
import { cn, formatCurrency } from "@/lib/utils";
import { useNeonStore } from "@/store/neon-store";

const productImages: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=500&q=80",
  "2": "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=500&q=80",
  "3": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=80",
  "4": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80",
  "5": "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=500&q=80",
  "6": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80",
  "7": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80",
  "8": "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=500&q=80",
  "9": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80",
  "10": "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=500&q=80",
  "11": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80",
  "12": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=500&q=80",
};

export default function PosPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const products = useNeonStore((s) => s.products);
  const cart = useNeonStore((s) => s.cart);
  const addToCart = useNeonStore((s) => s.addToCart);
  const updateQuantity = useNeonStore((s) => s.updateQuantity);
  const removeFromCart = useNeonStore((s) => s.removeFromCart);
  const subtotal = useNeonStore((s) => s.subtotal);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        category === "all" ||
        (category === "favorites" ? p.popular : p.category === category);
      return matchCat && p.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [products, category, search]);

  const total = subtotal();

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="shrink-0 space-y-3 border-b border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4">
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
                  category === cat.id
                    ? "bg-black text-white shadow-sm"
                    : "border border-[var(--border)] bg-white text-[var(--text-secondary)] hover:text-black",
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
                onClick={() =>
                  addToCart({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                  })
                }
                className="min-h-[168px] overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] text-left shadow-sm transition hover:border-neutral-300 hover:shadow-md active:scale-[0.98]"
              >
                <div className="h-24 bg-neutral-100 sm:h-28">
                  <img
                    src={product.image ?? productImages[product.id]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 min-h-[2.25rem] text-sm font-semibold leading-tight">
                    {product.name}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[var(--accent-red)]">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="flex w-full shrink-0 flex-col border-t border-[var(--border)] bg-[var(--surface)] lg:w-80 lg:border-l lg:border-t-0">
        <div className="border-b border-[var(--border)] px-4 py-3">
          <h2 className="font-semibold">Đơn hiện tại</h2>
          <p className="text-xs text-[var(--text-secondary)]">{cart.length} món</p>
        </div>
        <div className="max-h-[40vh] flex-1 overflow-auto p-3 lg:max-h-none">
          {cart.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--text-secondary)]">
              Chưa có món
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                className="mb-2 rounded-xl border border-[var(--border)] p-3"
              >
                <div className="flex justify-between gap-2">
                  <p className="text-sm font-medium">{item.name}</p>
                  <button type="button" onClick={() => removeFromCart(item.productId)}>
                    <Trash2 className="h-4 w-4 text-neutral-500" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t border-[var(--border)] p-4">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Tạm tính</span>
            <span className="font-semibold">{formatCurrency(total)}</span>
          </div>
          <Link
            href={cart.length > 0 ? "/staff/payment" : "#"}
            className={cn(
              "mt-4 flex min-h-[48px] w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold",
              cart.length > 0
                ? "bg-black text-white hover:bg-neutral-800"
                : "pointer-events-none bg-neutral-100 text-neutral-400",
            )}
          >
            THANH TOÁN
          </Link>
        </div>
      </aside>
    </div>
  );
}
