# NEON COFFEE — Operating System (Frontend)

Beverage POS + Operations Platform — Staff & Manager portals chạy song song.

## Chạy dự án

```bash
cd neon-coffee
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) — chọn **Staff** hoặc **Manager**.

## Routes

### Staff (dark, touch)

| Route | Màn hình |
|-------|----------|
| `/staff/login` | Đăng nhập PIN |
| `/staff/pos` | POS — chọn món |
| `/staff/pos/modifier` | Tùy chọn món (size, đá, đường, topping) |
| `/staff/cart` | Giỏ hàng & tóm tắt đơn |
| `/staff/payment` | Thanh toán + pager |
| `/staff/payment/discount` | Giảm giá / KM |
| `/staff/payment/split` | Thanh toán chia |
| `/staff/orders` | Hàng đợi đơn |
| `/staff/orders/[id]` | Chi tiết đơn |
| `/staff/orders/[id]/refund` | Hoàn tiền / hủy |
| `/staff/offline` | Chế độ offline |
| `/staff/kitchen` | KDS |
| `/staff/pickup` | Pickup TV (fullscreen) |
| `/staff/pager` | Quản lý pager |
| `/staff/inventory` | Tồn kho nhanh |
| `/staff/profile` | Hồ sơ NV |

### Manager (light analytics — đầy đủ UI)

| Route | Nội dung |
|-------|----------|
| `/manager/dashboard` | KPI, charts, cảnh báo, hoạt động, NV, kho, thiết bị |
| `/manager/orders` | Bảng đơn, filter, chi tiết + timeline + actions |
| `/manager/kitchen` | Station stats, KDS realtime, routing rules, analytics |
| `/manager/inventory` | 5 tab: Tồn / Nhập / Xuất / Hao hụt / NCC |
| `/manager/staff` | Bảng NV, profile, quyền hạn |
| `/manager/shifts` | Lịch tuần drag-style grid, nghỉ phép, dự báo |
| `/manager/crm` | Danh sách khách, loyalty, lịch sử mua |
| `/manager/promotions` | Chiến dịch + voucher + phân khúc |
| `/manager/devices` | Pager, máy in, KDS, POS, TV, mạng |
| `/manager/reports` | 5 tab analytics (revenue, product, customer, kitchen, labor) |
| `/manager/settings` | Cửa hàng, thanh toán, kitchen routing, bảo mật |

## Stack

- Next.js 16 · React 19 · Tailwind CSS 4
- Zustand (giỏ POS) · Recharts (manager charts) · Lucide icons

## Chức năng thật (local)

Dữ liệu lưu **localStorage** (`neon-coffee-store`) — reload trang vẫn giữ đơn, kho, pager.

**Staff:** đăng nhập → POS thêm món → thanh toán (cash/QR mô phỏng) → gán pager → KDS mark done → pickup TV cập nhật → trả pager.

**Manager:** đơn hoàn tiền / gửi lại bếp, kho +/-, tích điểm CRM, bật/tắt KM, cài đặt cửa hàng, dashboard KPI theo dữ liệu thực.

**Responsive:** mobile bottom nav (staff), drawer menu (manager), bảng scroll ngang, layout POS xếp dọc trên điện thoại.

## Tiếp theo (production)

- Backend .NET + SignalR thay localStorage
- Cổng thanh toán / Pager Gateway RF thật

Spec: `../neon_coffee_pos_system_specification_v2.md`
