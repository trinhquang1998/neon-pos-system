"use client";

import Link from "next/link";
import { useNeonStore } from "@/store/neon-store";

const statusConfig = {
  good: { label: "BÌNH THƯỜNG", className: "text-emerald-600" },
  low: { label: "THẤP", className: "text-amber-500" },
  critical: { label: "SẮP HẾT", className: "text-red-500" },
};

export default function StaffInventoryPage() {
  const inventory = useNeonStore((s) => s.inventory);

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-5">
      <h1 className="text-xl font-bold">Tồn kho nhanh</h1>
      <div className="mt-4 space-y-2">
        {inventory.map((item) => {
          const cfg = statusConfig[item.status];
          return (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {item.quantity} {item.unit}
                </p>
              </div>
              <span className={`text-xs font-bold ${cfg.className}`}>{cfg.label}</span>
            </div>
          );
        })}
      </div>
      <Link
        href="/manager/inventory"
        className="mt-6 text-center text-sm text-[var(--text-secondary)] hover:text-black"
      >
        Quản lý kho đầy đủ →
      </Link>
    </div>
  );
}
