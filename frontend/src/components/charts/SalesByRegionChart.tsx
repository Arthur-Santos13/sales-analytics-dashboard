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
import type { RegionSale } from "@/types/sales";
import { formatCurrency } from "@/lib/format";

interface Props {
  data: RegionSale[];
  loading?: boolean;
  activeRegion?: string;
}

const REGION_COLORS: Record<string, string> = {
  Sudeste: "#00b4d8",
  Sul: "#0077b6",
  Nordeste: "#48cae4",
  Norte: "#90e0ef",
  "Centro-Oeste": "#00e5ff",
};

const DEFAULT_COLOR = "#1e3a5f";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d: RegionSale = payload[0].payload;
  return (
    <div
      className="rounded-lg px-4 py-3 text-xs shadow-lg"
      style={{
        background: "var(--bg-overlay)",
        border: "1px solid var(--border-accent)",
        color: "var(--text-primary)",
      }}
    >
      <p className="mb-1 font-semibold" style={{ color: "var(--accent-bright)" }}>
        {d.region}
      </p>
      <p>Receita: <span className="font-bold">{formatCurrency(Number(d.revenue))}</span></p>
      <p style={{ color: "var(--text-secondary)" }}>Pedidos: {d.orders}</p>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomLabel = ({ x, y, width, value }: any) => (
  <text
    x={x + width / 2}
    y={y - 6}
    fill="var(--text-secondary)"
    fontSize={10}
    textAnchor="middle"
  >
    {formatCurrency(Number(value))}
  </text>
);

export function SalesByRegionChart({ data, loading, activeRegion }: Props) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-48 w-full animate-pulse rounded-lg" style={{ background: "var(--bg-surface-2)" }} />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Sem dados de região</p>
      </div>
    );
  }

  return (
    <div style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="region"
            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
            tick={{ fill: "var(--text-muted)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]} label={<CustomLabel />}>
            {data.map((entry) => (
              <Cell
                key={entry.region}
                fill={REGION_COLORS[entry.region] ?? DEFAULT_COLOR}
                opacity={!activeRegion || activeRegion === entry.region ? 1 : 0.35}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
