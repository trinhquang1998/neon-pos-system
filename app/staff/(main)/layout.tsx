import { StaffShell } from "@/components/staff/staff-shell";

export default function StaffMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StaffShell>{children}</StaffShell>;
}
