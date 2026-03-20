"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MonthlySale } from "@/types/sales";
import { formatCurrency } from "@/lib/format";

interface MonthlySalesChartProps {
  data: MonthlySale[];
  loading?: boolean;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-lg"
      style={{
        background: "var(--bg-overlay)",
        border: "1px solid var(--border-accent)",
        color: "var(--text-primary)",
      }}
    >
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.dataKey === "revenue" ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

export function MonthlySalesChart({ data, loading }: MonthlySalesChartProps) {
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
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={{ stroke: "var(--border)" }}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="revenue"
          name="Receita"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "var(--chart-1)" }}
          activeDot={{ r: 6 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="orders"
          name="Pedidos"
          stroke="var(--chart-3)"
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
