"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  UserPlus,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Mail,
  Calendar,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getCustomersList, getCustomersStats } from "@/lib/salesService";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { CustomerListItem, CustomersStats } from "@/types/sales";

const KPI_CONFIG: {
  key: keyof CustomersStats;
  label: string;
  icon: React.ElementType;
  color: string;
  format: (v: number) => string;
}[] = [
  { key: "total",                   label: "Total de Clientes",    icon: Users,       color: "#00b4d8", format: formatNumber },
  { key: "new_this_month",          label: "Novos este mês",       icon: UserPlus,    color: "#48cae4", format: formatNumber },
  { key: "avg_orders_per_customer", label: "Pedidos por Cliente",  icon: ShoppingCart,color: "#0077b6", format: (v) => Number(v).toFixed(1) },
  { key: "avg_spent_per_customer",  label: "Gasto Médio / Cliente",icon: DollarSign,  color: "#22c55e", format: formatCurrency },
];

const PAGE_SIZE = 20;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [stats, setStats]         = useState<CustomersStats | null>(null);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [sort, setSort]           = useState<"total_spent" | "total_orders" | "name">("total_spent");
  const [page, setPage]           = useState(1);

  useEffect(() => {
    Promise.all([getCustomersList(), getCustomersStats()])
      .then(([c, s]) => { setCustomers(c); setStats(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sort === "name") return a.name.localeCompare(b.name);
        return Number(b[sort]) - Number(a[sort]);
      });
  }, [customers, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function onSearchChange(val: string) { setSearch(val); setPage(1); }
  function onSortChange(val: string)   { setSort(val as typeof sort); setPage(1); }

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
    <DashboardLayout title="Clientes" subtitle="Base de clientes e análise de comportamento">

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {KPI_CONFIG.map(({ key, label, icon: Icon, color, format }) => (
          <div
            key={key}
            className="flex items-center gap-4 rounded-xl px-5 py-4"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `${color}22` }}
            >
              <Icon size={19} style={{ color }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
              <p className="mt-0.5 text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                {loading ? "—" : format(Number(stats?.[key] ?? 0))}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            flex: "1 1 220px",
            maxWidth: 360,
          }}
        >
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "0.8125rem",
              width: "100%",
            }}
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <TrendingUp size={13} style={{ color: "var(--text-muted)" }} />
          <select value={sort} onChange={(e) => onSortChange(e.target.value)} style={selectStyle}>
            <option value="total_spent">Ordenar: Maior gasto</option>
            <option value="total_orders">Ordenar: Mais pedidos</option>
            <option value="name">Ordenar: Nome A-Z</option>
          </select>
        </div>

        {/* Count */}
        <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
          {filtered.length} cliente{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="mt-3 overflow-hidden rounded-xl" style={{ border: "1px solid var(--border)" }}>
        {/* Header */}
        <div
          className="grid items-center px-5 py-3 text-xs font-semibold uppercase tracking-wider"
          style={{
            background: "var(--bg-surface)",
            color: "var(--text-muted)",
            gridTemplateColumns: "2fr 1.6fr 0.7fr 1fr 1fr",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span>Cliente</span>
          <span className="flex items-center gap-1.5"><Mail size={11} />E-mail</span>
          <span className="text-right">Pedidos</span>
          <span className="text-right">Total Gasto</span>
          <span className="flex items-center gap-1.5 justify-end"><Calendar size={11} />Último Pedido</span>
        </div>

        {/* Rows */}
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse"
              style={{
                background: i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-surface-2)",
                margin: "2px 0",
              }}
            />
          ))
        ) : paginated.length === 0 ? (
          <div
            className="flex h-32 items-center justify-center"
            style={{ background: "var(--bg-surface)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Nenhum cliente encontrado</p>
          </div>
        ) : (
          paginated.map((c, i) => (
            <div
              key={c.id}
              className="grid items-center px-5 py-3.5 text-sm"
              style={{
                gridTemplateColumns: "2fr 1.6fr 0.7fr 1fr 1fr",
                background: i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-surface-2)",
                borderBottom: i < paginated.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              {/* Name + avatar */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: "#00b4d822", color: "#00b4d8", border: "1px solid #00b4d844" }}
                >
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ color: "var(--text-primary)", fontWeight: 500 }}>{c.name}</p>
                  <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                    #{c.id.split("-").pop()}
                  </p>
                </div>
              </div>
              {/* Email */}
              <span className="truncate text-xs" style={{ color: "var(--text-secondary)" }}>
                {c.email}
              </span>
              {/* Orders */}
              <span className="text-right" style={{ color: "var(--text-primary)" }}>
                {formatNumber(c.total_orders)}
              </span>
              {/* Total spent */}
              <span className="text-right font-semibold" style={{ color: "#00e5ff" }}>
                {formatCurrency(Number(c.total_spent))}
              </span>
              {/* Last order */}
              <span className="text-right text-xs" style={{ color: "var(--text-secondary)" }}>
                {c.last_order_at
                  ? new Date(c.last_order_at).toLocaleDateString("pt-BR")
                  : <span style={{ color: "var(--text-muted)" }}>—</span>}
              </span>
            </div>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
            style={{
              background: "var(--bg-surface-2)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            ← Anterior
          </button>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
            style={{
              background: "var(--bg-surface-2)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            Próximo →
          </button>
        </div>
      )}

    </DashboardLayout>
  );
}

