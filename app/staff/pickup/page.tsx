"use client";

import { useMemo } from "react";
import { useNeonStore } from "@/store/neon-store";
import { useOrderTicker } from "@/hooks/use-order-ticker";
import type { OrderStatus } from "@/lib/types";

export default function PickupDisplayPage() {
  useOrderTicker();
  const orders = useNeonStore((s) => s.orders);
  const pickup = useMemo(() => {
    const pick = (statuses: OrderStatus[]) =>
      orders
        .filter((o) => statuses.includes(o.status) && o.pagerId)
        .map((o) => o.pagerId!);
    return {
      ready: pick(["ready"]),
      almost: pick(["almost_ready"]),
      preparing: pick(["preparing", "queued", "new"]),
    };
  }, [orders]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white px-4 py-8 text-black sm:px-8 sm:py-10">
      <header className="text-center">
        <p className="text-xs tracking-[0.3em] text-neutral-500 sm:text-sm">NEON COFFEE</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-4xl md:text-5xl">ORDERS ARE READY</h1>
      </header>

      <section className="mt-8 flex-1 sm:mt-12">
        <h2 className="text-center text-sm text-neutral-500 sm:text-lg">Đã sẵn sàng</h2>
        <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-8">
          {pickup.ready.length ? (
            pickup.ready.map((num) => (
              <span key={num} className="text-5xl font-black sm:text-7xl md:text-9xl">
                {num}
              </span>
            ))
          ) : (
            <span className="text-neutral-300">—</span>
          )}
        </div>
      </section>

      <section className="mt-8 sm:mt-12">
        <h2 className="text-center text-sm text-amber-600 sm:text-base">Sắp sẵn sàng</h2>
        <div className="mt-3 flex flex-wrap justify-center gap-3 sm:gap-6">
          {pickup.almost.map((num) => (
            <span key={num} className="text-3xl font-bold text-amber-600 sm:text-5xl">
              {num}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6 sm:mt-10">
        <h2 className="text-center text-xs text-neutral-500">Đang chuẩn bị</h2>
        <div className="mt-2 flex flex-wrap justify-center gap-2 sm:gap-4">
          {pickup.preparing.map((num) => (
            <span key={num} className="text-xl text-neutral-500 sm:text-3xl">
              {num}
            </span>
          ))}
        </div>
      </section>

      <footer className="mt-auto pt-8 text-center text-sm text-neutral-500 sm:text-lg">
        Vui lòng nhận đồ uống khi thấy số pager của bạn
      </footer>
    </div>
  );
}
