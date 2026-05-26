"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Coffee, CreditCard, QrCode } from "lucide-react";
import { useNeonStore } from "@/store/neon-store";

export default function StaffLoginPage() {
  const router = useRouter();
  const login = useNeonStore((s) => s.login);
  const [staffId, setStaffId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!staffId.trim() || pin.length < 4) {
      setError("Nhập mã NV và PIN tối thiểu 4 số");
      return;
    }
    const name = staffId.toUpperCase() === "NV-001" ? "Nguyễn Văn A" : `NV ${staffId}`;
    login(staffId, name);
    router.push("/staff/pos");
  }

  return (
    <div className="flex min-h-[100dvh] bg-white">
      <div className="hidden w-[38%] min-w-[320px] flex-col justify-between bg-black p-8 text-white lg:flex">
        <div className="text-[10px] text-neutral-500">v1.0.0</div>
        <div className="flex flex-col items-center text-center">
          <Coffee className="h-14 w-14 stroke-[1.5]" />
          <h1 className="mt-8 text-3xl font-black tracking-tight">NEON COFFEE</h1>
          <p className="mt-2 text-xs font-semibold tracking-[0.22em] text-neutral-400">
            OPERATING SYSTEM
          </p>
        </div>
        <div />
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-10">
        <div className="mx-auto w-full max-w-sm">
          <p className="mb-8 text-center text-xs font-bold tracking-[0.24em] text-black lg:hidden">
            NEON COFFEE
          </p>
          <h2 className="text-center text-lg font-black tracking-wide">
            ĐĂNG NHẬP NHÂN VIÊN
          </h2>

          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <div>
              <label className="text-xs font-medium text-neutral-600">Mã nhân viên</label>
              <input
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="NV-001"
                className="mt-1.5 w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-600">PIN</label>
              <input
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="mt-1.5 w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                autoComplete="current-password"
              />
            </div>
            <label className="flex items-center gap-2 text-xs font-medium text-neutral-700">
              <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-black" />
              Ghi nhớ đăng nhập
            </label>
            <button
              type="submit"
              className="flex min-h-[46px] w-full items-center justify-center rounded-md bg-black py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              ĐĂNG NHẬP
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-500">hoặc đăng nhập bằng</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                login("QR", "Trần Thị B");
                router.push("/staff/pos");
              }}
              className="flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-md border border-neutral-200 text-xs font-bold hover:border-neutral-400"
            >
              <QrCode className="h-4 w-4" /> QR CODE
            </button>
            <button
              type="button"
              onClick={() => {
                login("CARD", "Lê Văn C");
                router.push("/staff/pos");
              }}
              className="flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-md border border-neutral-200 text-xs font-bold hover:border-neutral-400"
            >
              <CreditCard className="h-4 w-4" /> THẺ NHÂN VIÊN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
