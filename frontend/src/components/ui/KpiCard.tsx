import { type LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface KpiCardProps {
  title: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  loading?: boolean;
}

export function KpiCard({
  title,
  value,
  sub,
  icon: Icon,
  trend,
  trendLabel,
  loading = false,
}: KpiCardProps) {
  const trendColor =
    trend === "up" ? "var(--success)" :
    trend === "down" ? "var(--danger)" :
    "var(--text-muted)";

  const trendSymbol = trend === "up" ? "▲" : trend === "down" ? "▼" : "●";

  return (
    <div
      className="relative overflow-hidden rounded-xl p-5 transition-all duration-200"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
      }}
    >
      {/* glow strip on top */}
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="text-xs font-semibold uppercase tracking-widest truncate"
            style={{ color: "var(--text-muted)" }}
          >
            {title}
          </p>

          {loading ? (
            <div
              className="mt-3 h-8 w-32 animate-pulse rounded-md"
              style={{ background: "var(--bg-surface-2)" }}
            />
          ) : (
            <p
              className="mt-2 text-3xl font-bold leading-none tracking-tight"
              style={{ color: "var(--accent-bright)" }}
            >
              {value}
            </p>
          )}

          {trendLabel && !loading && (
            <p className="mt-2 text-xs font-medium" style={{ color: trendColor }}>
              {trendSymbol} {trendLabel}
            </p>
          )}

          {sub && !loading && (
            <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
              {sub}
            </p>
          )}
        </div>

        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: "var(--bg-overlay)",
            border: "1px solid var(--border)",
            boxShadow: "0 0 16px var(--accent-glow)",
          }}
        >
          <Icon size={20} style={{ color: "var(--accent)" }} />
        </div>
      </div>
    </div>
  );
}

// Helper to apply shared className logic conveniently
export { clsx };
