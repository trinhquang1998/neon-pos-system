"use client";

import { useState } from "react";
import { useNeonStore } from "@/store/neon-store";
import { formatCurrency } from "@/lib/utils";
import {
  ManagerCard,
  ManagerToolbar,
  ManagerTabs,
  Badge,
  StatGrid,
  StatCard,
} from "@/components/manager/ui";

const tabs = [
  { id: "stock", label: "Tồn kho" },
  { id: "import", label: "Nhập" },
  { id: "export", label: "Xuất" },
  { id: "waste", label: "Hao hụt" },
  { id: "supplier", label: "NCC" },
];

export default function ManagerInventoryPage() {
  const inventory = useNeonStore((s) => s.inventory);
  const inventoryTxns = useNeonStore((s) => s.inventoryTxns);
  const adjustInventory = useNeonStore((s) => s.adjustInventory);
  const [tab, setTab] = useState("stock");
  const low = inventory.filter((i) => i.status !== "good").length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <StatGrid>
        <StatCard label="SKU" value={String(inventory.length)} />
        <StatCard label="Cảnh báo" value={String(low)} variant={low ? "danger" : "default"} />
      </StatGrid>

      <ManagerTabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "stock" && (
        <ManagerCard>
          <div className="responsive-table-wrap">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="text-left text-xs text-neutral-500">
                <tr className="border-b">
                  <th className="pb-3">Nguyên liệu</th>
                  <th className="pb-3">Tồn</th>
                  <th className="pb-3">TT</th>
                  <th className="pb-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          item.status === "critical"
                            ? "danger"
                            : item.status === "low"
                              ? "warning"
                              : "default"
                        }
                      >
                        {item.status === "critical" ? "SẮP HẾT" : item.status === "low" ? "THẤP" : "OK"}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        className="mr-2 text-xs text-blue-600"
                        onClick={() => adjustInventory(item.id, 5, "Nhập nhanh")}
                      >
                        +5
                      </button>
                      <button
                        type="button"
                        className="text-xs text-red-600"
                        onClick={() => adjustInventory(item.id, -1, "Điều chỉnh")}
                      >
                        -1
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ManagerCard>
      )}

      {tab !== "stock" && tab !== "supplier" && (
        <ManagerCard>
          <div className="responsive-table-wrap">
            <table className="w-full text-sm">
              <thead className="text-xs text-neutral-500">
                <tr className="border-b">
                  <th className="pb-2 text-left">Ngày</th>
                  <th className="pb-2 text-left">Mặt hàng</th>
                  <th className="pb-2 text-left">SL</th>
                  <th className="pb-2 text-left">NV</th>
                </tr>
              </thead>
              <tbody>
                {inventoryTxns
                  .filter((t) =>
                    tab === "import"
                      ? t.type === "import"
                      : tab === "export"
                        ? t.type === "export"
                        : t.type === "waste",
                  )
                  .map((txn) => (
                    <tr key={txn.id} className="border-t">
                      <td className="py-2">{txn.date}</td>
                      <td className="py-2">{txn.item}</td>
                      <td className="py-2">
                        {txn.quantity} {txn.unit}
                      </td>
                      <td className="py-2">{txn.staff}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </ManagerCard>
      )}
    </div>
  );
}
