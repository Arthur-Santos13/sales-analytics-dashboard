import { Settings } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ComingSoon } from "@/components/ui/ComingSoon";

export default function SettingsPage() {
  return (
    <DashboardLayout title="Configurações" subtitle="Preferências do sistema">
      <ComingSoon title="Configurações" icon={Settings} />
    </DashboardLayout>
  );
}
