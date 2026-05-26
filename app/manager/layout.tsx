import { ManagerLayoutWrapper } from "@/components/manager/manager-layout-wrapper";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <ManagerLayoutWrapper>{children}</ManagerLayoutWrapper>;
}
