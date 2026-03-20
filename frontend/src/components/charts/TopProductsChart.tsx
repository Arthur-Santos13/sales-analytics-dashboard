"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { TopProduct } from "@/types/sales";
import { formatCurrency } from "@/lib/format";

interface TopProductsChartProps {
  data: TopProduct[];
  loading?: boolean;
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as TopProduct;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-lg"
      style={{
        background: "var(--bg-overlay)",
        border: "1px solid var(--border-accent)",
        color: "var(--text-primary)",
      }}
    >
      <p className="mb-1 font-semibold">{d.name}</p>
      <p style={{ color: "var(--text-secondary)" }}>Categoria: {d.category}</p>
      <p style={{ color: "var(--chart-1)" }}>Receita: {formatCurrency(d.revenue)}</p>
      <p style={{ color: "var(--chart-3)" }}>Unidades: {d.units_sold}</p>
    </div>
  );
}

export function TopProductsChart({ data, loading }: TopProductsChartProps) {
  if (loading) {
    return (
      <div
        className="h-64 w-full animate-pulse rounded-lg"
        style={{ background: "var(--bg-surface-2)" }}
      />
    );
  }

  // truncate long names for the axis
  const chartData = data.map((d) => ({
    ...d,
    shortName: d.name.length > 18 ? d.name.slice(0, 16) + "…" : d.name,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        layout="vertical"
        data={chartData}
        margin={{ top: 4, right: 32, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="shortName"
          width={110}
          tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-overlay)" }} />
        <Bar dataKey="revenue" radius={[0, 4, 4, 0]} maxBarSize={28}>
          {chartData.map((_, index) => (
            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
