"use client";

import { useMemo, useState } from "react";
import { formatCurrency, cn } from "@/lib/utils";
import { useNeonStore } from "@/store/neon-store";
import {
  ManagerCard,
  ManagerToolbar,
  Badge,
  StatGrid,
  StatCard,
} from "@/components/manager/ui";

export default function ManagerCrmPage() {
  const customers = useNeonStore((s) => s.customers);
  const addCustomerPoints = useNeonStore((s) => s.addCustomerPoints);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(customers[0]?.id ?? "");

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search),
      ),
    [customers, search],
  );

  const selected = customers.find((c) => c.id === selectedId);

  return (
    <div className="space-y-4 sm:space-y-6">
      <StatGrid>
        <StatCard label="Khách hàng" value={String(customers.length)} />
        <StatCard
          label="Điểm TB"
          value={String(Math.round(customers.reduce((s, c) => s + c.points, 0) / customers.length))}
        />
      </StatGrid>

      <ManagerToolbar searchPlaceholder="Tìm khách..." onSearch={setSearch} />

      <div className="grid gap-4 lg:grid-cols-3">
        <ManagerCard className="max-h-[480px] overflow-auto p-0 lg:col-span-1">
          <ul className="divide-y">
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-3 text-left",
                    selectedId === c.id && "bg-neutral-50",
                  )}
                >
                  <span className="font-medium">{c.name}</span>
                  <Badge>{c.tier}</Badge>
                </button>
              </li>
            ))}
          </ul>
        </ManagerCard>

        {selected && (
          <div className="space-y-4 lg:col-span-2">
            <ManagerCard>
              <h2 className="text-xl font-bold">{selected.name}</h2>
              <p className="text-sm text-neutral-500">{selected.phone}</p>
              <p className="mt-4 text-3xl font-bold text-amber-600">
                {selected.points} điểm
              </p>
              <p className="text-sm">Chi tiêu: {formatCurrency(selected.totalSpent)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                  onClick={() => addCustomerPoints(selected.id, 100)}
                >
                  +100 điểm
                </button>
                <button
                  type="button"
                  className="rounded-lg border px-4 py-2 text-sm"
                  onClick={() => addCustomerPoints(selected.id, 250)}
                >
                  +250 điểm (birthday)
                </button>
              </div>
            </ManagerCard>
          </div>
        )}
      </div>
    </div>
  );
}
