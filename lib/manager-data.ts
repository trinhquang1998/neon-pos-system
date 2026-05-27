import type { OrderStatus } from "./types";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  points: number;
  visits: number;
  totalSpent: number;
  favoriteDrink: string;
  lastVisit: string;
  tags?: string[];
}

export interface Promotion {
  id: string;
  name: string;
  type: "percent" | "fixed" | "bogo" | "points" | "combo";
  value: string;
  status: "active" | "scheduled" | "ended";
  startDate: string;
  endDate: string;
  used: number;
  limit: number;
  // applyTo allows promotion to target either categories or specific product ids
  applyTo?: { type: "category" | "products"; ids: string[] };
}

export interface Voucher {
  id: string;
  code: string;
  discount: string;
  status: "active" | "used" | "expired";
  customer?: string;
  expires: string;
}

export interface ShiftSlot {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  day: number;
  start: string;
  end: string;
  color: string;
}

export interface DeviceRecord {
  id: string;
  name: string;
  type: "pager" | "printer" | "kds" | "pos" | "tv";
  status: "online" | "offline" | "warning";
  location: string;
  lastSeen: string;
  firmware?: string;
  detail?: string;
}

export interface InventoryTxn {
  id: string;
  date: string;
  type: "import" | "export" | "waste";
  item: string;
  quantity: number;
  unit: string;
  staff: string;
  note?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  items: string[];
  lastOrder: string;
}

