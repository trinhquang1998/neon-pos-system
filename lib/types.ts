export type OrderStatus =
  | "new"
  | "queued"
  | "preparing"
  | "almost_ready"
  | "ready"
  | "picked_up"
  | "completed"
  | "cancelled"
  | "overdue";

export type PagerState =
  | "ready"
  | "in_use"
  | "ringing"
  | "low_battery"
  | "offline"
  | "maintenance"
  | "disabled";

export type DiscountType = "percent" | "fixed" | "buy_x_get_y" | "combo" | "other";
export type RefundType = "partial" | "full" | "void";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  popular?: boolean;
  prepMinutes?: number;
  available?: boolean;
}

export interface ItemModifiers {
  size?: "M" | "L" | "XL";
  ice?: number;
  sugar?: number;
  toppings?: string[];
  note?: string;
}

export interface CartItem {
  lineId: string;
  productId: string;
  name: string;
  basePrice: number;
  price: number;
  quantity: number;
  modifiers?: ItemModifiers;
  modifierLabels?: string[];
}

export interface CartDiscount {
  type: DiscountType;
  name: string;
  value: number;
}

export interface SplitPaymentLine {
  id: string;
  method: string;
  amount: number;
}

export interface PendingSyncItem {
  id: string;
  type: "order" | "payment" | "inventory";
  description: string;
  status: "pending" | "synced";
  time: string;
}

export interface OrderLineDetail {
  lineId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  modifierLabels?: string[];
  refunded?: boolean;
}

export interface Order {
  id: string;
  time: string;
  customer: string;
  items: string[];
  lineDetails?: OrderLineDetail[];
  total: number;
  status: OrderStatus;
  pagerId?: string;
  timer?: string;
  paymentMethod?: string;
  payments?: { method: string; amount: number }[];
  discount?: CartDiscount;
}

export interface PagerDevice {
  id: string;
  physicalId: string;
  state: PagerState;
  battery: number;
  orderId?: string;
  signal?: number;
  lastSeen?: string;
  location?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  shift: string;
  orders: number;
  revenue: number;
  performance: number;
  avatar?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: "good" | "low" | "critical";
}

export interface Alert {
  id: string;
  type: "inventory" | "pager" | "order" | "device";
  title: string;
  message: string;
  severity: "warning" | "critical";
  time: string;
}

export interface Activity {
  id: string;
  time: string;
  message: string;
}
