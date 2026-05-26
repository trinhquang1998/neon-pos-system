"use client";

import { usePathname } from "next/navigation";
import { managerNav } from "@/lib/mock-data";
import { ManagerShell } from "./manager-shell";

const titleMap: Record<string, string> = {
  "/manager/dashboard": "Tổng quan",
  "/manager/orders": "Đơn hàng",
  "/manager/kitchen": "Bếp",
  "/manager/inventory": "Kho hàng",
  "/manager/staff": "Nhân sự",
  "/manager/shifts": "Lịch làm việc",
  "/manager/crm": "Khách hàng",
  "/manager/promotions": "Khuyến mãi",
  "/manager/devices": "Thiết bị",
  "/manager/reports": "Báo cáo",
  "/manager/settings": "Cài đặt",
  "/manager/analytics": "Phân tích",
};

export function ManagerLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItem = managerNav.find((n) => n.href === pathname);
  const title = titleMap[pathname] ?? navItem?.label ?? "Quản lý";

  return <ManagerShell title={title}>{children}</ManagerShell>;
}
