"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  Search,
  Eye,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { OrderDetailModal } from "@/components/orders/OrderDetailModal";
import { getOrdersList, getOrdersStats } from "@/lib/salesService";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { OrderListItem, OrderStatus, OrdersStats } from "@/types/sales";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:   "Pendente",
  confirmed: "Confirmado",
  shipped:   "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string; border: string }> = {
  pending:   { bg: "#f59e0b22", color: "#f59e0b", border: "#f59e0b44" },
  confirmed: { bg: "#00b4d822", color: "#00b4d8", border: "#00b4d844" },
  shipped:   { bg: "#8b5cf622", color: "#8b5cf6", border: "#8b5cf644" },
  delivered: { bg: "#22c55e22", color: "#22c55e", border: "#22c55e44" },
  cancelled: { bg: "#ef444422", color: "#ef4444", border: "#ef444444" },
};

const ALL_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const KPI_CONFIG: {
  key: keyof OrdersStats;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  { key: "total",     label: "Total de Pedidos", icon: ShoppingCart, color: "#00b4d8" },
  { key: "pending",   label: "Pendentes",        icon: Clock,        color: "#f59e0b" },
  { key: "shipped",   label: "Enviados",         icon: Truck,        color: "#8b5cf6" },
  { key: "delivered", label: "Entregues",        icon: PackageCheck, color: "#22c55e" },
  { key: "confirmed", label: "Confirmados",      icon: CheckCircle2, color: "#48cae4" },
  { key: "cancelled", label: "Cancelados",       icon: XCircle,      color: "#ef4444" },
];

const PAGE_SIZE = 20;

function StatusBadge({ status }: { status: OrderStatus }) {
  const c = STATUS_COLORS[status];
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders]   = useState<OrderListItem[]>([]);
  const [stats, setStats]     = useState<OrdersStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch]   = useState("");
  const [status, setStatus]   = useState<OrderStatus | "">("");
  const [page, setPage]       = useState(1);

  const [detailId, setDetailId] = useState<string | null>(null);

  function reload() {
    return Promise.all([getOrdersList(), getOrdersStats()])
      .then(([o, s]) => { setOrders(o); setStats(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch = !search || o.customer_name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !status || o.status === status;
      return matchSearch && matchStatus;
    });
  }, [orders, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function onFilterChange(val: string) {
    setStatus(val as OrderStatus | "");
    setPage(1);
  }

  function onSearchChange(val: string) {
    setSearch(val);
    setPage(1);
  }

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
    <DashboardLayout title="Pedidos" subtitle="Gerenciamento e acompanhamento de pedidos">

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {KPI_CONFIG.map(({ key, label, icon: Icon, color }) => (
          <div
            key={key}
            className="flex flex-col gap-2 rounded-xl px-4 py-3"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <Icon size={13} style={{ color }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
            </div>
            <span className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              {loading ? "—" : formatNumber(Number(stats?.[key] ?? 0))}
            </span>
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
            maxWidth: 340,
          }}
        >
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar cliente…"
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

        {/* Status filter */}
        <select value={status} onChange={(e) => onFilterChange(e.target.value)} style={selectStyle}>
          <option value="">Todos os status</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>

        {/* Count */}
        <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
          {filtered.length} pedido{filtered.length !== 1 ? "s" : ""}
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
            gridTemplateColumns: "1.8fr 1fr 0.9fr 0.5fr 1fr 1.4fr 3rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span>Data / ID</span>
          <span>Cliente</span>
          <span>Região</span>
          <span className="text-right">Itens</span>
          <span className="text-right">Total</span>
          <span className="pl-6">Status</span>
          <span />
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
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Nenhum pedido encontrado
            </p>
          </div>
        ) : (
          paginated.map((order, i) => (
            <div
              key={order.id}
              className="grid items-center px-5 py-3.5 text-sm transition-colors"
              style={{
                gridTemplateColumns: "1.8fr 1fr 0.9fr 0.5fr 1fr 1.4fr 3rem",
                background: i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-surface-2)",
                borderBottom: i < paginated.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              {/* Date + ID */}
              <div className="flex flex-col gap-0.5">
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                  {new Date(order.created_at).toLocaleDateString("pt-BR")}
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  #{order.id.split("-").pop()}
                </span>
              </div>
              {/* Customer */}
              <div className="flex flex-col gap-0.5">
                <span style={{ color: "var(--text-primary)" }}>{order.customer_name}</span>
                <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {order.customer_email}
                </span>
              </div>
              {/* Region */}
              <span style={{ color: "var(--text-secondary)" }}>{order.region}</span>
              {/* Items count */}
              <span className="text-right" style={{ color: "var(--text-secondary)" }}>
                {formatNumber(order.items_count)}
              </span>
              {/* Total */}
              <span className="text-right font-semibold" style={{ color: "#00e5ff" }}>
                {formatCurrency(Number(order.total_amount))}
              </span>
              {/* Status */}
              <div className="pl-6">
                <StatusBadge status={order.status} />
              </div>
              {/* Action */}
              <div className="flex justify-center">
                <button
                  onClick={() => setDetailId(order.id)}
                  className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-overlay)]"
                  title="Ver detalhes"
                >
                  <Eye size={15} style={{ color: "#00b4d8" }} />
                </button>
              </div>
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

      {/* ── Detail Modal ── */}
      {detailId && (
        <OrderDetailModal
          orderId={detailId}
          onClose={() => setDetailId(null)}
          onStatusChanged={reload}
        />
      )}

    </DashboardLayout>
  );
}

