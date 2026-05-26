"use client";

import Link from "next/link";
import { useState } from "react";
import { useNeonStore } from "@/store/neon-store";
import {
  Bell,
  Calendar,
  ChevronDown,
  KeyRound,
  LogOut,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ProfilePanel = "history" | "notifications" | "password";

const workHistory = [
  { date: "25/05/2026", shift: "14:00 - 22:00", orders: 48, status: "Đang làm" },
  { date: "24/05/2026", shift: "08:00 - 16:00", orders: 62, status: "Hoàn thành" },
  { date: "23/05/2026", shift: "10:00 - 18:00", orders: 41, status: "Hoàn thành" },
];

const notifications = [
  "Ca làm hôm nay bắt đầu lúc 14:00.",
  "Bạn có 2 ngày nghỉ phép còn lại trong tháng.",
  "Quầy POS 02 đã đồng bộ đơn hàng mới.",
];

export default function StaffProfilePage() {
  const session = useNeonStore((s) => s.session);
  const logout = useNeonStore((s) => s.logout);
  const staffName = session.staffName ?? "Nguyễn Văn A";
  const [openPanel, setOpenPanel] = useState<ProfilePanel | null>("history");
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");

  function togglePanel(panel: ProfilePanel) {
    setOpenPanel((current) => (current === panel ? null : panel));
    setPasswordMessage("");
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setPasswordMessage("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (passwordForm.next.length < 4) {
      setPasswordMessage("PIN mới cần tối thiểu 4 ký tự.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordMessage("PIN xác nhận không khớp.");
      return;
    }
    setPasswordForm({ current: "", next: "", confirm: "" });
    setPasswordMessage("Đã cập nhật PIN demo.");
  }

  return (
    <div className="flex flex-1 items-start justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl rounded-[var(--radius)] border border-[var(--border)] bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-black text-2xl font-black text-white">
              {staffName
                .split(" ")
                .map((part) => part[0])
                .slice(-2)
                .join("")}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-black sm:text-2xl">{staffName}</h1>
              <p className="text-sm font-medium text-neutral-500">Barista</p>
              <div className="mt-2 flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                <span className="ml-1 text-sm font-semibold text-black">4.8</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-[var(--border)] p-4">
              <p className="text-xs font-medium text-neutral-500">Ca làm hôm nay</p>
              <p className="mt-2 text-lg font-black">14:00 - 22:00</p>
            </div>
            <div className="rounded-lg border border-[var(--border)] p-4">
              <p className="text-xs font-medium text-neutral-500">Trạng thái</p>
              <p className="mt-2 text-sm font-black text-emerald-600">Đang làm</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Ca làm", value: "18" },
            { label: "Giờ làm", value: "162h" },
            { label: "Điểm đánh giá", value: "4.8" },
            { label: "Nghỉ phép", value: "2 ngày" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-center"
            >
              <p className="text-xs font-medium text-neutral-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-black">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-[var(--border)]">
          <ProfileDropdown
            icon={Calendar}
            label="Lịch sử làm việc"
            open={openPanel === "history"}
            onClick={() => togglePanel("history")}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="bg-neutral-50 text-left text-xs text-neutral-500">
                  <tr>
                    <th className="px-4 py-3">Ngày</th>
                    <th className="px-4 py-3">Ca</th>
                    <th className="px-4 py-3">Đơn</th>
                    <th className="px-4 py-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {workHistory.map((row) => (
                    <tr key={row.date} className="border-t border-[var(--border)]">
                      <td className="px-4 py-3 font-medium">{row.date}</td>
                      <td className="px-4 py-3">{row.shift}</td>
                      <td className="px-4 py-3">{row.orders}</td>
                      <td className="px-4 py-3 text-emerald-600">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ProfileDropdown>

          <ProfileDropdown
            icon={Bell}
            label="Thông báo"
            open={openPanel === "notifications"}
            onClick={() => togglePanel("notifications")}
          >
            <ul className="space-y-2 p-4 text-sm">
              {notifications.map((message) => (
                <li key={message} className="rounded-lg bg-neutral-50 px-3 py-2">
                  {message}
                </li>
              ))}
            </ul>
          </ProfileDropdown>

          <ProfileDropdown
            icon={KeyRound}
            label="Đổi mật khẩu"
            open={openPanel === "password"}
            onClick={() => togglePanel("password")}
          >
            <form className="grid gap-3 p-4 sm:grid-cols-3" onSubmit={handlePasswordSubmit}>
              {[
                ["current", "PIN hiện tại"],
                ["next", "PIN mới"],
                ["confirm", "Nhập lại PIN"],
              ].map(([key, label]) => (
                <label key={key} className="text-xs font-medium text-neutral-600">
                  {label}
                  <input
                    type="password"
                    inputMode="numeric"
                    value={passwordForm[key as keyof typeof passwordForm]}
                    onChange={(e) =>
                      setPasswordForm((form) => ({ ...form, [key]: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </label>
              ))}
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="rounded-md bg-black px-4 py-2 text-sm font-bold text-white"
                >
                  Cập nhật PIN
                </button>
                {passwordMessage && (
                  <span className="ml-3 text-sm text-neutral-600">{passwordMessage}</span>
                )}
              </div>
            </form>
          </ProfileDropdown>
        </div>

        <Link
          href="/staff/login"
          onClick={() => logout()}
          className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-red-200 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" /> ĐĂNG XUẤT
        </Link>
      </div>
    </div>
  );
}

function ProfileDropdown({
  icon: Icon,
  label,
  open,
  onClick,
  children,
}: {
  icon: typeof Calendar;
  label: string;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-[var(--border)] last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 px-4 py-4 text-left text-sm font-medium hover:bg-neutral-50"
        aria-expanded={open}
      >
        <Icon className="h-4 w-4 text-neutral-500" />
        <span className="flex-1">{label}</span>
        <ChevronDown
          className={cn("h-4 w-4 text-neutral-400 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="border-t border-[var(--border)] bg-white">{children}</div>}
    </section>
  );
}
