import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Dashboard de Vendas"
      subtitle="Visão geral das vendas e indicadores"
    >
      {/* KPI Cards and charts will live here in the next step */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Receita Total", "Total de Pedidos", "Ticket Médio"].map((label) => (
          <div
            key={label}
            className="rounded-xl p-5"
            style={{
              background:   "var(--bg-surface)",
              border:       "1px solid var(--border)",
            }}
          >
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              {label}
            </p>
            <p
              className="mt-2 text-2xl font-bold"
              style={{ color: "var(--accent-bright)" }}
            >
              —
            </p>
          </div>
        ))}
      </div>

      {/* Chart area placeholder */}
      <div
        className="mt-4 rounded-xl p-6"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Vendas Mensais
        </p>
        <div
          className="mt-4 flex h-48 items-center justify-center rounded-lg"
          style={{ background: "var(--bg-surface-2)", border: "1px dashed var(--border)" }}
        >
          <span style={{ color: "var(--text-muted)" }} className="text-sm">
            Gráfico será implementado no próximo passo
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
}
