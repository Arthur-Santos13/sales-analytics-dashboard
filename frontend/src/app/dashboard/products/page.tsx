"use client";

import { useEffect, useMemo, useState } from "react";
import { Package, Search, TrendingUp, DollarSign, Tag } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getProductsList } from "@/lib/salesService";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { ProductItem } from "@/types/sales";

const CATEGORY_COLORS: Record<string, string> = {
  "Eletrônicos":  "var(--chart-1)",
  "Móveis":       "var(--chart-2)",
  "Livros":       "var(--chart-3)",
  "Saúde":        "var(--chart-4)",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    getProductsList()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch   = !search   || p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !category || p.category === category;
      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  const totalRevenue   = filtered.reduce((s, p) => s + Number(p.revenue), 0);
  const totalUnitsSold = filtered.reduce((s, p) => s + p.units_sold, 0);

  const selectStyle: React.CSSProperties = {
    background: "var(--bg-surface-2)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: "0.5rem",
    padding: "0.375rem 0.75rem",
    fontSize: "0.8rem",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <DashboardLayout title="Produtos" subtitle="Catálogo completo com métricas de vendas">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", flex: "1 1 220px", maxWidth: 340 }}
        >
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "0.8125rem", width: "100%" }}
          />
        </div>
        {/* Category filter */}
        <div className="flex items-center gap-2">
          <Tag size={13} style={{ color: "var(--text-muted)" }} />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
            <option value="">Todas as categorias</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {/* Stats strip */}
        <div className="ml-auto flex gap-4">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            <Package size={12} />
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{filtered.length}</span> produtos
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            <TrendingUp size={12} />
            <span style={{ color: "var(--accent-bright)", fontWeight: 600 }}>{formatNumber(totalUnitsSold)}</span> un. vendidas
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            <DollarSign size={12} />
            <span style={{ color: "var(--accent-bright)", fontWeight: 600 }}>{formatCurrency(totalRevenue)}</span>
          </span>
        </div>
      </div>

      {/* ── Table ── */}
      <div
        className="mt-5 overflow-hidden rounded-xl"
        style={{ border: "1px solid var(--border)" }}
      >
        {/* Table header */}
        <div
          className="grid items-center px-5 py-3 text-xs font-semibold uppercase tracking-wider"
          style={{
            background: "var(--bg-surface)",
            color: "var(--text-muted)",
            gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span>Produto</span>
          <span>Categoria</span>
          <span className="text-right">Preço Unit.</span>
          <span className="text-right">Un. Vendidas</span>
          <span className="text-right">Receita</span>
        </div>

        {/* Rows */}
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse"
              style={{ background: i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-surface-2)", margin: "2px 0" }}
            />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex h-32 items-center justify-center" style={{ background: "var(--bg-surface)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Nenhum produto encontrado</p>
          </div>
        ) : (
          filtered.map((p, i) => (
            <div
              key={p.id}
              className="grid items-center px-5 py-3.5 text-sm transition-colors"
              style={{
                gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr",
                background: i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-surface-2)",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              {/* Name + rank */}
              <div className="flex items-center gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                  style={{ background: "var(--bg-overlay)", color: "var(--text-secondary)" }}
                >
                  {i + 1}
                </span>
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{p.name}</span>
              </div>
              {/* Category badge */}
              <div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    background: `${CATEGORY_COLORS[p.category] ?? "var(--accent)"}22`,
                    color: CATEGORY_COLORS[p.category] ?? "var(--accent-bright)",
                    border: `1px solid ${CATEGORY_COLORS[p.category] ?? "var(--accent)"}44`,
                  }}
                >
                  {p.category}
                </span>
              </div>
              {/* Price */}
              <span className="text-right" style={{ color: "var(--text-secondary)" }}>
                {formatCurrency(Number(p.price))}
              </span>
              {/* Units sold */}
              <span className="text-right" style={{ color: p.units_sold > 0 ? "var(--text-primary)" : "var(--text-muted)" }}>
                {formatNumber(p.units_sold)}
              </span>
              {/* Revenue */}
              <span className="text-right font-semibold" style={{ color: "var(--accent-bright)" }}>
                {formatCurrency(Number(p.revenue))}
              </span>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
