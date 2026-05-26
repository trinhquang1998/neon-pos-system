"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PagerState } from "@/lib/types";
import { useNeonStore } from "@/store/neon-store";
import { Battery, Radio, RefreshCw, Vibrate } from "lucide-react";

const pagerLabels: Record<PagerState, string> = {
  ready: "Sẵn sàng",
  in_use: "Đang dùng",
  ringing: "Đang rung",
  low_battery: "Pin yếu",
  offline: "Mất kết nối",
  maintenance: "Bảo trì",
  disabled: "Vô hiệu",
};

const pagerStyles: Record<PagerState, string> = {
  ready: "border-neutral-200 bg-white",
  in_use: "border-blue-500/60 bg-blue-50",
  ringing: "border-blue-400 animate-pager-ring",
  low_battery: "border-amber-500",
  offline: "border-red-500 bg-red-50",
  maintenance: "border-neutral-300",
  disabled: "border-neutral-200 bg-neutral-100 opacity-50",
};

export default function PagerPage() {
  const pagers = useNeonStore((s) => s.pagers);
  const ringPager = useNeonStore((s) => s.ringPager);
  const testPager = useNeonStore((s) => s.testPager);
  const releasePager = useNeonStore((s) => s.releasePager);
  const [selected, setSelected] = useState(pagers[0]?.physicalId ?? "01");

  const current = pagers.find((p) => p.physicalId === selected) ?? pagers[0];

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h1 className="text-xl font-bold">Quản lý pager</h1>
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11">
          {pagers.map((pager) => (
            <button
              key={pager.id}
              type="button"
              onClick={() => setSelected(pager.physicalId)}
              className={cn(
                "rounded-xl border-2 p-2 text-center sm:p-3",
                pagerStyles[pager.state],
                selected === pager.physicalId && "ring-2 ring-black",
              )}
            >
              <p className="text-base font-bold sm:text-xl">{pager.physicalId}</p>
              <p className="text-[9px] sm:text-[10px] text-neutral-500">
                {pagerLabels[pager.state]}
              </p>
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => current && testPager(current.physicalId)}
            className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm"
          >
            <Vibrate className="h-4 w-4" /> Test rung
          </button>
          <button
            type="button"
            onClick={() => useNeonStore.getState().resetDemo()}
            className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm"
          >
            <RefreshCw className="h-4 w-4" /> Reset demo
          </button>
        </div>
      </div>

      {current && (
        <aside className="w-full shrink-0 border-t border-[var(--border)] bg-[var(--surface)] p-5 lg:w-80 lg:border-l lg:border-t-0">
          <h2 className="text-3xl font-bold">#{current.physicalId}</h2>
          <p className="mt-1 text-sm text-neutral-500">{pagerLabels[current.state]}</p>
          {current.orderId && (
            <p className="mt-2 text-sm">Đơn #{current.orderId}</p>
          )}
          <p className="mt-4 text-sm">Pin: {current.battery}%</p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => ringPager(current.physicalId)}
              className="min-h-[44px] rounded-xl bg-black py-3 text-sm font-bold text-white"
            >
              Rung thiết bị
            </button>
            {current.state === "in_use" && (
              <button
                type="button"
                onClick={() => releasePager(current.physicalId)}
                className="min-h-[44px] rounded-xl border py-3 text-sm"
              >
                Khách đã trả pager
              </button>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
