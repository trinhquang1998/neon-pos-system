import type {
  Activity,
  Alert,
  InventoryItem,
  Order,
  PagerDevice,
  Product,
  StaffMember,
} from "./types";

export const BRANCH_NAME = "Neon Coffee - Lê Lợi";

export const products: Product[] = [
  { id: "1", name: "Espresso", price: 25000, category: "coffee", popular: true },
  { id: "2", name: "Americano", price: 32000, category: "coffee" },
  { id: "3", name: "Cappuccino", price: 45000, category: "coffee", popular: true },
  { id: "4", name: "Latte", price: 45000, category: "coffee" },
  { id: "5", name: "Matcha Latte", price: 55000, category: "tea", popular: true },
  { id: "6", name: "Trà đào cam sả", price: 49000, category: "tea", popular: true },
  { id: "7", name: "Cold Brew", price: 42000, category: "coffee" },
  { id: "8", name: "Caramel Macchiato", price: 52000, category: "coffee" },
  { id: "9", name: "Cookie Cream Frappe", price: 59000, category: "blended" },
  { id: "10", name: "Chocolate Frappe", price: 59000, category: "blended" },
  { id: "11", name: "Croissant", price: 35000, category: "cake" },
  { id: "12", name: "Tiramisu", price: 45000, category: "cake" },
  // Combos
  { id: "combo1", name: "Combo Sáng (Cà phê + Bánh)", price: 75000, category: "combo", popular: true, image: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=500&q=80" },
  { id: "combo2", name: "Combo Trưa (2 Cà phê + Bánh)", price: 120000, category: "combo", popular: true, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80" },
  { id: "combo3", name: "Combo Chiều (Trà + Bánh + Snack)", price: 95000, category: "combo", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=500&q=80" },
  { id: "combo4", name: "Combo Đôi (2 Cà phê bất kỳ)", price: 85000, category: "combo", image: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=500&q=80" },
  { id: "combo5", name: "Combo Gia Đình (4 Đồ uống + 2 Bánh)", price: 280000, category: "combo", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80" },
];

export const categories = [
  { id: "all", label: "Tất cả" },
  { id: "coffee", label: "Cà phê" },
  { id: "tea", label: "Trà" },
  { id: "blended", label: "Đá xay" },
  { id: "cake", label: "Bánh" },
  { id: "combo", label: "Combo" },
  { id: "other", label: "Khác" },
  { id: "favorites", label: "Yêu thích" },
];

export const orders: Order[] = [
  {
    id: "1045",
    time: "10:24",
    customer: "Walk-in",
    items: ["Matcha Latte x2", "Cold Brew x1"],
    total: 152000,
    status: "preparing",
    pagerId: "05",
    timer: "03:12",
  },
  {
    id: "1044",
    time: "10:20",
    customer: "Minh Anh",
    items: ["Trà đào cam sả x1"],
    total: 49000,
    status: "almost_ready",
    pagerId: "12",
    timer: "01:45",
  },
  {
    id: "1043",
    time: "10:15",
    customer: "Walk-in",
    items: ["Espresso x2", "Croissant x1"],
    total: 85000,
    status: "overdue",
    pagerId: "08",
    timer: "08:20",
  },
  {
    id: "1042",
    time: "10:10",
    customer: "Lan Hương",
    items: ["Latte x1", "Tiramisu x1"],
    total: 90000,
    status: "ready",
    pagerId: "25",
    timer: "00:30",
  },
  {
    id: "1041",
    time: "10:05",
    customer: "Walk-in",
    items: ["Cappuccino x1"],
    total: 45000,
    status: "picked_up",
    pagerId: "03",
  },
  {
    id: "1040",
    time: "09:58",
    customer: "Tuấn",
    items: ["Cookie Cream Frappe x2"],
    total: 118000,
    status: "completed",
    pagerId: "17",
  },
];

export const kitchenOrders = orders.filter((o) =>
  ["preparing", "almost_ready", "ready", "overdue"].includes(o.status),
);

export const pickupReady = ["25", "31", "44"];
export const pickupAlmost = ["26", "32", "45", "46"];
export const pickupPreparing = ["27", "28", "33", "34", "35"];

export const pagers: PagerDevice[] = Array.from({ length: 22 }, (_, i) => {
  const id = String(i + 1).padStart(2, "0");
  const states: PagerDevice["state"][] = [
    "ready",
    "in_use",
    "in_use",
    "ready",
    "low_battery",
  ];
  const state = i === 4 ? "in_use" : i === 6 ? "low_battery" : states[i % 5];
  return {
    id,
    physicalId: id,
    state,
    battery: state === "low_battery" ? 20 : 75 + (i % 25),
    orderId: state === "in_use" ? (i === 4 ? "1045" : "1042") : undefined,
    signal: 85 - (i % 15),
    lastSeen: "10:28",
    location: i % 3 === 0 ? "Quầy thu ngân" : "Khu vực A",
  };
});

export const inventoryItems: InventoryItem[] = [
  { id: "1", name: "Bột matcha", quantity: 1.2, unit: "kg", status: "critical" },
  { id: "2", name: "Sữa tươi", quantity: 2.5, unit: "L", status: "critical" },
  { id: "3", name: "Hạt arabica", quantity: 12.5, unit: "kg", status: "good" },
  { id: "4", name: "Đường", quantity: 8.0, unit: "kg", status: "low" },
  { id: "5", name: "Syrup caramel", quantity: 4.2, unit: "L", status: "good" },
  { id: "6", name: "Trân châu", quantity: 3.1, unit: "kg", status: "low" },
];

export const staffMembers: StaffMember[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    role: "Barista",
    shift: "14:00 - 22:00",
    orders: 48,
    revenue: 2450000,
    performance: 95,
  },
  {
    id: "2",
    name: "Trần Thị B",
    role: "Cashier",
    shift: "08:00 - 16:00",
    orders: 62,
    revenue: 3180000,
    performance: 92,
  },
  {
    id: "3",
    name: "Lê Văn C",
    role: "Barista",
    shift: "10:00 - 18:00",
    orders: 41,
    revenue: 1980000,
    performance: 88,
  },
  {
    id: "4",
    name: "Phạm Thị D",
    role: "Supervisor",
    shift: "09:00 - 17:00",
    orders: 28,
    revenue: 1420000,
    performance: 90,
  },
];

export const alerts: Alert[] = [
  {
    id: "1",
    type: "inventory",
    title: "Matcha bột",
    message: "Chỉ còn 1.2kg",
    severity: "critical",
    time: "10:25",
  },
  {
    id: "2",
    type: "pager",
    title: "Pager #27",
    message: "Pin yếu (20%)",
    severity: "warning",
    time: "10:22",
  },
  {
    id: "3",
    type: "order",
    title: "Đơn #1043",
    message: "Trễ hạn 03:12",
    severity: "critical",
    time: "10:20",
  },
  {
    id: "4",
    type: "inventory",
    title: "Sữa tươi",
    message: "Chỉ còn 2.5L",
    severity: "critical",
    time: "10:18",
  },
];

export const activities: Activity[] = [
  { id: "1", time: "10:28", message: 'Nhân viên "Trần Thị B" đã check-in ca' },
  { id: "2", time: "10:24", message: "Đơn hàng #1045 hoàn thành" },
  { id: "3", time: "10:20", message: "Nhập kho 20kg hạt arabica" },
  { id: "4", time: "10:15", message: 'Khách "Minh Anh" tích 250 điểm' },
  { id: "5", time: "10:10", message: "Đơn hàng #1043 đã hủy" },
];

export const hourlyRevenue = [
  { hour: "06", revenue: 420 },
  { hour: "07", revenue: 890 },
  { hour: "08", revenue: 1240 },
  { hour: "09", revenue: 1580 },
  { hour: "10", revenue: 2100 },
  { hour: "11", revenue: 2450 },
  { hour: "12", revenue: 3200 },
  { hour: "13", revenue: 2800 },
  { hour: "14", revenue: 1950 },
  { hour: "15", revenue: 1680 },
  { hour: "16", revenue: 1420 },
  { hour: "17", revenue: 1100 },
  { hour: "18", revenue: 980 },
  { hour: "19", revenue: 750 },
  { hour: "20", revenue: 520 },
  { hour: "21", revenue: 380 },
  { hour: "22", revenue: 210 },
];

export const categoryRevenue = [
  { name: "Cà phê", value: 45, amount: 5652000 },
  { name: "Trà trái cây", value: 25, amount: 3140000 },
  { name: "Đá xay", value: 15, amount: 1884000 },
  { name: "Bánh", value: 10, amount: 1256000 },
  { name: "Khác", value: 5, amount: 628000 },
];

export const branchRevenue = [
  { name: "Neon Coffee - Lê Lợi", value: 12560000 },
  { name: "Neon Coffee - Nguyễn Huệ", value: 9840000 },
  { name: "Neon Coffee - Thảo Điền", value: 8720000 },
  { name: "Neon Coffee - Quận 7", value: 7650000 },
  { name: "Neon Coffee - Bình Thạnh", value: 6580000 },
];

export const orderStatusBreakdown = [
  { name: "Đang làm", value: 98, color: "#FFB020" },
  { name: "Sắp xong", value: 56, color: "#F5A623" },
  { name: "Chờ lấy", value: 42, color: "#3DDC84" },
  { name: "Hoàn thành", value: 58, color: "#4A90D9" },
  { name: "Đã hủy", value: 2, color: "#9A9A9A" },
];

export const topProducts = [
  { name: "Matcha Latte", sold: 48, revenue: 2640000 },
  { name: "Trà đào cam sả", sold: 42, revenue: 2058000 },
  { name: "Latte", sold: 38, revenue: 1710000 },
  { name: "Cold Brew", sold: 35, revenue: 1470000 },
  { name: "Cappuccino", sold: 32, revenue: 1440000 },
];

export const managerNav = [
  { href: "/manager/dashboard", label: "Tổng quan", icon: "LayoutDashboard" },
  { href: "/manager/orders", label: "Đơn hàng", icon: "ShoppingBag" },
  { href: "/manager/kitchen", label: "Bếp", icon: "ChefHat" },
  { href: "/manager/inventory", label: "Kho hàng", icon: "Package" },
  { href: "/manager/staff", label: "Nhân sự", icon: "Users" },
  { href: "/manager/shifts", label: "Lịch làm việc", icon: "Calendar" },
  { href: "/manager/crm", label: "Khách hàng", icon: "UserCircle" },
  { href: "/manager/promotions", label: "Khuyến mãi", icon: "Tag" },
  { href: "/manager/devices", label: "Thiết bị", icon: "Radio" },
  { href: "/manager/reports", label: "Báo cáo", icon: "BarChart3" },
  { href: "/manager/settings", label: "Cài đặt", icon: "Settings" },
] as const;

export const staffNav = [
  { href: "/staff/pos", label: "POS", icon: "ShoppingCart" },
  { href: "/staff/cart", label: "Giỏ", icon: "ClipboardList" },
  { href: "/staff/orders", label: "Đơn hàng", icon: "ListOrdered" },
  { href: "/staff/kitchen", label: "Bếp", icon: "ChefHat" },
  { href: "/staff/pickup", label: "Pickup TV", icon: "LayoutDashboard" },
  { href: "/staff/pager", label: "Pager", icon: "Radio" },
  { href: "/staff/inventory", label: "Kho", icon: "Package" },
  { href: "/staff/offline", label: "Offline", icon: "WifiOff" },
  { href: "/staff/profile", label: "Hồ sơ", icon: "User" },
] as const;

export const refundReasons = [
  "Khách yêu cầu",
  "Sai món / modifier",
  "Chất lượng không đạt",
  "Chờ quá lâu",
  "Thanh toán nhầm",
  "Khác",
] as const;

// Combo details - define what's in each combo
export const comboDetails = [
  {
    comboId: "combo1",
    name: "Combo Sáng (Cà phê + Bánh)",
    description: "Chọn 1 cà phê (Espresso, Americano, Cappuccino, Latte) + 1 bánh (Croissant, Tiramisu)",
    slots: [
      { category: "Cà phê", productIds: ["1", "2", "3", "4"], quantity: 1 },
      { category: "Bánh", productIds: ["11", "12"], quantity: 1 },
    ],
    discount: 10,
    savings: 5000,
  },
  {
    comboId: "combo2",
    name: "Combo Trưa (2 Cà phê + Bánh)",
    description: "Chọn 2 cà phê + 1 bánh",
    slots: [
      { category: "Cà phê", productIds: ["1", "2", "3", "4", "7", "8"], quantity: 2 },
      { category: "Bánh", productIds: ["11", "12"], quantity: 1 },
    ],
    discount: 15,
    savings: 18000,
  },
  {
    comboId: "combo3",
    name: "Combo Chiều (Trà + Bánh + Snack)",
    description: "Chọn 1 trà + 1 bánh + 1 đá xay",
    slots: [
      { category: "Trà", productIds: ["5", "6"], quantity: 1 },
      { category: "Bánh", productIds: ["11", "12"], quantity: 1 },
      { category: "Đá xay", productIds: ["9", "10"], quantity: 1 },
    ],
    discount: 12,
    savings: 11400,
  },
  {
    comboId: "combo4",
    name: "Combo Đôi (2 Cà phê bất kỳ)",
    description: "Chọn 2 cà phê bất kỳ (Espresso, Americano, Cappuccino, Latte, Cold Brew, Caramel Macchiato)",
    slots: [
      { category: "Cà phê", productIds: ["1", "2", "3", "4", "7", "8"], quantity: 2 },
    ],
    discount: 8,
    savings: 6800,
  },
  {
    comboId: "combo5",
    name: "Combo Gia Đình (4 Đồ uống + 2 Bánh)",
    description: "Chọn 4 đồ uống bất kỳ + 2 bánh",
    slots: [
      { category: "Đồ uống", productIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], quantity: 4 },
      { category: "Bánh", productIds: ["11", "12"], quantity: 2 },
    ],
    discount: 20,
    savings: 56000,
  },
] as const;

// Combo discount examples for testing
export const comboDiscounts = [
  {
    type: "combo" as const,
    name: "Combo Sáng - Tiết kiệm 10%",
    value: 10,
  },
  {
    type: "combo" as const,
    name: "Combo Trưa - Tiết kiệm 15%",
    value: 15,
  },
  {
    type: "combo" as const,
    name: "Combo Gia Đình - Tiết kiệm 20%",
    value: 20,
  },
  {
    type: "combo" as const,
    name: "Combo Đôi - Tiết kiệm 8%",
    value: 8,
  },
] as const;

export const orderStatusLabels: Record<string, string> = {
  new: "Mới",
  queued: "Chờ",
  preparing: "Đang làm",
  almost_ready: "Sắp xong",
  ready: "Sẵn sàng",
  picked_up: "Đã lấy",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  overdue: "Quá hạn",
};
