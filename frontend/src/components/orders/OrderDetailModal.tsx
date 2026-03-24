"use client";

import { useEffect, useState } from "react";
import { X, User, MapPin, Hash, Calendar } from "lucide-react";
import { getOrderById, updateOrderStatus } from "@/lib/salesService";
import { formatCurrency, formatNumber } from "@/lib/format";
import { STATUS_LABELS, STATUS_COLORS, ALL_STATUSES } from "@/lib/orderStatus";
import type { OrderDetail, OrderStatus } from "@/types/sales";

interface Props {
  orderId: string;
  onClose: () => void;
  onStatusChanged: () => void;
}

export function OrderDetailModal({ orderId, onClose, onStatusChanged }: Props) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getOrderById(orderId)
      .then((o) => {
        setOrder(o);
        setNewStatus(o.status);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSave() {
    if (!order || !newStatus || newStatus === order.status) return;
    setSaving(true);
    try {
      await updateOrderStatus(order.id, newStatus as OrderStatus);
      onStatusChanged();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const statusChanged = newStatus && order && newStatus !== order.status;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="flex w-full max-w-2xl flex-col rounded-2xl shadow-2xl"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", maxHeight: "90vh" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            Detalhes do Pedido
          </p>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-overlay)]"
          >
            <X size={16} style={{ color: "var(--text-muted)" }} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 animate-pulse rounded"
                  style={{ background: "var(--bg-surface-2)" }}
                />
              ))}
            </div>
          ) : order ? (
            <>
              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Hash, label: "ID", value: "#" + order.id.split("-").pop() },
                  { icon: Calendar, label: "Data", value: new Date(order.created_at).toLocaleDateString("pt-BR") },
                  { icon: User, label: "Cliente", value: order.customer_name },
                  { icon: MapPin, label: "Região", value: order.region },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1 rounded-xl px-4 py-3"
                    style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon size={11} style={{ color: "var(--text-muted)" }} />
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
                    </div>
                    <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status changer */}
              <div
                className="flex flex-wrap items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}
              >
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Status:
                </span>
                {/* current badge */}
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: STATUS_COLORS[order.status].bg,
                    color: STATUS_COLORS[order.status].color,
                    border: `1px solid ${STATUS_COLORS[order.status].border}`,
                  }}
                >
                  {STATUS_LABELS[order.status]}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>→ alterar para:</span>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  style={{
                    background: "var(--bg-overlay)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    borderRadius: "0.5rem",
                    padding: "0.25rem 0.6rem",
                    fontSize: "0.8rem",
                    outline: "none",
                  }}
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              {/* Items table */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Itens do Pedido
                </p>
                <div className="overflow-hidden rounded-xl" style={{ border: "1px solid var(--border)" }}>
                  <div
                    className="grid px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                    style={{
                      background: "var(--bg-surface-2)",
                      color: "var(--text-muted)",
                      gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span>Produto</span>
                    <span>Categoria</span>
                    <span className="text-right">Qtd.</span>
                    <span className="text-right">Preço Unit.</span>
                    <span className="text-right">Subtotal</span>
                  </div>
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="grid items-center px-4 py-3 text-sm"
                      style={{
                        gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                        background: i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-surface-2)",
                        borderBottom: i < order.items.length - 1 ? "1px solid var(--border)" : "none",
                      }}
                    >
                      <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{item.product_name}</span>
                      <span>
                        <span
                          className="rounded-full px-2 py-0.5 text-xs"
                          style={{ background: "#00b4d822", color: "#00e5ff", border: "1px solid #00b4d844" }}
                        >
                          {item.category}
                        </span>
                      </span>
                      <span className="text-right" style={{ color: "var(--text-secondary)" }}>
                        {formatNumber(item.quantity)}
                      </span>
                      <span className="text-right" style={{ color: "var(--text-secondary)" }}>
                        {formatCurrency(Number(item.unit_price))}
                      </span>
                      <span className="text-right font-semibold" style={{ color: "#00e5ff" }}>
                        {formatCurrency(Number(item.subtotal))}
                      </span>
                    </div>
                  ))}
                  {/* Total row */}
                  <div
                    className="grid items-center px-4 py-3 text-sm font-bold"
                    style={{
                      gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                      background: "var(--bg-overlay)",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <span style={{ color: "var(--text-secondary)" }}>Total</span>
                    <span />
                    <span className="text-right" style={{ color: "var(--text-primary)" }}>
                      {formatNumber(order.items.reduce((s, i) => s + i.quantity, 0))}
                    </span>
                    <span />
                    <span className="text-right" style={{ color: "#00e5ff" }}>
                      {formatCurrency(Number(order.total_amount))}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Pedido não encontrado.</p>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold"
            style={{
              background: "var(--bg-surface-2)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            Fechar
          </button>
          <button
            onClick={handleSave}
            disabled={!statusChanged || saving}
            className="rounded-lg px-4 py-2 text-sm font-semibold transition-opacity disabled:opacity-40"
            style={{ background: "#00b4d8", color: "#fff" }}
          >
            {saving ? "Salvando…" : "Salvar Status"}
          </button>
        </div>
      </div>
    </div>
  );
}
