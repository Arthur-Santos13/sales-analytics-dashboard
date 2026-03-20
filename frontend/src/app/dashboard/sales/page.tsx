import { TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ComingSoon } from "@/components/ui/ComingSoon";

export default function SalesPage() {
  return (
    <DashboardLayout title="Vendas" subtitle="Histórico e análise de vendas">
      <ComingSoon title="Módulo de Vendas" icon={TrendingUp} />
    </DashboardLayout>
  );
}
