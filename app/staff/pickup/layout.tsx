import { StaffShell } from "@/components/staff/staff-shell";

export default function PickupLayout({ children }: { children: React.ReactNode }) {
  return <StaffShell fullscreen>{children}</StaffShell>;
}
