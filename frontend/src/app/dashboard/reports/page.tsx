"use client";

import { useEffect, useState } from "react";
import { FileBarChart, Download } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChartCard } from "@/components/ui/ChartCard";
import { MonthlySalesChart } from "@/components/charts/MonthlySalesChart";
import { TopProductsChart } from "@/components/charts/TopProductsChart";
import { SalesByCategoryChart } from "@/components/charts/SalesByCategoryChart";
import { SalesByRegionChart } from "@/components/charts/SalesByRegionChart";
import {
  getSalesSummary,
  getMonthlySales,
  getSalesByCategory,
  getTopProducts,
  getSalesByRegion,
} from "@/lib/salesService";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { SalesSummary, MonthlySale, CategorySale, TopProduct, RegionSale } from "@/types/sales";

const CURRENT_YEAR = new Date().getFullYear();

export default function ReportsPage() {
  const [summary,    setSummary]    = useState<SalesSummary | null>(null);
  const [monthly,    setMonthly]    = useState<MonthlySale[]>([]);
  const [categories, setCategories] = useState<CategorySale[]>([]);
  const [products,   setProducts]   = useState<TopProduct[]>([]);
  const [regions,    setRegions]    = useState<RegionSale[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      getSalesSummary(),
      getMonthlySales(CURRENT_YEAR),
      getSalesByCategory(),
      getTopProducts(10),
      getSalesByRegion(),
    ])
      .then(([s, m, c, p, r]) => {
        setSummary(s);
        setMonthly(m);
        setCategories(c);
        setProducts(p);
        setRegions(r);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout
      title="Relatórios"
      subtitle={`Análise completa de vendas — ${CURRENT_YEAR}`}
    >
      {/* ── Report header ── */}
      <div
        className="flex items-center justify-between rounded-xl px-5 py-4"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-muted)" }}
          >
            <FileBarChart size={17} style={{ color: "var(--accent-bright)" }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Relatório Anual de Vendas {CURRENT_YEAR}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Gerado em {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors"
          style={{ background: "var(--accent)", color: "#fff" }}
          onClick={() => window.print()}
        >
          <Download size={13} />
          Exportar PDF
        </button>
      </div>

      {/* ── KPI Summary strip ── */}
      {summary && (
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Receita Total",   value: formatCurrency(summary.total_revenue), color: "var(--accent-bright)" },
            { label: "Total de Pedidos", value: formatNumber(summary.total_orders),   color: "var(--chart-3)" },
            { label: "Ticket Médio",    value: formatCurrency(summary.average_ticket), color: "var(--chart-4)" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl px-5 py-4"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</p>
              <p className="mt-1 text-2xl font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Charts 2×2 ── */}
      <div className="mt-5 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Vendas Mensais" subtitle={`Receita e pedidos — ${CURRENT_YEAR}`}>
          <MonthlySalesChart data={monthly} loading={loading} />
        </ChartCard>

        <ChartCard title="Vendas por Categoria" subtitle="Distribuição de receita">
          <SalesByCategoryChart data={categories} loading={loading} />
        </ChartCard>

        <ChartCard title="Vendas por Região" subtitle="Receita acumulada por região">
          <SalesByRegionChart data={regions} loading={loading} />
        </ChartCard>

        <ChartCard title="Top 10 Produtos" subtitle="Maior receita por produto">
          <TopProductsChart data={products} loading={loading} />
        </ChartCard>
      </div>

      {/* ── Monthly breakdown table ── */}
      <div className="mt-6">
        <ChartCard title="Detalhamento Mensal" subtitle="Receita e pedidos por mês">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Mês", "Receita", "Pedidos", "Ticket Médio"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}><td colSpan={4} className="px-4 py-3"><div className="h-4 animate-pulse rounded" style={{ background: "var(--bg-overlay)" }} /></td></tr>
                    ))
                  : monthly.map((m, i) => (
                      <tr
                        key={m.month}
                        style={{
                          background: i % 2 === 0 ? "transparent" : "var(--bg-surface-2)",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>{m.month}</td>
                        <td className="px-4 py-3 font-semibold" style={{ color: "var(--accent-bright)" }}>
                          {formatCurrency(Number(m.revenue))}
                        </td>
                        <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{m.orders}</td>
                        <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                          {formatCurrency(Number(m.revenue) / m.orders)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
