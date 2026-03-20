import { ShoppingCart } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ComingSoon } from "@/components/ui/ComingSoon";

export default function OrdersPage() {
  return (
    <DashboardLayout title="Pedidos" subtitle="Gerenciamento de pedidos">
      <ComingSoon title="Módulo de Pedidos" icon={ShoppingCart} />
    </DashboardLayout>
  );
}
