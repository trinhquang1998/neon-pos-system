import { products, pagers as seedPagers, inventoryItems, staffMembers, orders as seedOrders } from "./mock-data";
import {
  customers,
  promotions,
  vouchers,
  inventoryTxns,
  shiftSlots,
} from "./manager-data";
import type {
  Order,
  PagerDevice,
  InventoryItem,
  Product,
} from "./types";
import type { Customer, Promotion, Voucher, ShiftSlot } from "./manager-data";

export interface OrderRecord extends Order {
  createdAt: number;
  paymentMethod?: string;
  timeline: { time: string; message: string }[];
}

export interface AppSettings {
  storeName: string;
  address: string;
  phone: string;
  vatPercent: number;
  serviceFeePercent: number;
  paymentMethods: Record<string, boolean>;
}

export function buildInitialOrders(): OrderRecord[] {
  const now = Date.now();
  return seedOrders.map((o, i) => ({
    ...o,
    createdAt: now - (seedOrders.length - i) * 120000,
    timeline: [
      { time: o.time, message: "Tạo đơn & thanh toán" },
      { time: o.time, message: o.pagerId ? `Gán pager #${o.pagerId}` : "Chưa gán pager" },
      { time: o.time, message: "Gửi xuống bếp" },
    ],
  }));
}

export function buildInitialState() {
  return {
    products: [...products] as Product[],
    orders: buildInitialOrders(),
    pagers: [...seedPagers] as PagerDevice[],
    inventory: inventoryItems.map((i) => ({
      ...i,
      minQty: i.status === "critical" ? 2 : 5,
    })),
    inventoryTxns: [...inventoryTxns],
    customers: [...customers] as Customer[],
    promotions: [...promotions] as Promotion[],
    vouchers: [...vouchers] as Voucher[],
    shiftSlots: [...shiftSlots] as ShiftSlot[],
    staff: [...staffMembers],
    activities: [
      { id: "1", time: formatTime(Date.now()), message: 'Hệ thống khởi tạo' },
    ],
    settings: {
      storeName: "Neon Coffee - Lê Lợi",
      address: "123 Lê Lợi, Quận 1, TP.HCM",
      phone: "028 3822 1234",
      vatPercent: 8,
      serviceFeePercent: 0,
      paymentMethods: {
        cash: true,
        qr: true,
        card: true,
        ewallet: true,
        split: true,
      },
    } satisfies AppSettings,
    cart: [] as import("./types").CartItem[],
    selectedPager: null as string | null,
    session: { staffId: null as string | null, staffName: null as string | null },
    orderCounter: 1046,
  };
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function recalcInventoryStatus(
  item: InventoryItem & { minQty?: number },
): InventoryItem["status"] {
  const min = item.minQty ?? 5;
  if (item.quantity <= min * 0.4) return "critical";
  if (item.quantity <= min) return "low";
  return "good";
}
