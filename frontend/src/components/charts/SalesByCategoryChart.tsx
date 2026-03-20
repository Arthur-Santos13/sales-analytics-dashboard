"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CategorySale } from "@/types/sales";
import { formatCurrency } from "@/lib/format";

interface SalesByCategoryChartProps {
  data: CategorySale[];
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
  const d = payload[0].payload as CategorySale;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-lg"
      style={{
        background: "var(--bg-overlay)",
        border: "1px solid var(--border-accent)",
        color: "var(--text-primary)",
      }}
    >
      <p className="mb-1 font-semibold">{d.category}</p>
      <p style={{ color: payload[0].color }}>
        Receita: {formatCurrency(d.revenue)}
      </p>
      <p style={{ color: "var(--text-secondary)" }}>
        Participação: {Number(d.percentage).toFixed(1)}%
      </p>
    </div>
  );
}

function CustomLegend({ payload }: any) {
  return (
    <ul className="flex flex-col gap-1.5 text-xs">
      {payload?.map((entry: any, i: number) => (
        <li key={i} className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: entry.color }}
          />
          <span style={{ color: "var(--text-secondary)" }}>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function SalesByCategoryChart({ data, loading }: SalesByCategoryChartProps) {
  if (loading) {
    return (
      <div
        className="h-64 w-full animate-pulse rounded-lg"
        style={{ background: "var(--bg-surface-2)" }}
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="revenue"
          nameKey="category"
          cx="45%"
          cy="50%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          content={<CustomLegend />}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
