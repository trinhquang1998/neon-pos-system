"use client";

import { useState } from "react";
import { RefreshCw, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNeonStore } from "@/store/neon-store";

export default function OfflinePage() {
  const isOffline = useNeonStore((s) => s.isOffline);
  const pendingSync = useNeonStore((s) => s.pendingSync);
  const setOffline = useNeonStore((s) => s.setOffline);
  const syncNow = useNeonStore((s) => s.syncNow);
  const [syncing, setSyncing] = useState(false);
  const pending = pendingSync.filter((p) => p.status === "pending");

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <div className="flex flex-col items-center border-b p-8 text-center lg:w-[360px] lg:border-r">
        <WifiOff className="h-16 w-16" />
        <h1 className="mt-4 text-3xl font-bold">{isOffline ? "OFFLINE" : "ONLINE"}</h1>
        <button type="button" onClick={() => setOffline(!isOffline)} className="mt-6 rounded-xl border px-6 py-3 text-sm font-medium">
          {isOffline ? "Bật online (demo)" : "Mô phỏng offline"}
        </button>
        <div className="mt-8 grid w-full grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-xl border p-3"><p className="text-xl font-bold">{pending.filter((p) => p.type === "order").length}</p><p className="text-xs">Đơn</p></div>
          <div className="rounded-xl border p-3"><p className="text-xl font-bold">{pending.filter((p) => p.type === "payment").length}</p><p className="text-xs">TT</p></div>
          <div className="rounded-xl border p-3"><p className="text-xl font-bold">{pending.filter((p) => p.type === "inventory").length}</p><p className="text-xs">Kho</p></div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-semibold">Nhật ký đồng bộ</h2>
        <ul className="mt-4 flex-1 space-y-2 overflow-auto">
          {pendingSync.map((item) => (
            <li key={item.id} className="flex justify-between rounded-xl border px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{item.description}</p>
                <p className="text-xs text-[var(--text-secondary)]">{item.time}</p>
              </div>
              <span className={cn("text-xs font-medium", item.status === "pending" ? "text-amber-700" : "text-green-700")}>
                {item.status === "pending" ? "Chờ sync" : "Đã sync"}
              </span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          disabled={syncing || !pending.length}
          onClick={async () => { setSyncing(true); await syncNow(); setSyncing(false); }}
          className="mt-4 flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-black font-bold text-white disabled:opacity-40"
        >
          <RefreshCw className={cn(syncing && "animate-spin")} /> Đồng bộ ngay
        </button>
      </div>
    </div>
  );
}
