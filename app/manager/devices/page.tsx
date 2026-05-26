"use client";

import { useState } from "react";
import { devices } from "@/lib/manager-data";
import { useNeonStore } from "@/store/neon-store";
import {
  ManagerCard,
  ManagerToolbar,
  Badge,
  StatGrid,
  StatCard,
  ManagerTabs,
} from "@/components/manager/ui";
import {
  Radio,
  Printer,
  Monitor,
  Tablet,
  Tv,
  Wifi,
} from "lucide-react";

const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "pager", label: "Pager" },
  { id: "printer", label: "Máy in" },
  { id: "kds", label: "KDS" },
  { id: "pos", label: "POS" },
  { id: "tv", label: "TV" },
];

const typeIcons = {
  pager: Radio,
  printer: Printer,
  kds: Monitor,
  pos: Tablet,
  tv: Tv,
};

export default function ManagerDevicesPage() {
  const pagers = useNeonStore((s) => s.pagers);
  const ringPager = useNeonStore((s) => s.ringPager);
  const [tab, setTab] = useState("all");
  const filtered =
    tab === "all" ? devices : devices.filter((d) => d.type === tab);

  const online = devices.filter((d) => d.status === "online").length;
  const warning = devices.filter((d) => d.status === "warning").length;

  return (
    <div className="space-y-6">
      <StatGrid>
        <StatCard label="Tổng thiết bị" value={String(devices.length + 22)} />
        <StatCard label="Online" value={String(online + 20)} variant="success" />
        <StatCard label="Cảnh báo" value={String(warning + 2)} variant="warning" />
        <StatCard label="Offline" value="0" />
        <StatCard label="Mạng" value="Ổn định" sub="Bandwidth 85%" />
      </StatGrid>

      <ManagerToolbar searchPlaceholder="Tìm thiết bị..." />

      <ManagerTabs tabs={tabs} active={tab} onChange={setTab} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((device) => {
          const Icon = typeIcons[device.type];
          return (
            <ManagerCard key={device.id}>
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{device.name}</h3>
                    <p className="text-xs text-neutral-500">{device.location}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    device.status === "online"
                      ? "success"
                      : device.status === "warning"
                        ? "warning"
                        : "danger"
                  }
                >
                  {device.status === "online"
                    ? "Online"
                    : device.status === "warning"
                      ? "Cảnh báo"
                      : "Offline"}
                </Badge>
              </div>
              <dl className="mt-4 space-y-1 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <dt>Cập nhật</dt>
                  <dd>{device.lastSeen}</dd>
                </div>
                {device.firmware && (
                  <div className="flex justify-between">
                    <dt>Firmware</dt>
                    <dd>{device.firmware}</dd>
                  </div>
                )}
                {device.detail && (
                  <div className="flex justify-between">
                    <dt>Chi tiết</dt>
                    <dd>{device.detail}</dd>
                  </div>
                )}
              </dl>
              {device.type === "pager" && (
                <button
                  type="button"
                  className="mt-3 w-full rounded-lg border py-2 text-sm hover:bg-neutral-50"
                  onClick={() => pagers[0] && ringPager(pagers[0].physicalId)}
                >
                  Test rung pager
                </button>
              )}
            </ManagerCard>
          );
        })}
      </div>

      {tab === "pager" && (
        <ManagerCard title="Pager — trạng thái nhanh">
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
            {pagers.slice(0, 22).map((p) => (
              <div
                key={p.id}
                className="rounded-lg border p-2 text-center text-xs"
              >
                <p className="font-bold">{p.physicalId}</p>
                <p className="text-neutral-500">{p.battery}%</p>
              </div>
            ))}
          </div>
        </ManagerCard>
      )}

      <ManagerCard title="Hệ thống mạng">
        <div className="flex items-center gap-4">
          <Wifi className="h-8 w-8 text-emerald-600" />
          <div>
            <p className="font-medium">Kết nối ổn định</p>
            <p className="text-sm text-neutral-500">
              LAN · Gateway pager local · SignalR hub connected
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold">85%</p>
            <p className="text-xs text-neutral-500">Bandwidth</p>
          </div>
        </div>
      </ManagerCard>
    </div>
  );
}
