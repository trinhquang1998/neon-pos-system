"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, OrderStatus, PagerDevice, PagerState } from "@/lib/types";
import {
  buildInitialState,
  formatTime,
  recalcInventoryStatus,
  type OrderRecord,
  type AppSettings,
} from "@/lib/seed";
import type {
  Customer,
  Promotion,
  Voucher,
  ShiftSlot,
  InventoryTxn,
} from "@/lib/manager-data";
import type { InventoryItem, Product, StaffMember, Activity } from "@/lib/types";

type InventoryRow = InventoryItem & { minQty: number };

function logActivity(message: string) {
  useNeonStore.setState((s) => ({
    activities: [
      { id: String(Date.now()), time: formatTime(Date.now()), message },
      ...s.activities.slice(0, 49),
    ],
  }));
}

interface NeonState {
  products: Product[];
  orders: OrderRecord[];
  pagers: PagerDevice[];
  inventory: InventoryRow[];
  inventoryTxns: InventoryTxn[];
  customers: Customer[];
  promotions: Promotion[];
  vouchers: Voucher[];
  shiftSlots: ShiftSlot[];
  staff: StaffMember[];
  activities: Activity[];
  settings: AppSettings;
  cart: CartItem[];
  selectedPager: string | null;
  session: { staffId: string | null; staffName: string | null };
  orderCounter: number;
  paymentProcessing: boolean;

