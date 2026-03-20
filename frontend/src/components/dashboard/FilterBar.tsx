"use client";

import { Calendar, Tag, Package, RotateCcw } from "lucide-react";

export interface DashboardFilters {
  year: number;
  category: string;
}

interface FilterBarProps {
  filters: DashboardFilters;
  categories: string[];
  onFilterChange: (filters: DashboardFilters) => void;
}

const YEARS = [2024, 2025, 2026];

export function FilterBar({ filters, categories, onFilterChange }: FilterBarProps) {
  const handleYear = (year: number) => onFilterChange({ ...filters, year });
  const handleCategory = (category: string) => onFilterChange({ ...filters, category });
  const handleReset = () => onFilterChange({ year: new Date().getFullYear(), category: "" });

  const selectStyle: React.CSSProperties = {
    background: "var(--bg-surface-2)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: "0.5rem",
    padding: "0.375rem 0.75rem",
    fontSize: "0.8125rem",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-xl px-5 py-3.5"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Year filter */}
      <div className="flex items-center gap-2">
        <Calendar size={14} style={{ color: "var(--text-muted)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Ano
        </span>
        <select
          value={filters.year}
          onChange={(e) => handleYear(Number(e.target.value))}
          style={selectStyle}
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="h-5 w-px" style={{ background: "var(--border)" }} />

      {/* Category filter */}
      <div className="flex items-center gap-2">
        <Tag size={14} style={{ color: "var(--text-muted)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Categoria
        </span>
        <select
          value={filters.category}
          onChange={(e) => handleCategory(e.target.value)}
          style={selectStyle}
        >
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="h-5 w-px" style={{ background: "var(--border)" }} />

      {/* Reset */}
      <button
        onClick={handleReset}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
        style={{
          background: "var(--bg-surface-2)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
      >
        <RotateCcw size={12} />
        Limpar
      </button>

      {/* Active filter badges */}
      <div className="ml-auto flex flex-wrap items-center gap-2">
        {filters.category && (
          <span
            className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ background: "var(--accent-glow)", color: "var(--accent-bright)", border: "1px solid var(--accent-muted)" }}
          >
            <Package size={10} />
            {filters.category}
          </span>
        )}
      </div>
    </div>
  );
}
