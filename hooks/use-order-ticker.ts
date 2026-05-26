"use client";

import { useEffect, useState } from "react";

/** Re-render every second for live order timers */
export function useOrderTicker() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
}
