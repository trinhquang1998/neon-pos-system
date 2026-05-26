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

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  popular?: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
  modifiers?: string[];
}

export interface Order {
  id: string;
  time: string;
  customer: string;
  items: string[];
  total: number;
  status: OrderStatus;
  pagerId?: string;
  timer?: string;
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
