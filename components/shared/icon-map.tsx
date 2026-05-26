"use client";

import {
  BarChart3,
  Bell,
  Calendar,
  ChefHat,
  ClipboardList,
  ListOrdered,
  WifiOff,
  LayoutDashboard,
  Package,
  Radio,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Tag,
  User,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  LayoutDashboard,
  ShoppingBag,
  ChefHat,
  Package,
  Users,
  Calendar,
  UserCircle,
  Tag,
  Radio,
  BarChart3,
  Settings,
  ShoppingCart,
  ClipboardList,
  ListOrdered,
  WifiOff,
  User,
  Bell,
};

export function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? LayoutDashboard;
  return <Icon className={className} strokeWidth={1.75} />;
}