export interface KitchenStation {
  id: string;
  code: string;
  name: string;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface RoutingRule {
  id: string;
  name: string;
  priority: number;
  target: string;
  active: boolean;
}

export const extendedOrders = [
  { id: "1046", time: "10:30", customer: "Walk-in", items: ["Latte x1"], total: 45000, status: "new" as OrderStatus, pagerId: undefined },
  { id: "1045", time: "10:24", customer: "Walk-in", items: ["Matcha Latte x2", "Cold Brew x1"], total: 152000, status: "preparing" as OrderStatus, pagerId: "05", timer: "03:12" },
  { id: "1044", time: "10:20", customer: "Minh Anh", items: ["Trà đào cam sả x1"], total: 49000, status: "almost_ready" as OrderStatus, pagerId: "12", timer: "01:45" },
  { id: "1043", time: "10:15", customer: "Walk-in", items: ["Espresso x2", "Croissant x1"], total: 85000, status: "overdue" as OrderStatus, pagerId: "08", timer: "08:20" },
  { id: "1042", time: "10:10", customer: "Lan Hương", items: ["Latte x1", "Tiramisu x1"], total: 90000, status: "ready" as OrderStatus, pagerId: "25", timer: "00:30" },
  { id: "1041", time: "10:05", customer: "Walk-in", items: ["Cappuccino x1"], total: 45000, status: "picked_up" as OrderStatus, pagerId: "03" },
  { id: "1040", time: "09:58", customer: "Tuấn", items: ["Cookie Cream Frappe x2"], total: 118000, status: "completed" as OrderStatus, pagerId: "17" },
  { id: "1039", time: "09:52", customer: "Hà My", items: ["Americano x1"], total: 32000, status: "completed" as OrderStatus },
  { id: "1038", time: "09:45", customer: "Walk-in", items: ["Matcha Latte x1"], total: 55000, status: "cancelled" as OrderStatus },
  { id: "1037", time: "09:40", customer: "Quốc Bảo", items: ["Cold Brew x2"], total: 84000, status: "completed" as OrderStatus, pagerId: "11" },
];

export const customers: Customer[] = [
  { id: "1", name: "Minh Anh", phone: "0901 234 567", tier: "Gold", points: 2450, visits: 28, totalSpent: 4200000, favoriteDrink: "Trà đào cam sả", lastVisit: "10/05/2024" },
  { id: "2", name: "Lan Hương", phone: "0912 345 678", tier: "Silver", points: 1200, visits: 15, totalSpent: 2100000, favoriteDrink: "Latte", lastVisit: "10/05/2024", tags: ["VIP"] },
  { id: "3", name: "Tuấn", phone: "0923 456 789", tier: "Bronze", points: 480, visits: 6, totalSpent: 890000, favoriteDrink: "Cookie Cream Frappe", lastVisit: "10/05/2024" },
  { id: "4", name: "Hà My", phone: "0934 567 890", tier: "Platinum", points: 5200, visits: 42, totalSpent: 8900000, favoriteDrink: "Matcha Latte", lastVisit: "09/05/2024", tags: ["VIP", "Birthday tháng 5"] },
  { id: "5", name: "Quốc Bảo", phone: "0945 678 901", tier: "Silver", points: 980, visits: 12, totalSpent: 1650000, favoriteDrink: "Cold Brew", lastVisit: "10/05/2024" },
  { id: "6", name: "Thảo Vy", phone: "0956 789 012", tier: "Gold", points: 3100, visits: 22, totalSpent: 5400000, favoriteDrink: "Caramel Macchiato", lastVisit: "08/05/2024" },
];

export const promotions: Promotion[] = [
  { id: "1", name: "Giảm 15% cuối tuần", type: "percent", value: "15%", status: "active", startDate: "01/05/2024", endDate: "31/05/2024", used: 124, limit: 500 },
  { id: "2", name: "Mua 2 tặng 1 đá xay", type: "bogo", value: "BOGO", status: "active", startDate: "10/05/2024", endDate: "20/05/2024", used: 38, limit: 200, applyTo: { type: "category", ids: ["blended"] } },
  { id: "3", name: "Giảm 20.000đ đơn từ 100k", type: "fixed", value: "20.000đ", status: "scheduled", startDate: "15/05/2024", endDate: "30/05/2024", used: 0, limit: 1000 },
  { id: "4", name: "Tích điểm x2", type: "points", value: "2x", status: "ended", startDate: "01/04/2024", endDate: "30/04/2024", used: 890, limit: 9999 },
];

export const vouchers: Voucher[] = [
  { id: "1", code: "NEON15", discount: "15%", status: "active", expires: "31/05/2024" },
  { id: "2", code: "MATCHA50", discount: "50.000đ", status: "active", customer: "Minh Anh", expires: "15/05/2024" },
  { id: "3", code: "BIRTHDAY", discount: "Miễn phí size M", status: "used", customer: "Hà My", expires: "10/05/2024" },
  { id: "4", code: "WELCOME10", discount: "10%", status: "expired", expires: "01/04/2024" },
];

export const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export const shiftSlots: ShiftSlot[] = [
  { id: "1", staffId: "2", staffName: "Trần Thị B", role: "Cashier", day: 0, start: "08:00", end: "16:00", color: "#4A90D9" },
  { id: "2", staffId: "4", staffName: "Phạm Thị D", role: "Supervisor", day: 0, start: "09:00", end: "17:00", color: "#9B59B6" },
  { id: "3", staffId: "1", staffName: "Nguyễn Văn A", role: "Barista", day: 0, start: "14:00", end: "22:00", color: "#FF3B30" },
  { id: "4", staffId: "3", staffName: "Lê Văn C", role: "Barista", day: 1, start: "10:00", end: "18:00", color: "#FF3B30" },
  { id: "5", staffId: "2", staffName: "Trần Thị B", role: "Cashier", day: 2, start: "08:00", end: "16:00", color: "#4A90D9" },
  { id: "6", staffId: "1", staffName: "Nguyễn Văn A", role: "Barista", day: 3, start: "14:00", end: "22:00", color: "#FF3B30" },
  { id: "7", staffId: "3", staffName: "Lê Văn C", role: "Barista", day: 4, start: "10:00", end: "18:00", color: "#FF3B30" },
  { id: "8", staffId: "4", staffName: "Phạm Thị D", role: "Supervisor", day: 5, start: "09:00", end: "17:00", color: "#9B59B6" },
  { id: "9", staffId: "2", staffName: "Trần Thị B", role: "Cashier", day: 6, start: "10:00", end: "18:00", color: "#4A90D9" },
];

export const devices: DeviceRecord[] = [
  { id: "p1", name: "Pager Base #1", type: "pager", status: "online", location: "Quầy thu ngân", lastSeen: "10:28", firmware: "v2.1.0", detail: "22 pager · 8 đang dùng" },
  { id: "p2", name: "Máy in bill #1", type: "printer", status: "online", location: "POS 1", lastSeen: "10:28", firmware: "v1.4.2" },
  { id: "p3", name: "Máy in bill #2", type: "printer", status: "online", location: "POS 2", lastSeen: "10:27", firmware: "v1.4.2" },
  { id: "k1", name: "KDS Espresso", type: "kds", status: "online", location: "Bếp A", lastSeen: "10:28", firmware: "v3.0.1" },
  { id: "k2", name: "KDS Matcha/Trà", type: "kds", status: "online", location: "Bếp B", lastSeen: "10:28", firmware: "v3.0.1" },
  { id: "k3", name: "KDS Topping", type: "kds", status: "warning", location: "Bếp C", lastSeen: "10:15", firmware: "v3.0.0", detail: "Sync chậm" },
  { id: "pos1", name: "POS Terminal 1", type: "pos", status: "online", location: "Quầy chính", lastSeen: "10:28" },
  { id: "pos2", name: "POS Terminal 2", type: "pos", status: "online", location: "Quầy phụ", lastSeen: "10:28" },
  { id: "tv1", name: "Pickup TV", type: "tv", status: "online", location: "Khu vực khách", lastSeen: "10:28" },
];

export const inventoryTxns: InventoryTxn[] = [
  { id: "1", date: "10/05 10:20", type: "import", item: "Hạt arabica", quantity: 20, unit: "kg", staff: "Phạm Thị D", note: "PO #8821" },
  { id: "2", date: "10/05 09:15", type: "import", item: "Sữa tươi", quantity: 30, unit: "L", staff: "Trần Thị B" },
  { id: "3", date: "09/05 18:30", type: "waste", item: "Bột matcha", quantity: 0.3, unit: "kg", staff: "Lê Văn C", note: "Hết hạn" },
  { id: "4", date: "09/05 14:00", type: "export", item: "Đường", quantity: 2, unit: "kg", staff: "Nguyễn Văn A", note: "Chuyển chi nhánh Q7" },
];

export const suppliers: Supplier[] = [
  { id: "1", name: "Công ty CP Cà phê Đà Lạt", contact: "Anh Tuấn", phone: "028 1234 5678", items: ["Hạt arabica", "Hạt robusta"], lastOrder: "08/05/2024" },
  { id: "2", name: "Vinamilk Distribution", contact: "Chị Lan", phone: "028 8765 4321", items: ["Sữa tươi"], lastOrder: "10/05/2024" },
  { id: "3", name: "Matcha House VN", contact: "Mr. Sato", phone: "0909 111 222", items: ["Bột matcha"], lastOrder: "05/05/2024" },
];

export const kitchenStations: KitchenStation[] = [
  { id: "1", code: "STA-01", name: "Cold brew & đá xay", pending: 4, inProgress: 2, completed: 18 },
  { id: "2", code: "STA-02", name: "Espresso bar", pending: 3, inProgress: 3, completed: 22 },
  { id: "3", code: "STA-03", name: "Matcha & trà", pending: 5, inProgress: 1, completed: 15 },
  { id: "4", code: "STA-04", name: "Topping & hoàn thiện", pending: 2, inProgress: 2, completed: 20 },
  { id: "5", code: "STA-05", name: "Food & bánh", pending: 1, inProgress: 0, completed: 8 },
];

export const routingRules: RoutingRule[] = [
  { id: "R001", name: "Matcha drinks → Station 3", priority: 10, target: "STA-03", active: true },
  { id: "R002", name: "Espresso-based → Station 2", priority: 20, target: "STA-02", active: true },
  { id: "R003", name: "Đá xay / Frappe → Station 1", priority: 30, target: "STA-01", active: true },
  { id: "R004", name: "Bánh & food → Station 5", priority: 40, target: "STA-05", active: true },
];

export const paymentDistribution = [
  { name: "Tiền mặt", value: 35 },
  { name: "QR", value: 40 },
  { name: "Thẻ", value: 15 },
  { name: "Ví điện tử", value: 10 },
];

export const revenueForecast = [
  { day: "T2", actual: 9800, forecast: 9500 },
  { day: "T3", actual: 10200, forecast: 10100 },
  { day: "T4", actual: 11500, forecast: 11000 },
  { day: "T5", actual: 12560, forecast: 12000 },
  { day: "T6", actual: 0, forecast: 14200 },
  { day: "T7", actual: 0, forecast: 15800 },
  { day: "CN", actual: 0, forecast: 13500 },
];

export const customerCohorts = [
  { name: "Mới (30 ngày)", count: 42, retention: 68 },
  { name: "Quay lại", count: 86, retention: 82 },
  { name: "VIP", count: 24, retention: 94 },
  { name: "Nguy cơ rời", count: 12, retention: 35 },
];

export const permissions = [
  { key: "refund", label: "Hoàn tiền", roles: ["Manager", "Supervisor"] },
  { key: "discount", label: "Giảm giá", roles: ["Manager", "Supervisor", "Cashier"] },
  { key: "inventory", label: "Sửa kho", roles: ["Manager", "Supervisor"] },
  { key: "override", label: "Manager override", roles: ["Manager"] },
  { key: "reports", label: "Xem báo cáo", roles: ["Manager", "Owner"] },
  { key: "devices", label: "Quản lý thiết bị", roles: ["Manager", "Supervisor"] },
];
