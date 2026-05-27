"use client";

import { useEffect, useMemo, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { modifiersKey } from "@/lib/modifiers";
import type {
  CartDiscount,
  CartItem,
  OrderStatus,
  PagerDevice,
  PagerState,
  PendingSyncItem,
  RefundType,
  SplitPaymentLine,
} from "@/lib/types";
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

function migrateCartItem(c: CartItem & { productId: string }): CartItem {
  if (c.lineId) return c;
  return {
    lineId: `${c.productId}-${Date.now()}`,
    productId: c.productId,
    name: c.name,
    basePrice: (c as CartItem).basePrice ?? c.price,
    price: c.price,
    quantity: c.quantity,
    modifiers: c.modifiers,
    modifierLabels: c.modifierLabels,
  };
}

function discountAmount(subtotal: number, discount: CartDiscount | null): number {
  if (!discount || discount.value <= 0) return 0;
  if (discount.type === "percent")
    return Math.round((subtotal * Math.min(100, discount.value)) / 100);
  return Math.min(subtotal, discount.value);
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
  cartDiscount: CartDiscount | null;
  splitPayments: SplitPaymentLine[];
  customerName: string;
  isOffline: boolean;
  pendingSync: PendingSyncItem[];
  heldOrders: {
    id: string;
    savedAt: string;
    cart: CartItem[];
    discount: CartDiscount | null;
    customerName: string;
  }[];
  selectedPager: string | null;
  session: { staffId: string | null; staffName: string | null };
  orderCounter: number;
  paymentProcessing: boolean;

  login: (staffId: string, staffName: string) => void;
  logout: () => void;
  addToCart: (item: Omit<CartItem, "lineId" | "quantity"> & { quantity?: number }) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  setCustomerName: (name: string) => void;
  setCartDiscount: (discount: CartDiscount | null) => void;
  setSplitPayments: (lines: SplitPaymentLine[]) => void;
  addSplitLine: (line: Omit<SplitPaymentLine, "id">) => void;
  updateSplitLine: (id: string, partial: Partial<SplitPaymentLine>) => void;
  removeSplitLine: (id: string) => void;
  clearSplitPayments: () => void;
  saveHeldOrder: () => string;
  loadHeldOrder: (id: string) => void;
  setSelectedPager: (id: string | null) => void;
  setPager: (id: string | null) => void;
  cartSubtotal: () => number;
  subtotal: () => number;
  cartDiscountAmount: () => number;
  cartTotal: () => number;
  suggestPager: () => string | null;
  confirmPayment: (params: {
    method: string;
    amountGiven?: number;
    customerName?: string;
    splitLines?: { method: string; amount: number }[];
  }) => Promise<{ ok: boolean; error?: string; orderId?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  refundOrder: (
    orderId: string,
    options?: { type?: RefundType; lineIds?: string[]; reason?: string },
  ) => void;
  resendToKitchen: (orderId: string) => void;
  markKitchenDone: (orderId: string) => void;
  setOffline: (offline: boolean) => void;
  syncNow: () => Promise<{ synced: number }>;
  ringPager: (physicalId: string) => void;
  releasePager: (physicalId: string) => void;
  testPager: (physicalId: string) => void;
  adjustInventory: (id: string, delta: number, note?: string) => void;
  addCustomerPoints: (customerId: string, points: number) => void;
  togglePromotion: (id: string) => void;
  applyPromotion: (id: string) => number;
  updateSettings: (partial: Partial<AppSettings>) => void;
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
        const key = item.modifiers ? modifiersKey(item.modifiers) : "default";
        set((s) => {
          const ex = s.cart.find(
            (c) =>
              c.productId === item.productId &&
              (c.modifiers ? modifiersKey(c.modifiers) : "default") === key,
          );
          if (ex) {
            return {
              cart: s.cart.map((c) =>
                c.lineId === ex.lineId
                  ? { ...c, quantity: c.quantity + (item.quantity ?? 1) }
                  : c,
              ),
            };
          }
          return {
            cart: [
              ...s.cart,
              { ...item, lineId: `${item.productId}-${Date.now()}`, quantity: item.quantity ?? 1 },
            ],
          };
        });
      },

      removeFromCart: (lineId) =>
        set((s) => ({ cart: s.cart.filter((c) => c.lineId !== lineId) })),

      updateQuantity: (lineId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(lineId);
          return;
        }
        set((s) => ({
          cart: s.cart.map((c) => (c.lineId === lineId ? { ...c, quantity } : c)),
        }));
      },

      clearCart: () => {
        const ready = get().pagers.find((p) => p.state === "ready");
        set({
          cart: [],
          cartDiscount: null,
          splitPayments: [],
          selectedPager: ready?.physicalId ?? null,
        });
      },

      setCustomerName: (name) => set({ customerName: name }),
      setCartDiscount: (discount) => set({ cartDiscount: discount }),
      setSplitPayments: (lines) => set({ splitPayments: lines }),
      addSplitLine: (line) =>
        set((s) => ({
          splitPayments: [
            ...s.splitPayments,
            { ...line, id: `sp-${Date.now()}` },
          ],
        })),
      updateSplitLine: (id, partial) =>
        set((s) => ({
          splitPayments: s.splitPayments.map((l) =>
            l.id === id ? { ...l, ...partial } : l,
          ),
        })),
      removeSplitLine: (id) =>
        set((s) => ({ splitPayments: s.splitPayments.filter((l) => l.id !== id) })),
      clearSplitPayments: () => set({ splitPayments: [] }),

      saveHeldOrder: () => {
        const id = `held-${Date.now()}`;
        const cart = get().cart;
        if (!cart.length) return id;
        set((s) => ({
          heldOrders: [
            {
              id,
              savedAt: formatTime(Date.now()),
              cart: [...cart],
              discount: s.cartDiscount,
              customerName: s.customerName,
            },
            ...s.heldOrders,
          ],
          cart: [],
          cartDiscount: null,
        }));
        return id;
      },

      loadHeldOrder: (id) => {
        const held = get().heldOrders.find((h) => h.id === id);
        if (!held) return;
        set((s) => ({
          cart: held.cart,
          cartDiscount: held.discount,
          customerName: held.customerName,
          heldOrders: s.heldOrders.filter((h) => h.id !== id),
        }));
      },

      setSelectedPager: (id) => set({ selectedPager: id }),
      setPager: (id) => set({ selectedPager: id }),

      cartSubtotal: () => get().cart.reduce((s, i) => s + i.price * i.quantity, 0),
      subtotal: () => get().cartSubtotal(),
      cartDiscountAmount: () => discountAmount(get().cartSubtotal(), get().cartDiscount),
      cartTotal: () => get().cartSubtotal() - get().cartDiscountAmount(),

      suggestPager: () => get().pagers.find((x) => x.state === "ready")?.physicalId ?? null,

      confirmPayment: async ({ method, amountGiven, customerName, splitLines }) => {
        const cart = get().cart;
        if (!cart.length) return { ok: false, error: "Giỏ hàng trống" };

        const total = get().cartTotal();
        const isSplit = method === "split" || (splitLines && splitLines.length > 0);

        if (isSplit && splitLines) {
          if (splitLines.reduce((s, l) => s + l.amount, 0) < total)
            return { ok: false, error: "Tổng thanh toán chia chưa đủ" };
        } else if (method === "cash" && (amountGiven ?? 0) < total) {
          return { ok: false, error: "Số tiền khách đưa chưa đủ" };
        }

        if (["qr", "card", "ewallet", "transfer"].includes(method) && !isSplit) {
          set({ paymentProcessing: true });
          await new Promise((r) => setTimeout(r, 1200));
          set({ paymentProcessing: false });
        }

        let pagerId = get().selectedPager ?? get().suggestPager();
        let pager = get().pagers.find((p) => p.physicalId === pagerId);
        if (!pager || pager.state !== "ready") {
          pager = get().pagers.find((p) => p.state === "ready");
          if (!pager) return { ok: false, error: "Không còn pager trống" };
          pagerId = pager.physicalId;
        }

        const orderId = String(get().orderCounter);
        const now = Date.now();
        const time = formatTime(now);
        const paymentLabel = isSplit ? `Chia ${splitLines!.length} PT` : method;
        const customer =
          customerName?.trim() || get().customerName.trim() || "Walk-in";

        const lineDetails = cart.map((c) => ({
          lineId: c.lineId,
          name: c.name,
          quantity: c.quantity,
          unitPrice: c.price,
          modifierLabels: c.modifierLabels,
        }));

        const order: OrderRecord = {
          id: orderId,
          time,
          createdAt: now,
          customer,
          items: cart.map((c) => {
            const mods = c.modifierLabels?.length ? ` (${c.modifierLabels.join(", ")})` : "";
            return `${c.name}${mods} x${c.quantity}`;
          }),
          lineDetails,
          total,
          status: "preparing",
          pagerId: pagerId!,
          paymentMethod: paymentLabel,
          payments: isSplit ? splitLines : [{ method: paymentLabel, amount: total }],
          discount: get().cartDiscount ?? undefined,
          timer: "00:00",
          timeline: [
            { time, message: `Thanh toán (${paymentLabel})` },
            { time, message: `Gán pager #${pagerId}` },
            { time, message: "Gửi xuống bếp" },
          ],
        };

        set((s) => ({
          orderCounter: s.orderCounter + 1,
          orders: [order, ...s.orders],
          cart: [],
          cartDiscount: null,
          splitPayments: [],
          customerName: "",
          pagers: s.pagers.map((p) =>
            p.physicalId === pagerId ? { ...p, state: "in_use" as PagerState, orderId } : p,
          ),
        }));

        if (get().isOffline) {
          set((s) => ({
            pendingSync: [
              {
                id: `ps-${Date.now()}`,
                type: "order",
                description: `Đơn #${orderId}`,
                status: "pending",
                time: formatTime(Date.now()),
              },
              ...s.pendingSync,
            ],
          }));
        }

        logActivity(`Đơn #${orderId} · ${total.toLocaleString("vi-VN")}đ`);
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
                    { time: formatTime(Date.now()), message: `Cập nhật: ${status}` },
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

      refundOrder: (orderId, options) => {
        const type = options?.type ?? "full";
        if (type === "partial" && options?.lineIds?.length) {
          set((s) => ({
            orders: s.orders.map((o) => {
              if (o.id !== orderId) return o;
              const lineDetails = o.lineDetails?.map((l) =>
                options.lineIds!.includes(l.lineId) ? { ...l, refunded: true } : l,
              );
              const refundTotal =
                lineDetails
                  ?.filter((l) => l.refunded)
                  .reduce((sum, l) => sum + l.unitPrice * l.quantity, 0) ?? 0;
              return {
                ...o,
                lineDetails,
                total: Math.max(0, o.total - refundTotal),
                timeline: [
                  ...o.timeline,
                  {
                    time: formatTime(Date.now()),
                    message: `Hoàn một phần · ${options.reason ?? ""}`,
                  },
                ],
              };
            }),
          }));
          return;
        }
        get().updateOrderStatus(orderId, "cancelled");
        const order = get().orders.find((o) => o.id === orderId);
        if (order?.pagerId) get().releasePager(order.pagerId);
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
                      message: next === "ready" ? "Sẵn sàng" : "Cập nhật bếp",
                    },
                  ],
                }
              : o,
          ),
        }));
        if (next === "ready" && order.pagerId) get().ringPager(order.pagerId);
      },

      setOffline: (offline) => set({ isOffline: offline }),

      syncNow: async () => {
        await new Promise((r) => setTimeout(r, 1200));
        let synced = 0;
        set((s) => ({
          pendingSync: s.pendingSync.map((p) => {
            if (p.status === "pending") {
              synced++;
              return { ...p, status: "synced" as const };
            }
            return p;
          }),
          isOffline: false,
        }));
        return { synced };
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
        const staff = get().session.staffName ?? "Staff";
        set((s) => {
          const inventory = s.inventory.map((inv) => {
            if (inv.id !== id) return inv;
            const quantity = Math.max(0, +(inv.quantity + delta).toFixed(2));
            const row = { ...inv, quantity };
            return { ...row, status: recalcInventoryStatus(row) };
          });
          const item = inventory.find((i) => i.id === id);
          return {
            inventory,
            inventoryTxns: [
              {
                id: String(Date.now()),
                date: formatTime(Date.now()),
                type: delta >= 0 ? "import" : "waste",
                item: item?.name ?? "",
                quantity: Math.abs(delta),
                unit: item?.unit ?? "",
                staff,
                note,
              },
              ...s.inventoryTxns,
            ],
          };
        });
      },

      addCustomerPoints: (customerId, points) => {
        set((s) => ({
          customers: s.customers.map((c) =>
            c.id === customerId ? { ...c, points: c.points + points } : c,
          ),
        }));
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
      applyPromotion: (id) => {
        const promo = get().promotions.find((p) => p.id === id);
        if (!promo) return 0;
        const cart = get().cart;
        if (!cart.length) return 0;
        let discount = 0;

        // helper: build list of unit prices for a subset of items
        const pricesFor = (items: typeof cart) => items.flatMap((it) => Array.from({ length: it.quantity }, () => it.price));

        if (promo.type === "percent") {
          discount = Math.round(get().cartSubtotal() * (Number(promo.value.replace("%", "")) || 0) / 100);
        } else if (promo.type === "fixed") {
          discount = Number(promo.value.replace(/[^0-9]/g, "")) || 0;
        } else if (promo.type === "bogo") {
          // Determine candidate items via promo.applyTo if provided
          let candidates = cart;
          if (promo.applyTo) {
            if (promo.applyTo.type === "category") {
              const cats = new Set(promo.applyTo.ids);
              candidates = cart.filter((c) => {
                const prod = get().products.find((p) => p.id === c.productId);
                return prod ? cats.has(prod.category) : false;
              });
            } else if (promo.applyTo.type === "products") {
              const ids = new Set(promo.applyTo.ids);
              candidates = cart.filter((c) => ids.has(c.productId));
            }
          }

          // For buy-2-get-1 semantics: every 3rd item is free within the candidate set
          const units = pricesFor(candidates).sort((a, b) => a - b);
          const freeCount = Math.floor(units.length / 3);
          discount = units.slice(0, freeCount).reduce((s, v) => s + v, 0);
        } else if (promo.type === "points") {
          // points don't reduce price directly
          discount = 0;
        } else {
          // combo/other: give one cheapest item free for each full combo set
          // determine distinct product ids and their quantities
          const byProduct: Record<string, { qty: number; price: number }> = {};
          cart.forEach((c) => {
            byProduct[c.productId] = byProduct[c.productId] || { qty: 0, price: c.price };
            byProduct[c.productId].qty += c.quantity;
            byProduct[c.productId].price = Math.min(byProduct[c.productId].price, c.price);
          });
          const productIds = Object.keys(byProduct);
          if (productIds.length >= 2) {
            // number of full sets is min quantity among distinct products
            const groups = Math.min(...productIds.map((id) => byProduct[id].qty));
            const cheapest = Math.min(...productIds.map((id) => byProduct[id].price));
            discount = groups * cheapest;
          }
        }

        if (discount > 0) {
          set({ cartDiscount: { type: "fixed", name: promo.name, value: discount } });
        }
        return discount;
      },

      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),

      resetDemo: () => set({ ...buildInitialState(), paymentProcessing: false }),
    }),
    {
      name: "neon-coffee-store",
      version: 2,
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2 && Array.isArray(state.cart)) {
          state.cart = (state.cart as CartItem[]).map((c) => migrateCartItem(c as CartItem));
          state.cartDiscount = state.cartDiscount ?? null;
          state.splitPayments = state.splitPayments ?? [];
          state.customerName = state.customerName ?? "";
          state.isOffline = state.isOffline ?? false;
          state.pendingSync = state.pendingSync ?? [];
          state.heldOrders = state.heldOrders ?? [];
        }
        return state as unknown as NeonState;
      },
    },
  ),
);

export function useLiveOrders() {
  const orders = useNeonStore((s) => s.orders);
  return useMemo(
    () =>
      orders.map((o) => {
        const overdue =
          Date.now() - o.createdAt > 5 * 60000 &&
          !["completed", "cancelled", "picked_up"].includes(o.status);
        return {
          ...o,
          timer: orderElapsedMinutes(o.createdAt),
          status:
            overdue && o.status === "preparing" ? ("overdue" as OrderStatus) : o.status,
        };
      }),
    [orders],
  );
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
