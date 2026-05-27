"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { useNeonStore } from "@/store/neon-store";
import type { DiscountType } from "@/lib/types";

const types: { id: DiscountType; label: string; tooltip?: string }[] = [
  { id: "percent", label: "% Giảm", tooltip: "Áp dụng phần trăm trên tổng hoặc nhóm sản phẩm" },
  { id: "fixed", label: "Số tiền", tooltip: "Giảm trực tiếp số tiền cố định" },
  { id: "buy_x_get_y", label: "Mua X tặng Y", tooltip: "Mua 2 tặng 1 - tự động tính số món được tặng" },
  { id: "combo", label: "Combo", tooltip: "Combo: áp dụng khi đủ các món trong combo" },
  { id: "other", label: "Khác", tooltip: "Thao tác thủ công hoặc khuyến mãi đặc biệt" },
];

function Icon({ type }: { type: DiscountType }) {
  if (type === "percent") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path d="M7 7L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="16.5" r="1.5" fill="currentColor" />
    </svg>
  );
  if (type === "fixed") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path d="M12 1v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  if (type === "buy_x_get_y") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path d="M3 7h18M3 12h12M3 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  if (type === "combo") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <path d="M3 12h6l3 6 3-12 3 6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function DiscountPage() {
  const router = useRouter();
  const subtotal = useNeonStore((s) => s.cartSubtotal());
  const promotions = useNeonStore((s) => s.promotions);
  const vouchers = useNeonStore((s) => s.vouchers);
  const setCartDiscount = useNeonStore((s) => s.setCartDiscount);
  const [type, setType] = useState<DiscountType>("percent");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(null);

  const selectedPromotion = useMemo(
    () => promotions.find((p) => p.id === selectedPromotionId) ?? null,
    [promotions, selectedPromotionId],
  );

  const manualPreview = type === "percent"
    ? Math.round((subtotal * Math.min(100, Number(value) || 0)) / 100)
    : Math.min(subtotal, Number(value) || 0);

  const selectedPromotionPreview = useMemo(() => {
    if (!selectedPromotion) return 0;
    if (selectedPromotion.type === "percent") return Math.round((subtotal * Number(selectedPromotion.value.replace("%", ""))) / 100);
    if (selectedPromotion.type === "fixed") return Number(selectedPromotion.value.replace(/[^0-9]/g, "")) || 0;
    return 0;
  }, [selectedPromotion, subtotal]);

  function applyManualDiscount() {
    const parsed = Number(value);
    if (!name.trim() || parsed <= 0) {
      setMessage("Nhập tên và giá trị giảm giá hợp lệ.");
      return;
    }
    setCartDiscount({ type, name: name.trim(), value: parsed });
    router.push("/staff/payment");
  }

  function applyVoucher() {
    const code = voucherCode.trim().toUpperCase();
    if (!code) {
      setMessage("Nhập mã voucher.");
      return;
    }
    const voucher = vouchers.find((v) => v.code === code);
    if (!voucher) {
      setMessage("Mã voucher không hợp lệ.");
      return;
    }
    if (voucher.status !== "active") {
      setMessage("Voucher đã dùng hoặc hết hạn.");
      return;
    }
    if (voucher.discount.endsWith("%")) {
      const amount = Number(voucher.discount.replace("%", "")) || 0;
      setCartDiscount({ type: "percent", name: voucher.code, value: amount });
    } else {
      const amount = Number(voucher.discount.replace(/[^0-9]/g, "")) || 0;
      if (amount <= 0) {
        setMessage("Voucher này không hỗ trợ tự động.");
        return;
      }
      setCartDiscount({ type: "fixed", name: voucher.code, value: amount });
    }
    router.push("/staff/payment");
  }

  function applyPromotion() {
    if (!selectedPromotion) {
      setMessage("Chọn khuyến mãi để áp dụng.");
      return;
    }
    if (selectedPromotion.type === "percent") {
      const amount = Number(selectedPromotion.value.replace("%", "")) || 0;
      setCartDiscount({ type: "percent", name: selectedPromotion.name, value: amount });
      router.push("/staff/payment");
      return;
    }
    if (selectedPromotion.type === "fixed") {
      const amount = Number(selectedPromotion.value.replace(/[^0-9]/g, "")) || 0;
      setCartDiscount({ type: "fixed", name: selectedPromotion.name, value: amount });
      router.push("/staff/payment");
      return;
    }
    // For complex promotions (bogo, points, combo), delegate to store to compute
    const applied = useNeonStore.getState().applyPromotion(selectedPromotion.id);
    if (applied > 0) {
      router.push("/staff/payment");
      return;
    }
    setMessage("Khuyến mãi này hiện không áp dụng cho giỏ hàng.");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b p-4">
        <Link href="/staff/payment" className="text-sm">← Thanh toán</Link>
        <h1 className="text-xl font-bold">Giảm giá & KM</h1>
      </div>
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-3">
        <div className="border-b p-4 lg:border-r">
          <p className="mb-3 text-sm font-semibold uppercase text-[var(--text-secondary)]">Loại khuyến mãi</p>
          {types.map((t) => (
            <button key={t.id} type="button" onClick={() => setType(t.id)} className={cn("mb-2 flex items-center gap-3 w-full min-h-[44px] rounded-xl border px-4 text-left", type === t.id && "bg-black text-white")}>
              <span className="relative inline-block group">
                <span className="text-[var(--text-secondary)]"><Icon type={t.id} /></span>
                <span className="pointer-events-none absolute -top-10 left-0 hidden group-hover:inline-block rounded bg-black text-white text-xs px-2 py-1 whitespace-nowrap">{t.tooltip}</span>
              </span>
              <span>{t.label}</span>
            </button>
          ))}
          <div className="mt-3 text-xs text-[var(--text-secondary)]">
            {type === "percent" && <p>% Giảm: áp dụng phần trăm trên tổng hoặc nhóm sản phẩm.</p>}
            {type === "fixed" && <p>Số tiền: giảm trực tiếp một số tiền cố định (vd: 20.000đ).</p>}
            {type === "buy_x_get_y" && <p>Mua X tặng Y: cấu hình phức tạp — sử dụng trang quản lý để tạo.</p>}
            {type === "combo" && <p>Combo: áp dụng khi đã tạo combo sẵn trong hệ thống.</p>}
            {type === "other" && <p>Khác: dùng cho trường hợp đặc biệt hoặc thao tác thủ công.</p>}
          </div>
          <div className="mt-4 rounded-2xl border bg-[var(--surface)] p-4 text-sm">
            <p className="font-semibold">Voucher đang có</p>
            <div className="mt-3 space-y-2">
              {vouchers.slice(0, 3).map((v) => (
                <div key={v.id} className="rounded-xl border bg-white px-3 py-2">
                  <p className="font-semibold">{v.code}</p>
                  <p className="text-[var(--text-secondary)]">{v.discount} · {v.status === "active" ? "Hoạt động" : v.status === "used" ? "Đã dùng" : "Hết hạn"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-b p-4 lg:border-r">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold">Thông tin khuyến mãi</p>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên chương trình" className="mb-3 w-full min-h-[44px] rounded-xl border px-3" />
              <input type={type === "percent" ? "number" : "text"} value={value} onChange={(e) => setValue(e.target.value)} placeholder={type === "percent" ? "% Giảm" : "Số tiền (vnđ)"} className="w-full min-h-[44px] rounded-xl border px-3" />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Áp dụng mã voucher</p>
              <div className="flex gap-2">
                <input value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} placeholder="Nhập mã voucher" className="flex-1 rounded-xl border px-3 py-2" />
                <button type="button" onClick={applyVoucher} className="rounded-xl bg-black px-4 text-sm font-bold text-white">Áp dụng</button>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Khuyến mãi có sẵn</p>
              <div className="space-y-2">
                {promotions.map((promo) => (
                  <button key={promo.id} type="button" onClick={() => setSelectedPromotionId(promo.id)} className={cn("w-full rounded-xl border px-4 py-3 text-left", selectedPromotionId === promo.id && "border-black bg-black text-white")}> 
                    <div className="flex items-center justify-between gap-3">
                      <span>{promo.name}</span>
                      <span className="text-xs text-[var(--text-secondary)]">{promo.value}</span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{promo.status === "active" ? "Đang chạy" : promo.status === "scheduled" ? "Sắp chạy" : "Kết thúc"}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="rounded-2xl border bg-[var(--surface)] p-4 text-sm">
            <div className="flex justify-between"><span>Tạm tính</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-green-600"><span>Giảm dự kiến</span><span>-{formatCurrency(selectedPromotion ? selectedPromotionPreview : manualPreview)}</span></div>
            <div className="mt-2 border-t pt-2 text-base font-bold flex justify-between"><span>Tổng tạm tính</span><span>{formatCurrency(subtotal - (selectedPromotion ? selectedPromotionPreview : manualPreview))}</span></div>
          </div>
          {message ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{message}</p> : null}
          <button type="button" onClick={applyManualDiscount} disabled={!(type === "percent" || type === "fixed")} className={cn("mt-4 w-full min-h-[48px] rounded-xl font-bold text-white", !(type === "percent" || type === "fixed") ? "bg-neutral-200 text-neutral-500 cursor-not-allowed" : "bg-black")}>Áp dụng giảm giá</button>
          <button type="button" onClick={applyPromotion} className="mt-3 w-full min-h-[48px] rounded-xl border border-black bg-white font-bold text-black">Áp dụng khuyến mãi</button>
        </div>
      </div>
    </div>
  );
}
