"use client";

import { useState } from "react";
import { routingRules } from "@/lib/manager-data";
import { permissions } from "@/lib/manager-data";
import { useNeonStore } from "@/store/neon-store";
import { ManagerCard, ManagerTabs, Badge } from "@/components/manager/ui";

const sections = [
  { id: "store", label: "Cửa hàng" },
  { id: "payment", label: "Thanh toán" },
  { id: "kitchen", label: "Kitchen routing" },
  { id: "security", label: "Bảo mật" },
];

export default function ManagerSettingsPage() {
  const settings = useNeonStore((s) => s.settings);
  const updateSettings = useNeonStore((s) => s.updateSettings);
  const resetDemo = useNeonStore((s) => s.resetDemo);
  const [tab, setTab] = useState("store");
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <ManagerTabs tabs={sections} active={tab} onChange={setTab} />

      {tab === "store" && (
        <ManagerCard title="Thông tin cửa hàng">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Tên cửa hàng
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={settings.storeName}
                onChange={(e) => updateSettings({ storeName: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              SĐT
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={settings.phone}
                onChange={(e) => updateSettings({ phone: e.target.value })}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              Địa chỉ
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={settings.address}
                onChange={(e) => updateSettings({ address: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              VAT (%)
              <input
                type="number"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={settings.vatPercent}
                onChange={(e) =>
                  updateSettings({ vatPercent: Number(e.target.value) })
                }
              />
            </label>
          </div>
          <button
            type="button"
            onClick={save}
            className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white"
          >
            {saved ? "Đã lưu ✓" : "Lưu"}
          </button>
        </ManagerCard>
      )}

      {tab === "payment" && (
        <ManagerCard title="Phương thức thanh toán">
          {Object.entries(settings.paymentMethods).map(([key, on]) => (
            <label
              key={key}
              className="mb-2 flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <span className="capitalize">{key}</span>
              <input
                type="checkbox"
                checked={on}
                onChange={(e) =>
                  updateSettings({
                    paymentMethods: {
                      ...settings.paymentMethods,
                      [key]: e.target.checked,
                    },
                  })
                }
              />
            </label>
          ))}
        </ManagerCard>
      )}

      {tab === "kitchen" && (
        <ManagerCard title="Routing rules">
          <ul className="space-y-2 text-sm">
            {routingRules.map((r) => (
              <li key={r.id} className="flex justify-between rounded-lg border px-3 py-2">
                <span>{r.name}</span>
                <Badge variant={r.active ? "success" : "default"}>{r.target}</Badge>
              </li>
            ))}
          </ul>
        </ManagerCard>
      )}

      {tab === "security" && (
        <div className="space-y-4">
          <ManagerCard title="Phân quyền">
            <ul className="space-y-2 text-sm">
              {permissions.map((p) => (
                <li key={p.key} className="flex justify-between border-b py-2">
                  <span>{p.label}</span>
                  <span className="text-neutral-500">{p.roles.join(", ")}</span>
                </li>
              ))}
            </ul>
          </ManagerCard>
          <ManagerCard title="Dữ liệu">
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset toàn bộ dữ liệu demo?")) resetDemo();
              }}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600"
            >
              Reset dữ liệu demo
            </button>
          </ManagerCard>
        </div>
      )}
    </div>
  );
}
