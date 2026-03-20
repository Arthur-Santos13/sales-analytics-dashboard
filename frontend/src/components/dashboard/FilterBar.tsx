"use client";

import { Calendar, Tag, MapPin, Search, RotateCcw } from "lucide-react";

export interface DashboardFilters {
  year: number;
  category: string;
  region: string;
  product: string;
}

interface FilterBarProps {
  filters: DashboardFilters;
  categories: string[];
  regions: string[];
  onFilterChange: (filters: DashboardFilters) => void;
}

const YEARS = [2024, 2025, 2026];

const selectStyle: React.CSSProperties = {
  background: "var(--bg-surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  borderRadius: "0.5rem",
  padding: "0.375rem 0.625rem",
  fontSize: "0.8rem",
  outline: "none",
  cursor: "pointer",
  minWidth: "7rem",
};

const Divider = () => (
  <div className="h-5 w-px" style={{ background: "var(--border)" }} />
);

export function FilterBar({ filters, categories, regions, onFilterChange }: FilterBarProps) {
  const set = (patch: Partial<DashboardFilters>) => onFilterChange({ ...filters, ...patch });
  const handleReset = () =>
    onFilterChange({ year: new Date().getFullYear(), category: "", region: "", product: "" });

  const activeCount = [filters.category, filters.region, filters.product].filter(Boolean).length;

  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-xl px-5 py-3"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      {/* ── Ano ── */}
      <div className="flex items-center gap-2">
        <Calendar size={13} style={{ color: "var(--text-muted)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Ano</span>
        <select value={filters.year} onChange={(e) => set({ year: Number(e.target.value) })} style={selectStyle}>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <Divider />

      {/* ── Região ── */}
      <div className="flex items-center gap-2">
        <MapPin size={13} style={{ color: "var(--text-muted)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Região</span>
        <select value={filters.region} onChange={(e) => set({ region: e.target.value })} style={selectStyle}>
          <option value="">Todas</option>
          {regions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <Divider />

      {/* ── Categoria ── */}
      <div className="flex items-center gap-2">
        <Tag size={13} style={{ color: "var(--text-muted)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Categoria</span>
        <select value={filters.category} onChange={(e) => set({ category: e.target.value })} style={selectStyle}>
          <option value="">Todas</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <Divider />

      {/* ── Produto ── */}
      <div className="flex items-center gap-2">
        <Search size={13} style={{ color: "var(--text-muted)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Produto</span>
        <input
          type="text"
          placeholder="Buscar produto..."
          value={filters.product}
          onChange={(e) => set({ product: e.target.value })}
          style={{
            ...selectStyle,
            minWidth: "10rem",
            cursor: "text",
          }}
        />
      </div>

      <Divider />

      {/* ── Reset ── */}
      <button
        onClick={handleReset}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
        style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
      >
        <RotateCcw size={11} />
        Limpar
      </button>

      {/* ── Active badge ── */}
      {activeCount > 0 && (
        <span
          className="ml-auto flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {activeCount}
        </span>
      )}
    </div>
  );
}

