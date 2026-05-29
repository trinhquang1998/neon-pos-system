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
    <div className="flex min-h-[100dvh] flex-col bg-neon-bg px-4 py-6 text-neon-text sm:px-6 md:px-10 lg:px-14 sm:py-8 md:py-12 lg:py-16">
      {/* Header */}
      <header className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
        <p className="text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.4em] text-neon-muted font-medium">NEON COFFEE</p>
        <h1 className="mt-3 sm:mt-4 md:mt-5 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold text-neon-text">
          Đã sẵn phục vụ
        </h1>
        <p className="mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base md:text-xl lg:text-2xl text-neon-muted font-light">Vui lòng nhận đồ uống khi thấy số pager</p>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 lg:gap-12 sm:grid-cols-3">
        
        {/* Ready Section */}
        <div className="rounded-2xl sm:rounded-3xl bg-neon-surface border border-neon-border p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col items-center justify-center">
          <div className="mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base lg:text-lg font-medium tracking-wider text-neon-muted uppercase">
            Sẵn sàng
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 flex-1 min-h-[140px] sm:min-h-[160px] md:min-h-[200px] items-center content-center">
            {pickup.ready.length ? (
              pickup.ready.map((num) => (
                <div
                  key={num}
                  className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-52 lg:w-52 rounded-xl sm:rounded-2xl bg-neon-text flex items-center justify-center shadow-sm flex-shrink-0"
                >
                  <span className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-semibold text-neon-surface">
                    {num}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-neon-muted font-light">—</span>
            )}
          </div>
          <div className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base lg:text-lg text-neon-muted text-center font-medium">
            {pickup.ready.length} {pickup.ready.length === 1 ? "đơn" : "đơn"}
          </div>
        </div>

        {/* Almost Ready Section */}
        <div className="rounded-2xl sm:rounded-3xl bg-neon-surface border border-neon-border p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col items-center justify-center">
          <div className="mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base lg:text-lg font-medium tracking-wider text-neon-muted uppercase">
            Sắp sẵn sàng
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-7 flex-1 min-h-[140px] sm:min-h-[160px] md:min-h-[200px] items-center content-center">
            {pickup.almost.length ? (
              pickup.almost.map((num) => (
                <div
                  key={num}
                  className="h-20 w-20 sm:h-28 sm:w-28 md:h-36 md:w-36 lg:h-40 lg:w-40 rounded-lg sm:rounded-2xl bg-neon-surface border-2 border-neon-text flex items-center justify-center shadow-sm flex-shrink-0"
                >
                  <span className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-neon-text">
                    {num}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-neon-muted font-light">—</span>
            )}
          </div>
          <div className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base lg:text-lg text-neon-muted text-center font-medium">
            {pickup.almost.length} {pickup.almost.length === 1 ? "đơn" : "đơn"}
          </div>
        </div>

        {/* Preparing Section */}
        <div className="rounded-2xl sm:rounded-3xl bg-neon-surface border border-neon-border p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col items-center justify-center">
          <div className="mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base lg:text-lg font-medium tracking-wider text-neon-muted uppercase">
            Đang chuẩn bị
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-5 lg:gap-5 flex-1 min-h-[140px] sm:min-h-[160px] md:min-h-[200px] items-center content-center">
            {pickup.preparing.length ? (
              pickup.preparing.map((num) => (
                <div
                  key={num}
                  className="h-14 w-14 sm:h-18 sm:w-18 md:h-24 md:w-24 lg:h-28 lg:w-28 rounded-lg bg-gray-100 flex items-center justify-center shadow-sm flex-shrink-0"
                >
                  <span className="text-lg sm:text-xl md:text-3xl lg:text-3xl font-semibold text-neon-muted">
                    {num}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-neon-muted font-light">—</span>
            )}
          </div>
          <div className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base lg:text-lg text-neon-muted text-center font-medium">
            {pickup.preparing.length} {pickup.preparing.length === 1 ? "đơn" : "đơn"}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 pt-4 sm:pt-6 md:pt-8 text-center border-t border-neon-border">
        <p className="text-neon-muted text-xs sm:text-sm md:text-base lg:text-lg font-light">
          Cập nhật liên tục
        </p>
        <p className="mt-2 text-xs text-neon-muted/70 font-light">
          {new Date().toLocaleTimeString("vi-VN")}
        </p>
      </footer>
    </div>
  );
}
