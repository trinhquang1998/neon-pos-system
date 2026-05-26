import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("vi-VN")}đ`;
}

export function formatPercent(value: number, positive = true): string {
  const sign = positive && value >= 0 ? "+" : "";
  return `${sign}${value}%`;
}
