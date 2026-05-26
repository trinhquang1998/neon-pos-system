"use client";

import { useHydration } from "@/store/neon-store";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useHydration();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <p className="text-sm text-neutral-400">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return <>{children}</>;
}
