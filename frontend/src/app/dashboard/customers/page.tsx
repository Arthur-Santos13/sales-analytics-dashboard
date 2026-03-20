import { Users } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ComingSoon } from "@/components/ui/ComingSoon";

export default function CustomersPage() {
  return (
    <DashboardLayout title="Clientes" subtitle="Base de clientes e análises">
      <ComingSoon title="Módulo de Clientes" icon={Users} />
    </DashboardLayout>
  );
}