  login: (staffId: string, staffName: string) => void;
  logout: () => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setSelectedPager: (id: string | null) => void;
  setPager: (id: string | null) => void;
  cartSubtotal: () => number;
  subtotal: () => number;
  suggestPager: () => string | null;
  confirmPayment: (params: {
    method: string;
    amountGiven?: number;
    customerName?: string;
  }) => Promise<{ ok: boolean; error?: string; orderId?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  refundOrder: (orderId: string) => void;
  resendToKitchen: (orderId: string) => void;
  markKitchenDone: (orderId: string) => void;
  ringPager: (physicalId: string) => void;
  releasePager: (physicalId: string) => void;
  testPager: (physicalId: string) => void;
  adjustInventory: (id: string, delta: number, note?: string) => void;
  addCustomerPoints: (customerId: string, points: number) => void;
  togglePromotion: (id: string) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  getPickupNumbers: () => { ready: string[]; almost: string[]; preparing: string[] };
  getAlerts: () => {
    id: string;
    title: string;
    message: string;
    severity: "warning" | "critical";
  }[];
  getTodayStats: () => {
    revenue: number;
    orders: number;
    completed: number;
    inProgress: number;
  };
  resetDemo: () => void;
}

function orderElapsedMinutes(createdAt: number): string {
  const mins = Math.floor((Date.now() - createdAt) / 60000);
  const sec = Math.floor(((Date.now() - createdAt) % 60000) / 1000);
  return `${String(mins).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function nextStatusAfterKitchen(current: OrderStatus): OrderStatus {
  if (current === "preparing" || current === "queued" || current === "new")
    return "almost_ready";
  if (current === "almost_ready") return "ready";
  return current;
}

export const useNeonStore = create<NeonState>()(
  persist(
    (set, get) => ({
      ...buildInitialState(),
      paymentProcessing: false,

      login: (staffId, staffName) => {
        set({ session: { staffId, staffName } });
        logActivity(`${staffName} đăng nhập`);
      },

      logout: () => set({ session: { staffId: null, staffName: null } }),

      addToCart: (item) => {
        set((s) => {
          const ex = s.cart.find((c) => c.productId === item.productId);
          if (ex) {
            return {
              cart: s.cart.map((c) =>
                c.productId === item.productId
                  ? { ...c, quantity: c.quantity + 1 }
                  : c,
              ),
            };
          }
          return { cart: [...s.cart, { ...item, quantity: 1 }] };
        });
      },

      removeFromCart: (productId) =>
        set((s) => ({ cart: s.cart.filter((c) => c.productId !== productId) })),

      updateCartQty: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((s) => ({
          cart: s.cart.map((c) =>
            c.productId === productId ? { ...c, quantity } : c,
          ),
        }));
      },

      clearCart: () => {
        const ready = get().pagers.find((p) => p.state === "ready");
        set({ cart: [], selectedPager: ready?.physicalId ?? null });
      },

      setSelectedPager: (id) => set({ selectedPager: id }),
      setPager: (id) => set({ selectedPager: id }),

      cartSubtotal: () =>
        get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      updateQuantity: (productId, quantity) => get().updateCartQty(productId, quantity),
      subtotal: () => get().cartSubtotal(),

      suggestPager: () => get().pagers.find((x) => x.state === "ready")?.physicalId ?? null,

      confirmPayment: async ({ method, amountGiven, customerName }) => {
        const cart = get().cart;
        if (cart.length === 0) return { ok: false, error: "Giỏ hàng trống" };

        const total = get().cartSubtotal();
        if (method === "cash" && (amountGiven ?? 0) < total) {
          return { ok: false, error: "Số tiền khách đưa chưa đủ" };
        }

        if (["qr", "card", "ewallet"].includes(method)) {
          set({ paymentProcessing: true });
          await new Promise((r) => setTimeout(r, 1200));
          set({ paymentProcessing: false });
        }

        let pagerId = get().selectedPager ?? get().suggestPager();
        const pagers = get().pagers;
        let pager = pagers.find((p) => p.physicalId === pagerId);
        if (!pager || pager.state !== "ready") {
          pager = pagers.find((p) => p.state === "ready");
          if (!pager) return { ok: false, error: "Không còn pager trống" };
          pagerId = pager.physicalId;
        }

        const orderId = String(get().orderCounter);
        const now = Date.now();
        const time = formatTime(now);

        const order: OrderRecord = {
          id: orderId,
          time,
          createdAt: now,
          customer: customerName?.trim() || "Walk-in",
          items: cart.map((c) => `${c.name} x${c.quantity}`),
          total,
          status: "preparing",
          pagerId: pagerId!,
          paymentMethod: method,
          timer: "00:00",
          timeline: [
            { time, message: `Thanh toán (${method}) thành công` },
            { time, message: `Gán pager #${pagerId}` },
            { time, message: "Gửi xuống bếp" },
          ],
        };

        set((s) => ({
          orderCounter: s.orderCounter + 1,
          orders: [order, ...s.orders],
          cart: [],
          pagers: s.pagers.map((p) =>
            p.physicalId === pagerId
              ? { ...p, state: "in_use" as PagerState, orderId }
              : p,
          ),
        }));

        logActivity(
          `Đơn #${orderId} · ${total.toLocaleString("vi-VN")}đ · Pager #${pagerId}`,
        );
        return { ok: true, orderId };
      },

      updateOrderStatus: (orderId, status) => {
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  timeline: [
                    ...o.timeline,
                    {
                      time: formatTime(Date.now()),
                      message: `Cập nhật: ${status}`,
                    },
                  ],
                }
              : o,
          ),
        }));
        if (status === "picked_up" || status === "completed") {
          const order = get().orders.find((o) => o.id === orderId);
          if (order?.pagerId) get().releasePager(order.pagerId);
        }
      },

      refundOrder: (orderId) => {
        get().updateOrderStatus(orderId, "cancelled");
        logActivity(`Hoàn tiền đơn #${orderId}`);
      },

      resendToKitchen: (orderId) => {
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: "preparing" as OrderStatus,
                  timeline: [
                    ...o.timeline,
                    { time: formatTime(Date.now()), message: "Gửi lại bếp" },
                  ],
                }
              : o,
          ),
        }));
      },

      markKitchenDone: (orderId) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (!order) return;
        const next = nextStatusAfterKitchen(order.status);
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: next,
                  timeline: [
                    ...o.timeline,
                    {
                      time: formatTime(Date.now()),
                      message:
                        next === "ready" ? "Sẵn sàng — đã rung pager" : "Cập nhật bếp",
                    },
                  ],
                }
              : o,
          ),
        }));
        if (next === "ready" && order.pagerId) get().ringPager(order.pagerId);
      },

      ringPager: (physicalId) => {
        set((s) => ({
          pagers: s.pagers.map((p) =>
            p.physicalId === physicalId ? { ...p, state: "ringing" as PagerState } : p,
          ),
        }));
        setTimeout(() => {
          set((s) => ({
            pagers: s.pagers.map((p) =>
              p.physicalId === physicalId && p.state === "ringing"
                ? { ...p, state: "in_use" as PagerState }
                : p,
            ),
          }));
        }, 2500);
      },

      releasePager: (physicalId) => {
        set((s) => ({
          pagers: s.pagers.map((p) =>
            p.physicalId === physicalId
              ? { ...p, state: "ready" as PagerState, orderId: undefined }
              : p,
          ),
        }));
      },

      testPager: (physicalId) => get().ringPager(physicalId),

      adjustInventory: (id, delta, note) => {
        const staff = get().session.staffName ?? "Quản lý";
        set((s) => {
          const inventory = s.inventory.map((inv) => {
            if (inv.id !== id) return inv;
            const quantity = Math.max(0, +(inv.quantity + delta).toFixed(2));
            const row = { ...inv, quantity };
            return { ...row, status: recalcInventoryStatus(row) };
          });
          const item = inventory.find((i) => i.id === id);
          const txn: InventoryTxn = {
            id: String(Date.now()),
            date: formatTime(Date.now()),
            type: delta >= 0 ? "import" : "waste",
            item: item?.name ?? "",
            quantity: Math.abs(delta),
            unit: item?.unit ?? "",
            staff,
            note,
          };
          return { inventory, inventoryTxns: [txn, ...s.inventoryTxns] };
        });
      },

      addCustomerPoints: (customerId, points) => {
        set((s) => ({
          customers: s.customers.map((c) =>
            c.id === customerId ? { ...c, points: c.points + points } : c,
          ),
        }));
        logActivity(`Tích ${points} điểm cho khách`);
      },

      togglePromotion: (id) => {
        set((s) => ({
          promotions: s.promotions.map((p) =>
            p.id === id
              ? { ...p, status: p.status === "active" ? "ended" : "active" }
              : p,
          ),
        }));
      },

      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),

      getPickupNumbers: () => {
        const orders = get().orders;
        const pick = (st: OrderStatus[]) =>
          orders.filter((o) => st.includes(o.status) && o.pagerId).map((o) => o.pagerId!);
        return {
          ready: pick(["ready"]),
          almost: pick(["almost_ready"]),
          preparing: pick(["preparing", "queued", "new"]),
        };
      },

      getAlerts: () => {
        const alerts: ReturnType<NeonState["getAlerts"]> = [];
        get().inventory
          .filter((i) => i.status !== "good")
          .forEach((i) => {
            alerts.push({
              id: `inv-${i.id}`,
              title: i.name,
              message: `Còn ${i.quantity}${i.unit}`,
              severity: i.status === "critical" ? "critical" : "warning",
            });
          });
        get().pagers
          .filter((p) => p.battery < 25)
          .forEach((p) => {
            alerts.push({
              id: `pg-${p.id}`,
              title: `Pager #${p.physicalId}`,
              message: `Pin ${p.battery}%`,
              severity: "warning",
            });
          });
        get()
          .orders.filter(
            (o) =>
              Date.now() - o.createdAt > 5 * 60000 &&
              ["preparing", "almost_ready", "queued"].includes(o.status),
          )
          .forEach((o) => {
            alerts.push({
              id: `ord-${o.id}`,
              title: `Đơn #${o.id}`,
              message: "Vượt SLA 5 phút",
              severity: "critical",
            });
          });
        return alerts;
      },

      getTodayStats: () => {
        const orders = get().orders.filter((o) => o.status !== "cancelled");
        return {
          revenue: orders.reduce((s, o) => s + o.total, 0),
          orders: orders.length,
          completed: orders.filter((o) => o.status === "completed").length,
          inProgress: orders.filter((o) =>
            ["preparing", "almost_ready", "ready", "queued", "new"].includes(o.status),
          ).length,
        };
      },

      resetDemo: () => set({ ...buildInitialState(), paymentProcessing: false }),
    }),
    { name: "neon-coffee-store" },
  ),
);

export function useLiveOrders() {
  const orders = useNeonStore((s) => s.orders);
  return orders.map((o) => {
    const elapsed = Date.now() - o.createdAt;
    const overdue =
      elapsed > 5 * 60000 &&
      !["completed", "cancelled", "picked_up"].includes(o.status);
    return {
      ...o,
      timer: orderElapsedMinutes(o.createdAt),
      status: overdue && o.status === "preparing" ? ("overdue" as OrderStatus) : o.status,
    };
  });
}

export function useHydration() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const done = () => setHydrated(true);
    if (useNeonStore.persist.hasHydrated()) done();
    else return useNeonStore.persist.onFinishHydration(done);
  }, []);
  return hydrated;
}
