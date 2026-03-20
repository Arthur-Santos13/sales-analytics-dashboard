"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Target } from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChartCard } from "@/components/ui/ChartCard";
import {
  getSalesSummary,
  getMonthlySales,
  getSalesByCategory,
  getTopProducts,
  getSalesByRegion,
} from "@/lib/salesService";
import { formatCurrency, formatNumber, formatCompact } from "@/lib/format";
import type {
  SalesSummary,
  MonthlySale,
  CategorySale,
  TopProduct,
  RegionSale,
} from "@/types/sales";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR];
const CHART_COLORS = ["#00b4d8", "#0077b6", "#48cae4", "#90e0ef", "#caf0f8"];

function KpiSkeleton() {
  return (
    <div
      className="h-24 animate-pulse rounded-xl"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    />
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  iconColor: string;
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl px-5 py-4"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `${iconColor}22` }}
      >
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="mt-0.5 text-xl font-bold break-all" style={{ color: "var(--text-primary)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function SalesPage() {
  const [year, setYear] = useState(CURRENT_YEAR);

  // Year-filtered data
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlySale[]>([]);
  const [kpiLoading, setKpiLoading] = useState(true);

  // Static aggregate data
  const [categories, setCategories] = useState<CategorySale[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [regions, setRegions] = useState<RegionSale[]>([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  useEffect(() => {
    setKpiLoading(true);
    Promise.all([getSalesSummary(year), getMonthlySales(year)])
      .then(([s, m]) => {
        setSummary(s);
        setMonthly(m);
      })
      .catch(console.error)
      .finally(() => setKpiLoading(false));
  }, [year]);

  useEffect(() => {
    setChartsLoading(true);
    Promise.all([getSalesByCategory(), getTopProducts(10), getSalesByRegion()])
      .then(([c, t, r]) => {
        setCategories(c);
        setTopProducts(t);
        setRegions(r);
      })
      .catch(console.error)
      .finally(() => setChartsLoading(false));
  }, []);

  return (
    <DashboardLayout title="Vendas" subtitle="Análise e histórico de vendas">

      {/* ── Year selector ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Período:</span>
        {YEARS.map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
            style={
              year === y
                ? { background: "#00b4d8", color: "#fff" }
                : {
                    background: "var(--bg-surface-2)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border)",
                  }
            }
          >
            {y}
          </button>
        ))}
      </div>

      {/* ── KPI Cards ── */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {kpiLoading ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              icon={DollarSign}
              label="Receita Total"
              value={formatCurrency(Number(summary?.total_revenue ?? 0))}
              iconColor="#00b4d8"
            />
            <KpiCard
              icon={ShoppingCart}
              label="Total de Pedidos"
              value={formatNumber(summary?.total_orders ?? 0)}
              iconColor="#48cae4"
            />
            <KpiCard
              icon={Target}
              label="Ticket Médio"
              value={formatCurrency(Number(summary?.average_ticket ?? 0))}
              iconColor="#0077b6"
            />
          </>
        )}
      </div>

      {/* ── Monthly Revenue & Orders Chart ── */}
      <div className="mt-4">
        <ChartCard
          title="Receita & Pedidos Mensais"
          subtitle={`Evolução mensal em ${year}`}
        >
          {kpiLoading ? (
            <div
              className="h-64 animate-pulse rounded"
              style={{ background: "var(--bg-surface-2)" }}
            />
          ) : monthly.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Sem dados para {year}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={monthly} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#4d6d9a", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#4d6d9a", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatCompact(v)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#4d6d9a", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0d1f3c",
                    border: "1px solid #1e3a5f",
                    borderRadius: 8,
                    color: "#e8f0fe",
                  }}
                  formatter={(value, name) =>
                    name === "revenue"
                      ? [formatCurrency(Number(value)), "Receita"]
                      : [formatNumber(Number(value)), "Pedidos"]
                  }
                />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="#00b4d8"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                  name="revenue"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#48cae4"
                  strokeWidth={2}
                  dot={{ fill: "#48cae4", r: 3 }}
                  name="orders"
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── Category + Region row ── */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Sales by Category — donut */}
        <ChartCard title="Receita por Categoria" subtitle="Distribuição percentual de receita">
          {chartsLoading ? (
            <div
              className="h-56 animate-pulse rounded"
              style={{ background: "var(--bg-surface-2)" }}
            />
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="revenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={88}
                    strokeWidth={0}
                  >
                    {categories.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0d1f3c",
                      border: "1px solid #1e3a5f",
                      borderRadius: 8,
                      color: "#e8f0fe",
                    }}
                    formatter={(v) => [formatCurrency(Number(v)), "Receita"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-1 flex-col gap-2.5 text-xs">
                {categories.map((c, i) => (
                  <div key={c.category} className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <span style={{ color: "var(--text-secondary)" }}>{c.category}</span>
                    <span className="ml-auto font-semibold" style={{ color: "var(--text-primary)" }}>
                      {c.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>

        {/* Sales by Region — horizontal bar */}
        <ChartCard title="Receita por Região" subtitle="Desempenho por região geográfica">
          {chartsLoading ? (
            <div
              className="h-56 animate-pulse rounded"
              style={{ background: "var(--bg-surface-2)" }}
            />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={regions}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#4d6d9a", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatCompact(v)}
                />
                <YAxis
                  type="category"
                  dataKey="region"
                  tick={{ fill: "#8eafd4", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0d1f3c",
                    border: "1px solid #1e3a5f",
                    borderRadius: 8,
                    color: "#e8f0fe",
                  }}
                  formatter={(v) => [formatCurrency(Number(v)), "Receita"]}
                />
                <Bar dataKey="revenue" fill="#0077b6" radius={[0, 4, 4, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── Top 10 Products Table ── */}
      <div className="mt-4">
        <ChartCard title="Top 10 Produtos" subtitle="Ranking por receita gerada">
          {chartsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded"
                  style={{ background: "var(--bg-surface-2)" }}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg" style={{ border: "1px solid var(--border)" }}>
              {/* Header */}
              <div
                className="grid px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                style={{
                  background: "var(--bg-surface-2)",
                  color: "var(--text-muted)",
                  gridTemplateColumns: "2rem 2fr 1fr 1fr 1fr",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span>#</span>
                <span>Produto</span>
                <span>Categoria</span>
                <span className="text-right">Un. Vendidas</span>
                <span className="text-right">Receita</span>
              </div>
              {/* Rows */}
              {topProducts.map((p, i) => (
                <div
                  key={p.name}
                  className="grid items-center px-4 py-3 text-sm"
                  style={{
                    gridTemplateColumns: "2rem 2fr 1fr 1fr 1fr",
                    background: i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-surface-2)",
                    borderBottom: i < topProducts.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: i < 3 ? "#00b4d8" : "var(--text-muted)" }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{p.name}</span>
                  <span>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs"
                      style={{
                        background: "#00b4d822",
                        color: "#00e5ff",
                        border: "1px solid #00b4d844",
                      }}
                    >
                      {p.category}
                    </span>
                  </span>
                  <span className="text-right" style={{ color: "var(--text-secondary)" }}>
                    {formatNumber(p.units_sold)}
                  </span>
                  <span className="text-right font-semibold" style={{ color: "#00e5ff" }}>
                    {formatCurrency(Number(p.revenue))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

    </DashboardLayout>
  );
}

