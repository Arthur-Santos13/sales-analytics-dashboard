"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CategorySale } from "@/types/sales";
import { formatCurrency } from "@/lib/format";

interface SalesByCategoryChartProps {
  data: CategorySale[];
  loading?: boolean;
}

// Hex values — SVG fill does not resolve CSS variables
const CHART_COLORS = ["#00b4d8", "#0077b6", "#48cae4", "#90e0ef", "#caf0f8"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as CategorySale;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-lg"
      style={{
        background: "#1a3560",
        border: "1px solid #00b4d8",
        color: "#e8f0fe",
      }}
    >
      <p className="mb-1 font-semibold" style={{ color: payload[0].fill }}>{d.category}</p>
      <p>Receita: <span className="font-bold">{formatCurrency(Number(d.revenue))}</span></p>
      <p style={{ color: "#8eafd4" }}>Participação: <span className="font-bold">{Number(d.percentage).toFixed(1)}%</span></p>
    </div>
  );
}

export function SalesByCategoryChart({ data, loading }: SalesByCategoryChartProps) {
  if (loading) {
    return (
      <div className="h-64 w-full animate-pulse rounded-lg" style={{ background: "#112447" }} />
    );
  }

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm" style={{ color: "#4d6d9a" }}>Sem dados de categoria</p>
      </div>
    );
  }

  const totalRevenue = data.reduce((sum, d) => sum + Number(d.revenue), 0);

  return (
    <div className="flex items-center gap-4" style={{ height: 240 }}>
      {/* Donut */}
      <div style={{ flex: "0 0 180px", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="revenue"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={86}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with values */}
      <div className="flex flex-1 flex-col gap-2.5 text-xs">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "#4d6d9a" }}>
          Categorias
        </p>
        {data.map((entry, i) => (
          <div key={entry.category} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="inline-block shrink-0 rounded-sm"
                style={{ width: 10, height: 10, background: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="truncate" style={{ color: "#e8f0fe" }}>{entry.category}</span>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="font-semibold" style={{ color: "#00e5ff" }}>
                {Number(entry.percentage).toFixed(1)}%
              </span>
              <span style={{ color: "#8eafd4", fontSize: "0.7rem" }}>
                {formatCurrency(Number(entry.revenue))}
              </span>
            </div>
          </div>
        ))}
        <div className="mt-1 border-t pt-2" style={{ borderColor: "#1e3a5f" }}>
          <div className="flex items-center justify-between">
            <span style={{ color: "#4d6d9a" }}>Total</span>
            <span className="font-bold" style={{ color: "#00b4d8" }}>
              {formatCurrency(totalRevenue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
